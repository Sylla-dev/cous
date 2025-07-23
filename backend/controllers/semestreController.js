const Semestre = require('../models/Semestre');

exports.createSemestre = async (req, res) => {
  try {
    const semestre = await Semestre.create(req.body);
    res.status(201).json(semestre);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSemestres = async (req, res) => {
  const semestres = await Semestre.find().sort({ dateDebut: 1 });
  res.json(semestres);
};

exports.updateSemestre = async (req, res) => {
  const { id } = req.params;
  const updated = await Semestre.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

exports.deleteSemestre = async (req, res) => {
  const { id } = req.params;
  await Semestre.findByIdAndDelete(id);
  res.json({ message: 'Semestre supprimé' });
};
