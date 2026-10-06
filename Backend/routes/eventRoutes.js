const express = require("express");
const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const Registration = require("../models/Registration");

const router = express.Router();

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();

    const eventsWithSeats = await Promise.all(
      events.map(async (event) => {
        const registeredCount = await Registration.countDocuments({
          eventId: event._id
        });

        return {
          ...event.toObject(),
          totalSeats: event.seats,
          registeredCount: registeredCount,
          availableSeats: event.seats - registeredCount
        };
      })
    );

    res.json(eventsWithSeats);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch events"
    });
  }
});

// Get single event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch event"
    });
  }
});

// Add event
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const event = await Event.create(req.body);

    res.status(201).json({
      message: "Event added successfully",
      event
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add event",
      error: error.message
    });
  }
});

// Delete event
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.json({
      message: "Event deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete event"
    });
  }
});

module.exports = router;