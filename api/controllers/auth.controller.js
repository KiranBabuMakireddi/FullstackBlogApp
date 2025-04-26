import User from "../models/usermodel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { errorHandler } from "../utils/error.js";

// === Validation Helpers ===
const isEmailValid = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isUsernameValid = (username) =>
  /^[a-zA-Z0-9_]{3,20}$/.test(username); // 3–20 chars, letters, numbers, underscores

const isPasswordStrong = (password) =>
  password.length >= 6;

// === SIGN UP ===
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check required fields
    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      return next(errorHandler(400, 'All fields are required'));
    }

    // Validate individual fields
    if (!isUsernameValid(username.trim())) {
      return next(errorHandler(400, 'Username must be 3-20 characters, letters/numbers/underscores only'));
    }

    if (!isEmailValid(email.trim())) {
      return next(errorHandler(400, 'Invalid email format'));
    }

    if (!isPasswordStrong(password)) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      return next(errorHandler(409, 'Username or Email already exists'));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    next(error);
  }
};

// === SIGN IN ===
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email?.trim() || !password?.trim()) {
      return next(errorHandler(400, 'Email and password are required'));
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(errorHandler(401, 'Invalid credentials'));
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send cookie and response
    res
      .cookie('access_token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: 'Signin successful',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
  } catch (error) {
    next(error);
  }
};
