const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// JWT Verification Middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: "Token is missing!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    req.userId = decoded.id;
    next();
  });
};

// Multer Configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = "uploads/profiles";
    try {
      if (!fs.existsSync(dir)) {
        await fs.promises.mkdir(dir, { recursive: true });
      }
      cb(null, dir);
    } catch (err) {
      cb(err, dir);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpg|jpeg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    return cb(null, true);
  }
  return cb(new Error("File type not supported"));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

module.exports = { verifyToken, upload };
