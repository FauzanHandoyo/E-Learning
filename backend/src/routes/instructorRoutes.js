const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const coursesController = require('../controllers/coursesController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Route to apply to become an instructor
router.post('/apply', verifyToken, checkRole(['student']), instructorController.applyToBeInstructor);

// Route to edit a course (instructor only)
router.put('/courses/:courseId', verifyToken, coursesController.updateCourse);

module.exports = router;