import dotenv from 'dotenv';

dotenv.config();

import express, { json } from 'express';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import authorsRoutes from './routes/authors.js';
import postsRoutes from './routes/posts.js';

const app = express();
app.use(json());

// Connect DB
connectDB();

// Routes

app.use('/auth', authRoutes);
app.use('/authors', authorsRoutes);
app.use('/posts', postsRoutes);

// Error handler (keep last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
