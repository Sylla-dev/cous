import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function Dashboard() {
  const { user, logout, token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Erreur stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const chartData = stats
    ? Object.entries(stats).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        total: value,
      }))
    : [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bienvenue, {user.name} 👋</h1>
        <p className="text-sm text-gray-500">Rôle : {user.role}</p>
        <button
          onClick={logout}
          className="btn btn-error btn-sm mt-3"
        >
          Déconnexion
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">📊 Statistiques générales</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-28 w-full rounded-xl"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {chartData.map((item) => (
              <div className="card bg-base-100 shadow-md">
                <div className="card-body items-center text-center">
                  <h2 className="card-title">{item.name}</h2>
                  <p className="text-3xl font-bold text-primary">{item.total}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="text-lg font-bold mb-4">Aperçu Visuel</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
