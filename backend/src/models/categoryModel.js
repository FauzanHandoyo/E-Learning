const pool = require('../../db');

const Category = {
    // Get all categories
    findAll: async () => {
        const query = 'SELECT * FROM categories ORDER BY name';
        const { rows } = await pool.query(query);
        return rows;
    },

    // Get category by ID
    findById: async (id) => {
        const query = 'SELECT * FROM categories WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    },

    // Create new category
    create: async (name, description) => {
        const query = `
            INSERT INTO categories (name, description)
            VALUES ($1, $2)
            RETURNING *`;
        const { rows } = await pool.query(query, [name, description]);
        return rows[0];
    }
};

module.exports = Category;