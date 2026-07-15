import { v4 as uuidv4 } from "uuid";
import { db, isFirebaseAvailable } from "../config/firebase.js";

const REPORTS_COLLECTION = "reports";
const USERS_COLLECTION = "users";

const memoryState = {
  users: new Map(),
  reports: new Map(),
};

export const CATEGORIES = [
  "Critical Alert",
  "Medical",
  "Food",
  "Shelter",
  "Missing Person",
  "Other",
];

function getMemoryReports() {
  return Array.from(memoryState.reports.values()).sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
}

/**
 * Create (or upsert) a lightweight local user record.
 * Since there is no authentication, this is purely informational —
 * it lets responders cross-reference reports by phone number if needed.
 */
export async function upsertUser({ name, mobileNumber }) {
  const id = mobileNumber;

  if (!isFirebaseAvailable || !db) {
    const existing = memoryState.users.get(id);
    const payload = {
      name,
      mobileNumber,
      updatedAt: new Date().toISOString(),
      createdAt: existing?.createdAt || new Date().toISOString(),
    };

    memoryState.users.set(id, payload);
    return { id, ...payload };
  }

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

  if (!isFirebaseAvailable || !db) {
    memoryState.reports.set(id, report);
    return report;
  }

  await db.collection(REPORTS_COLLECTION).doc(id).set(report);
  return report;
}

export async function getReports({ category, search } = {}) {
  if (!isFirebaseAvailable || !db) {
    let reports = getMemoryReports();

    if (category && category !== "All") {
      reports = reports.filter((report) => report.category === category);
    }

    if (search) {
      const term = search.toLowerCase();
      reports = reports.filter(
        (report) =>
          report.name?.toLowerCase().includes(term) ||
          report.location?.toLowerCase().includes(term) ||
          report.description?.toLowerCase().includes(term)
      );
    }

    return reports;
  }

  let query = db.collection(REPORTS_COLLECTION).orderBy("timestamp", "desc");

  if (category && category !== "All") {
    query = query.where("category", "==", category);
  }

  const snapshot = await query.get();
  let reports = snapshot.docs.map((doc) => doc.data());

  if (search) {
    const term = search.toLowerCase();
    reports = reports.filter(
      (report) =>
        report.name?.toLowerCase().includes(term) ||
        report.location?.toLowerCase().includes(term) ||
        report.description?.toLowerCase().includes(term)
    );
  }

  return reports;
}

export async function getReportById(id) {
  if (!isFirebaseAvailable || !db) {
    return memoryState.reports.get(id) || null;
  }

  const doc = await db.collection(REPORTS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return doc.data();
}

export async function saveSummary(id, summary) {
  if (!isFirebaseAvailable || !db) {
    const existing = memoryState.reports.get(id);
    if (existing) {
      const updated = { ...existing, aiSummary: summary };
      memoryState.reports.set(id, updated);
    }
    return;
  }

  await db.collection(REPORTS_COLLECTION).doc(id).update({ aiSummary: summary });
}

export async function getCategoryCounts() {
  if (!isFirebaseAvailable || !db) {
    const counts = Object.fromEntries(CATEGORIES.map((category) => [category, 0]));
    getMemoryReports().forEach((report) => {
      if (counts[report.category] !== undefined) counts[report.category] += 1;
    });
    return counts;
  }

  const snapshot = await db.collection(REPORTS_COLLECTION).get();
  const counts = Object.fromEntries(CATEGORIES.map((category) => [category, 0]));

  snapshot.docs.forEach((doc) => {
    const { category } = doc.data();
    if (counts[category] !== undefined) counts[category] += 1;
  });

  return counts;
}
