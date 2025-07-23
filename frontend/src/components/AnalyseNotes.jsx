import { useEffect, useState, useContext } from 'react';
import { Table, message, Card } from 'antd';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AnalyseNotes() {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/notes/analyse', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        message.error("Erreur lors du chargement des statistiques");
      }
    };

    fetchStats();
  }, [token]);

  // Fonction pour extraire le niveau de la classe, ex : "6ème A" -> "6ème"
  const getNiveau = (classeNom) => {
    if (!classeNom) return "Autres";
    const match = classeNom.match(/^\d+ème/);
    return match ? match[0] : "Autres";
  };

  // Regrouper les stats par niveau
  const groupedStats = stats.reduce((acc, stat) => {
    const niveau = getNiveau(stat._id.classe);
    if (!acc[niveau]) acc[niveau] = [];
    acc[niveau].push(stat);
    return acc;
  }, {});

  // Colonnes pour le tableau desktop
  const columns = [
    {
      title: 'Classe',
      dataIndex: ['_id', 'classe'],
      key: 'classe',
      sorter: (a, b) => a._id.classe.localeCompare(b._id.classe),
    },
    {
      title: 'Semestre',
      dataIndex: ['_id', 'semestre'],
      key: 'semestre',
      sorter: (a, b) => a._id.semestre.localeCompare(b._id.semestre),
    },
    {
      title: 'Moyenne',
      dataIndex: 'moyenne',
      key: 'moyenne',
      render: (val) => <strong>{val.toFixed(2)}</strong>,
      sorter: (a, b) => a.moyenne - b.moyenne,
    },
    {
      title: 'Total de notes',
      dataIndex: 'totalNotes',
      key: 'totalNotes',
      sorter: (a, b) => a.totalNotes - b.totalNotes,
    },
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Analyse des Notes</h2>

      {Object.entries(groupedStats).map(([niveau, statsNiveau]) => (
        <section key={niveau} className="mb-10">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-1">{niveau}</h3>

          {/* Tableau desktop */}
          <div className="hidden md:block">
            <Table
              columns={columns}
              dataSource={statsNiveau}
              rowKey={row => `${row._id.classe}-${row._id.semestre}`}
              pagination={{ pageSize: 5 }}
              bordered
              size="middle"
            />
          </div>

          {/* Cartes mobile */}
          <div className="md:hidden space-y-4">
            {statsNiveau.map(stat => (
              <Card
                key={`${stat._id.classe}-${stat._id.semestre}`}
                size="small"
                bordered
                className="shadow-sm"
              >
                <p><strong>Classe :</strong> {stat._id.classe}</p>
                <p><strong>Semestre :</strong> {stat._id.semestre}</p>
                <p><strong>Moyenne :</strong> {stat.moyenne.toFixed(2)}</p>
                <p><strong>Total de notes :</strong> {stat.totalNotes}</p>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
