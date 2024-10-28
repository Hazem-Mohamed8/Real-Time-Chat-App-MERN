const { Router } = require("express");
const {
  login,
  signup,
  userInfo,
  updateProfile,
  addProfileImage,
  removeProfileImage,
  logout,
} = require("../controller/authController.js");
const { verifyToken, upload } = require("../middlewares/authMiddleware.js");

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/userinfo", verifyToken, userInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post(
  "/add-profile-image",
  verifyToken,
  upload.single("avatar"),
  addProfileImage
);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
authRoutes.post("/logout", logout);

module.exports = authRoutes;
