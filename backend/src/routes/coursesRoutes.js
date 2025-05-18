const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/enrolled', coursesController.getEnrolledCourses);
router.get('/instructor', verifyToken, coursesController.getInstructorCourses)
router.post('/', coursesController.createCourse);
router.get('/', coursesController.getAllCourses);
router.get('/:id', coursesController.getCourseById);


module.exports = router;