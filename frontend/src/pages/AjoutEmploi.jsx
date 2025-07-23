import { useState, useEffect, useContext } from 'react';
import { Select, Input, Button, message } from 'antd';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AjoutEmploi() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState({ jour: '', heure: '', classe: '', matiere: '', enseignant: '' });
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [resC, resM, resE] = await Promise.all([
          api.get('/api/classes', { headers }),
          api.get('/api/matieres', { headers }),
          api.get('/api/enseignants', { headers }),
        ]);
        setClasses(resC.data);
        setMatieres(resM.data);
        setEnseignants(resE.data);
      } catch {
        message.error('Erreur chargement données');
      }
    };
    fetch();
  }, [token]);

  const handle = async () => {
    if (!data.jour || !data.heure || !data.classe || !data.matiere || !data.enseignant) {
      return message.warning('Tous les champs sont requis');
    }
    try {
      await api.post('/api/emploi', data, { headers: { Authorization: `Bearer ${token}` } });
      message.success('Créneau ajouté');
      setData({ jour: '', heure: '', classe: '', matiere: '', enseignant: '' });
    } catch (err) {
      message.error(err.response?.data?.message || 'Erreur ajout');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow-md space-y-4 mt-8">
      <h2 className="text-lg font-semibold text-center">Ajouter un créneau</h2>

      <Select
        placeholder="Jour"
        className="w-full mt-4"
        value={data.jour}
        onChange={(v) => setData({ ...data, jour: v })}
      >
        {['Lundi','Mardi','Mercredi','Jeudi','Vendredi'].map(j => (
          <Select.Option key={j} value={j}>{j}</Select.Option>
        ))}
      </Select>

      <Input
        placeholder="Heure (ex: 08:00 - 09:00)"
        value={data.heure}
        onChange={(e) => setData({ ...data, heure: e.target.value })}
        className='mt-4'
      />

      <Select
        placeholder="Classe"
        className="w-full mt-4"
        value={data.classe}
        onChange={(v) => setData({ ...data, classe: v })}
      >
        {classes.map(c => (
          <Select.Option key={c._id} value={c._id}>
            {c.nom} ({c.niveau})
          </Select.Option>
        ))}
      </Select>

      <Select
        placeholder="Matière"
        className="w-full"
        value={data.matiere}
        onChange={(v) => setData({ ...data, matiere: v })}
      >
        {matieres.map(m => (
          <Select.Option key={m._id} value={m._id}>
            {m.nom}
          </Select.Option>
        ))}
      </Select>

      <Select
        placeholder="Enseignant"
        className="w-full"
        value={data.enseignant}
        onChange={(v) => setData({ ...data, enseignant: v })}
      >
        {enseignants.map(e => (
          <Select.Option key={e._id} value={e._id}>
            {e.nom}
          </Select.Option>
        ))}
      </Select>

      <Button type="primary" block onClick={handle} className='mt-6'>
        Ajouter créneau
      </Button>
    </div>
  );
}
