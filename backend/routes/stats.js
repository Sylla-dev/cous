const express = require('express');
const router = express.Router();
const statController = require('../controllers/statController');
const { protect } = require('../middleware/authMiddleware'); // Authentification middleware

router.get('/', protect, statController.getStats);

module.exports = router;
