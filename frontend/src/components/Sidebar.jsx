import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  HomeOutlined,
  UserOutlined,
  BookOutlined,
  CalendarOutlined,
  TeamOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons';

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const linksByRole = {
    admin: [
      { to: '/', label: 'Dashboard', icon: <HomeOutlined /> },
      { to: '/eleves', label: 'Gestion Élèves', icon: <UserOutlined /> },
      { to: '/cours', label: 'Gestion Cours', icon: <BookOutlined /> },
      { to: '/classes', label: 'Classes', icon: <BookOutlined /> },
      { to: '/semestres', label: 'Semestres', icon: <CalendarOutlined /> },
      { to: '/matieres', label: 'Matieres', icon: <BookOutlined /> },
      { to: '/enseignants', label: 'Enseignants', icon: <UserOutlined /> },
      { to: '/analyse-notes', label: 'Analyser les notes', icon: <UserOutlined /> },
      //{ to: '/admin/emplois/add', label: 'Ajouter emploi du temps', icon: <CalendarOutlined /> },
      { to: '/admin/emploi', label: 'Emploi du temps', icon: <CalendarOutlined /> },
      { to: '/admin/bulletins', label: 'Bulletin de note', icon: <CalendarOutlined /> },
      { to: `/eleves/${user._id}/affecter`, label: 'Affecter un eleve', icon: <BookOutlined /> },
      { to: '/admin/affecter-enseignant', label: 'Affecter un enseignant', icon: <BookOutlined /> },
      { to: 'admin/presences', label: 'Liste des presences', icon: <BookOutlined /> },
    ],
    enseignant: [
      { to: '/', label: 'Dashboard', icon: <HomeOutlined /> },
       { to: '/cours', label: 'Gestion Cours', icon: <BookOutlined /> },
      { to: '/enseignants/mes-classes', label: 'Mes Classes', icon: <TeamOutlined /> },
      { to: '/enseignant/notes', label: 'Liste des notes', icon: <TeamOutlined /> },
      { to: '/enseignant/notes/add', label: 'Ajouter une note', icon: <TeamOutlined /> },
      { to: `/enseignant/emplois/${user._id}`, label: 'Emploi du temps', icon: <CalendarOutlined /> },
      //{ to: `/cours/${user._id}/presence`, label: 'Eleve present', icon: <CalendarOutlined /> },
    ],
    eleve: [
      { to: '/', label: 'Dashboard', icon: <HomeOutlined /> },
      { to: '/notes-liste', label: 'Mes Notes', icon: <BookOutlined /> },
      { to: '/par-eleves', label: 'Liste cours', icon: <BookOutlined /> },
      { to: '/eleve/emploi', label: 'Emploi du temps', icon: <CalendarOutlined /> },
    ],
  };

  const links = linksByRole[user?.role] || [];

  return (
    <>
      {/* Bouton hamburger visible uniquement sur mobile */}
      <button
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        className="btn btn-square btn-ghost fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <CloseOutlined style={{ fontSize: 20 }} /> : <MenuOutlined style={{ fontSize: 20 }} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-base-200 shadow-lg p-4 flex flex-col
          transition-transform duration-300 ease-in-out z-50
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:shadow-none
        `}
        aria-label="Sidebar navigation"
      >
        <h2 className="text-xl font-bold mb-6 select-none">
          👩‍🏫 {user?.role?.toUpperCase() || 'UTILISATEUR'}
        </h2>

        <ul className="menu vertical overflow-auto flex-grow gap-2">
          {links.map(({ to, label, icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md
                  ${
                    location.pathname === to
                      ? 'bg-primary text-primary-content font-semibold'
                      : 'hover:bg-primary hover:text-primary-content'
                  }
                `}
                onClick={() => setOpen(false)}
              >
                {icon}
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
