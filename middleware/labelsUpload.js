/*
  middleware/uploadLabel.js
  Multer config for label banner + thumbnail uploads.
  Files saved to:  /uploads/labels/<timestamp>-<originalname>
  DB stores:       "uploads/labels/<filename>"  (relative path)
*/

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Ensure folder exists ───────────────────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, "../uploads/labels");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ── Storage engine ────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),

  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

// ── File filter (images only) ─────────────────────────────────────────────────
const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error("Only image files are allowed (jpeg, jpg, png, webp, gif)"));
};

// ── Export: accepts image_url + thumbnail_url fields ─────────────────────────
const uploadLabel = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max per file
}).fields([
  { name: "image_url", maxCount: 1 },
  { name: "thumbnail_url", maxCount: 1 },
]);

module.exports = uploadLabel;
