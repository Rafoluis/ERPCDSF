'use client';

interface LegendGridProps {
  onSelect: (icon: string) => void;
  active: string | null;
}

const icons = [
  { title: 'Lesión de Caries dental', icon: '🦷' },
  { title: 'Sellante (Buen estado)', icon: '✔️' },
  { title: 'Sellante (Mal estado)', icon: '❌' },
  { title: 'Fractura', icon: '❌' },
  { title: 'Pieza dentaria ausente', icon: '✖️' },
  { title: 'Pieza dentaria en erupción', icon: '✖️' },
  { title: 'Restauración definitiva (Mal estado)', icon: '❌' },
  { title: 'Restauración definitiva (Buen estado)', icon: '✔️' },
  { title: 'Restauración temporal', icon: '🦷' },
  { title: 'Edentulo total', icon: '🦷' },
  { title: 'Pieza dentaria supernumeraria', icon: '🦷' },
  { title: 'Diastema', icon: '🦷' },
  { title: 'Corona temporal', icon: '🦷' },
  { title: 'Espigo - muñon', icon: '🦷' },
  { title: 'Aparato ortodontico removible (Mal estado)', icon: '❌' },
  { title: 'Aparato ortodontico removible (Buen estado)', icon: '✔️' },
  { title: 'Protesis fija (Mal estado)', icon: '❌' },
  { title: 'Protesis fija (Buen estado)', icon: '✔️' },
  { title: 'Protesis removible (Mal estado)', icon: '❌' },
  { title: 'Protesis removible (Buen estado)', icon: '✔️' },
];

export default function LegendGrid({ onSelect, active }: LegendGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-8">
      {icons.map(({ title, icon }) => (
        <button
          key={title}
          onClick={() => onSelect(icon)}
          className={`flex flex-col items-center bg-white rounded-lg shadow p-2 transition ${
            active === icon ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="text-sm text-center">{title}</div>
          <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-xl">
            {icon}
          </div>
        </button>
      ))}
    </div>
  );
}
