import { useState, useEffect, useContext } from 'react';
import { Input, Button, Select, message } from 'antd';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AjouterNote() {
  const { token } = useContext(AuthContext);
  const [eleves, setEleves] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);

  const [form, setForm] = useState({
    eleve: '',
    matiere: '',
    classe: '',
    valeur: '',
    type: 'Devoir',
    semestre: '',
    enseignant: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resEleves, resMatieres, resClasses, resSemestres, resEnseignant] = await Promise.all([
          api.get('/api/eleves', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/api/matieres', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/api/classes', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/api/semestres', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/api/enseignants', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setEleves(resEleves.data);
        setMatieres(resMatieres.data);
        setClasses(resClasses.data);
        setSemestres(resSemestres.data);
        setEnseignants(resEnseignant.data);
      } catch (err) {
        message.error("Erreur lors du chargement des données.");
      }
    };

    fetchData();
  }, [token]);

  const handleSubmit = async () => {
    const { eleve, matiere, valeur, type, semestre, classe, enseignant } = form;
    if (!eleve || !matiere || !valeur || !type || !semestre || !classe || !enseignant) {
      return message.warning('Tous les champs sont obligatoires');
    }

    try {
      await api.post('/api/notes', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Note ajoutée avec succès');
      setForm({
        eleve: '', matiere: '', valeur: '', type: 'Devoir',
        semestre: '', classe: '', enseignant: ''
      });
    } catch (err) {
      message.error("Erreur lors de l'ajout de la note");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow space-y-6">
      <h2 className="text-xl font-bold text-center">Ajouter une Note</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          placeholder="Classe"
          value={form.classe}
          onChange={(val) => setForm({ ...form, classe: val })}
          className="w-full"
        >
          {classes.map(c => (
            <Select.Option key={c._id} value={c._id}>
              {c.nom} ({c.niveau})
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Élève"
          value={form.eleve}
          onChange={(val) => setForm({ ...form, eleve: val })}
          className="w-full"
        >
          {eleves.map(e => (
            <Select.Option key={e._id} value={e._id}>
              {e.nom}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Matière"
          value={form.matiere}
          onChange={(val) => setForm({ ...form, matiere: val })}
          className="w-full"
        >
          {matieres.map(m => (
            <Select.Option key={m._id} value={m._id}>
              {m.nom}
            </Select.Option>
          ))}
        </Select>

        <Input
          type="number"
          placeholder="Note (valeur)"
          value={form.valeur}
          onChange={(e) => setForm({ ...form, valeur: e.target.value })}
          className="w-full"
          min={0}
          max={20}
        />

        <Select
          value={form.type}
          onChange={(val) => setForm({ ...form, type: val })}
          className="w-full"
        >
          <Select.Option value="Devoir">Devoir</Select.Option>
          <Select.Option value="Composition">Composition</Select.Option>
          <Select.Option value="Contrôle">Contrôle</Select.Option>
        </Select>

        <Select
          placeholder="Semestre"
          value={form.semestre}
          onChange={(val) => setForm({ ...form, semestre: val })}
          className="w-full"
        >
          {semestres.map((s) => (
            <Select.Option key={s._id} value={s._id}>
              {s.nom}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Enseignant"
          value={form.enseignant}
          onChange={(val) => setForm({ ...form, enseignant: val })}
          className="w-full"
        >
          {enseignants.map((e) => (
            <Select.Option key={e._id} value={e._id}>
              {e.nom}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div className="text-center">
        <Button type="primary" onClick={handleSubmit} className="w-full md:w-1/2">
          Enregistrer
        </Button>
      </div>
    </div>
  );
}
