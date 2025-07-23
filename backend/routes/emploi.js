const express = require('express');
const router = express.Router();
const Emploi = require('../models/Emploi');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

// ✅ Ajouter un créneau
router.post("/", protect, allowRoles('admin'), async (req, res) => {
  try {
    const exist = await Emploi.findOne({
      classe: req.body.classe,
      jour_semaine: req.body.jour_semaine,
      $or: [
        {
          heure_debut: { $lt: req.body.heure_fin },
          heure_fin: { $gt: req.body.heure_debut }
        }
      ]
    });

    if (exist) return res.status(400).json({ error: "Conflit avec un autre cours" });

    const newCours = new Emploi(req.body);
    await newCours.save();
    res.status(201).json(newCours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📝 Modifier un créneau
router.put("/:id", async (req, res) => {
  try {
    const updated = await Emploi.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Supprimer un créneau
router.delete("/:id", async (req, res) => {
  try {
    await Emploi.findByIdAndDelete(req.params.id);
    res.json({ message: "Supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 Lister tous les créneaux (admin)
router.get("/", async (req, res) => {
  try {
    const data = await Emploi.find()
      .populate('classe', 'nom niveau')
      .populate('enseignant', 'nom')
      .populate('matiere', 'nom')
      .sort({ jour_semaine: 1, heure_debut: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
