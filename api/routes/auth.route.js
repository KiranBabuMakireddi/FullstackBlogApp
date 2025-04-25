import express from 'express';
import { signup } from '../controllers/auth.controller.js';
const router = express.Router();

export default router.post('/signup',signup)
