const Enseignant = require('../models/Enseignant');
const Classe = require('../models/Classe');
const Eleve = require('../models/Eleve');


exports.createEnseignant = async (req, res) => {
  try {
    const enseignant = await Enseignant.create(req.body);
    res.status(201).json(enseignant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateEnseignant = async (req, res) => {
  const { id } = req.params;
  const updated = await Enseignant.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

exports.getEnseignants = async (req, res) => {
  const enseignants = await Enseignant.find()
    .populate('matieres', 'nom')
    .populate('classes', 'nom niveau section');
  res.json(enseignants);
};

exports.deleteEnseignant = async (req, res) => {
  const { id } = req.params;
  await Enseignant.findByIdAndDelete(id);
  res.json({ message: 'Supprimé' });
};

exports.getMesClasses = async (req, res) => {
  try {


    const enseignantId = req.user.id;

    console.log('req.user:', req.user);

    
    if (!enseignantId) {
      return res.status(400).json({ error: 'ID enseignant manquant' });
    }

    const enseignant = await Enseignant.findById(enseignantId).populate('classes');
    if (!enseignant) {
      return res.status(404).json({ error: 'Enseignant introuvable' });
    }

    // 🔁 Pour chaque classe, récupérer les élèves
    const classesAvecEleves = await Promise.all(
      enseignant.classes.map(async (classe) => {
        const eleves = await Eleve.find({ classe: classe._id });
        return {
          ...classe.toObject(),
          eleves,
        };
      })
    );

    // ✅ Un seul envoi de réponse
    res.json(classesAvecEleves);
    
  } catch (err) {
    console.error('Erreur getMesClasses:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


exports.getInfosPourCours = async (req, res) => {
  try {
      const enseignant = await Enseignant.findOne({ email: req.user.email })
    .populate('matieres', 'nom')
    .populate('classes', 'nom niveau section');

  if (!enseignant) return res.status(404).json({ error: 'Enseignant introuvable' });

  res.json({
    matieres: enseignant.matieres,
    classes: enseignant.classes
  });
  } catch (err) {
    console.log(err);
  }
};

// ✅ Affecter classes
exports.affecterClasses = async (req, res) => {
  const { classes } = req.body;
  const enseignant = await Enseignant.findByIdAndUpdate(
    req.params.id,
    { $set: { classes } },
    { new: true }
  ).populate('classes');
  res.json(enseignant);
};

// ✅ Affecter matières
exports.affecterMatieres = async (req, res) => {
  const { matieres } = req.body;
  const enseignant = await Enseignant.findByIdAndUpdate(
    req.params.id,
    { $set: { matieres } },
    { new: true }
  ).populate('matieres');
  res.json(enseignant);
};

// ✅ Affecter emploi du temps (creneaux)
exports.affecterCreneaux = async (req, res) => {
  const { emploi } = req.body;
  const enseignant = await Enseignant.findByIdAndUpdate(
    req.params.id,
    { $set: { emploiDuTemps: emploi } },
    { new: true }
  ).populate('emploiDuTemps');
  res.json(enseignant);
};

// ✅ Ajouter cahier des charges
exports.ajouterCahierCharges = async (req, res) => {
  const { contenu } = req.body;
  const enseignant = await Enseignant.findByIdAndUpdate(
    req.params.id,
    { cahierCharges: contenu },
    { new: true }
  );
  res.json(enseignant);
};


