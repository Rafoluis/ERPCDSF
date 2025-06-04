'use client';
import { useState } from 'react';
import { SymmetricSelectRow } from '@/components/toothSelect';
import LegendGrid from '@/components/toothGrid';
import ToothOverlay from './toothOverlay';
import type { SurfaceId } from './toothOverlay';

const LegendGridA = ({ onSelect, active }: { onSelect: (legend: string | null) => void; active: string | null }) => {
  const mockLegends = ['rojo', 'azul', 'verde', 'amarillo', 'negro'];
  return (
    <div className="mt-4 p-3 border rounded-md shadow">
      {mockLegends.map((legend) => (
        <button
          key={legend}
          onClick={() => onSelect(legend)}
          className={`px-3 py-1 mr-2 mb-2 rounded text-sm capitalize border ${
            active === legend ? 'ring-2 ring-blue-500 ring-offset-1' : 'border-gray-300'
          }`}
          style={{ backgroundColor: active === legend ? '#e0e7ff' : '#f9fafb' }}
        >
          {legend}
        </button>
      ))}
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1 mr-2 mb-2 rounded text-sm border ${
          active === null ? 'ring-2 ring-gray-500 ring-offset-1' : 'border-gray-300'
        }`}
        style={{ backgroundColor: active === null ? '#e5e7eb' : '#f9fafb' }}
      >
        Borrar
      </button>
    </div>
  );
};

export default function ClientOdontograma() {
  const [activeLegend, setActiveLegend] = useState<string|null>(null);

  const [selectedSurfaces, setSelectedSurfaces] = useState<
    Record<number, Partial<Record<SurfaceId,string>>>
  >({});

  const [selectedWholeTeeth, setSelectedWholeTeeth] = useState<Record<number,string>>({});

  const legendColorMapData: Record<string,string> = {
    rojo: 'rgba(255,0,0,0.7)',
    azul: 'rgba(0,0,255,0.7)',
    verde:   'rgba(0,255,0,0.7)',
    amarillo: 'rgba(255,165,0,0.7)',
    negro: 'rgba(0,0,0,0.7)',
  };

  const handleSurfaceSelect = (
    tooth: number,
    surface: SurfaceId,
    legendToApply: string | null
  ) => {
    setSelectedSurfaces(prevSelected => {
      const newSelectedSurfaces = { ...prevSelected };
      const currentToothSurfaces = { ...(newSelectedSurfaces[tooth] || {}) };

      if (legendToApply) {
        if (currentToothSurfaces[surface] === legendToApply) {
          delete currentToothSurfaces[surface];
        } else {
          currentToothSurfaces[surface] = legendToApply;
        }
      } else {
        delete currentToothSurfaces[surface];
      }
      if (Object.keys(currentToothSurfaces).length === 0) {
        delete newSelectedSurfaces[tooth];
      } else {
        newSelectedSurfaces[tooth] = currentToothSurfaces;
      }
      return newSelectedSurfaces;
    });
  };
  const handleWholeToothSelect = (tooth: number, legendToApply: string | null) => {
    setSelectedWholeTeeth(prevSelected => {
      const newSelectedWholeTeeth = { ...prevSelected };
      if (legendToApply) {
        if (newSelectedWholeTeeth[tooth] === legendToApply) {
          delete newSelectedWholeTeeth[tooth];
        } else {
          newSelectedWholeTeeth[tooth] = legendToApply;
        }
      } else {
        delete newSelectedWholeTeeth[tooth];
      }
      return newSelectedWholeTeeth;
    });
  };

  return (
    <div>
      {/* SELECT */}
      <div className="p-4 flex flex-col items-center gap-4 w-full">
        {/* <SymmetricSelectRow count={16} start={1} />
        <SymmetricSelectRow count={10} start={17} /> */}

        {/* OVERLAY */}
         <ToothOverlay
          activeLegend={activeLegend}
          onSurfaceSelect={handleSurfaceSelect}
          selectedSurfaceLegends={selectedSurfaces}
          legendColorMap={legendColorMapData}
          onWholeToothSelect={handleWholeToothSelect}
          selectedWholeTeethLegends={selectedWholeTeeth}
        />

        {/* <SymmetricSelectRow count={10} start={1} />
        <SymmetricSelectRow count={16} start={11} /> */}
      </div>

      {/* GRILLA */}
      <LegendGridA onSelect={setActiveLegend} active={activeLegend} />
      <LegendGrid onSelect={setActiveLegend} active={activeLegend} />
    </div>
  );
}
