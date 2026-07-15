import { v4 as uuidv4 } from "uuid";
import { bucket, isFirebaseAvailable } from "../config/firebase.js";

/**
 * Upload an in-memory file buffer to Firebase Storage and return a
 * publicly accessible URL. If Firebase Storage is unavailable, return null.
 */
export async function uploadImage(file) {
  if (!file) return null;

  if (!isFirebaseAvailable || !bucket) {
    console.warn("Firebase Storage is unavailable; skipping image upload.");
    return null;
  }

  const ext = file.originalname.split(".").pop();
  const filename = `reports/${uuidv4()}.${ext}`;
  const blob = bucket.file(filename);

  await new Promise((resolve, reject) => {
    const stream = blob.createWriteStream({
      metadata: { contentType: file.mimetype },
    });
    stream.on("error", reject);
    stream.on("finish", resolve);
    stream.end(file.buffer);
  });

  await blob.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${filename}`;
}
