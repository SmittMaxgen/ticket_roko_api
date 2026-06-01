/*
  services/uploadService.js
  Reusable multer factory.
  - Base folder : uploads/
  - Auto-creates sub-folder per entity (e.g. uploads/advertisement/)
  - Returns { single, array, fields } helpers ready to use as middleware
*/

const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * createUploader("advertisement")
 *   → stores files in  uploads/advertisement/
 *   → filename: advertisement-<timestamp>-<originalname>
 *
 * @param {string} folder  Sub-folder name inside /uploads
 * @param {object} options
 * @param {number} options.maxSizeMB   Max file size in MB  (default 5)
 * @param {RegExp} options.allowedTypes Regex for mimetype  (default images)
 */
function createUploader(folder, options = {}) {
  const { maxSizeMB = 5, allowedTypes = /image\/(jpeg|jpg|png|webp|gif)/ } =
    options;

  // Resolve absolute path from cwd so it always lands in project root /uploads/<folder>
  const dest = path.join("uploads", folder);
  // Auto-create the folder if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, dest);
    },
    filename: (_req, file, cb) => {
      const safeName = file.originalname.replace(/\s+/g, "_");
      cb(null, `${folder}-${Date.now()}-${safeName}`);
    },
  });

  const fileFilter = (_req, file, cb) => {
    if (allowedTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(`Only image files are allowed (got ${file.mimetype})`),
        false,
      );
    }
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });

  return {
    single: (field) => upload.single(field),
    array: (field, max) => upload.array(field, max),
    fields: (fieldsList) => upload.fields(fieldsList),
  };
}

module.exports = { createUploader };
