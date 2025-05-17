const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');

router.get('/enrolled', coursesController.getEnrolledCourses);
router.post('/', coursesController.createCourse);
router.get('/', coursesController.getAllCourses);
router.get('/:id', coursesController.getCourseById);


module.exports = router;