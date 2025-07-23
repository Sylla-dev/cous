import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Card, Table, Empty, Spin, message } from 'antd';

export default function MesClasses() {
  const { user, token } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/enseignants', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClasses(res.data);
      } catch (err) {
        console.error('Erreur chargement des classes:', err);
        message.error("Erreur lors du chargement des classes");
      } finally {
        setLoading(false);
      }
    };

    if (token && user?.role === 'enseignant') {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [token, user]);

  if (loading) return <Spin tip="Chargement..." style={{ display: 'block', margin: 'auto' }} />;
  if (classes.length === 0) return <Empty description="Aucune classe disponible" />;

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Matricule',
      dataIndex: 'matricule',
      key: 'matricule',
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold mb-4">Mes Classes et Élèves</h2>

      {classes.map(classe => (
        <Card
          key={classe._id}
          title={`${classe.nom} (${classe.niveau})`}
          className="shadow-md"
          bodyStyle={{ padding: 12 }}
        >
          {classe.eleves?.length > 0 ? (
            <Table
              dataSource={classe.eleves}
              rowKey="_id"
              pagination={false}
              columns={columns}
              size="small"
              bordered
              scroll={{ x: 'max-content' }}
            />
          ) : (
            <Empty description="Aucun élève dans cette classe" />
          )}
        </Card>
      ))}
    </div>
  );
}
