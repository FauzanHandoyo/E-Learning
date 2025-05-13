const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Define routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/:id/courses-held', userController.getCoursesHeldByInstructor);

module.exports = router; // Use CommonJS export