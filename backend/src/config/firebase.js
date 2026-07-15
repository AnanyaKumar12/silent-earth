import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const hasFirebaseCredentials = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
);

let db = null;
let bucket = null;
let isFirebaseAvailable = false;

if (!admin.apps.length && hasFirebaseCredentials) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket,
    });
  } catch (error) {
    console.warn("Firebase initialization failed:", error.message);
  }
}

if (admin.apps.length) {
  try {
    db = admin.firestore();
    bucket = admin.storage().bucket();
    isFirebaseAvailable = true;
  } catch (error) {
    console.warn("Firebase Admin SDK could not be initialized fully:", error.message);
  }
}

if (!isFirebaseAvailable) {
  console.warn(
    "Firebase credentials are not configured. Using in-memory fallback storage so the backend can still run."
  );
}

export { db, bucket, isFirebaseAvailable };
export default admin;
