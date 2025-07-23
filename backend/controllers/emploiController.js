const Emploi = require('../models/Emploi');
const Enseignant = require('../models/Enseignant');
const Classe = require('../models/Classe');
const Matiere = require('../models/Matiere');
const Eleve = require('../models/Eleve');

// 📅 Emploi du temps d’un enseignant
exports.getEmploi = async (req, res) => {
  try {
    const emploi = await Emploi.find({ enseignant: req.user._id })
      .populate('classe', 'nom niveau')
      .populate('matiere', 'nom')
      .sort({ jour: 1, heure: 1 });

    res.json(emploi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📅 Emploi du temps pour un élève
exports.getEmploiEleve = async (req, res) => {
  try {
    const eleve = await Eleve.findById(req.user._id);
    if (!eleve || !eleve.classe) {
      return res.status(404).json({ message: "Classe de l'élève introuvable" });
    }

    const emploi = await Emploi.find({ classe: eleve.classe })
      .populate('matiere', 'nom')
      .populate('enseignant', 'nom')
      .sort({ jour: 1, heure: 1 });

    res.json(emploi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➕ Ajout manuel d’un créneau
exports.createEmploi = async (req, res) => {
  try {
    const { jour, heure, classe, matiere, enseignant } = req.body;

    if (!jour || !heure || !classe || !matiere || !enseignant) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const existing = await Emploi.findOne({ jour, heure, classe, matiere, enseignant });
    if (existing) {
      return res.status(400).json({ message: 'Ce créneau existe déjà' });
    }

    const emploi = await Emploi.create({ jour, heure, classe, matiere, enseignant });
    res.status(201).json(emploi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
