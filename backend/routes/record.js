import express from "express";
import db from "../db/connection.js"; // Import the connected MongoDB instance
import { ObjectId } from "mongodb"; // For working with MongoDB ObjectIds

const router = express.Router();

router.post("/messages", async (req, res) => {
  try {
    const message = {
      user_id: req.body.user_id,
      timestamp: req.body.timestamp,
      message: req.body.message,
      likes: 0, // Initialize likes to 0
      replies: req.body.replies || [], // If there are replies, store them
    };
    const messagesCollection = db.collection("messages");
    const result = await messagesCollection.insertOne(message);
    res.status(201).json(result); // Return the result
  } catch (err) {
    console.error("Error adding message:", err);
    res.status(500).send("Error adding message");
  }
});

// Retrieve all messages for a specific user (GET)
router.get("/messages/:user_id", async (req, res) => {
  try {
    const messagesCollection = db.collection("messages");
    const userMessages = await messagesCollection
      .find({ user_id: req.params.user_id })
      .toArray();
    res.status(200).json(userMessages);
  } catch (err) {
    console.error("Error retrieving messages:", err);
    res.status(500).send("Error retrieving messages");
  }
});

// Retrieve a single message by ID (GET)
router.get("/messages/single/:id", async (req, res) => {
  try {
    const messageId = new ObjectId(req.params.id);
    const messagesCollection = db.collection("messages");
    const message = await messagesCollection.findOne({ _id: messageId });

    if (!message) {
      res.status(404).send("Message not found");
    } else {
      res.status(200).json(message);
    }
  } catch (err) {
    console.error("Error retrieving message:", err);
    res.status(500).send("Error retrieving message");
  }
});

// Update a message (PATCH)
router.patch("/messages/:id", async (req, res) => {
  try {
    const messageId = new ObjectId(req.params.id);
    const updates = {
      $set: {
        message: req.body.message, // Only update the message content
        timestamp: req.body.timestamp || new Date().toISOString(), // Optionally update the timestamp
      },
    };
    const messagesCollection = db.collection("messages");
    const result = await messagesCollection.updateOne(
      { _id: messageId },
      updates
    );

    if (result.modifiedCount === 0) {
      res.status(404).send("Message not found");
    } else {
      res.status(200).send("Message updated successfully");
    }
  } catch (err) {
    console.error("Error updating message:", err);
    res.status(500).send("Error updating message");
  }
});

// Add a new reply to a message (PATCH)
router.patch("/messages/:id/reply", async (req, res) => {
  try {
    const messageId = new ObjectId(req.params.id);
    // console.log(req);
    const newReply = {
      userId: req.body.userId,
      message: req.body.message,
      date: req.body.date,
    };

    const messagesCollection = db.collection("messages");

    // Add the reply to the replies array using $push
    const result = await messagesCollection.updateOne(
      { _id: messageId },
      { $push: { replies: newReply } }
    );

    if (result.modifiedCount === 0) {
      res.status(404).send("Message not found");
    } else {
      res.status(200).send("Reply added successfully");
    }
  } catch (err) {
    console.error("Error adding reply:", err);
    res.status(500).send("Error adding reply");
  }
});

// Delete a message (DELETE)
router.delete("/messages/:id", async (req, res) => {
  try {
    const messageId = new ObjectId(req.params.id);
    const messagesCollection = db.collection("messages");
    const result = await messagesCollection.deleteOne({ _id: messageId });

    if (result.deletedCount === 0) {
      res.status(404).send("Message not found");
    } else {
      res.status(200).send("Message deleted successfully");
    }
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).send("Error deleting message");
  }
});

// Like a message (PATCH)
router.patch("/messages/:id/like", async (req, res) => {
  try {
    const messageId = new ObjectId(req.params.id);
    const messagesCollection = db.collection("messages");

    // Increment the "likes" field by 1
    const result = await messagesCollection.updateOne(
      { _id: messageId },
      { $inc: { likes: 1 } } // Increment the "likes" field by 1
    );

    if (result.modifiedCount === 0) {
      res.status(404).send("Message not found");
    } else {
      res.status(200).send("Message liked successfully");
    }
  } catch (err) {
    console.error("Error liking message:", err);
    res.status(500).send("Error liking message");
  }
});

////////// Appointments CRUD //////////

// Create a new appointment (POST)
router.post("/appointments", async (req, res) => {
  try {
    const appointment = {
      user_id: req.body.user_id,
      appointment_date: req.body.appointment_date,
      description: req.body.description,
    };
    const appointmentsCollection = db.collection("appointments");
    const result = await appointmentsCollection.insertOne(appointment);
    res.status(201).json(result);
  } catch (err) {
    console.error("Error adding appointment:", err);
    res.status(500).send("Error adding appointment");
  }
});

// Retrieve all appointments for a specific user (GET)
router.get("/appointments/:user_id", async (req, res) => {
  try {
    const appointmentsCollection = db.collection("appointments");
    const userAppointments = await appointmentsCollection
      .find({ user_id: req.params.user_id })
      .toArray();
    res.status(200).json(userAppointments);
  } catch (err) {
    console.error("Error retrieving appointments:", err);
    res.status(500).send("Error retrieving appointments");
  }
});

// Retrieve a single appointment by ID (GET)
router.get("/appointments/single/:id", async (req, res) => {
  try {
    const appointmentId = new ObjectId(req.params.id);
    const appointmentsCollection = db.collection("appointments");
    const appointment = await appointmentsCollection.findOne({
      _id: appointmentId,
    });

    if (!appointment) {
      res.status(404).send("Appointment not found");
    } else {
      res.status(200).json(appointment);
    }
  } catch (err) {
    console.error("Error retrieving appointment:", err);
    res.status(500).send("Error retrieving appointment");
  }
});

// Update an appointment (PATCH)
router.patch("/appointments/:id", async (req, res) => {
  try {
    const appointmentId = new ObjectId(req.params.id);
    const updates = {
      $set: {
        appointment_date: req.body.appointment_date,
        description: req.body.description,
      },
    };
    const appointmentsCollection = db.collection("appointments");
    const result = await appointmentsCollection.updateOne(
      { _id: appointmentId },
      updates
    );

    if (result.modifiedCount === 0) {
      res.status(404).send("Appointment not found");
    } else {
      res.status(200).send("Appointment updated successfully");
    }
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).send("Error updating appointment");
  }
});

// Delete an appointment (DELETE)
router.delete("/appointments/:id", async (req, res) => {
  try {
    const appointmentId = new ObjectId(req.params.id);
    const appointmentsCollection = db.collection("appointments");
    const result = await appointmentsCollection.deleteOne({
      _id: appointmentId,
    });

    if (result.deletedCount === 0) {
      res.status(404).send("Appointment not found");
    } else {
      res.status(200).send("Appointment deleted successfully");
    }
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).send("Error deleting appointment");
  }
});

export default router;
