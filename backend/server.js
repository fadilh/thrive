const express = require('express');
const cors = require('cors');
const records = require('./routes/record.js');
require('dotenv').config();

const PORT = process.env.PORT || 5050;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/record', records);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
