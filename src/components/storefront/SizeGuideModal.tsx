'use client';

import React, { useState } from 'react';
import { X, Ruler, CheckCircle } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
}

export default function SizeGuideModal({ isOpen, onClose, categoryName = 'Shirt' }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  if (!isOpen) return null;

  const isPants = categoryName.toLowerCase().includes('pant') ||
                  categoryName.toLowerCase().includes('cargo') ||
                  categoryName.toLowerCase().includes('jean') ||
                  categoryName.toLowerCase().includes('short');

  const shirtSizes = [
    { size: 'S (38)', chestIn: '38 - 40', chestCm: '96 - 101', shoulderIn: '17.5', shoulderCm: '44.5', lengthIn: '28.5', lengthCm: '72' },
    { size: 'M (40)', chestIn: '40 - 42', chestCm: '101 - 106', shoulderIn: '18.5', shoulderCm: '47', lengthIn: '29.5', lengthCm: '75' },
    { size: 'L (42)', chestIn: '42 - 44', chestCm: '106 - 112', shoulderIn: '19.5', shoulderCm: '49.5', lengthIn: '30.5', lengthCm: '77.5' },
    { size: 'XL (44)', chestIn: '44 - 46', chestCm: '112 - 117', shoulderIn: '20.5', shoulderCm: '52', lengthIn: '31.5', lengthCm: '80' },
    { size: 'XXL (46)', chestIn: '46 - 48', chestCm: '117 - 122', shoulderIn: '21.5', shoulderCm: '54.5', lengthIn: '32.5', lengthCm: '82.5' },
  ];

  const pantSizes = [
    { size: '30', waistIn: '30', waistCm: '76', hipIn: '39', hipCm: '99', lengthIn: '40', lengthCm: '101.5' },
    { size: '32', waistIn: '32', waistCm: '81', hipIn: '41', hipCm: '104', lengthIn: '40.5', lengthCm: '103' },
    { size: '34', waistIn: '34', waistCm: '86', hipIn: '43', hipCm: '109', lengthIn: '41', lengthCm: '104' },
    { size: '36', waistIn: '36', waistCm: '91', hipIn: '45', hipCm: '114', lengthIn: '41.5', lengthCm: '105.5' },
    { size: '38', waistIn: '38', waistCm: '96', hipIn: '47', hipCm: '119', lengthIn: '42', lengthCm: '106.5' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-5 h-5 text-zinc-950" />
            <h3 className="text-base sm:text-lg font-black uppercase text-zinc-950 tracking-wide">
              {isPants ? 'Trousers & Pants Size Chart' : 'Shirts & Tops Size Chart'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Selector */}
        <div className="flex items-center justify-between py-4">
          <span className="text-xs text-zinc-600 font-medium">All measurements in:</span>
          <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                unit === 'in' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                unit === 'cm' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100 text-zinc-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Size</th>
                {isPants ? (
                  <>
                    <th className="p-3">Waist</th>
                    <th className="p-3">Hip</th>
                    <th className="p-3">Length</th>
                  </>
                ) : (
                  <>
                    <th className="p-3">Chest</th>
                    <th className="p-3">Shoulder</th>
                    <th className="p-3">Length</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 font-mono text-zinc-700">
              {isPants
                ? pantSizes.map((row) => (
                    <tr key={row.size} className="hover:bg-zinc-50">
                      <td className="p-3 font-bold text-zinc-950">{row.size}</td>
                      <td className="p-3">{unit === 'in' ? `${row.waistIn}"` : `${row.waistCm} cm`}</td>
                      <td className="p-3">{unit === 'in' ? `${row.hipIn}"` : `${row.hipCm} cm`}</td>
                      <td className="p-3">{unit === 'in' ? `${row.lengthIn}"` : `${row.lengthCm} cm`}</td>
                    </tr>
                  ))
                : shirtSizes.map((row) => (
                    <tr key={row.size} className="hover:bg-zinc-50">
                      <td className="p-3 font-bold text-zinc-950">{row.size}</td>
                      <td className="p-3">{unit === 'in' ? `${row.chestIn}"` : `${row.chestCm} cm`}</td>
                      <td className="p-3">{unit === 'in' ? `${row.shoulderIn}"` : `${row.shoulderCm} cm`}</td>
                      <td className="p-3">{unit === 'in' ? `${row.lengthIn}"` : `${row.lengthCm} cm`}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Measuring Tip */}
        <div className="mt-5 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong className="text-zinc-900">Oversized note:</strong> For oversized and baggy fits, we recommend sticking to your regular true size for the intended relaxed drop-shoulder aesthetic.
          </span>
        </div>
      </div>
    </div>
  );
}
