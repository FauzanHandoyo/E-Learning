// src/app.js: jiha coba aja ya
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🎉 Online E-Learning Backend is running!');
});

export default app; // gaje coba aja push lu
