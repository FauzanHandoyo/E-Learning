const express = require('express');
const router = express.Router();
const courseContentController = require('../controllers/courseContentController');

// Route to create new course content
router.post('/', courseContentController.createContent);

// Route to get all content for a specific course
router.get('/course/:course_id', courseContentController.getContentByCourseId);

// Route to get specific content by its ID
router.get('/:id', courseContentController.getContentById);

// Route to delete course content by ID
router.delete('/:id', courseContentController.deleteContent);

module.exports = router;