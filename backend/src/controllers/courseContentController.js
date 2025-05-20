const pool = require('../../db');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create new course content with PDF upload
exports.createContent = async (req, res) => {
  try {
    const { course_id, title, content_url } = req.body;
    const userId = req.user.id;

    if (!course_id || !title || !content_url) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify course ownership
    const courseQuery = 'SELECT * FROM courses WHERE id = $1 AND instructor_id = $2';
    const courseResult = await pool.query(courseQuery, [course_id, userId]);

    if (courseResult.rows.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to add content to this course' });
    }

    // Upload PDF to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(content_url, {
      folder: `course_content/${course_id}`,
      resource_type: 'auto'
    });

    // Insert content into database
    const query = `
      INSERT INTO course_content (course_id, title, content_url, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *`;
      
    const values = [course_id, title, uploadResult.secure_url];
    const { rows } = await pool.query(query, values);
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating course content:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all content for a course
exports.getContentByCourseId = async (req, res) => {
  try {
    const courseId = req.params.course_id;
    
    const query = `
      SELECT * FROM course_content
      WHERE course_id = $1
      ORDER BY created_at DESC`;
      
    const { rows } = await pool.query(query, [courseId]);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching course content:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get specific content by ID
exports.getContentById = async (req, res) => {
  try {
    const contentId = req.params.id;
    
    const query = `SELECT * FROM course_content WHERE id = $1`;
    const { rows } = await pool.query(query, [contentId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete course content
exports.deleteContent = async (req, res) => {
  try {
    const contentId = req.params.id;
    const userId = req.user.id;
    
    // Check if user owns the course
    const checkQuery = `
      SELECT cc.*, c.instructor_id 
      FROM course_content cc
      JOIN courses c ON cc.course_id = c.id
      WHERE cc.id = $1`;
      
    const { rows } = await pool.query(checkQuery, [contentId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    if (rows[0].instructor_id !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this content' });
    }
    
    // Delete from database
    await pool.query('DELETE FROM course_content WHERE id = $1', [contentId]);
    
    res.status(200).json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ message: 'Server error' });
  }
};