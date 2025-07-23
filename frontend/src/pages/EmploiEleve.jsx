import React from 'react';
import EmploiEleve from '../components/EmploisEleves';

export default function EmploiElevePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Emploi du temps par classe</h1>
      <EmploiEleve />
    </div>
  );
}
