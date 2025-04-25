import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserRoutes from './routes/user.route.js'
import AuthRoutes from './routes/auth.route.js'
dotenv.config(); 

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.listen(3000, () => {
  console.log('Server Running on port 3000');
});

app.use('/api/user',UserRoutes);
app.use('/api/auth',AuthRoutes)