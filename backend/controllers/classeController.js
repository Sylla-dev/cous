const Classe = require('../models/Classe');

exports.createClasse = async (req, res) => {
	try {
		const { nom, niveau, section } = req.body;
		const classe = await Classe.create({ nom, niveau, section });
		res.status(201).json(classe);
		
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.getClasses = async (req, res) => {
	try {
		const classes = await Classe.find().sort({ createdAt: -1 });
		res.status(200).json(classes);
		
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.updateClasse = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Classe.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteClasse = async (req, res) => {
  try {
    const { id } = req.params;
    await Classe.findByIdAndDelete(id);
    res.json({ message: 'Classe supprimée' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
