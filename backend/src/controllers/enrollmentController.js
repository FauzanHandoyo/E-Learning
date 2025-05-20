const pool = require('../../db');

// Enroll a user in a course
const enrollUser = async (req, res) => {
    // Get user ID from JWT token instead of request body
    const user_id = req.user.id;
    const { course_id } = req.body;

    if (!course_id) {
        return res.status(400).json({
            message: 'Course ID is required',
        });
    }

    try {
        // Check if enrollment already exists to prevent duplicates
        const checkQuery = `
            SELECT * FROM enrollments 
            WHERE user_id = $1 AND course_id = $2`;
        const checkResult = await pool.query(checkQuery, [user_id, course_id]);
        
        if (checkResult.rows.length > 0) {
            return res.status(400).json({
                message: 'User is already enrolled in this course',
            });
        }

        // Insert enrollment into the database
        const query = `
            INSERT INTO enrollments (user_id, course_id)
            VALUES ($1, $2)
            RETURNING *`;
        const { rows } = await pool.query(query, [user_id, course_id]);

        res.status(201).json({
            message: 'User enrolled successfully.',
            enrollment: rows[0],
        });
    } catch (error) {
        console.error('Error enrolling user:', error);
        res.status(500).json({ message: 'Error enrolling user', error: error.message || error });
    }
};

module.exports = {
    enrollUser,
};