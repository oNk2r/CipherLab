import React from 'react';
import { CipherId } from '../types';

interface FooterProps {
  onSelectCipher: (cipherId: CipherId) => void;
  onOpenWorkspace: () => void;
  onOpenCompare: () => void;
  onOpenFileEncryptor: () => void;
  onOpenFrequencyAttack: () => void;
  onOpenWorkbook: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCipher,
  onOpenWorkspace,
  onOpenCompare,
  onOpenFileEncryptor,
  onOpenFrequencyAttack,
  onOpenWorkbook,
}) => {
  const substitutionCiphers: { id: CipherId; label: string }[] = [
    { id: 'caesar', label: 'Caesar Shift' },
    { id: 'mono', label: 'Monoalphabetic' },
    { id: 'playfair', label: 'Playfair Matrix' },
    { id: 'hill', label: 'Hill 2×2' },
  ];

  const transpositionCiphers: { id: CipherId; label: string }[] = [
    { id: 'vigenere', label: 'Vigenère' },
    { id: 'otp', label: 'One-Time Pad' },
    { id: 'railfence', label: 'Rail Fence' },
    { id: 'columnar', label: 'Columnar' },
  ];

  return (
    <footer className="w-full mt-16 bg-[#111111] text-[#FFF8EE] border-t-[4px] border-[#111111] py-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FFE066] text-[#111111] flex items-center justify-center font-bold text-sm border border-[#111111] shadow-[2px_2px_0px_#FFE066]">
                CL
              </div>
              <span className="font-headline-lg text-2xl uppercase tracking-tight text-[#FFE066] font-bold">
                CipherLab
              </span>
            </div>
            <p className="font-body-sm text-xs text-[#cfc6b0] leading-relaxed max-w-sm">
              An interactive educational laboratory for classical cryptography, modular arithmetic, and cryptanalysis. Designed for network security coursework.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#222222] border border-[#333333] text-[11px] text-[#B8F28B] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              <span>100% Client-Side • Zero Cloud Storage</span>
            </div>
          </div>

          {/* Substitution Ciphers */}
          <div className="md:col-span-2 sm:col-span-4 space-y-2.5">
            <h4 className="text-xs uppercase text-[#FFE066] font-bold tracking-wider">
              Substitution
            </h4>
            <ul className="space-y-2 text-xs">
              {substitutionCiphers.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      onSelectCipher(c.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[#cfc6b0] hover:text-[#FFE066] transition-colors cursor-pointer text-left font-medium"
                  >
                    → {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Poly & Transposition Ciphers */}
          <div className="md:col-span-3 sm:col-span-4 space-y-2.5">
            <h4 className="text-xs uppercase text-[#5ED9D1] font-bold tracking-wider">
              Transposition &amp; Stream
            </h4>
            <ul className="space-y-2 text-xs">
              {transpositionCiphers.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      onSelectCipher(c.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[#cfc6b0] hover:text-[#5ED9D1] transition-colors cursor-pointer text-left font-medium"
                  >
                    → {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Laboratory Tools */}
          <div className="md:col-span-3 sm:col-span-4 space-y-2.5">
            <h4 className="text-xs uppercase text-[#B8F28B] font-bold tracking-wider">
              Laboratory Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenWorkspace}
                  className="text-[#cfc6b0] hover:text-[#B8F28B] transition-colors cursor-pointer text-left font-medium"
                >
                  → Interactive Workspace
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCompare}
                  className="text-[#cfc6b0] hover:text-[#B8F28B] transition-colors cursor-pointer text-left font-medium"
                >
                  → Compare Ciphers Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFrequencyAttack}
                  className="text-[#cfc6b0] hover:text-[#B8F28B] transition-colors cursor-pointer text-left font-medium"
                >
                  → Frequency Cryptanalysis
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFileEncryptor}
                  className="text-[#cfc6b0] hover:text-[#B8F28B] transition-colors cursor-pointer text-left font-medium"
                >
                  → Client File Encryptor
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenWorkbook}
                  className="text-[#cfc6b0] hover:text-[#B8F28B] transition-colors cursor-pointer text-left font-medium"
                >
                  → Theory &amp; Reference Guide
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#333333] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8A8575]">
          <div>
            CipherLab • Classical Cryptography Laboratory Toolkit
          </div>
          <div className="flex items-center gap-3">
            <span>Client-Side Runtime</span>
            <span>•</span>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
