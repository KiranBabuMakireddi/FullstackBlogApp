import User from "../models/usermodel.js";
import bcrypt from 'bcrypt';
import { errorHandler } from "../utils/error.js"; 

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      return next(errorHandler(400, 'All fields are required')); // 400 Bad Request
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return next(errorHandler(409, 'Username or Email already exists')); // 409 Conflict
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201 ).json({ message: "Signup successful" }); // 201 Created

  } catch (error) {
    next(error); // Pass to global error handler
  }
};
