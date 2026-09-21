import React, { useState, useEffect } from 'react';
import { CipherId, CipherResult } from '../types';
import {
  runCaesar,
  runMonoalphabetic,
  runPlayfair,
  runHill,
  runVigenere,
  runOTP,
  generateRandomPad,
  runRailFence,
  runColumnar,
  generatePlayfairMatrix,
  ALPHABET,
  det2x2,
  gcd
} from '../utils/cryptoEngines';
import { SAMPLE_TEXTS } from '../data/ciphersData';

interface WorkspaceSectionProps {
  currentAlgorithm: CipherId;
  onAlgorithmChange: (id: CipherId) => void;
  onShowToast: (msg: string) => void;
}

export const WorkspaceSection: React.FC<WorkspaceSectionProps> = ({
  currentAlgorithm,
  onAlgorithmChange,
  onShowToast,
}) => {
  const [plaintext, setPlaintext] = useState('NETWORK SECURITY');
  const [keepSpaces, setKeepSpaces] = useState(true);
  const [isEncryptMode, setIsEncryptMode] = useState(true);
  const [copyState, setCopyState] = useState('Copy');

  // Algorithm-specific state
  const [caesarShift, setCaesarShift] = useState(3);
  const [vigenereKey, setVigenereKey] = useState('CIPHER');
  const [playfairKey, setPlayfairKey] = useState('MONARCHY');
  const [railCount, setRailCount] = useState(3);
  const [hillMatrix, setHillMatrix] = useState<[number, number, number, number]>([9, 4, 5, 7]);
  const [monoKey, setMonoKey] = useState('QWERTYUIOPASDFGHJKLZXCVBNM');
  const [otpKey, setOtpKey] = useState('XMCKLPOIUYTREWQASDFGHJKLMN');
  const [columnarKey, setColumnarKey] = useState('MATH');

  // Compute cipher output
  const [cipherOutput, setCipherOutput] = useState<CipherResult>({
    result: '',
    trace: [],
    equation: '',
    keyspace: '',
    timeComplexity: ''
  });

  const runCurrentEngine = (encrypt: boolean) => {
    setIsEncryptMode(encrypt);
    let out: CipherResult;

    switch (currentAlgorithm) {
      case 'caesar':
        out = runCaesar(plaintext, caesarShift, encrypt, keepSpaces);
        break;
      case 'mono':
        out = runMonoalphabetic(plaintext, monoKey, encrypt, keepSpaces);
        break;
      case 'playfair':
        out = runPlayfair(plaintext, playfairKey, encrypt, keepSpaces);
        break;
      case 'hill':
        out = runHill(plaintext, hillMatrix, encrypt, keepSpaces);
        break;
      case 'vigenere':
        out = runVigenere(plaintext, vigenereKey, encrypt, keepSpaces);
        break;
      case 'otp':
        out = runOTP(plaintext, otpKey, encrypt, keepSpaces);
        break;
      case 'railfence':
        out = runRailFence(plaintext, railCount, encrypt, keepSpaces);
        break;
      case 'columnar':
        out = runColumnar(plaintext, columnarKey, encrypt, keepSpaces);
        break;
      default:
        out = runCaesar(plaintext, 3, encrypt, keepSpaces);
    }

    setCipherOutput(out);
  };

  useEffect(() => {
    runCurrentEngine(isEncryptMode);
  }, [
    plaintext,
    currentAlgorithm,
    caesarShift,
    vigenereKey,
    playfairKey,
    railCount,
    hillMatrix,
    monoKey,
    otpKey,
    columnarKey,
    keepSpaces,
    isEncryptMode
  ]);

  const handleCopy = () => {
    if (!cipherOutput.result) return;
    navigator.clipboard.writeText(cipherOutput.result).then(() => {
      setCopyState('Copied!');
      onShowToast('Copied to clipboard');
      setTimeout(() => setCopyState('Copy'), 2000);
    }).catch(() => {
      setCopyState('Copied!');
      setTimeout(() => setCopyState('Copy'), 2000);
    });
  };

  const handleLoadSample = () => {
    const randomSample = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setPlaintext(randomSample);
    onShowToast(`Loaded sample`);
  };

  const handleClear = () => {
    setPlaintext('');
    onShowToast('Cleared input');
  };

  const handleSwap = () => {
    if (cipherOutput.result && !cipherOutput.result.startsWith('[')) {
      setPlaintext(cipherOutput.result);
      setIsEncryptMode(!isEncryptMode);
      onShowToast('Swapped output to input');
    }
  };

  const handleDownloadOutput = () => {
    if (!cipherOutput.result) return;
    const blob = new Blob([cipherOutput.result], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentAlgorithm}_${isEncryptMode ? 'cipher' : 'plain'}_output.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Download started');
  };

  const shuffleMono = () => {
    const letters = ALPHABET.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    const newKey = letters.join('');
    setMonoKey(newKey);
    onShowToast('Generated alphabet key');
  };

  const resetMono = () => {
    setMonoKey(ALPHABET);
    onShowToast('Reset key to A-Z');
  };

  const generateNewOtp = () => {
    const cleanLetters = plaintext.replace(/[^A-Za-z]/g, '');
    const neededLen = Math.max(30, cleanLetters.length);
    const rand = generateRandomPad(neededLen);
    setOtpKey(rand);
    onShowToast(`Generated ${neededLen}-char random pad`);
  };

  const hillDet = det2x2(hillMatrix);
  const isHillInvertible = gcd(hillDet, 26) === 1 && hillDet !== 0;

  const allCiphers: { id: CipherId; label: string }[] = [
    { id: 'caesar', label: 'Caesar' },
    { id: 'vigenere', label: 'Vigenère' },
    { id: 'playfair', label: 'Playfair' },
    { id: 'hill', label: 'Hill 2×2' },
    { id: 'railfence', label: 'Rail Fence' },
    { id: 'columnar', label: 'Columnar' },
    { id: 'mono', label: 'Monoalphabetic' },
    { id: 'otp', label: 'One-Time Pad' },
  ];

  return (
    <section className="w-full pt-4 pb-12" id="interactive-suite">
      <div className="w-full bg-white rounded-2xl border-2 border-[#111111] shadow-[6px_6px_0px_#111111] overflow-hidden">
        {/* Workspace Navigation Bar */}
        <div className="bg-[#FFE066] p-4 border-b-2 border-[#111111] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-headline-md text-lg text-[#111111] font-bold">
              Workspace
            </span>
          </div>

          {/* Cipher Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {allCiphers.map((tab) => {
              const active = currentAlgorithm === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => onAlgorithmChange(tab.id)}
                  className={`px-3 py-1.5 rounded-lg border-2 border-[#111111] text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#111111] text-[#FFE066] shadow-[2px_2px_0px_#111111]'
                      : 'bg-white text-[#111111] hover:bg-[#F0EDEC]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Validation Error Alert */}
        {cipherOutput.error && (
          <div className="mx-6 mt-4 p-3 bg-[#FF7373] text-[#111111] rounded-xl border-2 border-[#111111] font-code-md text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">warning</span>
            <span>{cipherOutput.error}</span>
          </div>
        )}

        {/* Two-Column Studio Layout */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel: Input & Key Controls */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              {/* Input Header */}
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="plaintext-input"
                  className="font-headline-sm text-sm uppercase text-[#111111] font-bold"
                >
                  {isEncryptMode ? 'Plaintext' : 'Ciphertext'}
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-code-md text-xs px-2 py-0.5 rounded bg-[#F0EDEC] border border-[#111111]">
                    {plaintext.length} chars
                  </span>
                  <button
                    onClick={handleLoadSample}
                    className="text-xs font-semibold underline text-[#4C4736] hover:text-[#111111] cursor-pointer"
                  >
                    Sample
                  </button>
                  <button
                    onClick={handleClear}
                    className="text-xs font-semibold underline text-[#4C4736] hover:text-[#111111] cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                id="plaintext-input"
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value.toUpperCase())}
                placeholder={isEncryptMode ? 'Type text to encrypt...' : 'Paste ciphertext to decrypt...'}
                rows={4}
                className="w-full bg-[#FFF8EE] rounded-xl border-2 border-[#111111] p-3 font-code-lg text-base text-[#111111] uppercase focus:outline-none shadow-[2px_2px_0px_#111111] resize-none"
              />
            </div>

            {/* Key Configuration Controls */}
            <div className="p-3.5 rounded-xl border-2 border-[#111111] bg-white shadow-[2px_2px_0px_#111111] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#111111]">
                  {currentAlgorithm === 'caesar' && 'Shift Key (0-25)'}
                  {currentAlgorithm === 'vigenere' && 'Keyword'}
                  {currentAlgorithm === 'playfair' && 'Matrix Keyword'}
                  {currentAlgorithm === 'railfence' && 'Rails (2-12)'}
                  {currentAlgorithm === 'hill' && `2×2 Matrix Key (det = ${hillDet})`}
                  {currentAlgorithm === 'mono' && 'Alphabet Key (26 letters)'}
                  {currentAlgorithm === 'otp' && 'Keystream Pad'}
                  {currentAlgorithm === 'columnar' && 'Columnar Keyword'}
                </label>

                {/* Keep Spaces Checkbox */}
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#4C4736]">
                  <input
                    id="preserve-spaces"
                    type="checkbox"
                    checked={keepSpaces}
                    onChange={(e) => setKeepSpaces(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border border-[#111111] accent-[#111111] cursor-pointer"
                  />
                  <span>
                    {currentAlgorithm === 'playfair' || currentAlgorithm === 'hill'
                      ? 'Space Between Pairs'
                      : 'Keep Spaces'}
                  </span>
                </label>
              </div>

              {/* Caesar controls */}
              {currentAlgorithm === 'caesar' && (
                <div className="flex items-center gap-2">
                  <input
                    id="key-input-caesar"
                    type="number"
                    min="0"
                    max="25"
                    value={caesarShift}
                    onChange={(e) => setCaesarShift(Math.max(0, Math.min(25, parseInt(e.target.value, 10) || 0)))}
                    className="w-24 bg-[#F0EDEC] rounded-lg border-2 border-[#111111] px-3 py-1 font-code-lg text-base font-bold text-[#111111] focus:outline-none text-center"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCaesarShift((prev) => (prev > 0 ? prev - 1 : 25))}
                      className="w-8 h-8 rounded-lg border-2 border-[#111111] bg-white flex items-center justify-center font-bold text-base hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setCaesarShift((prev) => (prev + 1) % 26)}
                      className="w-8 h-8 rounded-lg border-2 border-[#111111] bg-white flex items-center justify-center font-bold text-base hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex gap-1 ml-auto text-xs font-semibold">
                    <button
                      onClick={() => setCaesarShift(3)}
                      className="px-2.5 py-1 bg-[#F0EDEC] rounded-lg border border-[#111111] hover:bg-[#FFE066]"
                    >
                      Shift 3
                    </button>
                    <button
                      onClick={() => setCaesarShift(13)}
                      className="px-2.5 py-1 bg-[#F0EDEC] rounded-lg border border-[#111111] hover:bg-[#FFE066]"
                    >
                      ROT13
                    </button>
                  </div>
                </div>
              )}

              {/* Vigenere controls */}
              {currentAlgorithm === 'vigenere' && (
                <div className="flex items-center gap-2">
                  <input
                    id="key-input-vigenere"
                    type="text"
                    value={vigenereKey}
                    onChange={(e) => setVigenereKey(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#F0EDEC] rounded-lg border-2 border-[#111111] px-3 py-1.5 font-code-lg text-sm font-bold text-[#111111] focus:outline-none"
                    placeholder="KEYWORD"
                  />
                  <div className="flex gap-1 text-xs font-semibold">
                    <button
                      onClick={() => setVigenereKey('LEMON')}
                      className="px-2.5 py-1 bg-[#F0EDEC] rounded-lg border border-[#111111] hover:bg-[#FFE066]"
                    >
                      LEMON
                    </button>
                    <button
                      onClick={() => setVigenereKey('CIPHER')}
                      className="px-2.5 py-1 bg-[#F0EDEC] rounded-lg border border-[#111111] hover:bg-[#FFE066]"
                    >
                      CIPHER
                    </button>
                  </div>
                </div>
              )}

              {/* Playfair controls */}
              {currentAlgorithm === 'playfair' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      id="key-input-playfair"
                      type="text"
                      value={playfairKey}
                      onChange={(e) => setPlayfairKey(e.target.value.toUpperCase())}
                      className="flex-1 bg-[#F0EDEC] rounded-lg border-2 border-[#111111] px-3 py-1.5 font-code-lg text-sm font-bold text-[#111111] focus:outline-none"
                      placeholder="KEYWORD"
                    />
                    <button
                      onClick={() => setPlayfairKey('MONARCHY')}
                      className="px-2.5 py-1 bg-[#F0EDEC] rounded-lg border border-[#111111] text-xs font-semibold hover:bg-[#FFE066]"
                    >
                      MONARCHY
                    </button>
                  </div>
                  {/* Compact 5x5 Matrix Preview */}
                  <div className="grid grid-cols-5 gap-0.5 text-center font-code-md text-xs font-bold pt-1">
                    {generatePlayfairMatrix(playfairKey).flat().map((letter, idx) => (
                      <span key={idx} className="p-1 rounded bg-[#F0EDEC] border border-[#111111]">
                        {letter}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rail Fence controls */}
              {currentAlgorithm === 'railfence' && (
                <div className="flex items-center gap-2">
                  <input
                    id="key-input-railfence"
                    type="number"
                    min="2"
                    max="12"
                    value={railCount}
                    onChange={(e) => setRailCount(Math.max(2, Math.min(12, parseInt(e.target.value, 10) || 2)))}
                    className="w-24 bg-[#F0EDEC] rounded-lg border-2 border-[#111111] px-3 py-1 font-code-lg text-base font-bold text-[#111111] focus:outline-none text-center"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setRailCount((prev) => Math.max(2, prev - 1))}
                      className="w-8 h-8 rounded-lg border-2 border-[#111111] bg-white flex items-center justify-center font-bold text-base hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setRailCount((prev) => Math.min(12, prev + 1))}
                      className="w-8 h-8 rounded-lg border-2 border-[#111111] bg-white flex items-center justify-center font-bold text-base hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Hill 2x2 controls */}
              {currentAlgorithm === 'hill' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((idx) => (
                      <input
                        key={idx}
                        type="number"
                        value={hillMatrix[idx]}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          const updated = [...hillMatrix] as [number, number, number, number];
                          updated[idx] = val;
                          setHillMatrix(updated);
                        }}
                        className="w-full bg-[#F0EDEC] rounded-lg border-2 border-[#111111] p-1.5 text-center font-code-md text-xs font-bold"
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className={isHillInvertible ? 'text-[#006A65]' : 'text-[#BA1A1A]'}>
                      {isHillInvertible ? 'Invertible (Valid Key)' : 'Non-coprime (Invalid Key)'}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setHillMatrix([9, 4, 5, 7])}
                        className="px-2 py-0.5 bg-[#F0EDEC] rounded border border-[#111111]"
                      >
                        [9, 4; 5, 7]
                      </button>
                      <button
                        onClick={() => setHillMatrix([3, 3, 2, 5])}
                        className="px-2 py-0.5 bg-[#F0EDEC] rounded border border-[#111111]"
                      >
                        [3, 3; 2, 5]
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Monoalphabetic controls */}
              {currentAlgorithm === 'mono' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    maxLength={26}
                    value={monoKey}
                    onChange={(e) => setMonoKey(e.target.value.toUpperCase())}
                    className="w-full bg-[#F0EDEC] rounded-lg border-2 border-[#111111] px-2.5 py-1.5 font-code-md text-xs font-bold"
                  />
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <button
                      onClick={shuffleMono}
                      className="px-2.5 py-1 bg-[#FFE066] rounded-lg border border-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
                    >
                      Randomize Alphabet
                    </button>
                    <button
                      onClick={resetMono}
                      className="px-2.5 py-1 bg-[#F0EDEC] rounded-lg border border-[#111111] hover:bg-white"
                    >
                      Reset A-Z
                    </button>
                  </div>
                </div>
              )}

              {/* One-Time Pad controls */}
              {currentAlgorithm === 'otp' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={otpKey}
                    onChange={(e) => setOtpKey(e.target.value.toUpperCase())}
                    className="w-full bg-[#F0EDEC] rounded-lg border-2 border-[#111111] px-2.5 py-1.5 font-code-md text-xs font-bold"
                    placeholder="Keystream Pad"
                  />
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <button
                      onClick={generateNewOtp}
                      className="px-2.5 py-1 bg-[#B8F28B] rounded-lg border border-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
                    >
                      Generate Matching Pad
                    </button>
                    <span className="text-[#4C4736]">
                      {otpKey.length >= plaintext.replace(/[^A-Za-z]/g, '').length ? 'Sufficient length' : 'Pad too short'}
                    </span>
                  </div>
                </div>
              )}

              {/* Columnar controls */}
              {currentAlgorithm === 'columnar' && (
                <div>
                  <input
                    type="text"
                    value={columnarKey}
                    onChange={(e) => setColumnarKey(e.target.value.toUpperCase())}
                    className="w-full bg-[#F0EDEC] rounded-lg border-2 border-[#111111] px-3 py-1.5 font-code-lg text-sm font-bold text-[#111111] focus:outline-none"
                    placeholder="KEYWORD"
                  />
                </div>
              )}

              {(currentAlgorithm === 'playfair' || currentAlgorithm === 'hill') && (
                <div className="text-[11px] text-[#4C4736] bg-[#F0EDEC] p-2 rounded-lg border border-[#111111]">
                  <strong>Digraph Cipher Note:</strong> Encrypts 2-letter pairs. Odd-length inputs are automatically padded with 'X'.
                </div>
              )}
            </div>

            {/* Mode & Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 flex rounded-xl border-2 border-[#111111] overflow-hidden p-0.5 bg-[#F0EDEC]">
                <button
                  id="btn-encrypt"
                  onClick={() => runCurrentEngine(true)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                    isEncryptMode
                      ? 'bg-[#111111] text-[#FFE066] shadow-[1px_1px_0px_#111111]'
                      : 'text-[#4C4736] hover:text-[#111111]'
                  }`}
                >
                  Encrypt
                </button>
                <button
                  id="btn-decrypt"
                  onClick={() => runCurrentEngine(false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                    !isEncryptMode
                      ? 'bg-[#111111] text-[#FFE066] shadow-[1px_1px_0px_#111111]'
                      : 'text-[#4C4736] hover:text-[#111111]'
                  }`}
                >
                  Decrypt
                </button>
              </div>

              <button
                id="btn-swap-text"
                onClick={handleSwap}
                className="p-2.5 rounded-xl border-2 border-[#111111] bg-white text-[#111111] shadow-[2px_2px_0px_#111111] hover:bg-[#FFE066] transition-colors cursor-pointer"
                title="Swap Output to Input"
              >
                <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
              </button>

              <button
                id="btn-download-output"
                onClick={handleDownloadOutput}
                className="p-2.5 rounded-xl border-2 border-[#111111] bg-white text-[#111111] shadow-[2px_2px_0px_#111111] hover:bg-[#5ED9D1] transition-colors cursor-pointer"
                title="Download Output"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
              </button>
            </div>
          </div>

          {/* Right Panel: Output & Trace */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              {/* Output Header */}
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="output-box"
                  className="font-headline-sm text-sm uppercase text-[#111111] font-bold"
                >
                  {isEncryptMode ? 'Ciphertext' : 'Plaintext'}
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-code-md text-xs px-2 py-0.5 rounded bg-[#F0EDEC] border border-[#111111]">
                    {cipherOutput.result ? `${cipherOutput.result.length} chars` : '0 chars'}
                  </span>
                  <button
                    id="btn-copy-output"
                    onClick={handleCopy}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FFE066] border border-[#111111] shadow-[1px_1px_0px_#111111] hover:bg-[#111111] hover:text-[#FFE066] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    <span id="copy-btn-text">{copyState}</span>
                  </button>
                </div>
              </div>

              {/* Output Display Box */}
              <div
                id="output-box"
                className={`w-full min-h-[140px] rounded-xl border-2 border-[#111111] p-3.5 font-code-lg text-base text-[#111111] uppercase shadow-[2px_2px_0px_#111111] select-all tracking-wider font-bold overflow-x-auto break-all ${
                  cipherOutput.error ? 'bg-[#FF7373]/20 text-[#BA1A1A]' : 'bg-[#FFF8EE]'
                }`}
              >
                {cipherOutput.result || ''}
              </div>
            </div>

            {/* Trace preview */}
            {cipherOutput.trace && cipherOutput.trace.length > 0 && (
              <div className="bg-[#F0EDEC] rounded-xl border-2 border-[#111111] p-3">
                <div className="text-xs font-bold text-[#4C4736] mb-2">
                  Step Trace
                </div>
                <div
                  id="trace-preview"
                  className="grid grid-cols-4 sm:grid-cols-6 gap-1 text-center font-code-md text-xs"
                >
                  {cipherOutput.trace.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-1 rounded bg-white border border-[#111111]"
                    >
                      <span className="text-[#4C4736] font-bold">{t.from}</span>
                      <span className="text-[#BA1A1A] font-bold ml-1">→ {t.to}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
