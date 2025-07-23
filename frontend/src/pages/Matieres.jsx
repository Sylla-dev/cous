import { useEffect, useState, useContext, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Input, Select, Button, Table, Popconfirm, message, Collapse, Empty, Spin } from 'antd';

const { Panel } = Collapse;

export default function Matieres() {
  const { token } = useContext(AuthContext);
  const [matieres, setMatieres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ nom: '', coefficient: '', classe: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [resMatieres, resClasses] = await Promise.all([
        api.get('/api/matieres', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/api/classes', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setMatieres(resMatieres.data);
      setClasses(resClasses.data);
    } catch (err) {
      message.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const handleEditChange = (field, value) => setEditingForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.nom || !form.coefficient || !form.classe) {
      message.warning('Veuillez remplir tous les champs');
      return;
    }
    try {
      await api.post('/api/matieres', form, { headers: { Authorization: `Bearer ${token}` } });
      message.success('Matière ajoutée');
      setForm({ nom: '', coefficient: '', classe: '' });
      fetchData();
    } catch {
      message.error('Erreur lors de l’ajout');
    }
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/api/matieres/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      message.success('Matière supprimée');
      fetchData();
    } catch {
      message.error('Erreur lors de la suppression');
    }
  };

  const startEdit = record => {
    setEditingId(record._id);
    setEditingForm({
      nom: record.nom,
      coefficient: record.coefficient,
      classe: record.classe._id,
    });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async id => {
    if (!editingForm.nom || !editingForm.coefficient || !editingForm.classe) {
      message.warning('Veuillez remplir tous les champs');
      return;
    }
    try {
      await api.put(`/api/matieres/${id}`, editingForm, { headers: { Authorization: `Bearer ${token}` } });
      message.success('Matière modifiée');
      setEditingId(null);
      fetchData();
    } catch {
      message.error('Erreur lors de la modification');
    }
  };

  // Regrouper les matières par niveau de classe
  const matieresByNiveau = matieres.reduce((acc, mat) => {
    const niveau = mat.classe?.niveau || 'Niveau inconnu';
    if (!acc[niveau]) acc[niveau] = [];
    acc[niveau].push(mat);
    return acc;
  }, {});

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      ellipsis: true,
      render: (_, record) =>
        editingId === record._id ? (
          <Input value={editingForm.nom} onChange={e => handleEditChange('nom', e.target.value)} />
        ) : (
          record.nom
        ),
    },
    {
      title: 'Coefficient',
      dataIndex: 'coefficient',
      key: 'coefficient',
      width: 100,
      align: 'center',
      ellipsis: true,
      render: (_, record) =>
        editingId === record._id ? (
          <Input
            type="number"
            value={editingForm.coefficient}
            onChange={e => handleEditChange('coefficient', e.target.value)}
          />
        ) : (
          record.coefficient
        ),
    },
    {
      title: 'Classe',
      dataIndex: ['classe', 'nom'],
      key: 'classe',
      ellipsis: true,
      responsive: ['md'],
      render: (_, record) =>
        editingId === record._id ? (
          <Select
            value={editingForm.classe}
            onChange={val => handleEditChange('classe', val)}
            style={{ minWidth: 150 }}
          >
            {classes.map(cls => (
              <Select.Option key={cls._id} value={cls._id}>
                {cls.nom}
              </Select.Option>
            ))}
          </Select>
        ) : (
          record.classe?.nom || ''
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 130,
      render: (_, record) =>
        editingId === record._id ? (
          <>
            <Button size="small" type="primary" onClick={() => saveEdit(record._id)}>
              Sauver
            </Button>{' '}
            <Button size="small" onClick={cancelEdit}>
              Annuler
            </Button>
          </>
        ) : (
          <>
            <Button size="small" onClick={() => startEdit(record)}>
              Modifier
            </Button>{' '}
            <Popconfirm
              title="Supprimer cette matière ?"
              onConfirm={() => handleDelete(record._id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button size="small" danger>
                Supprimer
              </Button>
            </Popconfirm>
          </>
        ),
    },
  ];

  if (loading) return <Spin tip="Chargement..." style={{ display: 'block', margin: 'auto' }} />;
  if (matieres.length === 0) return <Empty description="Aucune matière disponible" />;

  return (
    <div className="p-4 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-semibold">Gestion des matières par Niveau de Classe</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Nom de la matière"
          value={form.nom}
          onChange={e => handleChange('nom', e.target.value)}
          required
        />
        <Input
          placeholder="Coefficient"
          type="number"
          min={0}
          value={form.coefficient}
          onChange={e => handleChange('coefficient', e.target.value)}
          required
        />
        <Select
          placeholder="Classe"
          value={form.classe}
          onChange={val => handleChange('classe', val)}
          required
          allowClear
        >
          {classes.map(cls => (
            <Select.Option key={cls._id} value={cls._id}>
              {cls.nom} ({cls.niveau || 'Niveau inconnu'})
            </Select.Option>
          ))}
        </Select>
        <div className="md:col-span-3">
          <Button htmlType="submit" type="primary" block>
            Ajouter la matière
          </Button>
        </div>
      </form>

      <Collapse accordion>
        {Object.entries(matieresByNiveau)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([niveau, matieresDuNiveau]) => (
            <Panel header={`Niveau : ${niveau}`} key={niveau}>
              <Table
                columns={columns}
                dataSource={matieresDuNiveau}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
                size="small"
                scroll={{ x: 'max-content' }}
              />
            </Panel>
          ))}
      </Collapse>
    </div>
  );
}
