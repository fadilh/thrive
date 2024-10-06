const express = require('express');
const db = require('../db/connection.js');
const { ObjectId } = require('mongodb');

const router = express.Router();

// Get a list of all records
router.get('/', async (req, res) => {
  try {
    const collection = await db.collection('records');
    const records = await collection.find({}).toArray();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).send('Error retrieving records');
  }
});

// Get a single record by ID
router.get('/:id', async (req, res) => {
  try {
    const collection = await db.collection('records');
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) {
      res.status(404).send('Not found');
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).send('Error retrieving the record');
  }
});

// Create a new record
router.post('/', async (req, res) => {
  try {
    const newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    const collection = await db.collection('records');
    const result = await collection.insertOne(newDocument);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding record');
  }
});

// Update a record by ID
router.patch('/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    const collection = await db.collection('records');
    const result = await collection.updateOne(query, updates);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating record');
  }
});

// Delete a record by ID
router.delete('/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection('records');
    const result = await collection.deleteOne(query);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting record');
  }
});

module.exports = router;
