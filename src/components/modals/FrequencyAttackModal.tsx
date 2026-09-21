import React, { useState } from 'react';
import {
  calculateFrequency,
  calculateIoC,
  breakCaesarByChiSquare,
  ENGLISH_FREQUENCIES,
  ALPHABET,
} from '../../utils/cryptoEngines';

interface FrequencyAttackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyKey: (key: number, plain: string) => void;
  onShowToast: (msg: string) => void;
}

export const FrequencyAttackModal: React.FC<FrequencyAttackModalProps> = ({
  isOpen,
  onClose,
  onApplyKey,
  onShowToast,
}) => {
  const [ciphertext, setCiphertext] = useState(
    'SLYBTWP XJHZWNYD NX YMJ KTASIFYNT STW RTIMWS HTRAZYJW XHNJSHJ'
  );
  const [showAllShifts, setShowAllShifts] = useState(false);

  if (!isOpen) return null;

  const freqResult = calculateFrequency(ciphertext);
  const ioc = calculateIoC(ciphertext);
  const candidates = breakCaesarByChiSquare(ciphertext);

  const bestCandidate = candidates[0];
  const displayedCandidates = showAllShifts ? candidates : candidates.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-[#111111]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl border-2 border-[#111111] shadow-[6px_6px_0px_#111111] max-w-4xl w-full p-5 my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#111111]">
          <h3 className="font-headline-lg text-xl font-bold text-[#111111]">
            Frequency Attack &amp; Brute Force
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border-2 border-[#111111] bg-[#F0EDEC] text-[#111111] font-bold flex items-center justify-center hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-4 overflow-y-auto flex-1">
          {/* Ciphertext Input */}
          <div>
            <label className="text-xs font-bold text-[#111111] block mb-1">
              Ciphertext
            </label>
            <textarea
              rows={3}
              value={ciphertext}
              onChange={(e) => setCiphertext(e.target.value.toUpperCase())}
              placeholder="Paste ciphertext here..."
              className="w-full bg-[#FFF8EE] rounded-lg border-2 border-[#111111] p-2.5 font-code-md text-xs sm:text-sm font-bold focus:outline-none"
            />
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border-2 border-[#111111] bg-[#5ED9D1]">
              <span className="text-[11px] text-[#4C4736] block font-bold">
                Total Letters
              </span>
              <span className="font-code-lg text-lg font-bold">{freqResult.totalLetters}</span>
            </div>
            <div className="p-3 rounded-lg border-2 border-[#111111] bg-[#FFE066]">
              <span className="text-[11px] text-[#4C4736] block font-bold">
                Index of Coincidence
              </span>
              <span className="font-code-lg text-lg font-bold">
                {ioc.toFixed(4)}{' '}
                <span className="text-xs font-normal text-[#4C4736]">
                  (English ≈ 0.0667)
                </span>
              </span>
            </div>
            <div className="p-3 rounded-lg border-2 border-[#111111] bg-[#B8F28B]">
              <span className="text-[11px] text-[#4C4736] block font-bold">
                Predicted Key
              </span>
              <span className="font-code-lg text-lg font-bold">
                K = {bestCandidate ? bestCandidate.shift : 0}
              </span>
            </div>
          </div>

          {/* Letter Histogram */}
          <div className="bg-[#FFF8EE] p-3.5 rounded-xl border-2 border-[#111111]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#111111] font-bold">
                Frequency Distribution
              </span>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#111111] inline-block"></span> Observed
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#FFE066] border border-[#111111] inline-block"></span> English
                </span>
              </div>
            </div>

            {/* 26 letter bars */}
            <div className="grid grid-cols-13 sm:grid-cols-26 gap-1 items-end h-24 pt-2">
              {ALPHABET.split('').map((letter) => {
                const observedPercent = freqResult.percentages[letter] || 0;
                const standardPercent = ENGLISH_FREQUENCIES[letter] || 0;
                const maxPercent = 15;
                const observedHeight = Math.min(100, (observedPercent / maxPercent) * 100);
                const standardHeight = Math.min(100, (standardPercent / maxPercent) * 100);

                return (
                  <div key={letter} className="flex flex-col items-center h-full justify-end group relative">
                    <div className="w-full flex items-end justify-center gap-0.5 h-full">
                      <div
                        className="w-1/2 bg-[#111111] rounded-t"
                        style={{ height: `${Math.max(4, observedHeight)}%` }}
                        title={`${letter} Observed: ${observedPercent.toFixed(1)}%`}
                      ></div>
                      <div
                        className="w-1/2 bg-[#FFE066] rounded-t border border-[#111111]"
                        style={{ height: `${Math.max(4, standardHeight)}%` }}
                        title={`${letter} English: ${standardPercent.toFixed(1)}%`}
                      ></div>
                    </div>
                    <span className="font-code-md text-[10px] font-bold mt-1 text-[#111111]">
                      {letter}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Candidates Header & Toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#111111] font-bold">
                {showAllShifts ? 'All 25 Shifts (Brute Force)' : 'Top Candidates (Chi-Square Test)'}
              </span>
              <button
                onClick={() => setShowAllShifts(!showAllShifts)}
                className="text-xs font-semibold px-2.5 py-1 rounded bg-[#F0EDEC] border border-[#111111] hover:bg-[#FFE066] transition-colors cursor-pointer"
              >
                {showAllShifts ? 'Show Top 3 Only' : 'Show All 25 Shifts'}
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {displayedCandidates.map((cand: { shift: number; score: number; decryptedText: string }, idx: number) => (
                <div
                  key={cand.shift}
                  className={`p-2.5 rounded-xl border-2 border-[#111111] flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    idx === 0 ? 'bg-[#B8F28B]' : 'bg-[#F0EDEC]'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 font-code-md text-xs font-bold mb-0.5">
                      <span className="bg-white px-2 py-0.5 rounded border border-[#111111]">
                        Shift K = {cand.shift}
                      </span>
                      <span className="text-xs text-[#4C4736] font-normal">
                        Chi² = {cand.score.toFixed(1)}
                      </span>
                    </div>
                    <p className="font-code-md text-xs text-[#111111] font-bold truncate">
                      "{cand.decryptedText}"
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onApplyKey(cand.shift, cand.decryptedText);
                      onClose();
                      onShowToast(`Applied key K = ${cand.shift}`);
                    }}
                    className="px-3 py-1 rounded-lg border-2 border-[#111111] bg-white text-xs font-bold shadow-[1px_1px_0px_#111111] hover:bg-[#111111] hover:text-[#FFE066] transition-colors cursor-pointer shrink-0"
                  >
                    Apply Key
                  </button>
                </div>
              ))}
            </div>
          </div>
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
