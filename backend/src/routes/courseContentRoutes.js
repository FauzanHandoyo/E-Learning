const express = require('express');
const router = express.Router();
const courseContentController = require('../controllers/courseContentController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Create new content with PDF upload
router.post('/', verifyToken, courseContentController.createContent);

// Get all content for a course
router.get('/course/:course_id', courseContentController.getContentByCourseId);

// Get specific content by ID
router.get('/:id', courseContentController.getContentById);

// Delete content
router.delete('/:id', verifyToken, courseContentController.deleteContent);

module.exports = router;