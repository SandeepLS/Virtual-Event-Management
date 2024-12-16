const Event = require("../models/event");
const User = require('../models/user');
const sendEmail = require('../utils/emailSender');
const nodemailer = require('nodemailer')

//role: EventManager:-
const getAllEvents = async (req, res) => {  //Can access User & EventManager.
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEvent = async (req, res) => {  //Can access User & EventManager.
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


//role: User:-
//user register for an event
const registerForEvent = async (req, res) => {
  try {
    // console.log(req.user); // Debug: Check if `req.user` contains the user ID and role. from middleware decoded JWT.
    // const { id: userId } = req.user; // Extract userId

    const { eventId } = req.params; // Get event ID from URL parameters
    const userId = req.user.id; // User ID from middleware decoded JWT
    // The id decoded from JWT and attached to req.user

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

    //for sending confirmation emails.
    const user = await User.findById(userId);
    if (user) {
      // Send confirmation email
      const emailText = `
        Hi ${user.name},

        You have successfully registered for the event: ${event.title}.

        Event Details:
        - Description: ${event.description}
        - Date: ${event.date}
        - Time: ${event.time}
        - Speaker: ${event.speaker}
        - Tech Tools: ${event.techTools}

        Thank you for registering!
      `;

      await sendEmail(user.email, "Event Registration Confirmation", emailText);
      console.log(`Confirmation email sent to: ${user.email}`);
    }

    res.status(200).send({ success: true, message: "User registered for the event successfully", event });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

const cancelEvent = async (req, res) =>{

  try{
    const userId = req.user.id; // User ID decoded from the JWT
    const eventId = req.params.eventId;  // Get the event ID from the URL/route.

    //Find the event
    const event = await Event.findById(eventId);  //await: It will be wait untill to get resolved value.
    if(!event){
      return res.status(404).send({ success: false, message: "Event not found" });
    }

    //Check if the user is participant/Not, in the event.
    //Using indexOf(userId) is to find the position of the userId, in the participants array. so we can remove it using the splice() method.
    const participantIndex = event.participants.indexOf(userId); 
    if (participantIndex === -1) {
      return res.status(400).json({ success: false, message: "User not registered for this event" });
    }
    /*User is Registered:-
    event.participants.indexOf(userId) → Returns 1 (index of user2 in the array).
    participantIndex !== -1: The user is found, so the removal proceeds.*/
    /*User is Not Registered:-
    event.participants.indexOf(userId) → Returns -1 (because user4 is not in the array).
    participantIndex === -1: The user is not found, so the function returns an error response.*/

    // Remove the user from the participants list
    event.participants.splice(participantIndex, 1);
    await event.save();

    // Fetch user details for sending confirmation email
    const user = await User.findById(userId);
    if (user) {
      // Send confirmation email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Event Registration Cancellation",
        text: `Dear ${user.name},\n\nYou have successfully canceled your registration for the event "${event.title}".\n\nThank you,\nVirtual Event Management Team`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Cancellation email sent to: ${user.email}`);
    }

    res.status(200).json({
      success: true,
      message: "User canceled the event successfully and received confirmation email",
      event,
    });
  } catch (error) {
    console.error("Error canceling event:", error);
    res.status(500).json({ success: false, message: "Failed to cancel the event", error: error.message });
  }
};


module.exports = { getAllEvents, getEvent, createEvent, updateEvent, deleteEvent, registerForEvent, cancelEvent};
