import { useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Table, Input, Button, DatePicker, Popconfirm, message } from 'antd';
import dayjs from 'dayjs';

export default function Semestres() {
  const { token } = useContext(AuthContext);
  const [semestres, setSemestres] = useState([]);
  const [form, setForm] = useState({ nom: '', dateDebut: null, dateFin: null });
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({});

  const fetchSemestres = async () => {
    const res = await api.get('/api/semestres', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSemestres(res.data);
  };

  useEffect(() => {
    fetchSemestres();
  }, []);

  const handleChange = (field, value) => setForm({ ...form, [field]: value });
  const handleEditChange = (field, value) => setEditingForm({ ...editingForm, [field]: value });

  const handleCreate = async e => {
    e.preventDefault();
    try {
      await api.post('/api/semestres', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Semestre ajouté');
      setForm({ nom: '', dateDebut: null, dateFin: null });
      fetchSemestres();
    } catch {
      message.error('Erreur création');
    }
  };

  const startEdit = (record) => {
    setEditingId(record._id);
    setEditingForm({
      nom: record.nom,
      dateDebut: dayjs(record.dateDebut),
      dateFin: dayjs(record.dateFin)
    });
  };

  const cancelEdit = () => setEditingId(null);

  const handleSaveEdit = async id => {
    try {
      await api.put(`/api/semestres/${id}`, editingForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Semestre mis à jour');
      setEditingId(null);
      fetchSemestres();
    } catch {
      message.error('Erreur de mise à jour');
    }
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/api/semestres/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Semestre supprimé');
      fetchSemestres();
    } catch {
      message.error('Erreur suppression');
    }
  };

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      render: (_, record) =>
        editingId === record._id ? (
          <Input
            value={editingForm.nom}
            onChange={e => handleEditChange('nom', e.target.value)}
            size="small"
          />
        ) : (
          record.nom
        )
    },
    {
      title: 'Début',
      dataIndex: 'dateDebut',
      render: (_, record) =>
        editingId === record._id ? (
          <DatePicker
            value={editingForm.dateDebut}
            onChange={val => handleEditChange('dateDebut', val)}
            size="small"
          />
        ) : (
          dayjs(record.dateDebut).format('YYYY-MM-DD')
        )
    },
    {
      title: 'Fin',
      dataIndex: 'dateFin',
      render: (_, record) =>
        editingId === record._id ? (
          <DatePicker
            value={editingForm.dateFin}
            onChange={val => handleEditChange('dateFin', val)}
            size="small"
          />
        ) : (
          dayjs(record.dateFin).format('YYYY-MM-DD')
        )
    },
    {
      title: 'Actions',
      render: (_, record) =>
        editingId === record._id ? (
          <>
            <Button onClick={() => handleSaveEdit(record._id)} type="primary" size="small" className="mr-2">Sauver</Button>
            <Button onClick={cancelEdit} size="small">Annuler</Button>
          </>
        ) : (
          <>
            <Button onClick={() => startEdit(record)} type="link" size="small">Modifier</Button>
            <Popconfirm
              title="Supprimer ce semestre ?"
              onConfirm={() => handleDelete(record._id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button danger type="link" size="small">Supprimer</Button>
            </Popconfirm>
          </>
        )
    }
  ];

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold text-center md:text-left">Gestion des semestres</h1>

      <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          placeholder="Nom (ex: Semestre 1)"
          value={form.nom}
          onChange={e => handleChange('nom', e.target.value)}
          required
          style={{ width: '100%' }}
          size="middle"
        />
        <DatePicker
          placeholder="Date début"
          value={form.dateDebut}
          onChange={val => handleChange('dateDebut', val)}
          required
          style={{ width: '100%' }}
          size="middle"
        />
        <DatePicker
          placeholder="Date fin"
          value={form.dateFin}
          onChange={val => handleChange('dateFin', val)}
          required
          style={{ width: '100%' }}
          size="middle"
        />
        <div className="md:col-span-3 flex justify-end">
          <Button type="primary" htmlType="submit" size="middle">
            Ajouter le semestre
          </Button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <Table
          dataSource={semestres}
          rowKey="_id"
          columns={columns}
          pagination={false}
          size="middle"
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
}
