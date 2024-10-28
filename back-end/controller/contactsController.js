const { models } = require("mongoose");
const User = require("../models/userModel");

const searchContacts = async (req, res) => {
  try {
    const { searchTerm } = req.body;

    if (searchTerm === undefined || searchTerm === null || searchTerm === "") {
      return res.status(400).json({ message: "Search term is required" });
    }

    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } }, // Exclude the current user
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });

    res.status(200).json({ contacts });
  } catch (error) {
    console.error("Error searching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { searchContacts };
