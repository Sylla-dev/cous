// routes/presences.js
const express = require('express');
const router = express.Router();
const presenceController = require('../controllers/presenceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, presenceController.marquerPresence);
router.get('/classe/:classeId', protect, presenceController.getPresencesParClasse);
router.get('/eleve/:eleveId/historique', protect, presenceController.historiquePresenceEleve);
router.get('/eleve/:eleveId/:export-pdf', protect, presenceController.exportPresencePDF);
router.get('/', protect, presenceController.getPresences);

module.exports = router;
