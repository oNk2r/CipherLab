import { CipherResult, TraceStep } from '../../types';
import { ALPHABET } from '../utils/math';
import { validateMonoalphabeticKey } from '../utils/validation';

/**
 * Monoalphabetic Substitution Cipher
 * Maps every letter to an arbitrary permutation table π ∈ S_26.
 */
export function runMonoalphabetic(
  text: string,
  keyMap: string,
  encrypt: boolean = true,
  keepSpaces: boolean = true
): CipherResult {
  const cleanKey = keyMap.toUpperCase().replace(/[^A-Z]/g, '');
  const validation = validateMonoalphabeticKey(cleanKey);

  if (!validation.isValid) {
    return {
      result: `[ERROR: ${validation.errorMessage}]`,
      error: validation.errorMessage,
      trace: [],
      equation: 'C = π(P), π ∈ S₂₆',
      keyspace: '26! ≈ 4.03 × 10²⁶ keys',
      timeComplexity: 'O(N) Linear'
    };
  }

  let result = '';
  const trace: TraceStep[] = [];

  for (let i = 0; i < text.length; i++) {
    const rawChar = text[i];
    const upper = rawChar.toUpperCase();
    const code = upper.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      let outChar = upper;
      const pIdx = code - 65;

      if (encrypt) {
        outChar = cleanKey[pIdx];
        if (trace.length < 6) {
          trace.push({
            from: upper,
            fromCode: pIdx,
            to: outChar,
            toCode: outChar.charCodeAt(0) - 65,
            note: `P[${upper}] → π[${upper}]=${outChar}`
          });
        }
      } else {
        const cIdx = cleanKey.indexOf(upper);
        outChar = cIdx !== -1 ? ALPHABET[cIdx] : upper;
        if (trace.length < 6) {
          trace.push({
            from: upper,
            fromCode: cleanKey.indexOf(upper),
            to: outChar,
            toCode: outChar.charCodeAt(0) - 65,
            note: `C[${upper}] → π⁻¹[${upper}]=${outChar}`
          });
        }
      }
      result += outChar;
    } else if (keepSpaces) {
      result += rawChar;
    }
  }

  return {
    result: result || (text.trim().length === 0 ? '' : '[NO ALPHABETIC DATA]'),
    trace,
    equation: encrypt ? 'C = π(P) Arbitrary Permutation' : 'P = π⁻¹(C) Inverse Permutation',
    keyspace: '26! ≈ 4.03 × 10²⁶ keys',
    timeComplexity: 'O(N) Linear',
    additionalInfo: {
      substitutionAlphabet: cleanKey
    }
  };
}
