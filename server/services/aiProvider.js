const { InferenceClient } = require("@huggingface/inference");

const hf = new InferenceClient(process.env.HF_TOKEN);

const getDimensions = (aspectRatio) => {
  const dimensions = {
    "1:1": {
      width: 1024,
      height: 1024,
    },
    "4:5": {
      width: 896,
      height: 1120,
    },
    "16:9": {
      width: 1152,
      height: 648,
    },
    "9:16": {
      width: 648,
      height: 1152,
    },
  };

  return dimensions[aspectRatio] || dimensions["1:1"];
};

const buildAdPrompt = ({ title, prompt }) => {
  return `
Create a premium professional advertising creative.

Product/ad title:
${title}

Creative direction:
${prompt}

Design requirements:
- professional commercial advertising photography
- premium modern visual composition
- strong focal point
- attractive lighting
- polished brand presentation
- clean background
- realistic product presentation
- visually compelling composition
- suitable for a professional digital advertisement
- leave appropriate visual breathing room for advertising copy
- no watermark
- no distorted objects
- no unnecessary text
- no logos unless naturally present in the supplied product image
`.trim();
};

const generateAdImage = async ({
  title,
  prompt,
  aspectRatio,
  productImage,
}) => {
  if (!process.env.HF_TOKEN) {
    throw new Error("Hugging Face API token is not configured");
  }

  const dimensions = getDimensions(aspectRatio);
  const finalPrompt = buildAdPrompt({
    title,
    prompt,
  });

  let image;

  if (productImage) {
    const [metadata, base64Data] = productImage.split(",");

    if (!metadata || !base64Data) {
      throw new Error("Invalid product image format");
    }

    const mimeMatch = metadata.match(/data:(.*?);base64/);
    const mimeType = mimeMatch?.[1] || "image/png";

    const imageBuffer = Buffer.from(base64Data, "base64");

    const inputImage = new Blob([imageBuffer], {
      type: mimeType,
    });

    image = await hf.imageToImage({
      model: "black-forest-labs/FLUX.2-dev",
      inputs: inputImage,
      parameters: {
        prompt: finalPrompt,
        target_size: {
          width: dimensions.width,
          height: dimensions.height,
        },
        num_inference_steps: 4,
      },
    });
  } else {
    image = await hf.textToImage({
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: finalPrompt,
      parameters: {
        width: dimensions.width,
        height: dimensions.height,
        num_inference_steps: 4,
      },
    });
  }

  if (!image) {
    throw new Error("AI provider returned no image");
  }

  const arrayBuffer = await image.arrayBuffer();

  return {
    buffer: Buffer.from(arrayBuffer),
    mimeType: image.type || "image/png",
  };
};

module.exports = {
  generateAdImage,
};
