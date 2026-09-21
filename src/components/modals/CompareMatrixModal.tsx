import React, { useState, useMemo } from 'react';
import { CipherId } from '../../types';
import {
  runCaesar,
  runMonoalphabetic,
  runPlayfair,
  runHill,
  runVigenere,
  runOTP,
  generateRandomPad,
  runRailFence,
  runColumnar
} from '../../utils/cryptoEngines';

interface CompareMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCipher: (id: CipherId) => void;
}

interface BenchmarkRow {
  id: CipherId;
  name: string;
  category: string;
  cardColor: string;
  inputLen: number;
  outputLen: number;
  encTimeMs: number;
  decTimeMs: number;
  preview: string;
  keyspace: string;
  securityNote: string;
}

export const CompareMatrixModal: React.FC<CompareMatrixModalProps> = ({
  isOpen,
  onClose,
  onSelectCipher,
}) => {
  const [testPayload, setTestPayload] = useState('NETWORK SECURITY CLASSICAL BENCHMARK EXPERIMENT');
  const [searchTerm, setSearchTerm] = useState('');

  // Default keys for benchmarking
  const benchmarkKeys = useMemo(() => ({
    caesar: 5,
    mono: 'QWERTYUIOPASDFGHJKLZXCVBNM',
    playfair: 'MONARCHY',
    hill: [9, 4, 5, 7] as [number, number, number, number],
    vigenere: 'SECURITY',
    otp: generateRandomPad(Math.max(100, testPayload.length)),
    railfence: 3,
    columnar: 'CIPHER'
  }), [testPayload]);

  // Live benchmark calculations
  const benchmarkResults: BenchmarkRow[] = useMemo(() => {
    const text = testPayload || 'TEST';
    const results: BenchmarkRow[] = [];

    const measure = (fn: () => string) => {
      const t0 = performance.now();
      const output = fn();
      const t1 = performance.now();
      return { output, durationMs: Math.max(0.001, Number((t1 - t0).toFixed(3))) };
    };

    // 1. Caesar
    const cEnc = measure(() => runCaesar(text, benchmarkKeys.caesar, true, true).result);
    const cDec = measure(() => runCaesar(cEnc.output, benchmarkKeys.caesar, false, true).result);
    results.push({
      id: 'caesar',
      name: 'Caesar Shift',
      category: 'Substitution',
      cardColor: '#FFE066',
      inputLen: text.length,
      outputLen: cEnc.output.length,
      encTimeMs: cEnc.durationMs,
      decTimeMs: cDec.durationMs,
      preview: cEnc.output.slice(0, 16) + (cEnc.output.length > 16 ? '...' : ''),
      keyspace: '26 keys',
      securityNote: 'Brute-forced across 25 shifts instantly.'
    });

    // 2. Monoalphabetic
    const mEnc = measure(() => runMonoalphabetic(text, benchmarkKeys.mono, true, true).result);
    const mDec = measure(() => runMonoalphabetic(mEnc.output, benchmarkKeys.mono, false, true).result);
    results.push({
      id: 'mono',
      name: 'Monoalphabetic',
      category: 'Substitution',
      cardColor: '#C9A7FF',
      inputLen: text.length,
      outputLen: mEnc.output.length,
      encTimeMs: mEnc.durationMs,
      decTimeMs: mDec.durationMs,
      preview: mEnc.output.slice(0, 16) + (mEnc.output.length > 16 ? '...' : ''),
      keyspace: '26! ≈ 4.03 × 10²⁶',
      securityNote: 'Vulnerable to single-letter frequency analysis.'
    });

    // 3. Playfair
    const pEnc = measure(() => runPlayfair(text, benchmarkKeys.playfair, true, true).result);
    const pDec = measure(() => runPlayfair(pEnc.output, benchmarkKeys.playfair, false, true).result);
    results.push({
      id: 'playfair',
      name: 'Playfair',
      category: 'Polygraphic',
      cardColor: '#B8F28B',
      inputLen: text.length,
      outputLen: pEnc.output.length,
      encTimeMs: pEnc.durationMs,
      decTimeMs: pDec.durationMs,
      preview: pEnc.output.slice(0, 16) + (pEnc.output.length > 16 ? '...' : ''),
      keyspace: '25! ≈ 1.55 × 10²⁵',
      securityNote: 'Flattens single frequencies; broken by digraph analysis.'
    });

    // 4. Hill
    const hEnc = measure(() => runHill(text, benchmarkKeys.hill, true, true).result);
    const hDec = measure(() => runHill(hEnc.output, benchmarkKeys.hill, false, true).result);
    results.push({
      id: 'hill',
      name: 'Hill 2×2',
      category: 'Polygraphic',
      cardColor: '#5ED9D1',
      inputLen: text.length,
      outputLen: hEnc.output.length,
      encTimeMs: hEnc.durationMs,
      decTimeMs: hDec.durationMs,
      preview: hEnc.output.slice(0, 16) + (hEnc.output.length > 16 ? '...' : ''),
      keyspace: 'GL(2, ℤ₂₆) = 157,248',
      securityNote: 'Linear algebra mod 26; broken by Known-Plaintext Attack.'
    });

    // 5. Vigenère
    const vEnc = measure(() => runVigenere(text, benchmarkKeys.vigenere, true, true).result);
    const vDec = measure(() => runVigenere(vEnc.output, benchmarkKeys.vigenere, false, true).result);
    results.push({
      id: 'vigenere',
      name: 'Vigenère',
      category: 'Substitution',
      cardColor: '#FF7373',
      inputLen: text.length,
      outputLen: vEnc.output.length,
      encTimeMs: vEnc.durationMs,
      decTimeMs: vDec.durationMs,
      preview: vEnc.output.slice(0, 16) + (vEnc.output.length > 16 ? '...' : ''),
      keyspace: '26^m',
      securityNote: 'Defeated by Kasiski examination and Index of Coincidence.'
    });

    // 6. OTP
    const oEnc = measure(() => runOTP(text, benchmarkKeys.otp, true, true).result);
    const oDec = measure(() => runOTP(oEnc.output, benchmarkKeys.otp, false, true).result);
    results.push({
      id: 'otp',
      name: 'One-Time Pad',
      category: 'Substitution',
      cardColor: '#F0EDEC',
      inputLen: text.length,
      outputLen: oEnc.output.length,
      encTimeMs: oEnc.durationMs,
      decTimeMs: oDec.durationMs,
      preview: oEnc.output.slice(0, 16) + (oEnc.output.length > 16 ? '...' : ''),
      keyspace: '26^N',
      securityNote: 'Perfect mathematical secrecy when keys are random.'
    });

    // 7. Rail Fence
    const rEnc = measure(() => runRailFence(text, benchmarkKeys.railfence, true, true).result);
    const rDec = measure(() => runRailFence(rEnc.output, benchmarkKeys.railfence, false, true).result);
    results.push({
      id: 'railfence',
      name: 'Rail Fence',
      category: 'Transposition',
      cardColor: '#ECDCFF',
      inputLen: text.length,
      outputLen: rEnc.output.length,
      encTimeMs: rEnc.durationMs,
      decTimeMs: rDec.durationMs,
      preview: rEnc.output.slice(0, 16) + (rEnc.output.length > 16 ? '...' : ''),
      keyspace: 'Rails d ∈ [2..12]',
      securityNote: 'Preserves character frequencies; weak to rail depth scanning.'
    });

    // 8. Columnar
    const colEnc = measure(() => runColumnar(text, benchmarkKeys.columnar, true, true).result);
    const colDec = measure(() => runColumnar(colEnc.output, benchmarkKeys.columnar, false, true).result);
    results.push({
      id: 'columnar',
      name: 'Columnar',
      category: 'Transposition',
      cardColor: '#E4F98E',
      inputLen: text.length,
      outputLen: colEnc.output.length,
      encTimeMs: colEnc.durationMs,
      decTimeMs: colDec.durationMs,
      preview: colEnc.output.slice(0, 16) + (colEnc.output.length > 16 ? '...' : ''),
      keyspace: 'K! permutations',
      securityNote: 'Permutes columns; vulnerable to anagramming.'
    });

    return results;
  }, [testPayload, benchmarkKeys]);

  if (!isOpen) return null;

  const filtered = benchmarkResults.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.securityNote.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#111111]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl border-2 border-[#111111] shadow-[6px_6px_0px_#111111] max-w-5xl w-full p-5 my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#111111]">
          <h3 className="font-headline-lg text-xl font-bold text-[#111111]">
            Compare Ciphers
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border-2 border-[#111111] bg-[#F0EDEC] text-[#111111] font-bold flex items-center justify-center hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Payload Input & Search */}
        <div className="py-3 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-8">
            <input
              type="text"
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value.toUpperCase())}
              placeholder="Test message..."
              className="w-full bg-[#FFF8EE] rounded-lg border-2 border-[#111111] px-3 py-1.5 font-code-md text-xs sm:text-sm font-bold focus:outline-none"
            />
          </div>
          <div className="sm:col-span-4">
            <input
              type="text"
              placeholder="Filter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F0EDEC] rounded-lg border-2 border-[#111111] px-3 py-1.5 font-code-md text-xs font-bold focus:outline-none"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto flex-1 border-2 border-[#111111] rounded-xl">
          <table className="w-full text-left text-xs font-code-md">
            <thead className="bg-[#FFE066] border-b-2 border-[#111111] text-[#111111] uppercase font-bold sticky top-0">
              <tr>
                <th className="p-2.5">Cipher</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Enc Time</th>
                <th className="p-2.5">Dec Time</th>
                <th className="p-2.5">Keyspace</th>
                <th className="p-2.5">Security Note</th>
                <th className="p-2.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111111]">
              {filtered.map((cipher) => (
                <tr key={cipher.id} className="hover:bg-[#FFF8EE] transition-colors">
                  <td className="p-2.5 font-bold text-[#111111] whitespace-nowrap">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 border border-[#111111]"
                      style={{ backgroundColor: cipher.cardColor }}
                    ></span>
                    {cipher.name}
                  </td>
                  <td className="p-2.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded border border-[#111111] bg-[#F0EDEC] text-[10px] font-bold">
                      {cipher.category}
                    </span>
                  </td>
                  <td className="p-2.5 whitespace-nowrap font-bold text-[#BA1A1A]">
                    {cipher.encTimeMs} ms
                  </td>
                  <td className="p-2.5 whitespace-nowrap font-bold text-[#006A65]">
                    {cipher.decTimeMs} ms
                  </td>
                  <td className="p-2.5 text-[#4C4736] whitespace-nowrap">
                    {cipher.keyspace}
                  </td>
                  <td className="p-2.5 text-[#4C4736] text-[11px] min-w-[200px]">
                    {cipher.securityNote}
                  </td>
                  <td className="p-2.5 whitespace-nowrap">
                    <button
                      onClick={() => {
                        onSelectCipher(cipher.id);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded bg-[#111111] text-[#FFE066] font-bold text-xs hover:bg-[#FFE066] hover:text-[#111111] border border-[#111111] transition-colors cursor-pointer"
                    >
                      Use
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
