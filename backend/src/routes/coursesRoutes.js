const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');
const uploadController = require('../controllers/uploadController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/enrolled', coursesController.getEnrolledCourses);
router.get('/instructor', verifyToken, coursesController.getInstructorCourses)
router.post('/', coursesController.createCourse);
router.get('/', coursesController.getAllCourses);
router.get('/:id', coursesController.getCourseById);
router.put('/:courseId', coursesController.updateCourse);
router.post('/upload-image', verifyToken, uploadController.uploadCourseImage);

module.exports = router;