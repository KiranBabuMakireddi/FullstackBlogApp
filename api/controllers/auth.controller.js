import User from "../models/usermodel.js";
import bcrypt from 'bcrypt';

export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username?.trim() || !email?.trim() || !password?.trim()) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists by email or username
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Username or Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: "Signup successful" });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
