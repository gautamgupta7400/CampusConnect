const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Get all students
router.get(
  "/students",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const students = await User.find(
        { role: "student" },
        "-password"
      );

      res.json(students);

    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch students"
      });
    }
  }
);

// Delete student
router.delete(
  "/students/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const student = await User.findOneAndDelete({
        _id: req.params.id,
        role: "student"
      });

      if (!student) {
        return res.status(404).json({
          message: "Student not found"
        });
      }

      res.json({
        message: "Student deleted successfully"
      });

    } catch (error) {
      res.status(500).json({
        message: "Failed to delete student"
      });
    }
  }
);

module.exports = router;