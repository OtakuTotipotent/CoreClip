const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  updateProfile,
  updateProfileImage,
} = require("../controllers/userController");

const router = express.Router();

router.patch("/profile", protect, updateProfile);

router.patch("/profile-image", protect, updateProfileImage);

module.exports = router;
