import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Store reference to io instance (will be set from index.js)
let ioInstance = null;

export const setIO = (io) => {
  ioInstance = io;
};

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
        res.status(500).json({ message: error.message });
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
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const logoutUser = async (req, res) => {
    try {
        // Logout is handled client-side by removing the cookie
        // This endpoint can be used for server-side session invalidation if needed
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Update user score in their own database
export const updateScore = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT token (decoded JWT has 'id' property)
    const { clicks } = req.body;

    if (clicks === undefined || clicks < 0) {
      return res.status(400).json({ message: "Invalid clicks value" });
    }

    // Update user's score in their own user document
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        score: clicks,
        scoreUpdatedAt: new Date()
      },
      { 
        new: true 
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Broadcast updated scoreboard to all clients
    if (ioInstance) {
      const scoreboard = await User.find()
        .select("displayName email score scoreUpdatedAt _id")
        .sort({ score: -1, scoreUpdatedAt: -1 })
        .limit(10)
        .lean();

      const formattedScoreboard = scoreboard.map((entry, index) => ({
        rank: index + 1,
        displayName: entry.displayName || "Unknown",
        score: entry.score || 0,
        userId: entry._id.toString(),
      }));

      ioInstance.emit("scoreboard-update", formattedScoreboard);
    }

    res.status(200).json({ message: "Score updated", score: user.score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's current score from their own user document
export const getUserScore = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT token (decoded JWT has 'id' property)
    
    const user = await User.findById(userId).select("score").lean();
    
    res.status(200).json({ score: user ? (user.score || 0) : 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get scoreboard (top players) from User documents
export const getScoreboard = async (req, res) => {
  try {
    const scoreboard = await User.find()
      .select("displayName email score scoreUpdatedAt _id")
      .sort({ score: -1, scoreUpdatedAt: -1 })
      .limit(10)
      .lean();

    // Format scoreboard data
    const formattedScoreboard = scoreboard.map((entry, index) => ({
      rank: index + 1,
      displayName: entry.displayName || "Unknown",
      score: entry.score || 0,
      userId: entry._id.toString(),
    }));

    res.status(200).json(formattedScoreboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

