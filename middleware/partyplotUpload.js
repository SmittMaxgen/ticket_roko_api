// middlewares/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Auto-create any upload folder on first use ──────────────────
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// ── Generic factory ─────────────────────────────────────────────
// Usage:  uploadTo("party-plots")  →  stores in  /uploads/party-plots/
const uploadTo = (subfolder) => {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dir = path.join(__dirname, "../uploads", subfolder);
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      // e.g.  partyplot-1718000000000-294812345.jpg
      const prefix = subfolder.replace(/\//g, "-");
      const unique = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${unique}${ext}`);
    },
  });

  const fileFilter = (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ok =
      allowed.test(path.extname(file.originalname).toLowerCase()) &&
      allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error("Only image files are allowed."));
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  });
};

module.exports = { uploadTo };
