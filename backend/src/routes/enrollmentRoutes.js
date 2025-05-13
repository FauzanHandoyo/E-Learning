const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

// Route to enroll a user in a course
router.post('/', enrollmentController.enrollUser);

module.exports = router;