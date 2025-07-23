const express = require('express');
const router = express.Router();
const { createCours, getCours, getCoursByEnseignant, deleteCours, getCoursPourEleve, getCoursById } = require('../controllers/coursController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.post('/', protect, allowRoles('enseignant', 'admin'), createCours);
router.get('/', protect, allowRoles('admin', 'enseignant', 'eleve'), getCours);
router.get('/mes-cours', protect, allowRoles('enseignant'), getCoursByEnseignant);
router.get('/', protect, getCoursPourEleve);
router.get('/:id', protect, getCoursById);

router.delete('/:id', protect, allowRoles('enseignant', 'admin'), deleteCours);



module.exports = router;
