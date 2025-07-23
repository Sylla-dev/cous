import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Card, Empty, Spin, Collapse } from 'antd';

const { Panel } = Collapse;

export default function ListeCoursEleve() {
  const { token } = useContext(AuthContext);
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const res = await api.get('/api/cours', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data); 
        setCours(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCours();
  }, [token]);

  if (loading) return <Spin tip="Chargement des cours..." style={{ display: 'block', margin: 'auto' }} />;

  if (cours.length === 0) return <Empty description="Aucun cours disponible" />;

  // Regroupement des cours par niveau de classe
  // On suppose que chaque cours a un champ `classe` qui contient un objet avec un `niveau`
  const coursByNiveau = {};
  cours.forEach((c) => {
    const niveau = c.classe?.niveau || 'Niveau inconnu';
    if (!coursByNiveau[niveau]) coursByNiveau[niveau] = [];
    coursByNiveau[niveau].push(c);
  });

  return (
    <div className="p-4">
      <Collapse accordion>
        {Object.entries(coursByNiveau)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([niveau, coursDuNiveau]) => (
            <Panel header={`Niveau : ${niveau}`} key={niveau}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {coursDuNiveau.map((c) => (
                  <Card key={c._id} title={c.titre} className="shadow-md" size="small" hoverable>
                    <p>
                      <strong>Matière :</strong> {c.matiere?.nom || 'N/A'}
                    </p>
                    <p>
                      <strong>Enseignant :</strong> {c.enseignant?.nom || 'N/A'}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">{c.contenu}</p>
                  </Card>
                ))}
              </div>
            </Panel>
          ))}
      </Collapse>
    </div>
  );
}
