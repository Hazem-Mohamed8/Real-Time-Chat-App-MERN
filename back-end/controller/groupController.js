const User = require("../models/userModel.js");
const Group = require("../models/groupModel.js");
const { default: mongoose } = require("mongoose");
const Message = require("../models/messagesModel.js");

const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;
    const admin = await User.findById(userId);

    if (!admin) {
      res.status(400).json({ message: "Admin not found" });
    }

    const validMember = await User.find({ _id: { $in: members } });

    if (validMember.length !== members.length) {
      return res.status(400).json({ message: "Invalid member IDs" });
    }

    const createdGroup = await Group({
      name,
      members,
      admin,
    });

    await createdGroup.save();
    res
      .status(201)
      .json({ message: "Group created successfully", group: createdGroup });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const GetUserGroup = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const groups = await Group.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updateAt: -1 });

    res.status(200).json({ groups: groups });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getGroupMessages = async (req, res) => {
  try {
    const groupId = req.body.id;
    const userId = req.userId;

    const group = await Group.findById(groupId).populate("admin members");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isUserInGroup =
      group.admin.equals(userId) ||
      group.members.some((member) => member._id.equals(userId));
    if (!isUserInGroup) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({ _id: { $in: group.messages } })
      .populate("sender", "firstName lastName image color email")
      .sort({
        timestamp: 1,
      });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching group messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { GetUserGroup, createGroup, getGroupMessages };
