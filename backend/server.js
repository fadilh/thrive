import express from 'express';
import cors from 'cors';
import records from './routes/record.js';  // Import the routes (messages + appointments)
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

const PORT = process.env.PORT || 5050;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // For parsing JSON bodies

// Use routes from 'record.js'
app.use('/api', records);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
