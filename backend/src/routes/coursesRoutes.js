const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');
// Route to create a course
router.post('/', coursesController.createCourse);

// Route to get all courses
router.get('/', coursesController.getAllCourses);

// Route to get a course by ID
router.get('/:id', coursesController.getCourseById);

module.exports = router;