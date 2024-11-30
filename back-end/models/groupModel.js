const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: false,
    },
  ],
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

groupSchema.pre("save", function (next) {
  this.updateAt = Date.now();
  next();
});

groupSchema.pre("findOneAndUpdate", function (next) {
  this.set = { updateAt: Date.now() };
  next();
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
