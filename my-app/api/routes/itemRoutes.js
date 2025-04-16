// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Ruta GET pentru preluarea tuturor item-urilor
router.get('/', itemController.getItems);

// Ruta POST pentru crearea unui item nou
router.post('/', itemController.createItem);

// Alte rute (update, delete) pot fi adăugate aici...

module.exports = router;
