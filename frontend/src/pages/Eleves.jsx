import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Input, Select, Button, Table, DatePicker, Popconfirm, message } from 'antd';
import dayjs from 'dayjs';

export default function Eleves() {
  const { token } = useContext(AuthContext);
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    nom: '', prenom: '', matricule: '', genre: 'Masculin', dateNaissance: null, classe: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({});

  useEffect(() => {
    fetchEleves();
    fetchClasses();
  }, []);

  const fetchEleves = async () => {
    const res = await api.get('/api/eleves', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEleves(res.data);
  };

  const fetchClasses = async () => {
    const res = await api.get('/api/classes', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setClasses(res.data);
  };

  const handleChange = (field, value) => setForm({ ...form, [field]: value });
  const handleEditChange = (field, value) => setEditingForm({ ...editingForm, [field]: value });

  const handleCreate = async e => {
    e.preventDefault();
    try {
      await api.post('/api/eleves', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Élève ajouté');
      setForm({ nom: '', prenom: '', matricule: '', genre: 'Masculin', dateNaissance: null, classe: '' });
      fetchEleves();
    } catch (err) {
      message.error('Erreur création');
    }
  };

  const startEdit = (record) => {
    setEditingId(record._id);
    setEditingForm({
      nom: record.nom,
      prenom: record.prenom,
      matricule: record.matricule,
      genre: record.genre,
      dateNaissance: dayjs(record.dateNaissance),
      classe: record.classe._id
    });
  };

  const cancelEdit = () => setEditingId(null);

  const handleSaveEdit = async id => {
    try {
      await api.put(`/api/eleves/${id}`, editingForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Élève modifié');
      setEditingId(null);
      fetchEleves();
    } catch {
      message.error('Erreur mise à jour');
    }
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/api/eleves/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Élève supprimé');
      fetchEleves();
    } catch {
      message.error('Erreur suppression');
    }
  };

  const columns = [
    { title: 'Matricule', dataIndex: 'matricule' },
    {
      title: 'Nom',
      render: (_, record) =>
        editingId === record._id ? (
          <Input value={editingForm.nom} onChange={e => handleEditChange('nom', e.target.value)} />
        ) : (
          record.nom
        )
    },
    {
      title: 'Prénom',
      render: (_, record) =>
        editingId === record._id ? (
          <Input value={editingForm.prenom} onChange={e => handleEditChange('prenom', e.target.value)} />
        ) : (
          record.prenom
        )
    },
    {
      title: 'Genre',
      render: (_, record) =>
        editingId === record._id ? (
          <Select value={editingForm.genre} onChange={val => handleEditChange('genre', val)} style={{ width: 100 }}>
            <Select.Option value="Masculin">Masculin</Select.Option>
            <Select.Option value="Féminin">Féminin</Select.Option>
          </Select>
        ) : (
          record.genre
        )
    },
    {
      title: 'Naissance',
      render: (_, record) =>
        editingId === record._id ? (
          <DatePicker value={editingForm.dateNaissance} onChange={val => handleEditChange('dateNaissance', val)} />
        ) : (
          dayjs(record.dateNaissance).format('YYYY-MM-DD')
        )
    },
    {
      title: 'Classe',
      render: (_, record) =>
        editingId === record._id ? (
          <Select
            value={editingForm.classe}
            onChange={val => handleEditChange('classe', val)}
            style={{ width: 120 }}
          >
            {classes.map(cls => (
              <Select.Option key={cls._id} value={cls._id}>
                {cls.nom} ({cls.niveau})
              </Select.Option>
            ))}
          </Select>
        ) : (
          `${record.classe?.nom} (${record.classe?.niveau})`
        )
    },
    {
      title: 'Actions',
      render: (_, record) =>
        editingId === record._id ? (
          <>
            <Button onClick={() => handleSaveEdit(record._id)} type="primary" size="small">Sauver</Button>{' '}
            <Button onClick={cancelEdit} size="small">Annuler</Button>
          </>
        ) : (
          <>
            <Button onClick={() => startEdit(record)} type="link">Modifier</Button>
            <Popconfirm
              title="Supprimer cet élève ?"
              onConfirm={() => handleDelete(record._id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button danger type="link">Supprimer</Button>
            </Popconfirm>
          </>
        )
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestion des élèves</h1>

      <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input placeholder="Matricule" value={form.matricule} onChange={e => handleChange('matricule', e.target.value)} required />
        <Input placeholder="Nom" value={form.nom} onChange={e => handleChange('nom', e.target.value)} required />
        <Input placeholder="Prénom" value={form.prenom} onChange={e => handleChange('prenom', e.target.value)} required />
        <Select value={form.genre} onChange={val => handleChange('genre', val)} options={[
          { label: 'Masculin', value: 'Masculin' },
          { label: 'Féminin', value: 'Féminin' }
        ]} />
        <DatePicker placeholder="Date de naissance" value={form.dateNaissance} onChange={val => handleChange('dateNaissance', val)} />
        <Select placeholder="Classe" value={form.classe} onChange={val => handleChange('classe', val)}>
          {classes.map(cls => (
            <Select.Option key={cls._id} value={cls._id}>
              {cls.nom} ({cls.niveau})
            </Select.Option>
          ))}
        </Select>
        <div className="md:col-span-3">
          <Button type="primary" htmlType="submit">Ajouter élève</Button>
        </div>
      </form>

      <Table columns={columns} dataSource={eleves} rowKey="_id" pagination={false} />
    </div>
  );
}
