import React, { useState } from 'react';
import { runCaesar } from '../utils/cryptoEngines';

interface HeroSectionProps {
  onStartEncrypting: () => void;
  onExploreCiphers: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartEncrypting,
  onExploreCiphers,
}) => {
  const [heroShift, setHeroShift] = useState(3);
  const [heroPlaintext, setHeroPlaintext] = useState('CIPHER');

  const heroResult = runCaesar(heroPlaintext, heroShift, true, true).result;

  const sampleLetters = heroPlaintext.slice(0, 6).toUpperCase().split('');
  const shiftedLetters = sampleLetters.map((ch) => {
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(65 + ((code - 65 + heroShift) % 26));
    }
    return ch;
  });

  return (
    <section className="relative w-full pt-4 pb-10 sm:pb-14" id="hero-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Heading & Calls to Action */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border-2 border-[#111111] bg-[#FFE066] text-[#111111] shadow-[3px_3px_0px_#111111] mb-4 text-xs font-bold">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>Classical Cryptography Suite</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display-lg text-4xl sm:text-5xl lg:text-[56px] text-[#111111] tracking-tight leading-[1.1] mb-4">
            Crack the Code.<br />
            <span className="relative inline-block mt-1 mr-2.5">
              <span className="bg-[#5ED9D1] px-3 py-0.5 rounded-xl border-[3px] border-[#111111] shadow-[4px_4px_0px_#111111] inline-block">
                Master
              </span>
            </span>
            <span>the Cipher.</span>
          </h1>

          {/* Subtitle */}
          <p className="font-body-lg text-base sm:text-lg text-[#4C4736] max-w-xl mb-6 leading-relaxed">
            Encrypt, decrypt, and reverse-engineer 8 classical cryptographic algorithms with step-by-step mathematical tracing and cryptanalysis.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 mb-6">
            <button
              id="hero-start-encrypting-btn"
              onClick={onStartEncrypting}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-[3px] border-[#111111] bg-[#FF7373] text-[#111111] font-headline-md text-base shadow-[4px_4px_0px_#111111] neo-shadow-btn cursor-pointer font-bold"
            >
              <span>Start Encrypting</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
            <button
              id="hero-explore-ciphers-btn"
              onClick={onExploreCiphers}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-[3px] border-[#111111] bg-white text-[#111111] font-headline-md text-base shadow-[4px_4px_0px_#111111] neo-shadow-btn cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[20px]">dataset</span>
              <span>View 8 Ciphers</span>
            </button>
          </div>

          {/* Trust & Quality Highlights */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold text-[#111111]">
            <div className="px-3 py-1 rounded-lg border-2 border-[#111111] bg-white shadow-[2px_2px_0px_#111111] flex items-center gap-1.5">
              <span className="text-[#006A65] font-bold">✓</span>
              <span>8 Classical Engines</span>
            </div>
            <div className="px-3 py-1 rounded-lg border-2 border-[#111111] bg-white shadow-[2px_2px_0px_#111111] flex items-center gap-1.5">
              <span className="text-[#006A65] font-bold">✓</span>
              <span>100% In-Browser</span>
            </div>
            <div className="px-3 py-1 rounded-lg border-2 border-[#111111] bg-white shadow-[2px_2px_0px_#111111] flex items-center gap-1.5">
              <span className="text-[#006A65] font-bold">✓</span>
              <span>Real-Time Reversible</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Live Shift Machine Preview */}
        <div className="lg:col-span-5 w-full">
          <div className="w-full bg-[#FFE066] rounded-2xl border-[3px] border-[#111111] shadow-[6px_6px_0px_#111111] p-5 sm:p-6 flex flex-col gap-4">
            {/* Card Window Header */}
            <div className="bg-white rounded-xl border-2 border-[#111111] p-3 flex items-center justify-between shadow-[2px_2px_0px_#111111]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF7373] border border-[#111111]"></span>
                <span className="w-3 h-3 rounded-full bg-[#FFE066] border border-[#111111]"></span>
                <span className="w-3 h-3 rounded-full bg-[#B8F28B] border border-[#111111]"></span>
                <span className="text-xs font-bold text-[#111111] ml-2">
                  Live Shift Preview
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#B8F28B] border border-[#111111] text-[11px] font-bold">
                Shift: +{heroShift}
              </span>
            </div>

            {/* Shift Rotor Display */}
            <div className="bg-white rounded-xl border-2 border-[#111111] p-3.5 shadow-[2px_2px_0px_#111111] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#4C4736]">
                <span>Plaintext Letters</span>
                <span>K = +{heroShift} mod 26</span>
              </div>

              {/* Source Letters */}
              <div className="grid grid-cols-6 gap-1.5 text-center font-code-md text-sm font-bold">
                {sampleLetters.map((ch, idx) => (
                  <div key={idx} className="p-1.5 rounded-lg bg-[#F0EDEC] border-2 border-[#111111]">
                    {ch || '•'}
                  </div>
                ))}
              </div>

              {/* Shift Arrows */}
              <div className="flex justify-around items-center text-[#111111] font-bold text-xs">
                {sampleLetters.map((_, idx) => (
                  <span key={idx} className="text-[#006A65]">↓</span>
                ))}
              </div>

              {/* Shifted Result Letters */}
              <div className="grid grid-cols-6 gap-1.5 text-center font-code-md text-sm font-bold">
                {shiftedLetters.map((ch, idx) => (
                  <div key={idx} className="p-1.5 rounded-lg bg-[#5ED9D1] border-2 border-[#111111] text-[#111111]">
                    {ch || '•'}
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Inputs */}
            <div className="space-y-2.5">
              {/* Input row */}
              <div className="bg-white rounded-xl border-2 border-[#111111] p-2.5 flex items-center justify-between shadow-[2px_2px_0px_#111111]">
                <div className="flex-1 pr-2">
                  <span className="text-[10px] uppercase font-bold text-[#4C4736] block">
                    Plaintext
                  </span>
                  <input
                    type="text"
                    maxLength={10}
                    value={heroPlaintext}
                    onChange={(e) => setHeroPlaintext(e.target.value.toUpperCase())}
                    className="w-full bg-transparent font-code-lg text-base font-bold text-[#111111] focus:outline-none"
                    placeholder="TYPE..."
                  />
                </div>
                {/* Steppers */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setHeroShift((prev) => (prev > 0 ? prev - 1 : 25))}
                    className="w-7 h-7 rounded-lg bg-[#F0EDEC] border border-[#111111] font-bold text-sm flex items-center justify-center hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                    title="Decrease shift"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setHeroShift((prev) => (prev + 1) % 26)}
                    className="w-7 h-7 rounded-lg bg-[#F0EDEC] border border-[#111111] font-bold text-sm flex items-center justify-center hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                    title="Increase shift"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Ciphertext Output */}
              <div className="bg-[#C9A7FF] rounded-xl border-2 border-[#111111] p-3 flex items-center justify-between shadow-[2px_2px_0px_#111111]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#111111] block">
                    Ciphertext
                  </span>
                  <span className="font-code-lg text-base font-bold text-[#111111] tracking-wider">
                    {heroResult || '...'}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[20px] text-[#111111]">
                  lock
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
