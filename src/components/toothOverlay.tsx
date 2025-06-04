// components/ToothOverlay.tsx
'use client';
import React from 'react';

export type SurfaceId = 'C' | 'M' | 'D' | 'V' | 'L';
interface ToothOverlayProps {
  activeLegend: string | null;
  onSurfaceSelect: (tooth: number, surface: SurfaceId, legend: string | null) => void;
  selectedSurfaceLegends: Record<number, Partial<Record<SurfaceId, string>>>;
  legendColorMap: Record<string, string>;
  onWholeToothSelect?: (tooth: number, legend: string | null) => void;
  selectedWholeTeethLegends?: Record<number, string>;
}

interface ToothPos {
  left: number;
  top: number;
  width?: number;       // ancho raíz
  height?: number;      // alto raíz
  occlusalWidth?: number;  // ancho área oclusal
  occlusalHeight?: number; // alto área oclusal
}

const toothPositions: Record<number, ToothPos> = {
  // Superior
  18: { left: 3.125, top: 20,   occlusalWidth: 6, occlusalHeight: 7 },
  17: { left: 9.375, top: 20,   occlusalWidth: 6, occlusalHeight: 7 },
  16: { left: 15.625, top: 20,  occlusalWidth: 6, occlusalHeight: 7 },
  15: { left: 21.875, top: 20,  occlusalWidth: 6, occlusalHeight: 7 },
  14: { left: 28.125, top: 20,  occlusalWidth: 6, occlusalHeight: 7 },
  13: { left: 34.375, top: 20,  occlusalWidth: 6, occlusalHeight: 7 },
  12: { left: 40.625, top: 22,  occlusalWidth: 6, occlusalHeight: 7 },
  11: { left: 46.875, top: 22,  occlusalWidth: 6, occlusalHeight: 7 },

  21: { left: 53.125, top: 18,  occlusalWidth: 6, occlusalHeight: 7 },
  22: { left: 59.375, top: 18,  occlusalWidth: 6, occlusalHeight: 7 },
  23: { left: 65.625, top: 18,  occlusalWidth: 6, occlusalHeight: 7 },
  24: { left: 71.875, top: 18,  occlusalWidth: 6, occlusalHeight: 7 },
  25: { left: 78.125, top: 18,  occlusalWidth: 6, occlusalHeight: 7 },
  26: { left: 84.375, top: 18,  occlusalWidth: 6, occlusalHeight: 7 },
  27: { left: 90.625, top: 18,  occlusalWidth: 6, occlusalHeight: 7 },
  28: { left: 96.875, top: 18,  occlusalWidth: 6, occlusalHeight: 7 },

  // Inferior
  48: { left: 3.125,  top: 65,  occlusalWidth: 6, occlusalHeight: 7 },
  47: { left: 9.375,  top: 65,  occlusalWidth: 6, occlusalHeight: 7 },
  46: { left: 15.625, top: 65,  occlusalWidth: 6, occlusalHeight: 7 },
  45: { left: 21.875, top: 65,  occlusalWidth: 6, occlusalHeight: 7 },
  44: { left: 28.125, top: 65,  occlusalWidth: 6, occlusalHeight: 7 },
  43: { left: 34.375, top: 65,  occlusalWidth: 6, occlusalHeight: 7 },
  42: { left: 40.625, top: 65,  occlusalWidth: 6, occlusalHeight: 7 },
  41: { left: 46.875, top: 65,  occlusalWidth: 6, occlusalHeight: 7 },

  31: { left: 53.125, top: 65,  occlusalWidth: 6, occlusalHeight: 7 },
  32: { left: 59.375, top: 65,  occlusalWidth: 6, occlusalHeight: 7 },
  33: { left: 65.625, top: 65,  occlusalWidth: 6, occlusalHeight: 7 },
  34: { left: 71.875, top: 65,  occlusalWidth: 6, occlusalHeight: 7 },
  35: { left: 78.125, top: 65,  occlusalWidth: 6, occlusalHeight: 7 },
  36: { left: 84.375, top: 65,  occlusalWidth: 6, occlusalHeight: 7 },
  37: { left: 90.625, top: 65,  occlusalWidth: 6, occlusalHeight: 7 },
  38: { left: 96.875, top: 65,  occlusalWidth: 6, occlusalHeight: 7 },
};

const surfaceLayouts: {
  id: SurfaceId;
  title: string;
  style: React.CSSProperties;
}[] = [
  { id: 'C', title: 'Centro / Oclusal', style: { top: '25%', left: '25%', width: '50%', height: '50%', borderRadius: '50%' } },
  { id: 'V', title: 'Vestibular',       style: { top: '0%',   left: '25%', width: '50%', height: '25%' } },
  { id: 'L', title: 'Lingual',          style: { top: '75%', left: '25%', width: '50%', height: '25%' } },
  { id: 'M', title: 'Mesial',           style: { top: '25%', left: '0%',   width: '25%', height: '50%' } },
  { id: 'D', title: 'Distal',           style: { top: '25%', left: '75%', width: '25%', height: '50%' } },
];

export default function ToothOverlay({
  activeLegend,
  onSurfaceSelect,
  selectedSurfaceLegends,
  legendColorMap,
  onWholeToothSelect,
  selectedWholeTeethLegends,
}: ToothOverlayProps) {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <img
        src="/ODONTOGRAMAFNADULTO.png"
        alt="Odontograma"
        className="w-full object-cover rounded-md select-none"
      />

      {/* Raíz */}
      {onWholeToothSelect && Object.entries(toothPositions).map(([tStr, pos]) => {
        const tooth = +tStr;
        const w = pos.width ?? 6.25;
        const h = pos.height ?? 12;
        const legend = selectedWholeTeethLegends?.[tooth];
        const bg = legend ? legendColorMap[legend] : 'transparent';
        const rootOpacity = legend ? 0.5 : 0; 
        return (
          <button
            key={`root-${tooth}`}
            onClick={() => onWholeToothSelect(tooth, activeLegend)}
            className="absolute transition hover:opacity-40"
            style={{
              left:   `${pos.left}%`,
              top:    `${pos.top}%`,
              width:  `${w}%`,
              height: `${h}%`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: bg,
              opacity: rootOpacity,
              borderRadius: '20%',
            }}
            title={`Raíz Diente ${tooth}`}
          />
        );
      })}

      {/* Superficies oclusales */}
      {Object.entries(toothPositions).map(([tStr, pos]) => {
        const tooth = +tStr;
        const ow = pos.occlusalWidth ?? 6;
        const oh = pos.occlusalHeight ?? 7;
        const centerY = pos.top < 50 ? 44 : 56;
        return (
          <div
            key={`occlusal-${tooth}`}
            className="absolute"
            style={{
              left: `${pos.left}%`,
              top:  `${centerY}%`,
              width: `${ow}%`,
              height:`${oh}%`,
              transform: 'translate(-50%, -50%)',
              // border: '1px dashed silver',
            }}
          >
            {surfaceLayouts.map(s => {
              const currentSurfaceLegend = selectedSurfaceLegends[tooth]?.[s.id];
              const backgroundColor = currentSurfaceLegend ? legendColorMap[currentSurfaceLegend] : 'transparent';
              const buttonOpacity = currentSurfaceLegend ? 1 : 0;

              return (
                <button
                  key={`${tooth}_${s.id}`}
                  onClick={() => onSurfaceSelect(tooth, s.id, activeLegend)}
                  className={`absolute transition-all duration-150 ease-in-out ${
                    !currentSurfaceLegend ? 'hover:opacity-30 hover:bg-gray-200' : ''
                  }`}
                  style={{
                    ...s.style,
                    backgroundColor: backgroundColor,
                    opacity: buttonOpacity,
                    // border: '1px dotted blue',
                  }}
                  title={`Diente ${tooth} – ${s.title}`}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}