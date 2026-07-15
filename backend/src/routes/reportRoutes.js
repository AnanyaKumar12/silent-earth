import { Router } from "express";
import {
  createReport,
  getReports,
  getCategoryCounts,
  generateSummary,
} from "../controllers/reportController.js";
import { upload } from "../middleware/upload.js";

const router = Router();

// GET /api/reports?category=Medical&search=water
router.get("/", getReports);

// GET /api/reports/category-counts
router.get("/category-counts", getCategoryCounts);

// POST /api/reports  (multipart/form-data, field name: "image")
router.post("/", upload.single("image"), createReport);

// POST /api/reports/:id/summary - generate (or fetch cached) AI summary
router.post("/:id/summary", generateSummary);

export default router;
