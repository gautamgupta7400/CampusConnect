const express = require("express");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Get all registrations - Admin only
router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const registrations = await Registration.find()
        .populate("userId", "name rollNo email")
        .populate("eventId", "name date time venue");

      res.json(registrations);

    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch all registrations"
      });
    }
  }
);

// Get logged-in user's registrations
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const registrations = await Registration.find({
      userId: req.user.userId
    }).populate("eventId");

    res.json(registrations);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch registrations"
    });
  }
});

// Register for an event
router.post("/:eventId", authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.userId;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    const existingRegistration = await Registration.findOne({
      userId,
      eventId
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "Already registered for this event"
      });
    }

    const registrationCount = await Registration.countDocuments({
      eventId
    });

    if (registrationCount >= event.seats) {
      return res.status(400).json({
        message: "No seats available"
      });
    }

    const registration = await Registration.create({
      userId,
      eventId
    });

    res.status(201).json({
      message: "Event registration successful",
      registration
    });

  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});

module.exports = router;