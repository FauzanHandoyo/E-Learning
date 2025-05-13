const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const coursesController = require('../controllers/coursesController');

// Route to apply to become an instructor
router.post('/:id/apply', instructorController.applyInstructor);

// Route to edit a course (instructor only)
router.put('/courses/:courseId', coursesController.updateCourse);

module.exports = router;