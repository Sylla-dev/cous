const Eleve = require('../models/Eleve');

// ✅ Créer un élève
exports.createEleve = async (req, res) => {
  try {
    const eleve = await Eleve.create(req.body);
    res.status(201).json(eleve);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Récupérer tous les élèves (avec option de populate la classe)
exports.getEleves = async (req, res) => {
  try {
    const eleves = await Eleve.find().populate('classe', 'nom niveau');
    res.json(eleves);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du chargement des élèves' });
  }
};

// ✅ Récupérer un élève par ID (avec classe)
exports.getEleveById = async (req, res) => {
  try {
    const eleve = await Eleve.findById(req.params.id).populate('classe');
    if (!eleve) return res.status(404).json({ error: 'Élève non trouvé' });
    res.json(eleve);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ✅ Modifier un élève
exports.updateEleve = async (req, res) => {
  try {
    const updated = await Eleve.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Élève non trouvé' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Mise à jour impossible' });
  }
};

// ✅ Supprimer un élève
exports.deleteEleve = async (req, res) => {
  try {
    const deleted = await Eleve.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Élève non trouvé' });
    res.json({ message: 'Élève supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

exports.affecteEleve = async (req, res) => {
  try {
    const { classeId } = req.body;
    const eleve = await Eleve.findByIdAndUpdate(
      req.params.id,
      { classe: classeId },
      { new: true }
    ).populate('classe');

    if (!eleve) return res.status(404).json({ error: 'Élève non trouvé' });

    res.json({ message: 'Élève affecté à la classe', eleve });
  } catch (err) {
    res.status(400).json({ error: 'Échec de l’affectation' });
  }
};

