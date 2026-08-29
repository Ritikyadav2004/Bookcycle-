const cloudinary = require("cloudinary").v2;

// Configure Cloudinary using environmental variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload buffer to Cloudinary
 * @param {Buffer} fileBuffer 
 * @param {string} folder 
 * @returns {Promise<Object>}
 */
const uploadImage = (fileBuffer, folder = "bookcycle") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete image from Cloudinary by public ID
 * @param {string} publicId 
 * @returns {Promise<Object>}
 */
const deleteImage = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

/**
 * Helper to extract Cloudinary public ID from a URL
 * @param {string} url 
 * @returns {string|null}
 */
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  // Cloudinary URL structure: https://res.cloudinary.com/cloud_name/image/upload/v1234567/folder/public_id.jpg
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    const pathAndId = parts[1].replace(/v\d+\//, ""); // Remove version tag e.g. v16728362
    const fileWithExtension = pathAndId.split("?")[0]; // Remove query params if any
    const publicId = fileWithExtension.substring(0, fileWithExtension.lastIndexOf("."));
    return publicId;
  } catch (error) {
    return null;
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  getPublicIdFromUrl,
};
