const cloudinary = require('cloudinary').v2;
const pool = require('../../db');

// Configure Cloudinary (you'll need to put these values in your .env file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadAvatar = async (req, res) => {
  try {
    // Get the base64 data from request body
    const fileStr = req.body.data;
    if (!fileStr) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    // Upload image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'e-learning/avatars',
      resource_type: 'image'
    });

    // Get the secure URL from the response
    const imageUrl = uploadResponse.secure_url;

    // Update the user's avatar URL in the database
    const userId = req.user.id; // Get user ID from the auth middleware
    const { rows } = await pool.query(
      'UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING *',
      [imageUrl, userId]
    );

    res.status(200).json({
      message: 'Avatar uploaded successfully',
      imageUrl,
      user: rows[0]
    });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
};