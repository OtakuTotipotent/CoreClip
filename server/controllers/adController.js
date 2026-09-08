const Ad = require("../models/Ad");
const cloudinary = require("../config/cloudinary");
const { generateAdImage } = require("../services/aiProvider");

const uploadToCloudinary = async (buffer, folder, publicId) => {
  const base64 = buffer.toString("base64");
  const dataUri = `data:image/png;base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    public_id: publicId,
    resource_type: "image",
    overwrite: true,
  });

  return result;
};

const generateAd = async (req, res) => {
  try {
    const { title, prompt, aspectRatio = "1:1", productImage = "" } = req.body;

    if (!title || !prompt) {
      return res.status(400).json({
        success: false,
        message: "Title and prompt are required",
      });
    }

    if (title.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Title must contain at least 2 characters",
      });
    }

    if (prompt.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Prompt must contain at least 10 characters",
      });
    }

    const allowedRatios = ["1:1", "4:5", "16:9", "9:16"];

    if (!allowedRatios.includes(aspectRatio)) {
      return res.status(400).json({
        success: false,
        message: "Invalid aspect ratio",
      });
    }

    if (productImage && !productImage.startsWith("data:image/")) {
      return res.status(400).json({
        success: false,
        message: "Invalid product image",
      });
    }

    const generated = await generateAdImage({
      title: title.trim(),
      prompt: prompt.trim(),
      aspectRatio,
      productImage,
    });

    const generatedUpload = await uploadToCloudinary(
      generated.buffer,
      "coreclip/generated-ads",
      `ad-${req.user._id}-${Date.now()}`,
    );

    let productImageUrl = "";

    if (productImage) {
      const productUpload = await cloudinary.uploader.upload(productImage, {
        folder: "coreclip/product-images",
        resource_type: "image",
      });

      productImageUrl = productUpload.secure_url;
    }

    const ad = await Ad.create({
      user: req.user._id,
      title: title.trim(),
      prompt: prompt.trim(),
      aspectRatio,
      productImage: productImageUrl,
      generatedImage: generatedUpload.secure_url,
      cloudinaryPublicId: generatedUpload.public_id,
      privacy: "private",
    });

    const populatedAd = await Ad.findById(ad._id).populate(
      "user",
      "name email profileImage",
    );

    return res.status(201).json({
      success: true,
      message: "Ad generated successfully",
      ad: populatedAd,
    });
  } catch (error) {
    console.error("Generate ad error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to generate ad",
    });
  }
};

const getMyAds = async (req, res) => {
  try {
    const ads = await Ad.find({
      user: req.user._id,
    })
      .populate("user", "name email profileImage")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      ads,
    });
  } catch (error) {
    console.error("Get my ads error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load your ads",
    });
  }
};

const getCommunityAds = async (req, res) => {
  try {
    const ads = await Ad.find({
      privacy: "public",
    })
      .populate("user", "name profileImage")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      ads,
    });
  } catch (error) {
    console.error("Get community ads error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load community ads",
    });
  }
};

const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    if (ad.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(ad.cloudinaryPublicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary delete error:", cloudinaryError.message);
      }
    }

    await ad.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Ad deleted successfully",
    });
  } catch (error) {
    console.error("Delete ad error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete ad",
    });
  }
};

const updatePrivacy = async (req, res) => {
  try {
    const { privacy } = req.body;

    if (!["public", "private"].includes(privacy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid privacy value",
      });
    }

    const ad = await Ad.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        privacy,
      },
      {
        new: true,
      },
    ).populate("user", "name email profileImage");

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: privacy === "public" ? "Ad is now public" : "Ad is now private",
      ad,
    });
  } catch (error) {
    console.error("Update privacy error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update ad privacy",
    });
  }
};

const getAdById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id).populate(
      "user",
      "name email profileImage",
    );

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Ad not found",
      });
    }

    const isOwner = ad.user._id.toString() === req.user._id.toString();

    if (ad.privacy !== "public" && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "This ad is private",
      });
    }

    return res.status(200).json({
      success: true,
      ad,
    });
  } catch (error) {
    console.error("Get ad error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load ad",
    });
  }
};

module.exports = {
  generateAd,
  getMyAds,
  getCommunityAds,
  deleteAd,
  updatePrivacy,
  getAdById,
};
