const Note = require('../models/Note');
const Eleve = require('../models/Eleve');

// ➕ Ajouter une note
exports.ajouterNote = async (req, res) => {
  try {
    const { eleve, matiere, valeur, type, semestre, classe, enseignant } = req.body;

    if (!eleve || !matiere || !valeur) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    const note = await Note.create({
      eleve,
      matiere,
      valeur,
      type,
      semestre,
      classe,
      enseignant,
    });

    res.status(201).json(note);
  } catch (err) {
    console.error('Erreur ajout note:', err);
    res.status(500).json({ error: err.message });
  }
};



exports.notesParClasseEtSemestre = async (req, res) => {
  try {
    const stats = await Note.aggregate([
      {
        $lookup: {
          from: 'classes',
          localField: 'classe',
          foreignField: '_id',
          as: 'classe',
        },
      },
      { $unwind: '$classe' },
      {
        $lookup: {
          from: 'semestres',
          localField: 'semestre',
          foreignField: '_id',
          as: 'semestre',
        },
      },
      { $unwind: '$semestre' },
      {
        $group: {
          _id: {
            classe: '$classe.nom',
            semestre: '$semestre.nom',
          },
          moyenne: { $avg: '$valeur' },
          totalNotes: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.classe': 1, '_id.semestre': 1 },
      },
    ]);

    res.json(stats);
  } catch (err) {
    console.error('Erreur analyse notes:', err);
    res.status(500).json({ error: err.message });
  }
};


// 📄 Toutes les notes d'un élève
exports.notesParEleve = async (req, res) => {
  try {
    const notes = await Note.find({ eleve: req.params.id })
      .populate('matiere', 'nom')
      .populate('enseignant', 'nom')
      .populate('semestre', 'nom');

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.notesDeLEleveConnecte = async (req, res) => {
  try {
    const notes = await Note.find({ eleve: req.user._id }) // req.user est l'élève connecté
      .populate('matiere', 'nom')
      .populate('enseignant', 'nom')
      .populate('semestre', 'nom');

    res.json(notes);
  } catch (err) {
    console.error('Erreur notesDeLEleveConnecte:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note introuvable' });

    // Vérification que l'enseignant est bien celui qui a créé la note
    if (note.enseignant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Vous n'avez pas le droit de modifier cette note" });
    }

    Object.assign(note, updateData);
    await note.save();

    res.json(note);
  } catch (err) {
    console.error('Erreur updateNote:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note introuvable' });

    if (note.enseignant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Vous n'avez pas le droit de supprimer cette note" });
    }

    await note.remove();
    res.json({ message: 'Note supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find().populate('classe', 'nom niveau').populate('matiere', 'nom').populate('enseignant', 'nom').populate('semestre', 'nom').populate('eleve', 'nom');
    res.status(200).json(notes);    
  } catch (error) {
     res.status(500).json({ error: error.message });
  }
};

exports.getNotesById = async (req, res) => {
     try {
    const notes = await Note.find({ eleve: req.params.id })
      .populate('matiere', 'nom')
      .populate('enseignant', 'nom')
      .sort({ semestre: 1 });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEleveMoyennes = async (req, res) => {
      try {
    const result = await Note.aggregate([
      { $match: { eleve: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $group: {
          _id: {
            matiere: "$matiere",
            semestre: "$semestre"
          },
          moyenne: { $avg: "$valeur" },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "matieres",
          localField: "_id.matiere",
          foreignField: "_id",
          as: "matiereDetails"
        }
      },
      {
        $unwind: "$matiereDetails"
      },
      {
        $project: {
          matiere: "$matiereDetails.nom",
          semestre: "$_id.semestre",
          moyenne: 1,
          count: 1
        }
      },
      { $sort: { semestre: 1, matiere: 1 } }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}