const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 2 characters",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This email is already in use",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = trimmedName;
    user.email = normalizedEmail;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update profile",
    });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    if (!image.startsWith("data:image/")) {
      return res.status(400).json({
        success: false,
        message: "Invalid image format",
      });
    }

    const mimeMatch = image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);

    if (!mimeMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid image data",
      });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(mimeMatch[1])) {
      return res.status(400).json({
        success: false,
        message: "Only JPG, PNG and WebP images are supported",
      });
    }

    const base64Data = image.split(",")[1];

    if (!base64Data) {
      return res.status(400).json({
        success: false,
        message: "Invalid image data",
      });
    }

    const imageBuffer = Buffer.from(base64Data, "base64");

    if (imageBuffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Profile image must be 5 MB or smaller",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "coreclip/profile-images",
      resource_type: "image",
      transformation: [
        {
          width: 512,
          height: 512,
          crop: "fill",
          gravity: "face",
        },
      ],
    });

    const oldPublicId = user.profileImagePublicId;

    user.profileImage = uploadResult.secure_url;
    user.profileImagePublicId = uploadResult.public_id;

    await user.save();

    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (deleteError) {
        console.error(
          "Unable to delete old profile image:",
          deleteError.message,
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error("Update profile image error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update profile image",
    });
  }
};

module.exports = {
  updateProfile,
  updateProfileImage,
};
