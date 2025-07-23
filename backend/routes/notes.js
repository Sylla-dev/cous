const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const noteCtrl = require('../controllers/noteController');

router.post('/', protect, noteCtrl.ajouterNote);
router.get('/eleve/:id', protect, noteCtrl.notesParEleve);
router.get('/', protect, noteCtrl.getNotes);
router.get('/mes-notes', protect, noteCtrl.notesDeLEleveConnecte);
router.get('/analyse', protect, noteCtrl.notesParClasseEtSemestre);
router.get('/eleve/:id', noteCtrl.getNotesById);
router.get('/eleve/:id/moyennes', noteCtrl.getEleveMoyennes);

router.put('/:id', protect, noteCtrl.updateNote);
router.delete('/:id', protect, noteCtrl.deleteNote);



module.exports = router;
