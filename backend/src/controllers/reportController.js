import {
  createReport as createReportService,
  getReports as getReportsService,
  getReportById,
  saveSummary,
  getCategoryCounts as getCategoryCountsService,
  CATEGORIES,
} from "../services/firestoreService.js";
import { uploadImage } from "../services/storageService.js";
import { generateEmergencySummary } from "../services/geminiService.js";

export async function createReport(req, res, next) {
  try {
    const { name, category, location, description } = req.body;

    if (!name?.trim() || !category?.trim() || !location?.trim()) {
      const err = new Error("Name, category, and location are required");
      err.status = 400;
      throw err;
    }

    if (!CATEGORIES.includes(category)) {
      const err = new Error(`Category must be one of: ${CATEGORIES.join(", ")}`);
      err.status = 400;
      throw err;
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    const report = await createReportService({
      name: name.trim(),
      category,
      location: location.trim(),
      description: description?.trim() || "",
      imageUrl,
    });

    res.status(201).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
}

export async function getReports(req, res, next) {
  try {
    const { category, search } = req.query;
    const reports = await getReportsService({ category, search });
    res.json({ success: true, data: reports });
  } catch (err) {
    next(err);
  }
}

export async function getCategoryCounts(req, res, next) {
  try {
    const counts = await getCategoryCountsService();
    res.json({ success: true, data: counts });
  } catch (err) {
    next(err);
  }
}

export async function generateSummary(req, res, next) {
  try {
    const { id } = req.params;
    const report = await getReportById(id);

    if (!report) {
      const err = new Error("Report not found");
      err.status = 404;
      throw err;
    }

    // Return the cached summary if we've already generated one —
    // avoids redundant Gemini API calls for the same report.
    if (report.aiSummary) {
      return res.json({ success: true, data: { summary: report.aiSummary, cached: true } });
    }

    const summary = await generateEmergencySummary({
      category: report.category,
      location: report.location,
      description: report.description,
    });

    await saveSummary(id, summary);

    res.json({ success: true, data: { summary, cached: false } });
  } catch (err) {
    next(err);
  }
}
