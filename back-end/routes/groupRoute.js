const { Router } = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  createGroup,
  GetUserGroup,
  getGroupMessages,
} = require("../controller/groupController.js");

const groupRoutes = Router();

groupRoutes.post("/create-group", verifyToken, createGroup);
groupRoutes.get("/get-user-groups", verifyToken, GetUserGroup);
groupRoutes.post("/get-group-messages", verifyToken, getGroupMessages);

module.exports = groupRoutes;
