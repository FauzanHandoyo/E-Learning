const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const uploadController = require('../controllers/uploadController');
const router = express.Router();

// Define routes
// Add verifyToken middleware to protected routes
router.get('/enrolled', verifyToken, userController.getEnrolledCourses);
router.post('/upload-avatar', verifyToken, uploadController.uploadAvatar);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/:id/courses-held', userController.getCoursesHeldByInstructor);

module.exports = router;