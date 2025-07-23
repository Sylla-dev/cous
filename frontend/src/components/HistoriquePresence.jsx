import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Table, Progress, Button, Spin } from 'antd';

export default function HistoriquePresence({ eleveId }) {
  const {user, token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get(`/api/presences`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('user:', user);
      setData(res.data);
      setLoading(false);
    };
    fetch();
  }, [user, token]);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (d) => new Date(d).toLocaleDateString(),
    },
    {
      title: 'Statut',
      dataIndex: 'present',
      render: (v) => (v ? 'Présent' : 'Absent'),
    },
  ];

  const exportPDF = () => {
    window.open(`/api/presences/eleve/${eleveId}/export-pdf`, '_blank');
  };

  if (loading) return <Spin />;

  return (
    <div className="space-y-4">
      <div className="bg-base-100 shadow p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Taux de présence</h2>
        <Progress percent={Number(data.taux)} status="active" />
        <p className="mt-2">{data.presents} présents / {data.total} jours</p>
        <Button onClick={exportPDF} type="primary" className="mt-4">Exporter en PDF</Button>
      </div>
      <Table columns={columns} dataSource={data.historique} rowKey="_id" pagination={false} />
    </div>
  );
}
