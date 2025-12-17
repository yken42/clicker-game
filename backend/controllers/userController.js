import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
    try {
        const { displayName, email, password } = req.body;
        if(!displayName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }
        
        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ displayName, email, password: hashedPassword });
        
        // Don't send password in response
        const userResponse = {
            _id: newUser._id,
            displayName: newUser.displayName,
            email: newUser.email
        };
        
        return res.status(201).json({ message: "User created successfully", user: userResponse });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.status(201).json({ token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const logoutUser = async (req, res) => {
    try {
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

