const Courses = require('../models/coursesModel');
const pool = require('../../db'); // Import the database connection

// Create a new course
const createCourse = async (req, res) => {
    const { title, description, instructor_id, price } = req.body;

    try {
        // Validate that the instructor exists and has the role 'instructor'
        const instructorQuery = 'SELECT role FROM users WHERE id = $1';
        const { rows: instructorRows } = await pool.query(instructorQuery, [instructor_id]);

        if (instructorRows.length === 0 || instructorRows[0].role !== 'instructor') {
            return res.status(400).json({ message: 'Only instructors can create courses.' });
        }

        // Insert the course into the database
        const course = await Courses.create({ title, description, instructor_id, price });
        res.status(201).json({ message: 'Course created successfully.', course });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Error creating course', error });
    }
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    console.log('Fetching courses from database...');
    const courses = await Courses.findAll(); // Replace with your database query
    console.log('Courses fetched:', courses);
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses', error });
  }
};

// Get a course by ID
const getCourseById = async (req, res) => {
  try {
    // Validate the ID from the request parameters
    const courseId = parseInt(req.params.id, 10);
    if (isNaN(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    // Call the findById method with the validated ID
    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Failed to fetch course' });
  }
};

const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const { title, description, price } = req.body;
    const instructorId = req.body.instructor_id; // Ensure the instructor ID is passed in the request

    try {
        // Validate that the course exists and belongs to the instructor
        const course = await Courses.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }
        if (course.instructor_id !== instructorId) {
            return res.status(403).json({ message: 'You are not authorized to edit this course.' });
        }

        // Update the course
        const updatedCourse = await Courses.update(courseId, { title, description, price });
        res.status(200).json({ message: 'Course updated successfully.', course: updatedCourse });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Error updating course', error });
    }
};

const getEnrolledCourses = async (req, res) => {
  try {
    // Get userId from query parameters or request body
    const userId = req.query.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required to fetch enrolled courses.' });
    }

    console.log('Fetching enrolled courses for user ID:', userId); // Log the user ID

    const courses = await Courses.getEnrolledCourses(userId); // Fetch enrolled courses
    console.log('Enrolled courses fetched:', courses); // Log the fetched courses

    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error); // Log the error
    res.status(500).json({ message: 'Failed to fetch enrolled courses' });
  }
};

module.exports = {
    updateCourse,
    createCourse,
    getAllCourses,
    getCourseById,
    getEnrolledCourses
};