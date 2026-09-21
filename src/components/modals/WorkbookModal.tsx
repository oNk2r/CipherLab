import React, { useState } from 'react';
import { CIPHERS_HELP_DATA } from '../../data/helpData';
import { CipherId } from '../../types';

interface WorkbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkbookModal: React.FC<WorkbookModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ciphers' | 'theory'>('ciphers');
  const [selectedCipherId, setSelectedCipherId] = useState<CipherId>('caesar');

  if (!isOpen) return null;

  const cipherList: { id: CipherId; label: string }[] = [
    { id: 'caesar', label: 'Caesar' },
    { id: 'mono', label: 'Monoalphabetic' },
    { id: 'playfair', label: 'Playfair' },
    { id: 'hill', label: 'Hill 2×2' },
    { id: 'vigenere', label: 'Vigenère' },
    { id: 'otp', label: 'One-Time Pad' },
    { id: 'railfence', label: 'Rail Fence' },
    { id: 'columnar', label: 'Columnar' },
  ];

  const activeCipher = CIPHERS_HELP_DATA[selectedCipherId];

  return (
    <div className="fixed inset-0 z-50 bg-[#111111]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl border-2 border-[#111111] shadow-[6px_6px_0px_#111111] max-w-4xl w-full p-5 my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#111111]">
          <h3 className="font-headline-lg text-xl font-bold text-[#111111]">
            Reference Guide
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border-2 border-[#111111] bg-[#F0EDEC] text-[#111111] font-bold flex items-center justify-center hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 pt-3 pb-2 border-b-2 border-[#111111] text-xs font-bold">
          <button
            onClick={() => setActiveTab('ciphers')}
            className={`px-3 py-1.5 rounded-lg border-2 border-[#111111] transition-all cursor-pointer ${
              activeTab === 'ciphers'
                ? 'bg-[#111111] text-[#FFE066]'
                : 'bg-[#F0EDEC] text-[#4C4736] hover:bg-white'
            }`}
          >
            Ciphers Specification
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-3 py-1.5 rounded-lg border-2 border-[#111111] transition-all cursor-pointer ${
              activeTab === 'theory'
                ? 'bg-[#111111] text-[#FFE066]'
                : 'bg-[#F0EDEC] text-[#4C4736] hover:bg-white'
            }`}
          >
            Theory & Principles
          </button>
        </div>

        {/* Tab 1: Ciphers Guide */}
        {activeTab === 'ciphers' && (
          <div className="py-3 flex flex-col flex-1 overflow-y-auto space-y-3">
            {/* Cipher Pills */}
            <div className="flex flex-wrap gap-1.5">
              {cipherList.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCipherId(c.id)}
                  className={`px-2.5 py-1 rounded-md border-2 border-[#111111] text-xs font-bold cursor-pointer transition-all ${
                    selectedCipherId === c.id
                      ? 'bg-[#111111] text-[#FFE066]'
                      : 'bg-[#F0EDEC] text-[#111111] hover:bg-[#FFE066]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Active Cipher Spec Card */}
            <div className="bg-[#FFF8EE] p-4 rounded-xl border-2 border-[#111111] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#111111]/20">
                <h4 className="font-headline-md text-lg font-bold text-[#111111]">
                  {activeCipher.name}
                </h4>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-[#111111]">
                  {activeCipher.type}
                </span>
              </div>

              <div>
                <p className="text-xs sm:text-sm text-[#111111] leading-relaxed">
                  {activeCipher.whatItIs}
                </p>
              </div>

              {/* Encryption & Decryption */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-2.5 bg-white rounded-lg border border-[#111111]">
                  <span className="text-xs font-bold text-[#006A65] block mb-1">
                    Encryption
                  </span>
                  <p className="font-code-md text-xs text-[#111111]">
                    {activeCipher.howEncryptionWorks}
                  </p>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-[#111111]">
                  <span className="text-xs font-bold text-[#6D4E9F] block mb-1">
                    Decryption
                  </span>
                  <p className="font-code-md text-xs text-[#111111]">
                    {activeCipher.howDecryptionWorks}
                  </p>
                </div>
              </div>

              {/* Key Requirements */}
              <div className="p-2.5 bg-white rounded-lg border border-[#111111]">
                <span className="text-xs font-bold text-[#BA1A1A] block mb-0.5">
                  Key Requirements
                </span>
                <p className="font-code-md text-xs text-[#111111]">
                  {activeCipher.keyRequirements}
                </p>
              </div>

              {/* Worked Example */}
              <div className="p-2.5 bg-white rounded-lg border border-[#111111] space-y-1.5">
                <span className="text-xs font-bold text-[#111111] block">
                  Example
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-code-md">
                  <div>
                    <span className="text-[#4C4736]">Plaintext: </span>
                    <strong className="text-[#111111]">{activeCipher.smallExample.plaintext}</strong>
                  </div>
                  <div>
                    <span className="text-[#4C4736]">Key: </span>
                    <strong className="text-[#111111]">{activeCipher.smallExample.key}</strong>
                  </div>
                </div>
                <div className="p-2 bg-[#FFF8EE] rounded border border-[#111111] font-code-md text-xs text-[#111111]">
                  {activeCipher.smallExample.step}
                </div>
                <div className="text-xs font-code-md">
                  <span className="text-[#4C4736]">Output: </span>
                  <code className="bg-[#B8F28B] px-1 py-0.5 rounded border border-[#111111] font-bold text-[#111111]">
                    {activeCipher.smallExample.ciphertext}
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Theory */}
        {activeTab === 'theory' && (
          <div className="py-3 space-y-3 overflow-y-auto flex-1 text-xs sm:text-sm font-body-md text-[#111111]">
            <div className="bg-[#FFF8EE] p-3.5 rounded-xl border border-[#111111]">
              <h4 className="font-headline-md text-base font-bold text-[#111111] mb-1">
                Modular Arithmetic (Mod 26)
              </h4>
              <p className="text-xs text-[#4C4736] mb-2 leading-relaxed">
                Alphabet characters map to integers: A = 0, B = 1, ... Z = 25.
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-[#111111] font-code-md text-xs space-y-1">
                <div>• Encryption: <strong>C ≡ (P + K) mod 26</strong></div>
                <div>• Decryption: <strong>P ≡ (C - K) mod 26</strong></div>
              </div>
            </div>

            <div className="bg-[#FFF8EE] p-3.5 rounded-xl border border-[#111111]">
              <h4 className="font-headline-md text-base font-bold text-[#111111] mb-1">
                Kerckhoffs' Principle &amp; One-Time Pad
              </h4>
              <p className="text-xs text-[#4C4736] mb-2 leading-relaxed">
                A cryptosystem must remain secure even if everything about the algorithm is known to the public, except the key.
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-[#111111] font-code-md text-xs space-y-1">
                <div>• One-Time Pad achieves Shannon's perfect secrecy when keys are truly random, used once, and equal to message length.</div>
              </div>
            </div>

            <div className="bg-[#FFF8EE] p-3.5 rounded-xl border border-[#111111]">
              <h4 className="font-headline-md text-base font-bold text-[#111111] mb-1">
                Frequency Analysis &amp; Index of Coincidence
              </h4>
              <p className="text-xs text-[#4C4736] mb-2 leading-relaxed">
                Monoalphabetic ciphers preserve single-letter frequencies (e.g. E ≈ 12.7%, T ≈ 9.1% in English).
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-[#111111] font-code-md text-xs space-y-1">
                <div>• English Plaintext IoC ≈ 0.0667; Random / polyalphabetic ciphertext IoC ≈ 0.0385.</div>
              </div>
            </div>

            <div className="bg-[#FFF8EE] p-3.5 rounded-xl border border-[#111111]">
              <h4 className="font-headline-md text-base font-bold text-[#111111] mb-1">
                Hill Matrix Inverses in GL(2, ℤ₂₆)
              </h4>
              <p className="text-xs text-[#4C4736] mb-2 leading-relaxed">
                Hill encryption multiplies vectors C = K · P (mod 26). The inverse matrix exists if and only if gcd(det(K), 26) = 1.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t-2 border-[#111111] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border-2 border-[#111111] bg-[#F0EDEC] font-bold text-xs hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
