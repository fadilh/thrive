import express from 'express';
import db from '../db/connection.js';  // Import the connected database
import { ObjectId } from 'mongodb';

const router = express.Router();

// Add a new message with replies
router.post('/messages', async (req, res) => {
  try {
    const message = {
      user_id: req.body.user_id,
      timestamp: req.body.timestamp,
      message: req.body.message,
      replies: req.body.replies || []  // Replies as an array of objects
    };
    const messagesCollection = db.collection('messages');
    const result = await messagesCollection.insertOne(message);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding message');
  }
});

// Retrieve all messages for a specific user
router.get('/messages/:user_id', async (req, res) => {
  try {
    const messagesCollection = db.collection('messages');
    const userMessages = await messagesCollection.find({ user_id: req.params.user_id }).toArray();
    res.status(200).json(userMessages);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving messages');
  }
});

// Add a new appointment
router.post('/appointments', async (req, res) => {
  try {
    const appointment = {
      user_id: req.body.user_id,
      appointment_date: req.body.appointment_date,
      description: req.body.description
    };
    const appointmentsCollection = db.collection('appointments');
    const result = await appointmentsCollection.insertOne(appointment);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding appointment');
  }
});

// Retrieve all appointments for a specific user
router.get('/appointments/:user_id', async (req, res) => {
  try {
    const appointmentsCollection = db.collection('appointments');
    const userAppointments = await appointmentsCollection.find({ user_id: req.params.user_id }).toArray();
    res.status(200).json(userAppointments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving appointments');
  }
});

export default router;
