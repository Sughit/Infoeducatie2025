// config/db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    await client.connect();
    // Numele bazei de date poate fi definit în .env ca DB_NAME, altfel se folosește o valoare implicită.
    db = client.db(process.env.DB_NAME || 'test');
    console.log(`MongoDB conectat: ${client.s.options.srvHost || 'local'}`);
  } catch (error) {
    console.error(`Eroare la conectarea la MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

module.exports = { connectDB, getDB };
