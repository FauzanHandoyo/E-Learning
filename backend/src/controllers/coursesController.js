const Courses = require('../models/coursesModel');
const pool = require('../../db'); // Import the database connection

// Create a new course
const createCourse = async (req, res) => {
    const { title, description, instructor_id, price, category_id } = req.body;

    try {
        // Validate that the instructor exists and has the role 'instructor'
        const instructorQuery = 'SELECT role FROM users WHERE id = $1';
        const { rows: instructorRows } = await pool.query(instructorQuery, [instructor_id]);

        if (instructorRows.length === 0 || instructorRows[0].role !== 'instructor') {
            return res.status(400).json({ message: 'Only instructors can create courses.' });
        }

        // Insert the course into the database
        const course = await Courses.create({ title, description, instructor_id, price, category_id });
        res.status(201).json({ message: 'Course created successfully.', course });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Error creating course', error });
    }
};

const getAllCourses = async (req, res) => {
  try {
    console.log('Fetching courses from database...');
    
    // Use a JOIN query to include instructor information
    const query = `
      SELECT c.*, u.username as instructor_name 
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
    `;
    
    const { rows } = await pool.query(query);
    console.log('Courses fetched:', rows);
    res.status(200).json(rows);
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
  try {
    const { courseId } = req.params;
    const { title, description, category_id, instructor_id } = req.body;

    // First, check if the course exists
    const course = await Courses.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the user is the instructor of this course
    if (course.instructor_id !== instructor_id) {
      return res.status(403).json({ message: 'You do not have permission to update this course' });
    }

    // Update the course
    const updatedCourse = await Courses.update(courseId, { 
      title, 
      description, 
      category_id 
    });

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Failed to update course', error: error.message });
  }
};

// Update the getEnrolledCourses function or add it if it doesn't exist
const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id; // Get from JWT token
    
    const query = `
      SELECT 
        c.id AS course_id, 
        c.title AS course_title, 
        c.description AS course_description,
        c.image_url, 
        u.username AS instructor_name,
        cat.name AS category_name,
        e.progress,
        e.enrolled_at
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON c.instructor_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE e.user_id = $1
      ORDER BY e.enrolled_at DESC
    `;
    
    const { rows } = await pool.query(query, [userId]);
    
    console.log('Enrolled courses data:', rows); // Debug log to check data
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Failed to fetch enrolled courses' });
  }
};

const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;
    
    // Use a JOIN query to get more information about the courses
    const query = `
      SELECT c.*, 
             COUNT(DISTINCT e.user_id) as students_count 
      FROM courses c
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE c.instructor_id = $1
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;
    
    const { rows } = await pool.query(query, [instructorId]);
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    res.status(500).json({ message: 'Failed to fetch instructor courses' });
  }
};


module.exports = {
    updateCourse,
    createCourse,
    getAllCourses,
    getCourseById,
    getEnrolledCourses,
    getInstructorCourses
};