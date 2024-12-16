const express = require("express");
const { getAllEvents, getEvent, createEvent, updateEvent, deleteEvent, registerForEvent, cancelEvent } = require("../controllers/event");
const { validateJWT } = require("../middlewares/userVerify");

const router = express.Router();

// Event Routes
router.get("/", validateJWT, getAllEvents);
router.get("/:id", validateJWT, getEvent);
router.post("/", validateJWT, createEvent);
router.put("/:id", validateJWT, updateEvent);
router.delete("/:id", validateJWT, deleteEvent);

// Route to User register for an event
router.post('/:eventId/register', validateJWT, registerForEvent);
router.delete('/:eventId/cancel', validateJWT, cancelEvent);

module.exports = router;
