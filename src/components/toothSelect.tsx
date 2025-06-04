import React from 'react';

export interface SymmetricSelectRowProps {
  count: number;
  start: number;
  gap?: string;
  px?: string;
  py?: string;
}

const options = [
  'CC /CC', 'CF/ CF', 'CMC/ CMC', 'CP/ CP', 'CV/ CV', 'CJ/ CJ', 'CT', 'O', 'PE', 'FFP', 'I', 'IMP/IMP',
  'MB', 'CE', 'CD', 'CDP', 'MAC', 'MIC', 'M1', 'M2', 'M3', 'DNE', 'DEX', 'DAO', 'M', 'D', 'V', 'P', 'L',
  'RR', 'AM/ AM', 'R/ R', 'IV/ IV', 'IM/ IM', 'IE/ IE', 'C/ C', 'S/S', 'DES', 'TC/TC', 'DIS', 'E', 'SI'
];

export const SymmetricSelectRow: React.FC<SymmetricSelectRowProps> = ({
  count,
  start,
  gap = 'gap-2',
  px = 'px-1',
  py = 'py-1',
}) => {
  const half = Math.ceil(count / 2);
  const leftCount = half;
  const rightCount = count - half;

  const renderSelect = (number: number, key: string) => (
    <select key={key} className={`border rounded ${px} ${py} text-sm`}>
      <option value="">Diente {number}</option>
      {options.map((opt, index) => {
  const [left, right] = opt.split("/");

  const hasRight = typeof right !== "undefined";

  return (
    <option
      key={index}
      value={opt}
      className={hasRight ? 'text-blue-600' : 'text-red-600'}
    >
      {opt}
    </option>
  );
})}
    </select>
  );

  return (
    <div className="w-full flex flex-wrap justify-center">
      <div className={`w-full md:w-1/2 flex flex-wrap justify-end ${gap} pr-1`}>
        {Array.from({ length: leftCount }).map((_, i) =>
          renderSelect(start + i, `left-${start + i}`)
        )}
      </div>

      <div className={`w-full md:w-1/2 flex flex-wrap justify-start ${gap} pl-1`}>
        {Array.from({ length: rightCount }).map((_, i) =>
          renderSelect(start + leftCount + i, `right-${start + leftCount + i}`)
        )}
      </div>
    </div>
  );
};