const express = require('express');
const router = express.Router();
const eleveCtrl = require('../controllers/eleveController');

router.post('/', eleveCtrl.createEleve);
router.get('/', eleveCtrl.getEleves);
router.get('/:id', eleveCtrl.getEleveById);
router.put('/:id', eleveCtrl.updateEleve);
router.delete('/:id', eleveCtrl.deleteEleve);
router.put('/:id/affecter', eleveCtrl.affecteEleve); // << nouvelle route affectation

module.exports = router;
