import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Input, Button, Table, Popconfirm, message } from 'antd';
//import { Link } from 'react-router-dom';

export default function Classes() {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ nom: '', niveau: '', section: '' });
  const [classes, setClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({ nom: '', niveau: '', section: '' });

  const fetchClasses = async () => {
    try {
      const res = await api.get('/api/classes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClasses(res.data);
    } catch {
      message.error('Erreur lors du chargement');
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreate = async e => {
    e.preventDefault();
    try {
      await api.post('/api/classes', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Classe ajoutée');
      setForm({ nom: '', niveau: '', section: '' });
      fetchClasses();
    } catch {
      message.error("Erreur lors de l'ajout");
    }
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/api/classes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Classe supprimée');
      fetchClasses();
    } catch {
      message.error('Erreur lors de la suppression');
    }
  };

  const startEdit = (record) => {
    setEditingId(record._id);
    setEditingForm({ nom: record.nom, niveau: record.niveau, section: record.section });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleEditChange = (e) => {
    setEditingForm({ ...editingForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (id) => {
    try {
      await api.put(`/api/classes/${id}`, editingForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Classe modifiée');
      setEditingId(null);
      fetchClasses();
    } catch {
      message.error('Erreur lors de la mise à jour');
    }
  };

  // Regroupement manuel par niveau
  const groupedData = classes.reduce((acc, curr) => {
    acc[curr.niveau] = acc[curr.niveau] || [];
    acc[curr.niveau].push(curr);
    return acc;
  }, {});

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      render: (_, record) =>
        editingId === record._id ? (
          <Input name="nom" value={editingForm.nom} onChange={handleEditChange} />
        ) : (
          record.nom
        )
    },
    {
      title: 'Niveau',
      dataIndex: 'niveau',
      render: (_, record) =>
        editingId === record._id ? (
          <Input name="niveau" value={editingForm.niveau} onChange={handleEditChange} />
        ) : (
          record.niveau
        )
    },
    {
      title: 'Section',
      dataIndex: 'section',
      render: (_, record) =>
        editingId === record._id ? (
          <Input name="section" value={editingForm.section} onChange={handleEditChange} />
        ) : (
          record.section
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
              title="Confirmer la suppression ?"
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
    <div className="space-y-6 px-2 md:px-8">
      <h1 className="text-2xl font-bold text-center md:text-left">Gestion des classes</h1>

      <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          name="nom"
          placeholder="Nom"
          value={form.nom}
          onChange={e => setForm({ ...form, nom: e.target.value })}
          required
        />
        <Input
          name="niveau"
          placeholder="Niveau"
          value={form.niveau}
          onChange={e => setForm({ ...form, niveau: e.target.value })}
          required
        />
        <Input
          name="section"
          placeholder="Section"
          value={form.section}
          onChange={e => setForm({ ...form, section: e.target.value })}
          required
        />
        <div className="md:col-span-3 text-center md:text-left">
          <Button type="primary" htmlType="submit" className="w-full md:w-auto">
            Ajouter
          </Button>
        </div>
      </form>

      {Object.entries(groupedData).map(([niveau, group]) => (
        <div key={niveau} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Niveau : {niveau}</h2>
          <div className="overflow-x-auto">
            <Table
              dataSource={group}
              columns={columns}
              rowKey="_id"
              pagination={false}
              size="middle"
              scroll={{ x: true }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
