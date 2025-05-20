const cloudinary = require('cloudinary').v2;
const pool = require('../../db');

// Configure Cloudinary
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

    // Extract user ID from authentication token
    const userId = req.user.id;

    // Upload image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'e-learning/avatars',
      resource_type: 'image',
      transformation: [
        { width: 250, height: 250, crop: 'fill', gravity: 'face' }
      ]
    });

    // Get the secure URL from the response
    const imageUrl = uploadResponse.secure_url;

    // Update the user's avatar URL in the database
    const { rows } = await pool.query(
      'UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING username, email, role, avatar_url',
      [imageUrl, userId]
    );

    res.status(200).json({
      message: 'Avatar uploaded successfully',
      imageUrl,
      user: rows[0]
    });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
};


exports.uploadCourseImage = async (req, res) => {
  try {
    const fileStr = req.body.data;
    if (!fileStr) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    const userId = req.user.id;

    // Verify the user is the instructor of this course
    const { rows } = await pool.query(
      'SELECT * FROM courses WHERE id = $1 AND instructor_id = $2',
      [courseId, userId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to update this course' });
    }


    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'e-learning/courses',
      resource_type: 'image',
      transformation: [
        { width: 800, height: 400, crop: 'fill' },
        { quality: 'auto:good' }
      ],
      format: 'jpg'
    });

    // Get the secure URL from the response
    const imageUrl = uploadResponse.secure_url;

    // Update the course's image URL in the database
    const updateResult = await pool.query(
      'UPDATE courses SET image_url = $1 WHERE id = $2 RETURNING id, title, image_url',
      [imageUrl, courseId]
    );

    res.status(200).json({
      message: 'Course image uploaded successfully',
      imageUrl,
      course: updateResult.rows[0]
    });
  } catch (error) {
    console.error('Error uploading course image to Cloudinary:', error);
    res.status(500).json({ message: 'Failed to upload course image', error: error.message });
  }
};