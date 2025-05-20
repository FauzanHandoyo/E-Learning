const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Apply authentication middleware to enrollment routes
router.post('/', verifyToken, enrollmentController.enrollUser);

module.exports = router;