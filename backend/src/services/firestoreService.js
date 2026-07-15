import { v4 as uuidv4 } from "uuid";
import { db } from "../config/firebase.js";

const REPORTS_COLLECTION = "reports";
const USERS_COLLECTION = "users";

export const CATEGORIES = [
  "Critical Alert",
  "Medical",
  "Food",
  "Shelter",
  "Missing Person",
  "Other",
];

/**
 * Create (or upsert) a lightweight local user record.
 * Since there is no authentication, this is purely informational —
 * it lets responders cross-reference reports by phone number if needed.
 */
export async function upsertUser({ name, mobileNumber }) {
  const id = mobileNumber; // mobile number acts as the natural key, no auth involved
  const userRef = db.collection(USERS_COLLECTION).doc(id);
  const existing = await userRef.get();

  const payload = {
    name,
    mobileNumber,
    updatedAt: new Date().toISOString(),
    createdAt: existing.exists ? existing.data().createdAt : new Date().toISOString(),
  };

  await userRef.set(payload, { merge: true });
  return { id, ...payload };
}

export async function createReport(reportData) {
  const id = uuidv4();
  const report = {
    id,
    name: reportData.name,
    category: reportData.category,
    location: reportData.location,
    description: reportData.description || "",
    imageUrl: reportData.imageUrl || null,
    aiSummary: null,
    timestamp: new Date().toISOString(),
  };

  await db.collection(REPORTS_COLLECTION).doc(id).set(report);
  return report;
}

export async function getReports({ category, search } = {}) {
  let query = db.collection(REPORTS_COLLECTION).orderBy("timestamp", "desc");

  if (category && category !== "All") {
    query = query.where("category", "==", category);
  }

  const snapshot = await query.get();
  let reports = snapshot.docs.map((doc) => doc.data());

  // Simple in-memory search across name, location, description.
  // Firestore doesn't support full-text search natively, so for a
  // production system consider Algolia/Typesense — this is sufficient
  // for a lightweight community reporting tool.
  if (search) {
    const term = search.toLowerCase();
    reports = reports.filter(
      (r) =>
        r.name?.toLowerCase().includes(term) ||
        r.location?.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term)
    );
  }

  return reports;
}

export async function getReportById(id) {
  const doc = await db.collection(REPORTS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return doc.data();
}

export async function saveSummary(id, summary) {
  await db.collection(REPORTS_COLLECTION).doc(id).update({ aiSummary: summary });
}

export async function getCategoryCounts() {
  const snapshot = await db.collection(REPORTS_COLLECTION).get();
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c, 0]));

  snapshot.docs.forEach((doc) => {
    const { category } = doc.data();
    if (counts[category] !== undefined) counts[category] += 1;
  });

  return counts;
}
