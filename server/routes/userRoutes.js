const express = require("express");

const protect = require("../middleware/authMiddleware");
const { updateProfile } = require("../controllers/userController");

const router = express.Router();

router.patch("/profile", protect, updateProfile);

module.exports = router;
