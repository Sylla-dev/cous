import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Input, Select, Button, message } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

export default function AjouterBulletin() {
  const { token } = useContext(AuthContext);
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [classe, setClasse] = useState('');
  const [eleve, setEleve] = useState('');
  const [semestre, setSemestre] = useState('1');
  const [notes, setNotes] = useState([]);
  const [appreciation, setAppreciation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [elevesRes, classesRes, matieresRes] = await Promise.all([
          api.get('/api/eleves', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/api/classes', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/api/matieres', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setEleves(elevesRes.data);
        setClasses(classesRes.data);
        setMatieres(matieresRes.data);
      } catch (err) {
        message.error("Erreur lors du chargement des données");
      }
    };
    fetchData();
  }, [token]);

  const ajouterNote = () => {
    setNotes([...notes, { matiere: '', moyenne: '' }]);
  };

  const modifierNote = (index, field, value) => {
    const newNotes = [...notes];
    newNotes[index][field] = value;
    setNotes(newNotes);
  };

  const supprimerNote = (index) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validNotes = notes.filter(n => n.matiere && n.moyenne !== '');
    if (!eleve || !classe || validNotes.length === 0) {
      return message.warning('Champs obligatoires manquants');
    }

    const payload = {
      eleve,
      classe,
      semestre,
      notes: validNotes.map(n => ({
        matiere: n.matiere,
        moyenne: parseFloat(n.moyenne),
      })),
      appreciation,
    };

    try {
      await api.post('/api/bulletins', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Bulletin créé avec succès');
      setClasse('');
      setEleve('');
      setNotes([]);
      setAppreciation('');
    } catch (err) {
      console.error(err);
      message.error("Erreur lors de l'ajout");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Ajouter un Bulletin</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            value={classe}
            onChange={(value) => setClasse(value)}
            placeholder="Classe"
            required
            className="w-full"
          >
            {classes.map((c) => (
              <Option key={c._id} value={c._id}>{c.nom}</Option>
            ))}
          </Select>

          <Select
            value={eleve}
            onChange={(value) => setEleve(value)}
            placeholder="Élève"
            required
            className="w-full"
          >
            {eleves.map((e) => (
              <Option key={e._id} value={e._id}>{e.nom}</Option>
            ))}
          </Select>
        </div>

        <Select
          value={semestre}
          onChange={(value) => setSemestre(value)}
          className="w-full"
        >
          <Option value="1">Semestre 1</Option>
          <Option value="2">Semestre 2</Option>
        </Select>

        <div className="space-y-3">
          <h3 className="font-semibold">Notes</h3>
          {notes.map((note, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-2 items-stretch">
              <Select
                value={note.matiere}
                onChange={(value) => modifierNote(index, 'matiere', value)}
                placeholder="Matière"
                className="w-full md:flex-1"
              >
                {matieres.map((m) => (
                  <Option key={m._id} value={m._id}>{m.nom}</Option>
                ))}
              </Select>
              <Input
                type="number"
                min={0}
                max={20}
                value={note.moyenne}
                onChange={(e) => modifierNote(index, 'moyenne', e.target.value)}
                placeholder="Moyenne"
                className="w-full md:w-32"
              />
              <Button danger type="button" onClick={() => supprimerNote(index)}>
                Supprimer
              </Button>
            </div>
          ))}
          <Button type="dashed" onClick={ajouterNote} block>+ Ajouter une note</Button>
        </div>

        <TextArea
          value={appreciation}
          onChange={(e) => setAppreciation(e.target.value)}
          placeholder="Appréciation"
          rows={4}
          className="w-full"
        />

        <Button type="primary" htmlType="submit" className="w-full">
          Enregistrer le bulletin
        </Button>
      </form>
    </div>
  );
}
