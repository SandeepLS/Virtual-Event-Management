const Event = require("../models/event");
const User = require('../models/user');

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEvent = async (req, res) => {
  try {
    // if(!req.params.id)
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEvent = async (req, res) => {
  try {
    if (req.user.role !== "EventManager") {
      return res.status(403).json({ error: "Access denied" });
    }

    const event = await Event.create(req.body);
    res.status(201).json({ success: true, event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//One constant file, create one object ,key:EM, Val: EM 

const updateEvent = async (req, res) => {
  try {
    if (req.user.role !== "EventManager") {
      return res.status(403).json({ error: "Access denied" });
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });    //Q
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    if (req.user.role !== "EventManager") {
      return res.status(403).json({ error: "Access denied" });
    }

    await Event.findByIdAndDelete(req.params.id);   //Q
    res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//user register for an event
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params; // Get event ID from URL parameters
    const userId = req.user._id; // User ID from middleware decoded JWT
    // The _id decoded from JWT and attached to req.user

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send({ success: false, message: "Event not found" });
    }

    // Check if user is already a participant
    if (event.participants.includes(userId)) {
      return res.status(400).send({ success: false, message: "User already registered for this event" });
    }

    // Add user to participants array
    event.participants.push(userId);
    await event.save();

    // Optionally, you can fetch user details if needed (for sending confirmation emails)
    const user = await User.findById(userId);
    if (user) {
      // Send confirmation email here (e.g., using a service like nodemailer)
      console.log(`Confirmation email sent to: ${user.email}`);
    }

    res.status(200).send({ success: true, message: "User registered for the event successfully", event });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: error.message });
  }
};


module.exports = { getAllEvents, getEvent, createEvent, updateEvent, deleteEvent, registerForEvent};
