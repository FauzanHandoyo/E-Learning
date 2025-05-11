// src/config/db.js
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
connectionString: process.env.DATABASE_URL,
});

pool.connect()
.then(() => console.log('📦 Connected to PostgreSQL'))
.catch(err => console.error('❌ PostgreSQL connection error:', err));

export default pool;