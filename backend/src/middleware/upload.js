import multer from "multer";

// Store the incoming file in memory; we then stream it straight to
// Firebase Storage rather than writing to local disk (safer for
// ephemeral/serverless hosting environments).
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WEBP, or GIF images are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
