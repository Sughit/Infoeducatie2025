// controllers/itemController.js
const { getDB } = require('../config/db');

// Obține toate item-urile
exports.getItems = async (req, res) => {
  try {
    const db = getDB();
    const items = await db.collection('items').find({}).toArray();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Eroare la preluarea datelor: ' + error.message });
  }
};

// Creează un nou item
exports.createItem = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Numele este obligatoriu' });
    }
    
    const newItem = {
      name,
      description: description || '',
      dateAdded: new Date(),
    };

    const db = getDB();
    const result = await db.collection('items').insertOne(newItem);
    res.status(201).json({ ...newItem, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Eroare la salvarea datelor: ' + error.message });
  }
};

// Alte funcții pentru update și delete pot fi adăugate similar.
