// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');

const app = express();

// Conectare la baza de date
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutele API – presupunem că itemRoutes.js expune rutele la "/api/items"
app.use('/api/items', require('./routes/itemRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});
