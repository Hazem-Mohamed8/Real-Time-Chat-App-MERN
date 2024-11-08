const Message = require("../models/messagesModel.js");
const { mkdirSync, rename } = require("fs");

const getMessages = async (req, res) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return res.status(400).json({ message: "Both user IDs are required" });
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ timestamp: 1 });
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error searching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const uploadFiles = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const date = new Date();
    let fileDir = `uploads/files/${date}`;
    const fileName = `${fileDir}/${req.file.originalname}`;
    mkdirSync(fileDir, { recursive: true });
    rename(req.file.path, fileName, (err) => {
      if (err) {
        console.error("Error renaming file:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
    });

    res.status(200).json({ filePath: fileName });
  } catch (error) {
    console.error("Error searching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getMessages, uploadFiles };