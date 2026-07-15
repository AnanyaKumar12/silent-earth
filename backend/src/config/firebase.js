import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin using service account credentials from env vars.
// This avoids committing a service account JSON file to source control.
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket,
    });
  } else {
    console.warn(
      "Firebase credentials are incomplete. Starting without Firebase Admin SDK; database routes will fail until env vars are provided."
    );
    admin.initializeApp({
      projectId: projectId || "demo-project",
    });
  }
}

export const db = admin.firestore();
export const bucket = admin.storage().bucket();
export default admin;
