const { Router } = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  getMessages,
  uploadFiles,
} = require("../controller/messageController.js");
const multer = require("multer");

const messageRoutes = Router();

const upload = multer({ dest: "uploads/files" });
messageRoutes.post("/get-messages", verifyToken, getMessages);
messageRoutes.post(
  "/upload-files",
  verifyToken,
  upload.single("file"),
  uploadFiles
);

module.exports = messageRoutes;
