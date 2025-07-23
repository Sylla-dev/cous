import { useEffect, useState, useContext } from 'react';
import { Input, Button, Select, message } from 'antd';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AjoutCours() {
  const { token } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [form, setForm] = useState({
    titre: '',
    contenu: '',
    classe: '',
    matiere: '',
    enseignant: ''
  });

  const fetchClasses = async () => {
    try {
      const res = await api.get('/api/classes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClasses(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des classes", error);
    }
  };

  const fetchEnseignants = async () => {
    try {
      const res = await api.get('/api/enseignants', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnseignants(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des classes", error);
    }
  };

  const fetchMatieres = async () => {
    try {
      const res1 = await api.get('/api/matieres', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMatieres(res1.data);
    } catch (error) {
      console.error("Erreur lors du chargement des matières", error);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchMatieres();
    fetchEnseignants();
  }, []);

  const handleSubmit = async () => {
    if (!form.titre || !form.contenu || !form.classe || !form.matiere || !form.enseignant) {
      return message.warning('Tous les champs sont obligatoires');
    }

    try {
      await api.post('/api/cours', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Cours ajouté');
      setForm({ titre: '', contenu: '', classe: '', matiere: '', enseignant: '' });
    } catch (err) {
      message.error("Erreur lors de l'ajout du cours");
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-semibold">Ajouter un Cours</h2>

      <Input
        placeholder="Titre du cours"
        value={form.titre}
        onChange={(e) => setForm({ ...form, titre: e.target.value })}
      />

      <Input.TextArea
        placeholder="Contenu ou résumé du cours"
        rows={5}
        value={form.contenu}
        onChange={(e) => setForm({ ...form, contenu: e.target.value })}
      />

      <Select
        placeholder="Sélectionner une matière"
        className="w-full"
        value={form.matiere}
        onChange={(val) => setForm({ ...form, matiere: val })}
      >
        {matieres.map((m) => (
          <Select.Option key={m._id} value={m._id}>
            {m.nom}
          </Select.Option>
        ))}
      </Select>

      <Select
        placeholder="Sélectionner une classe"
        className="w-full"
        value={form.classe}
        onChange={(val) => setForm({ ...form, classe: val })}
      >
        {classes.map((c) => (
          <Select.Option key={c._id} value={c._id}>
            {c.nom} ({c.niveau})
          </Select.Option>
        ))}
      </Select>
      <Select
        placeholder="Sélectionner un enseignant"
        className="w-full"
        value={form.enseignant}
        onChange={(val) => setForm({ ...form, enseignant: val })}
      >
        {enseignants.map((e) => (
          <Select.Option key={e._id} value={e._id}>
            {e.nom}
          </Select.Option>
        ))}
      </Select>

      <Button type="primary" onClick={handleSubmit}>
        Enregistrer le cours
      </Button>
    </div>
  );
}
