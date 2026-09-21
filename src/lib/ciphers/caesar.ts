import { CipherResult, TraceStep } from '../../types';
import { mod } from '../utils/math';
import { validateCaesarKey } from '../utils/validation';

/**
 * Caesar Shift Cipher
 * Encrypts/decrypts text by shifting characters in Z_26.
 * C = (P + K) mod 26
 * P = (C - K) mod 26
 */
export function runCaesar(
  text: string,
  shift: number,
  encrypt: boolean = true,
  keepSpaces: boolean = true
): CipherResult {
  const validation = validateCaesarKey(shift);
  if (!validation.isValid) {
    return {
      result: `[ERROR: ${validation.errorMessage}]`,
      error: validation.errorMessage,
      trace: [],
      equation: 'C = (P + K) mod 26',
      keyspace: '26 Shifts (K ∈ [0..25])',
      timeComplexity: 'O(N) Linear'
    };
  }

  const effectiveShift = mod(Math.round(shift), 26);
  const k = encrypt ? effectiveShift : mod(-effectiveShift, 26);
  let result = '';
  const trace: TraceStep[] = [];

  for (let i = 0; i < text.length; i++) {
    const rawChar = text[i];
    const upperChar = rawChar.toUpperCase();
    const code = upperChar.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      const origIdx = code - 65;
      const newIdx = (origIdx + k) % 26;
      const outChar = String.fromCharCode(65 + newIdx);
      result += outChar;

      if (trace.length < 6) {
        trace.push({
          from: upperChar,
          fromCode: origIdx,
          to: outChar,
          toCode: newIdx,
          note: encrypt ? `+${effectiveShift} mod 26` : `-${effectiveShift} mod 26`
        });
      }
    } else if (keepSpaces) {
      result += rawChar;
    }
  }

  return {
    result: result || (text.trim().length === 0 ? '' : '[NO ALPHABETIC DATA]'),
    trace,
    equation: encrypt
      ? `C ≡ (P + ${effectiveShift}) mod 26`
      : `P ≡ (C - ${effectiveShift}) mod 26`,
    keyspace: '26 Shifts (K ∈ [0..25])',
    timeComplexity: 'O(N) Linear',
    additionalInfo: {
      shiftApplied: String(effectiveShift),
      operation: encrypt ? 'Encryption (+K)' : 'Decryption (-K)'
    }
  };
}
