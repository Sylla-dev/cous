const Cours = require('../models/Cours');
const Eleve = require('../models/Eleve');

// ➕ Créer un cours
exports.createCours = async (req, res) => {
  try {
    const { titre, contenu, classe, matiere, enseignant } = req.body;

    if (!titre || !contenu || !classe || !matiere || !enseignant) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    // Ajout de l'enseignant connecté via le token
    const cours = await Cours.create({
      titre,
      contenu,
      classe,
      matiere,
      enseignant,
    });

    res.status(201).json(cours);
  } catch (err) {
    console.error('Erreur createCours:', err);
    res.status(400).json({ error: err.message });
  }
};

// 📄 Obtenir tous les cours (admin ou direction par ex)
exports.getCours = async (req, res) => {
  try {
    const cours = await Cours.find()
      .populate('matiere', 'nom')
      .populate('classe', 'nom niveau')
      .populate('enseignant', 'nom');
    res.json(cours);
  } catch (err) {
    console.error('Erreur getCours:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCoursPourEleve = async (req, res) => {
  try {
    const eleve = await Eleve.find({eleve: req.user.id}); // req.user doit contenir l'élève connecté

    if (!eleve || !eleve.classe) {
      return res.status(404).json({ message: "Élève ou classe introuvable" });
    }

    const cours = await Cours.find({ classe: eleve.classe })
      .populate('matiere', 'nom')
      .populate('enseignant', 'nom')
      .populate('classe', 'nom niveau');

    res.json(cours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👨‍🏫 Obtenir les cours de l'enseignant connecté
exports.getCoursByEnseignant = async (req, res) => {
  try {
    const cours = await Cours.find({ enseignant: req.params.id })
      .populate('matiere', 'nom')
      .populate('classe', 'nom niveau');
    res.json(cours);
  } catch (err) {
    console.error('Erreur getCoursByEnseignant:', err);
    res.status(500).json({ error: err.message });
  }
};

// ❌ Supprimer un cours
exports.deleteCours = async (req, res) => {
  try {
    await Cours.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cours supprimé' });
  } catch (err) {
    console.error('Erreur deleteCours:', err);
    res.status(400).json({ error: err.message });
  }
};

// controllers/coursController.js
exports.getCoursById = async (req, res) => {
  try {
    const { id } = req.params;

    const cours = await Cours.findById(id).populate('classe');
    if (!cours) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }

    res.json(cours);
  } catch (err) {
    console.error("Erreur getCoursById:", err);
    res.status(500).json({ error: err.message });
  }
};


