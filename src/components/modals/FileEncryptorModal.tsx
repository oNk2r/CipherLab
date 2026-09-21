import React, { useState, useRef, useEffect } from 'react';
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
  runColumnar,
  det2x2,
} from '../../utils/cryptoEngines';
import { SAMPLE_FILE_PRESETS, SampleFileItem } from '../../data/sampleFiles';

interface FileEncryptorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const FileEncryptorModal: React.FC<FileEncryptorModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [fileName, setFileName] = useState('classified_dispatch.txt');
  const [fileContent, setFileContent] = useState('');
  const [selectedCipher, setSelectedCipher] = useState<CipherId>('caesar');
  const [processedContent, setProcessedContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastExecutionMs, setLastExecutionMs] = useState<number | null>(null);
  const [lastMode, setLastMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [activeSampleId, setActiveSampleId] = useState<string | null>('dispatch');
  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  // Key configurations for each cipher
  const [caesarShift, setCaesarShift] = useState('3');
  const [monoKey, setMonoKey] = useState('QWERTYUIOPASDFGHJKLZXCVBNM');
  const [playfairKey, setPlayfairKey] = useState('MONARCHY');
  const [hillMatrix, setHillMatrix] = useState<[number, number, number, number]>([9, 4, 5, 7]);
  const [vigenereKey, setVigenereKey] = useState('CIPHER');
  const [otpKey, setOtpKey] = useState('');
  const [railCount, setRailCount] = useState('3');
  const [columnarKey, setColumnarKey] = useState('MATH');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Preload first sample file on open if content is empty
  useEffect(() => {
    if (isOpen && !fileContent) {
      const defaultSample = SAMPLE_FILE_PRESETS[0];
      setFileName(defaultSample.filename);
      setFileContent(defaultSample.content);
      setActiveSampleId(defaultSample.id);
      const cleanLen = defaultSample.content.replace(/[^A-Za-z]/g, '').length;
      setOtpKey(generateRandomPad(Math.max(64, cleanLen)));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getCleanLetterCount = (text: string) => text.replace(/[^A-Za-z]/g, '').length;

  const handleLoadSample = (sample: SampleFileItem) => {
    setFileName(sample.filename);
    setFileContent(sample.content);
    setActiveSampleId(sample.id);
    setProcessedContent('');
    setLastExecutionMs(null);

    // Apply recommended cipher & key if preset defines them
    if (sample.recommendedCipher) {
      const c = sample.recommendedCipher as CipherId;
      setSelectedCipher(c);
      if (c === 'caesar' && typeof sample.recommendedKey === 'number') {
        setCaesarShift(String(sample.recommendedKey));
      } else if (c === 'vigenere' && typeof sample.recommendedKey === 'string') {
        setVigenereKey(sample.recommendedKey);
      } else if (c === 'railfence' && typeof sample.recommendedKey === 'number') {
        setRailCount(String(sample.recommendedKey));
      }
    }

    // Ensure OTP pad matches length if currently on or switching to OTP
    const cleanLen = getCleanLetterCount(sample.content);
    setOtpKey(generateRandomPad(Math.max(64, cleanLen)));

    onShowToast(`Loaded sample: ${sample.filename}`);
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    setActiveSampleId(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      setFileContent(text);
      setProcessedContent('');
      setLastExecutionMs(null);

      const cleanLen = getCleanLetterCount(text);
      setOtpKey(generateRandomPad(Math.max(64, cleanLen)));

      onShowToast(`Loaded file: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleGeneratePad = () => {
    const cleanLen = getCleanLetterCount(fileContent);
    const len = Math.max(64, cleanLen);
    const pad = generateRandomPad(len);
    setOtpKey(pad);
    onShowToast(`Generated ${len}-character random pad`);
  };

  const handleProcess = (encrypt: boolean) => {
    const trimmed = fileContent.trim();
    if (!trimmed) {
      onShowToast('Please enter text or load a sample file first');
      return;
    }

    // Auto-fix OTP key if too short for current message
    let activeOtpKey = otpKey;
    if (selectedCipher === 'otp') {
      const cleanLen = getCleanLetterCount(fileContent);
      const cleanPad = otpKey.replace(/[^A-Za-z]/g, '');
      if (cleanPad.length < cleanLen) {
        activeOtpKey = generateRandomPad(Math.max(64, cleanLen));
        setOtpKey(activeOtpKey);
        onShowToast(`Auto-extended OTP pad to ${activeOtpKey.length} characters`);
      }
    }

    setIsProcessing(true);
    setLastMode(encrypt ? 'encrypt' : 'decrypt');

    setTimeout(() => {
      const t0 = performance.now();
      let output = '';
      let errorMsg: string | undefined;

      switch (selectedCipher) {
        case 'caesar': {
          const shift = parseInt(caesarShift, 10);
          const res = runCaesar(fileContent, isNaN(shift) ? 3 : shift, encrypt, true);
          output = res.result;
          errorMsg = res.error;
          break;
        }
        case 'mono': {
          const res = runMonoalphabetic(fileContent, monoKey, encrypt, true);
          output = res.result;
          errorMsg = res.error;
          break;
        }
        case 'playfair': {
          const res = runPlayfair(fileContent, playfairKey, encrypt, true);
          output = res.result;
          errorMsg = res.error;
          break;
        }
        case 'hill': {
          const res = runHill(fileContent, hillMatrix, encrypt, true);
          output = res.result;
          errorMsg = res.error;
          break;
        }
        case 'vigenere': {
          const res = runVigenere(fileContent, vigenereKey, encrypt, true);
          output = res.result;
          errorMsg = res.error;
          break;
        }
        case 'otp': {
          const res = runOTP(fileContent, activeOtpKey, encrypt, true);
          output = res.result;
          errorMsg = res.error;
          break;
        }
        case 'railfence': {
          const r = parseInt(railCount, 10) || 3;
          const res = runRailFence(fileContent, r, encrypt, true);
          output = res.result;
          errorMsg = res.error;
          break;
        }
        case 'columnar': {
          const res = runColumnar(fileContent, columnarKey, encrypt, true);
          output = res.result;
          errorMsg = res.error;
          break;
        }
      }

      const t1 = performance.now();
      setIsProcessing(false);
      setLastExecutionMs(Number((t1 - t0).toFixed(2)));

      if (errorMsg) {
        onShowToast(`Error: ${errorMsg}`);
        setProcessedContent(`[Error]: ${errorMsg}`);
      } else {
        setProcessedContent(output);
        onShowToast(encrypt ? 'Encryption complete!' : 'Decryption complete!');
      }
    }, 40);
  };

  const handleTransferOutputToInput = () => {
    if (!processedContent) return;
    setFileContent(processedContent);
    const prefix = lastMode === 'encrypt' ? 'encrypted' : 'decrypted';
    const baseName = fileName ? fileName.replace(/\.[^/.]+$/, '') : 'file';
    setFileName(`${prefix}_${baseName}.txt`);
    setActiveSampleId(null);
    setProcessedContent('');
    setLastExecutionMs(null);
    onShowToast('Output transferred to input! Click Decrypt or Encrypt to process.');
  };

  const handleClear = () => {
    setFileContent('');
    setFileName('');
    setActiveSampleId(null);
    setProcessedContent('');
    setLastExecutionMs(null);
    onShowToast('Cleared input');
  };

  const handleCopyInput = () => {
    if (!fileContent) return;
    navigator.clipboard.writeText(fileContent);
    setCopiedInput(true);
    onShowToast('Copied input text to clipboard');
    setTimeout(() => setCopiedInput(false), 1800);
  };

  const handleCopyOutput = () => {
    if (!processedContent) return;
    navigator.clipboard.writeText(processedContent);
    setCopiedOutput(true);
    onShowToast('Copied output text to clipboard');
    setTimeout(() => setCopiedOutput(false), 1800);
  };

  const handleDownload = () => {
    if (!processedContent) return;
    const blob = new Blob([processedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const modePrefix = lastMode === 'encrypt' ? 'encrypted' : 'decrypted';
    const baseName = fileName ? fileName.replace(/\.[^/.]+$/, '') : 'file';
    const ext = fileName && fileName.includes('.') ? fileName.split('.').pop() : 'txt';
    a.download = `cipherlab_${modePrefix}_${baseName}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast(`Downloaded: cipherlab_${modePrefix}_${baseName}.${ext}`);
  };

  const handleDownloadKeyPad = () => {
    if (!otpKey) return;
    const blob = new Blob([otpKey], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `otp_key_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Saved OTP key file');
  };

  const charCount = fileContent.length;
  const wordCount = fileContent.trim() ? fileContent.trim().split(/\s+/).length : 0;
  const lineCount = fileContent ? fileContent.split('\n').length : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#111111]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl border-2 border-[#111111] shadow-[8px_8px_0px_#111111] max-w-3xl w-full p-5 sm:p-6 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#111111]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-2xl text-[#111111] p-1.5 rounded-lg bg-[#B8F28B] border border-[#111111]">
              folder_managed
            </span>
            <div>
              <h3 className="font-headline-lg text-lg sm:text-xl font-bold text-[#111111]">
                File Encryptor &amp; Batch Processor
              </h3>
              <p className="text-[11px] text-[#4C4736] font-semibold">
                Client-side text processing • Instant sample files • Zero server data transfer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border-2 border-[#111111] bg-[#F0EDEC] text-[#111111] font-bold flex items-center justify-center hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Sample Files Presets Bar */}
          <div className="bg-[#FFF8EE] p-3 rounded-xl border-2 border-[#111111]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-headline-sm text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#FF7373]">
                  dataset
                </span>
                Sample Files &amp; Texts:
              </span>
              <span className="text-[10px] text-[#4C4736] font-semibold">
                Click to load instantly
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_FILE_PRESETS.map((sample) => {
                const isSelected = activeSampleId === sample.id;
                return (
                  <button
                    key={sample.id}
                    onClick={() => handleLoadSample(sample)}
                    className={`text-left p-2 rounded-lg border-2 border-[#111111] text-xs font-bold transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#FFE066] shadow-[2px_2px_0px_#111111]'
                        : 'bg-white hover:bg-[#F0EDEC]'
                    }`}
                    title={sample.description}
                  >
                    <span className="truncate block font-bold text-[#111111]">
                      📄 {sample.name}
                    </span>
                    <span className="text-[10px] text-[#4C4736] font-normal truncate mt-0.5">
                      {sample.filename}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Dropzone & File Status */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files?.[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            className={`border-2 border-dashed border-[#111111] rounded-xl p-3.5 text-center cursor-pointer transition-colors flex items-center justify-center gap-3 ${
              isDragOver ? 'bg-[#FFE066]' : 'bg-[#F0EDEC]/50 hover:bg-[#FFE066]/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv,.log,.md,.json"
              className="hidden"
              onClick={(e) => {
                (e.target as HTMLInputElement).value = '';
              }}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <span className="material-symbols-outlined text-2xl text-[#111111]">
              cloud_upload
            </span>
            <div className="text-left">
              <p className="font-headline-sm text-xs font-bold text-[#111111]">
                {fileName
                  ? `Loaded File: ${fileName}`
                  : 'Drop your own text file (.txt, .md, .csv, .json) or click to browse'}
              </p>
              <p className="text-[10px] text-[#4C4736]">
                Upload local file, edit below, or pick a sample preset above
              </p>
            </div>
          </div>

          {/* Text Content Editor & Viewer */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                  File Content / Input Text
                </label>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F0EDEC] border border-[#111111]">
                  {charCount} chars • {wordCount} words • {lineCount} lines
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyInput}
                  disabled={!fileContent}
                  className="px-2 py-0.5 bg-white rounded border border-[#111111] text-[11px] font-bold hover:bg-[#F0EDEC] disabled:opacity-40 cursor-pointer"
                >
                  {copiedInput ? '✓ Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleClear}
                  disabled={!fileContent && !fileName}
                  className="px-2 py-0.5 bg-white rounded border border-[#111111] text-[11px] font-bold hover:bg-[#FF7373] hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
            <textarea
              rows={4}
              value={fileContent}
              onChange={(e) => {
                setFileContent(e.target.value);
                if (!fileName) setFileName('scratchpad.txt');
                setActiveSampleId(null);
                if (selectedCipher === 'otp') {
                  const cleanLen = getCleanLetterCount(e.target.value);
                  if (cleanLen > otpKey.length) {
                    setOtpKey(generateRandomPad(Math.max(64, cleanLen)));
                  }
                }
              }}
              placeholder="Type or paste file text here, or click any sample file above..."
              className="w-full bg-[#FFF8EE] rounded-xl border-2 border-[#111111] p-3 font-code-md text-xs sm:text-sm text-[#111111] focus:outline-none focus:bg-white transition-colors resize-y"
            />
          </div>

          {/* Cipher Selection & Key Configuration */}
          <div className="bg-[#F0EDEC] p-3.5 rounded-xl border-2 border-[#111111]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#111111] block mb-1 font-bold uppercase tracking-wider">
                  Cipher Algorithm
                </label>
                <select
                  value={selectedCipher}
                  onChange={(e) => {
                    const c = e.target.value as CipherId;
                    setSelectedCipher(c);
                    if (c === 'otp') {
                      const cleanLen = getCleanLetterCount(fileContent);
                      if (!otpKey || otpKey.length < cleanLen) {
                        setOtpKey(generateRandomPad(Math.max(64, cleanLen)));
                      }
                    }
                  }}
                  className="w-full bg-white rounded-lg border-2 border-[#111111] p-2 text-xs font-bold cursor-pointer"
                >
                  <option value="caesar">Caesar Shift</option>
                  <option value="vigenere">Vigenère Cipher</option>
                  <option value="playfair">Playfair Cipher</option>
                  <option value="hill">Hill 2×2 Matrix</option>
                  <option value="railfence">Rail Fence Transposition</option>
                  <option value="columnar">Columnar Transposition</option>
                  <option value="mono">Monoalphabetic Substitution</option>
                  <option value="otp">One-Time Pad (Vernam)</option>
                </select>
              </div>

              {/* Adaptive Key Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-[#111111] font-bold uppercase tracking-wider">
                    {selectedCipher === 'caesar' && 'Shift Key (0-25)'}
                    {selectedCipher === 'mono' && 'Key Alphabet (26 unique letters)'}
                    {selectedCipher === 'playfair' && 'Keyword'}
                    {selectedCipher === 'hill' && `Matrix Key [a,b,c,d] (det=${det2x2(hillMatrix)})`}
                    {selectedCipher === 'vigenere' && 'Keyword'}
                    {selectedCipher === 'otp' && `Keystream Pad (${otpKey.length} chars)`}
                    {selectedCipher === 'railfence' && 'Rails Depth (2-12)'}
                    {selectedCipher === 'columnar' && 'Column Keyword'}
                  </label>
                  {selectedCipher === 'caesar' && (
                    <div className="flex gap-1 text-[10px]">
                      <button
                        onClick={() => setCaesarShift('3')}
                        className="underline font-bold text-[#4C4736] hover:text-[#111111]"
                      >
                        Shift 3
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => setCaesarShift('13')}
                        className="underline font-bold text-[#4C4736] hover:text-[#111111]"
                      >
                        ROT13
                      </button>
                    </div>
                  )}
                </div>

                {selectedCipher === 'caesar' && (
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={caesarShift}
                    onChange={(e) => setCaesarShift(e.target.value)}
                    className="w-full bg-white rounded-lg border-2 border-[#111111] p-2 font-code-md text-xs font-bold"
                  />
                )}

                {selectedCipher === 'mono' && (
                  <input
                    type="text"
                    maxLength={26}
                    value={monoKey}
                    onChange={(e) => setMonoKey(e.target.value.toUpperCase())}
                    className="w-full bg-white rounded-lg border-2 border-[#111111] p-2 font-code-md text-xs font-bold"
                  />
                )}

                {selectedCipher === 'playfair' && (
                  <input
                    type="text"
                    value={playfairKey}
                    onChange={(e) => setPlayfairKey(e.target.value.toUpperCase())}
                    className="w-full bg-white rounded-lg border-2 border-[#111111] p-2 font-code-md text-xs font-bold"
                  />
                )}

                {selectedCipher === 'hill' && (
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2, 3].map((idx) => (
                      <input
                        key={idx}
                        type="number"
                        value={hillMatrix[idx]}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 0;
                          const copy = [...hillMatrix] as [number, number, number, number];
                          copy[idx] = val;
                          setHillMatrix(copy);
                        }}
                        className="w-full bg-white rounded-lg border-2 border-[#111111] p-1.5 text-center font-code-md text-xs font-bold"
                      />
                    ))}
                  </div>
                )}

                {selectedCipher === 'vigenere' && (
                  <input
                    type="text"
                    value={vigenereKey}
                    onChange={(e) => setVigenereKey(e.target.value.toUpperCase())}
                    className="w-full bg-white rounded-lg border-2 border-[#111111] p-2 font-code-md text-xs font-bold"
                  />
                )}

                {selectedCipher === 'otp' && (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={otpKey}
                      onChange={(e) => setOtpKey(e.target.value.toUpperCase())}
                      placeholder="Random keystream pad..."
                      className="w-full bg-white rounded-lg border-2 border-[#111111] p-2 font-code-md text-xs font-bold truncate"
                    />
                    <button
                      onClick={handleGeneratePad}
                      className="px-3 py-1 bg-[#B8F28B] rounded-lg border-2 border-[#111111] text-xs font-bold shrink-0 hover:bg-[#111111] hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0px_#111111]"
                    >
                      New Pad
                    </button>
                  </div>
                )}

                {selectedCipher === 'railfence' && (
                  <input
                    type="number"
                    min="2"
                    max="12"
                    value={railCount}
                    onChange={(e) => setRailCount(e.target.value)}
                    className="w-full bg-white rounded-lg border-2 border-[#111111] p-2 font-code-md text-xs font-bold"
                  />
                )}

                {selectedCipher === 'columnar' && (
                  <input
                    type="text"
                    value={columnarKey}
                    onChange={(e) => setColumnarKey(e.target.value.toUpperCase())}
                    className="w-full bg-white rounded-lg border-2 border-[#111111] p-2 font-code-md text-xs font-bold"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons: Encrypt & Decrypt */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => handleProcess(true)}
              disabled={isProcessing || !fileContent.trim()}
              className="flex-1 py-2.5 rounded-xl border-2 border-[#111111] bg-[#B8F28B] text-sm font-bold shadow-[4px_4px_0px_#111111] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#111111] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">lock</span>
              <span>{isProcessing ? 'Encrypting...' : 'Encrypt File Content'}</span>
            </button>
            <button
              onClick={() => handleProcess(false)}
              disabled={isProcessing || !fileContent.trim()}
              className="flex-1 py-2.5 rounded-xl border-2 border-[#111111] bg-[#C9A7FF] text-sm font-bold shadow-[4px_4px_0px_#111111] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#111111] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">lock_open</span>
              <span>{isProcessing ? 'Decrypting...' : 'Decrypt File Content'}</span>
            </button>
          </div>

          {/* Output Preview & Actions */}
          {processedContent && (
            <div className="space-y-2 pt-3 border-t-2 border-[#111111]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#111111] font-bold uppercase tracking-wider">
                    {lastMode === 'encrypt' ? 'Encrypted Output' : 'Decrypted Output'}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FFE066] border border-[#111111]">
                    {processedContent.length} chars
                  </span>
                  {lastExecutionMs !== null && (
                    <span className="text-[11px] text-[#4C4736] font-semibold">
                      ⚡ {lastExecutionMs} ms
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={handleTransferOutputToInput}
                    className="px-2.5 py-1 bg-[#FFE066] border-2 border-[#111111] rounded-lg text-xs font-bold shadow-[2px_2px_0px_#111111] hover:bg-[#111111] hover:text-[#FFE066] transition-colors cursor-pointer flex items-center gap-1"
                    title="Move this output into the input box to test round-trip decryption"
                  >
                    <span className="material-symbols-outlined text-[16px]">swap_vert</span>
                    <span>Use Output as Input</span>
                  </button>

                  <button
                    onClick={handleCopyOutput}
                    className="px-2.5 py-1 bg-white border-2 border-[#111111] rounded-lg text-xs font-bold shadow-[2px_2px_0px_#111111] hover:bg-[#F0EDEC] transition-colors cursor-pointer"
                  >
                    {copiedOutput ? '✓ Copied' : 'Copy'}
                  </button>

                  {selectedCipher === 'otp' && (
                    <button
                      onClick={handleDownloadKeyPad}
                      className="px-2.5 py-1 bg-[#B8F28B] border-2 border-[#111111] rounded-lg text-xs font-bold shadow-[2px_2px_0px_#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                    >
                      Save Pad (.txt)
                    </button>
                  )}

                  <button
                    onClick={handleDownload}
                    className="px-3 py-1 bg-[#5ED9D1] border-2 border-[#111111] rounded-lg text-xs font-bold shadow-[2px_2px_0px_#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Download File</span>
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                value={processedContent}
                rows={5}
                className="w-full bg-[#111111] text-[#FFE066] rounded-xl border-2 border-[#111111] p-3 font-code-md text-xs sm:text-sm focus:outline-none resize-y selection:bg-[#FFE066] selection:text-[#111111]"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t-2 border-[#111111] flex items-center justify-between">
          <p className="text-[11px] text-[#4C4736] font-semibold">
            Tip: Click <b>&quot;Use Output as Input&quot;</b> to verify encryption/decryption round trips.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-lg border-2 border-[#111111] bg-[#F0EDEC] font-bold text-xs hover:bg-[#111111] hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0px_#111111]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
