const express = require('express');
const router = express.Router();
const { createClasse, getClasses, updateClasse, deleteClasse } = require('../controllers/classeController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// Accessible uniquement aux admins
router.post('/', protect, allowRoles('admin'), createClasse);
router.get('/', protect, allowRoles('admin', 'enseignant', 'eleve'), getClasses);
router.put('/:id', protect, allowRoles('admin'), updateClasse);
router.delete('/:id', protect, allowRoles('admin'), deleteClasse);

module.exports = router;