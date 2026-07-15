import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin using service account credentials from env vars.
// This avoids committing a service account JSON file to source control.
if (!admin.apps.length) {
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const db = admin.firestore();
export const bucket = admin.storage().bucket();
export default admin;
