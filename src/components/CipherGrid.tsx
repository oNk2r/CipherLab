import React, { useState } from 'react';
import { CipherId } from '../types';

interface CipherGridProps {
  onSelectCipher: (cipherId: CipherId) => void;
}

interface CipherInfo {
  id: CipherId;
  name: string;
  category: 'Substitution' | 'Transposition' | 'Polygraphic';
  tag: string;
  description: string;
  bg: string;
}

export const CipherGrid: React.FC<CipherGridProps> = ({ onSelectCipher }) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'Substitution' | 'Transposition' | 'Polygraphic'>('ALL');

  const ciphers: CipherInfo[] = [
    {
      id: 'caesar',
      name: 'Caesar Shift',
      category: 'Substitution',
      tag: 'Shift Key',
      description: 'Shifts each letter forward by a fixed numeric key modulo 26.',
      bg: 'bg-[#FFE066]',
    },
    {
      id: 'mono',
      name: 'Monoalphabetic',
      category: 'Substitution',
      tag: 'Alphabet Map',
      description: 'Replaces each letter with a unique shuffled alphabet substitution.',
      bg: 'bg-[#C9A7FF]',
    },
    {
      id: 'playfair',
      name: 'Playfair',
      category: 'Polygraphic',
      tag: '5×5 Matrix',
      description: 'Encrypts letter pairs using a 5×5 keyword coordinate grid.',
      bg: 'bg-[#B8F28B]',
    },
    {
      id: 'hill',
      name: 'Hill 2×2',
      category: 'Polygraphic',
      tag: 'Linear Algebra',
      description: 'Multiplies character vector pairs by an invertible 2×2 matrix.',
      bg: 'bg-[#5ED9D1]',
    },
    {
      id: 'vigenere',
      name: 'Vigenère',
      category: 'Substitution',
      tag: 'Repeating Key',
      description: 'Applies cyclic Caesar shifts derived from a secret keyword.',
      bg: 'bg-[#FF7373]',
    },
    {
      id: 'otp',
      name: 'One-Time Pad',
      category: 'Substitution',
      tag: 'Random Pad',
      description: 'Modular addition with a truly random, non-repeating keystream.',
      bg: 'bg-white',
    },
    {
      id: 'railfence',
      name: 'Rail Fence',
      category: 'Transposition',
      tag: 'Zig-Zag Path',
      description: 'Writes characters along zig-zag rails before reading row by row.',
      bg: 'bg-[#ECDCFF]',
    },
    {
      id: 'columnar',
      name: 'Columnar',
      category: 'Transposition',
      tag: 'Permutation',
      description: 'Transposes letters into columns ordered alphabetically by a keyword.',
      bg: 'bg-[#E4F98E]',
    },
  ];

  const filteredCiphers = activeFilter === 'ALL'
    ? ciphers
    : ciphers.filter((c) => c.category === activeFilter);

  return (
    <section className="w-full pt-8 pb-12 sm:pb-16" id="ciphers-grid">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-headline-xl text-2xl sm:text-3xl text-[#111111] tracking-tight">
            Supported Ciphers
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {(['ALL', 'Substitution', 'Transposition', 'Polygraphic'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg border-2 border-[#111111] cursor-pointer transition-all ${
                activeFilter === filter
                  ? 'bg-[#111111] text-[#FFE066] shadow-[2px_2px_0px_#111111]'
                  : 'bg-white text-[#111111] hover:bg-[#F0EDEC]'
              }`}
            >
              {filter === 'ALL' ? 'All (8)' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCiphers.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectCipher(c.id)}
            className={`${c.bg} rounded-xl border-2 border-[#111111] p-4 shadow-[4px_4px_0px_#111111] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#111111] transition-all flex flex-col justify-between cursor-pointer group`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-[#111111]">
                  {c.tag}
                </span>
              </div>
              <h3 className="font-headline-md text-lg text-[#111111] font-bold mb-1 group-hover:underline">
                {c.name}
              </h3>
              <p className="font-body-sm text-xs text-[#4C4736] leading-relaxed mb-4">
                {c.description}
              </p>
            </div>
            <div className="pt-2 border-t border-[#111111]/20 flex items-center justify-between text-xs font-bold text-[#111111]">
              <span>Select</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
