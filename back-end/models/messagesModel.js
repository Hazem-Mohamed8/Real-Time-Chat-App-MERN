const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    messageType: {
      type: String,
      enum: ["text", "file"],
      required: true,
    },
    content: {
      type: String,
      required: function () {
        return this.messageType === "text";
      },
    },
    fileUrl: {
      type: String,
      required: function () {
        return this.messageType === "file";
      },
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

messageSchema.pre("save", function (next) {
  if (this.messageType === "text" && !this.content) {
    return next(new Error("Content is required for text messages"));
  }
  if (this.messageType === "file" && !this.fileUrl) {
    return next(new Error("File URL is required for file messages"));
  }
  next();
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
