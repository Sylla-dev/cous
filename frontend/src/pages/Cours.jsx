import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Table, Button, message } from 'antd';
import AjoutCours from '../components/AjoutCours';
import { useNavigate } from 'react-router-dom';

export default function MesCours() {
  const { token } = useContext(AuthContext);
  const [cours, setCours] = useState([]);

  const navigate = useNavigate();

  const fetchCours = async () => {
    try {
      const res = await api.get('/api/cours', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCours(res.data);
    } catch {
      message.error('Erreur lors du chargement des cours');
    }
  };

  const deleteCours = async (id) => {
    try {
      await api.delete(`/api/cours/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Cours supprimé');
      fetchCours();
    } catch {
      message.error('Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    fetchCours();
  }, []);

  // Regroupement manuel des cours par niveau
  const groupedByNiveau = cours.reduce((acc, c) => {
    const niveau = c.classe?.niveau || 'Inconnu';
    if (!acc[niveau]) acc[niveau] = [];
    acc[niveau].push(c);
    return acc;
  }, {});

  const columns = [
    { title: 'Titre', dataIndex: 'titre' },
    { title: 'Matière', dataIndex: ['matiere', 'nom'] },
    { title: 'Enseignant', dataIndex: ['enseignant', 'nom'] },
    {
      title: 'Classe',
      render: (_, r) => r.classe ? `${r.classe.nom} (${r.classe.niveau})` : 'Non défini'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: date => new Date(date).toLocaleDateString()
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Button danger size="small" onClick={() => deleteCours(record._id)}>
          Supprimer
        </Button>
      )
    },
    {
      render: (_, record) => (
        <Button green size="small" onClick={() => navigate(`/cours/${record._id}/presence`)}>
          Voir la presence
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 px-2 md:px-6">
      <h2 className="text-2xl font-bold text-center md:text-left">Mes Cours</h2>

      <AjoutCours onCoursCree={fetchCours} />

      {Object.entries(groupedByNiveau).map(([niveau, group]) => (
        <div key={niveau} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Niveau : {niveau}</h3>
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
