const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

// Configure Cloudinary with error handling
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} catch (error) {
  console.error('Error configuring Cloudinary:', error);
}

// Configure multer for temporary local storage
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept video files only
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'));
    }
  },
});

// Function to upload file to Cloudinary
const uploadToCloud = async (file, resource_type) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary credentials are not configured');
    }

    console.log(`Attempting to upload to Cloudinary with resource_type: ${resource_type}`);

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: resource_type,
      folder: 'class-videos',
    });

    console.log('Cloudinary upload result:', result);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    console.error('Cloudinary error details:', error.message);
    throw error;
  }
};

module.exports = {
  upload,
  uploadToCloud,
};
