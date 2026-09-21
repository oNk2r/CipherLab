import { CipherResult, TraceStep } from '../../types';
import { mod } from '../utils/math';
import { validateVigenereKey } from '../utils/validation';

/**
 * Vigenère Polyalphabetic Cipher
 * Shifts each character using a repeating keyword stream:
 * Cᵢ = (Pᵢ + K[i mod m]) mod 26
 * Pᵢ = (Cᵢ - K[i mod m]) mod 26
 */
export function runVigenere(
  text: string,
  key: string,
  encrypt: boolean = true,
  keepSpaces: boolean = true
): CipherResult {
  const validation = validateVigenereKey(key);
  if (!validation.isValid) {
    return {
      result: `[ERROR: ${validation.errorMessage}]`,
      error: validation.errorMessage,
      trace: [],
      equation: 'Cᵢ = (Pᵢ + K[i mod m]) mod 26',
      keyspace: '26^m (m = key length)',
      timeComplexity: 'O(N) Linear'
    };
  }

  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  let result = '';
  let kIdx = 0;
  const trace: TraceStep[] = [];

  for (let i = 0; i < text.length; i++) {
    const rawChar = text[i];
    const upper = rawChar.toUpperCase();
    const code = upper.charCodeAt(0);

    if (code >= 65 && code <= 90) {
      const pVal = code - 65;
      const keyChar = cleanKey[kIdx % cleanKey.length];
      const kVal = keyChar.charCodeAt(0) - 65;
      const shift = encrypt ? mod(pVal + kVal, 26) : mod(pVal - kVal, 26);
      const outChar = String.fromCharCode(65 + shift);

      result += outChar;

      if (trace.length < 6) {
        trace.push({
          from: upper,
          fromCode: `${pVal} (K: ${keyChar}=${kVal})`,
          to: outChar,
          toCode: shift,
          note: encrypt ? `(${pVal} + ${kVal}) mod 26` : `(${pVal} - ${kVal}) mod 26`
        });
      }
      kIdx++;
    } else if (keepSpaces) {
      result += rawChar;
    }
  }

  return {
    result: result || (text.trim().length === 0 ? '' : '[NO ALPHABETIC DATA]'),
    trace,
    equation: encrypt
      ? 'Cᵢ ≡ (Pᵢ + K[i mod m]) mod 26'
      : 'Pᵢ ≡ (Cᵢ - K[i mod m]) mod 26',
    keyspace: `26^${cleanKey.length} Keyspace for Key Length ${cleanKey.length}`,
    timeComplexity: 'O(N) Linear',
    additionalInfo: {
      keyword: cleanKey,
      keyLength: String(cleanKey.length)
    }
  };
}
