const pool = require('../../db');

// Enroll a user in a course
const enrollUser = async (req, res) => {
    const { user_id, course_id } = req.body;

    try {
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
        res.status(500).json({ message: 'Error enrolling user', error });
    }
};

module.exports = {
    enrollUser,
};