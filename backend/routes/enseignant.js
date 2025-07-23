const express = require('express');
const router = express.Router();
const {
  createEnseignant,
  getEnseignants,
  updateEnseignant,
  deleteEnseignant,
  getMesClasses,
  getInfosPourCours,
  affecterClasses,
  affecterMatieres,
  affecterCreneaux,
  ajouterCahierCharges
} = require('../controllers/enseignantController');

const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.get('/', protect, getEnseignants);
router.post('/', protect, allowRoles('admin'), createEnseignant);
router.put('/:id', protect, allowRoles('admin'), updateEnseignant);
router.delete('/:id', protect, allowRoles('admin'), deleteEnseignant);
router.get('/mes-classes', protect, allowRoles('enseignant'), getMesClasses);
router.get('/infos-pour-cours', protect, allowRoles('enseignant'), getInfosPourCours);

router.put('/:id/classes', protect, allowRoles('admin'), affecterClasses);
router.put('/:id/matieres', protect, allowRoles('admin'), affecterMatieres);
router.put('/:id/creneaux', protect, allowRoles('admin'), affecterCreneaux);
router.put('/:id/cahier', protect, allowRoles('admin'), ajouterCahierCharges);



module.exports = router;
