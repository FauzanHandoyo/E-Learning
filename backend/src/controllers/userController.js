const User = require('../models/userModel');
const pool = require('../../db'); 

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    // Validate the ID from the request parameters
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Call the findById method with the validated ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

// Create a new user
const createUser = async (req, res) => {
    try {
        const { email, username, password, role } = req.body;
        const newUser = await User.create({ email, username, password, role });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error); // Log the error
        res.status(500).json({ message: 'Error creating user', error: error.message || error });
    }
};

// Update user by ID
const updateUser = async (req, res) => {
    try {
        const { email, username, password, role } = req.body;
        const updatedUser = await User.update(req.params.id, { email, username, password, role });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

// Delete user by ID
const deleteUser = async (req, res) => {
    try {
        const deleted = await User.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

const getCoursesHeldByInstructor = async (req, res) => {
    const { id } = req.params;

    try {
        const courses = await User.getCoursesHeld(id);
        if (!courses.length) {
            return res.status(404).json({ message: 'No courses found for this instructor.' });
        }
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses held by instructor:', error);
        res.status(500).json({ message: 'Error fetching courses held by instructor', error });
    }
};

// Fetch enrolled courses for a user
const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure `req.user` is populated correctly
    const courses = await User.getEnrolledCourses(userId); // Use the User model method
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Failed to fetch enrolled courses' });
  }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getCoursesHeldByInstructor,
    getEnrolledCourses
};