import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function BulletinDetails() {
  const { id } = useParams();
  const [bulletin, setBulletin] = useState(null);
  const pdfRef = useRef();

  useEffect(() => {
    api.get(`/api/bulletins/${id}`).then((res) => setBulletin(res.data));
  }, [id]);

// Exemple d’URL de logo ou `import logo from './logo.png';`
const logoUrl = '/logo-ecole.png';

const handleExportPDF = async () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const marginLeft = 40;
  const lineHeight = 20;
  const today = new Date().toLocaleDateString();

  // Charger le logo
  const logoImg = await loadImageBase64(logoUrl);

  // 🔹 EN-TÊTE : Logo + École
  if (logoImg) {
    doc.addImage(logoImg, 'PNG', marginLeft, 20, 50, 50);
  }

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('École Excellence Académie', marginLeft + 60, 40);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date de génération : ${today}`, marginLeft + 60, 60);

  doc.setLineWidth(0.5);
  doc.line(marginLeft, 75, 550, 75);

  // 🔹 TITRE BULLETIN
  doc.setFontSize(14);
  doc.text(`Bulletin de ${bulletin.eleve.nom}`, marginLeft, 100);
  doc.setFontSize(12);
  doc.text(`Semestre : ${bulletin.semestre}`, marginLeft, 120);
  doc.text(`Classe : ${bulletin.classe.nom}`, marginLeft, 135);

  // 🔹 TABLEAU DES NOTES
  autoTable(doc, {
    startY: 140,
    head: [['Matière', 'Moyenne']],
    body: bulletin.notes.map(note => [
      note.matiere.nom,
      note.moyenne?.toFixed(2) ?? '—',
    ]),
    theme: 'striped',
    styles: {
      fontSize: 10,
      halign: 'left',
      cellPadding: 6,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
    },
  });

  // 🔹 MOYENNE GÉNÉRALE ET APPRÉCIATION
  const finalY = doc.lastAutoTable.finalY + 30;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `Moyenne générale : ${bulletin.moyenneGenerale?.toFixed(2) ?? '—'}`,
    marginLeft,
    finalY
  );

  doc.setFont('helvetica', 'normal');
  doc.text(`Appréciation : ${bulletin.appreciation || '—'}`, marginLeft, finalY + lineHeight);

  // 🔹 ENREGISTRER
  doc.save(`bulletin_${bulletin.eleve.nom}.pdf`);
};

// 🔁 Convertit une image en base64
const loadImageBase64 = url =>
  new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });


  if (!bulletin) return <p className="text-center">Chargement...</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Bulletin de {bulletin.eleve.nom} Semestre {bulletin.semestre} -
          Classe {bulletin.classe.nom}
        </h2>
        <button onClick={handleExportPDF} className="btn btn-sm btn-primary">
          📄 Exporter en PDF
        </button>
      </div>

      <div ref={pdfRef} className="bg-white p-4 rounded shadow space-y-6">
        {/* Tableau desktop */}
        <table className="w-full border-collapse border hidden md:table">
          <thead className="bg-base-200">
            <tr>
              <th className="border p-2">Matière</th>
              <th className="border p-2">Moyenne</th>
            </tr>
          </thead>
          <tbody>
            {bulletin.notes.map((n, i) => (
              <tr key={i} className="even:bg-base-100">
                <td className="border p-2">{n.matiere.nom}</td>
                <td className="border p-2">{n.moyenne?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile view */}
        <div className="md:hidden space-y-4">
          {bulletin.notes.map((n, i) => (
            <div key={i} className="card bg-base-100 shadow p-4">
              <p><strong>Matière :</strong> {n.matiere.nom}</p>
              <p><strong>Moyenne :</strong> {n.moyenne?.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t space-y-1">
          <p className="font-semibold text-lg">
            🎯 Moyenne générale : {bulletin.moyenneGenerale?.toFixed(2)}
          </p>
          <p>🗣️ Appréciation : {bulletin.appreciation || '—'}</p>
        </div>
      </div>
    </div>
  );
}
