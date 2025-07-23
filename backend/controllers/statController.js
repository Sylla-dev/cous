const Eleve = require('../models/Eleve');
const Enseignant = require('../models/Enseignant');
const Classe = require('../models/Classe');
const Matiere = require('../models/Matiere');
const Cours = require('../models/Cours');
const Bulletin = require('../models/Bulletin');

exports.getStats = async (req, res) => {
  try {
    const [eleves, enseignants, classes, matieres, cours, bulletins] = await Promise.all([
      Eleve.countDocuments(),
      Enseignant.countDocuments(),
      Classe.countDocuments(),
      Matiere.countDocuments(),
      Cours.countDocuments(),
      Bulletin.countDocuments(),
    ]);

    res.json({ eleves, enseignants, classes, matieres, cours, bulletins });
  } catch (err) {
    console.error('Erreur stats :', err);
    res.status(500).json({ error: 'Erreur lors du chargement des statistiques.' });
  }
};
