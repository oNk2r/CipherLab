/**
 * CipherLab Core Cryptography Engine Hub
 * Re-exports modular ciphers, mathematical foundations, and cryptanalysis utilities.
 */

import { CipherResult, LetterFrequency, TraceStep } from '../types';
import {
  ALPHABET,
  gcd,
  mod,
  modInverse,
  det2x2,
  invMatrix2x2
} from '../lib/utils/math';

export {
  ALPHABET,
  gcd,
  mod,
  modInverse,
  det2x2,
  invMatrix2x2
};

import {
  runCaesar,
  runMonoalphabetic,
  runPlayfair,
  generatePlayfairMatrix,
  runHill,
  runVigenere,
  runOTP,
  generateRandomPad,
  runRailFence,
  runColumnar
} from '../lib/ciphers';

export {
  runCaesar,
  runMonoalphabetic,
  runPlayfair,
  generatePlayfairMatrix,
  runHill,
  runVigenere,
  runOTP,
  generateRandomPad,
  runRailFence,
  runColumnar
};

export const ENGLISH_FREQUENCIES: Record<string, number> = {
  A: 8.2, B: 1.5, C: 2.8, D: 4.3, E: 12.7, F: 2.2, G: 2.0, H: 6.1,
  I: 7.0, J: 0.15, K: 0.8, L: 4.0, M: 2.4, N: 6.7, O: 7.5, P: 1.9,
  Q: 0.10, R: 6.0, S: 6.3, T: 9.1, U: 2.8, V: 1.0, W: 2.4, X: 0.15,
  Y: 2.0, Z: 0.07
};

// Frequency Analysis & Auto-Crack Engine
export function analyzeFrequencies(text: string): {
  frequencies: LetterFrequency[];
  totalLetters: number;
  indexCoincidence: number;
} {
  const counts: Record<string, number> = {};
  for (const c of ALPHABET) counts[c] = 0;

  let total = 0;
  for (const ch of text.toUpperCase()) {
    if (ch >= 'A' && ch <= 'Z') {
      counts[ch]++;
      total++;
    }
  }

  // Index of Coincidence: sum(n_i * (n_i - 1)) / (N * (N - 1))
  let ic = 0;
  if (total > 1) {
    let sum = 0;
    for (const c of ALPHABET) {
      sum += counts[c] * (counts[c] - 1);
    }
    ic = sum / (total * (total - 1));
  }

  const frequencies: LetterFrequency[] = ALPHABET.split('').map((letter) => {
    const count = counts[letter];
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return {
      letter,
      count,
      percentage: Number(percentage.toFixed(2)),
      expectedPercentage: ENGLISH_FREQUENCIES[letter] || 0
    };
  });

  return {
    frequencies,
    totalLetters: total,
    indexCoincidence: Number(ic.toFixed(4))
  };
}

export function calculateFrequency(text: string): {
  totalLetters: number;
  percentages: Record<string, number>;
} {
  const analysis = analyzeFrequencies(text);
  const percentages: Record<string, number> = {};
  for (const f of analysis.frequencies) {
    percentages[f.letter] = f.percentage;
  }
  return { totalLetters: analysis.totalLetters, percentages };
}

export function calculateIoC(text: string): number {
  return analyzeFrequencies(text).indexCoincidence;
}

export function breakCaesarByChiSquare(
  ciphertext: string
): Array<{ shift: number; score: number; decryptedText: string }> {
  const clean = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
  const results: Array<{ shift: number; score: number; decryptedText: string }> = [];

  for (let s = 0; s < 26; s++) {
    const decrypted = runCaesar(clean, s, false, false).result;
    const { frequencies, totalLetters } = analyzeFrequencies(decrypted);

    let chiSq = 0;
    for (const f of frequencies) {
      const expectedCount = (f.expectedPercentage / 100) * totalLetters;
      if (expectedCount > 0) {
        chiSq += Math.pow(f.count - expectedCount, 2) / expectedCount;
      }
    }

    const fullDecrypted = runCaesar(ciphertext, s, false, true).result;
    results.push({
      shift: s,
      score: chiSq,
      decryptedText: fullDecrypted
    });
  }

  results.sort((a, b) => a.score - b.score);
  return results;
}
