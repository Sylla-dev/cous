const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/dashboard', protect, allowRoles('admin'), (req, res) => {
	res.json({ message: 'Bienvenue admin !'});
});

module.exports = router;