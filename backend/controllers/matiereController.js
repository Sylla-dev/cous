const Matiere = require('../models/Matiere');

exports.createMatiere = async (req, res) => {
  try {
    const matiere = await Matiere.create(req.body);
    res.status(201).json(matiere);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMatieres = async (req, res) => {
  const matieres = await Matiere.find().populate('classe');
  res.json(matieres);
};

exports.updateMatiere = async (req, res) => {
  const { id } = req.params;
  const updated = await Matiere.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

exports.deleteMatiere = async (req, res) => {
  const { id } = req.params;
  await Matiere.findByIdAndDelete(id);
  res.json({ message: 'Matière supprimée' });
};
