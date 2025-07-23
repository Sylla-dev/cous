const express = require('express');
const router = express.Router();
const {
  createSemestre,
  getSemestres,
  updateSemestre,
  deleteSemestre
} = require('../controllers/semestreController');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.get('/', protect, getSemestres);
router.post('/', protect, allowRoles('admin'), createSemestre);
router.put('/:id', protect, allowRoles('admin'), updateSemestre);
router.delete('/:id', protect, allowRoles('admin'), deleteSemestre);

module.exports = router;
