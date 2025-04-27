import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import UserRoutes from './routes/user.route.js';
import AuthRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js'
import commentRoutes from './routes/comment.route.js';
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('✅ MongoDB is connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
// Routes
app.use('/api/user', UserRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
// 404 Not Found Handler
app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.statusCode = 404;
  next(error); // Pass to global error handler
});

// Global Error Handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    success: false,
    status,
    message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
