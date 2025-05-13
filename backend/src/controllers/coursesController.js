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
        const courses = await Courses.findAll();
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Error fetching courses', error });
    }
};

// Get a course by ID
const getCourseById = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Courses.findById(id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Error fetching course', error });
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

module.exports = {
    updateCourse,
    createCourse,
    getAllCourses,
    getCourseById,
};