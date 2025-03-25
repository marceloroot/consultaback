const multer = require("multer");
const crypto = require("crypto");

module.exports = {
  // Remova o `dest` para evitar criar a pasta
  // dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"), ❌

  storage: multer.memoryStorage(), // ✅ Sem opções de disco

  limits: {
    fileSize: 8 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedMimes = ["application/pdf"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo inválido."));
    }
  },
};
