import { CipherResult, TraceStep } from '../../types';
import { ALPHABET, mod } from '../utils/math';
import { validateOTPKey } from '../utils/validation';

/**
 * Generates a truly pseudo-random alphabet keystream of specified length.
 */
export function generateRandomPad(length: number): string {
  let pad = '';
  for (let i = 0; i < length; i++) {
    pad += ALPHABET[Math.floor(Math.random() * 26)];
  }
  return pad;
}

/**
 * One-Time Pad (Vernam Modular Alphabet Stream Cipher)
 * Encrypts each letter with a unique, random keystream character:
 * Cᵢ = (Pᵢ + Kᵢ) mod 26
 * Pᵢ = (Cᵢ - Kᵢ) mod 26
 * Unconditionally secure (Shannon Perfect Secrecy) iff key is truly random,
 * used exactly once, and length(K) >= length(P).
 */
export function runOTP(
  text: string,
  keyStream: string,
  encrypt: boolean = true,
  keepSpaces: boolean = true
): CipherResult {
  const cleanKey = keyStream.toUpperCase().replace(/[^A-Z]/g, '');
  const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');

  const validation = validateOTPKey(cleanKey, cleanText.length);
  if (!validation.isValid) {
    return {
      result: `[ERROR: ${validation.errorMessage}]`,
      error: validation.errorMessage,
      trace: [],
      equation: 'C ≡ P ⊕ K (Shannon Perfect Secrecy)',
      keyspace: '26^N Infinite Key Space',
      timeComplexity: 'O(N) Linear'
    };
  }

  let result = '';
  let keyPos = 0;
  const trace: TraceStep[] = [];

  for (let i = 0; i < text.length; i++) {
    const rawChar = text[i];
    const upper = rawChar.toUpperCase();
    const code = upper.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      const pVal = code - 65;
      const padChar = cleanKey[keyPos];
      const kVal = padChar.charCodeAt(0) - 65;
      const shift = encrypt ? mod(pVal + kVal, 26) : mod(pVal - kVal, 26);
      const outChar = String.fromCharCode(65 + shift);

      result += outChar;

      if (trace.length < 6) {
        trace.push({
          from: upper,
          fromCode: `${pVal} (Pad: ${padChar}=${kVal})`,
          to: outChar,
          toCode: shift,
          note: encrypt ? `(${pVal} + ${kVal}) mod 26` : `(${pVal} - ${kVal}) mod 26`
        });
      }
      keyPos++;
    } else if (keepSpaces) {
      result += rawChar;
    }
  }

  return {
    result: result || (text.trim().length === 0 ? '' : '[NO ALPHABETIC DATA]'),
    trace,
    equation: encrypt ? 'C ≡ (P + K) mod 26 (Shannon Secrecy)' : 'P ≡ (C - K) mod 26 (Pad Cancellation)',
    keyspace: '26^N Infinite Key Space (Information-Theoretic Security)',
    timeComplexity: 'O(N) Linear',
    additionalInfo: {
      padLength: String(cleanKey.length),
      padUsed: cleanKey.slice(0, Math.min(cleanText.length, 30)) + (cleanText.length > 30 ? '...' : '')
    }
  };
}
