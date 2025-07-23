const express = require('express');
const router = express.Router();
const {
  createMatiere,
  getMatieres,
  updateMatiere,
  deleteMatiere
} = require('../controllers/matiereController');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.get('/', protect, getMatieres);
router.post('/', protect, allowRoles('admin'), createMatiere);
router.put('/:id', protect, allowRoles('admin'), updateMatiere);
router.delete('/:id', protect, allowRoles('admin'), deleteMatiere);

module.exports = router;
