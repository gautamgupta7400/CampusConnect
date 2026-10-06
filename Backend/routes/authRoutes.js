const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();


// ===============================
// Student Signup
// ===============================

router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      rollNo,
      email,
      password
    } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered. Please login."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create student
    const user = await User.create({
      name,
      rollNo,
      email,
      password: hashedPassword,
      role: "student"
    });

    // Create JWT automatically after signup
    const token = jwt.sign(
  {
    userId: user._id,
    role: user.role
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1d"
  }
);

    // Send token and user details
    res.status(201).json({
      message: "Student signup successful",

      token: token,

      user: {
        id: user._id,
        name: user.name,
        rollNo: user.rollNo,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Student signup failed",
      error: error.message
    });
  }
});


// ===============================
// Login
// ===============================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // Check password
    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // Create JWT
    const token = jwt.sign(
  {
    userId: user._id,
    role: user.role
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1d"
  }
);

    // Send response
    res.json({
      message: "Login successful",

      token: token,

      user: {
        id: user._id,
        name: user.name,
        rollNo: user.rollNo,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});


module.exports = router;