const pool = require('../../db'); // Import the database connection

// Apply to become an instructor (auto-accept)
const applyInstructor = async (req, res) => {
    const { id } = req.params; // User ID
    try {
        // Check if the user is already an instructor
        const userQuery = 'SELECT role FROM users WHERE id = $1';
        const { rows: userRows } = await pool.query(userQuery, [id]);

        if (userRows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (userRows[0].role === 'instructor') {
            return res.status(400).json({ message: 'User is already an instructor.' });
        }

        // Insert a new application
        const applicationQuery = `
            INSERT INTO instructor_applications (user_id)
            VALUES ($1)
            RETURNING *`;
        const { rows: applicationRows } = await pool.query(applicationQuery, [id]);

        // Update the user's role to 'instructor'
        const updateRoleQuery = 'UPDATE users SET role = $1 WHERE id = $2';
        await pool.query(updateRoleQuery, ['instructor', id]);

        res.status(201).json({
            message: 'Application submitted and accepted successfully.',
            application: applicationRows[0],
        });
    } catch (error) {
        console.error('Error applying to become an instructor:', error);
        res.status(500).json({ message: 'Error applying to become an instructor', error });
    }
};

module.exports = {
    applyInstructor,
};