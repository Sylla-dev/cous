import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Table, Button, message, Collapse, Spin, Empty, Popconfirm } from 'antd';

const { Panel } = Collapse;

export default function MesCours() {
  const { token } = useContext(AuthContext);
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCours = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/cours/mes-cours', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCours(res.data);
    } catch {
      message.error("Erreur lors du chargement des cours");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCours();
  }, [token]);

  const deleteCours = async (id) => {
    try {
      await api.delete(`/api/cours/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Cours supprimé');
      fetchCours();
    } catch {
      message.error('Erreur lors de la suppression');
    }
  };

  // Regroupe les cours par niveau de classe
  const coursByNiveau = {};
  cours.forEach(c => {
    const niveau = c.classe?.niveau || 'Niveau inconnu';
    if (!coursByNiveau[niveau]) coursByNiveau[niveau] = [];
    coursByNiveau[niveau].push(c);
  });

  const columns = [
    {
      title: 'Titre',
      dataIndex: 'titre',
      key: 'titre',
      ellipsis: true,
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Matière',
      dataIndex: ['matiere', 'nom'],
      key: 'matiere',
      ellipsis: true,
      responsive: ['sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Classe',
      key: 'classe',
      render: (_, record) => `${record.classe.nom} (${record.classe.niveau})`,
      ellipsis: true,
      responsive: ['md', 'lg', 'xl'], // visible à partir de md
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: date => new Date(date).toLocaleDateString(),
      responsive: ['lg', 'xl'], // visible à partir de lg
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Confirmer la suppression ?"
          onConfirm={() => deleteCours(record._id)}
          okText="Oui"
          cancelText="Non"
        >
          <Button danger size="small">Supprimer</Button>
        </Popconfirm>
      ),
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    }
  ];

  if (loading) return <Spin tip="Chargement des cours..." style={{ display: 'block', margin: 'auto' }} />;
  if (cours.length === 0) return <Empty description="Aucun cours disponible" />;

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold mb-4">Mes Cours par Niveau de Classe</h2>

      <Collapse accordion>
        {Object.entries(coursByNiveau)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([niveau, coursDuNiveau]) => (
            <Panel key={niveau} header={`Niveau : ${niveau}`}>
              <Table
                columns={columns}
                dataSource={coursDuNiveau}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
                size="small"
                scroll={{ x: 'max-content' }}
                bordered
              />
            </Panel>
          ))}
      </Collapse>
    </div>
  );
}
