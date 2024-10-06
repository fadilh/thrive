import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

const URI = process.env.ATLAS_URI || '';
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

// Call the function to connect to MongoDB
connectDB();

const db = client.db('ThriveDB');  // Replace with your DB name

export default db;
