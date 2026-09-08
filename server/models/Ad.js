const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Ad title is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    prompt: {
      type: String,
      required: [true, "Ad prompt is required"],
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },

    aspectRatio: {
      type: String,
      enum: ["1:1", "4:5", "16:9", "9:16"],
      default: "1:1",
    },

    productImage: {
      type: String,
      default: "",
    },

    generatedImage: {
      type: String,
      required: [true, "Generated image is required"],
    },

    cloudinaryPublicId: {
      type: String,
      default: "",
    },

    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "private",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

adSchema.index({
  user: 1,
  createdAt: -1,
});

adSchema.index({
  privacy: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Ad", adSchema);
