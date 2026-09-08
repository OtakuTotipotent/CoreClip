const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  generateAd,
  getMyAds,
  getCommunityAds,
  deleteAd,
  updatePrivacy,
  getAdById,
} = require("../controllers/adController");

const router = express.Router();

router.use(protect);

router.post("/generate", generateAd);

router.get("/my-ads", getMyAds);

router.get("/community", getCommunityAds);

router.get("/:id", getAdById);

router.delete("/:id", deleteAd);

router.patch("/:id/privacy", updatePrivacy);

module.exports = router;
