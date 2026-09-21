import { CipherResult, TraceStep } from '../../types';
import { det2x2, invMatrix2x2, mod } from '../utils/math';
import { validateHillMatrix } from '../utils/validation';

/**
 * Hill Cipher (2×2 Polygraphic Linear Matrix Substitution)
 * Encrypts 2-letter column vectors using matrix multiplication in Z_26:
 * C = K · P (mod 26)
 * P = K⁻¹ · C (mod 26)
 */
export function runHill(
  text: string,
  matrixKey: [number, number, number, number],
  encrypt: boolean = true,
  keepSpaces: boolean = true
): CipherResult {
  const validation = validateHillMatrix(matrixKey);
  const [a, b, c, d] = matrixKey;
  const det = det2x2(matrixKey);

  if (!validation.isValid) {
    return {
      result: `[ERROR: ${validation.errorMessage}]`,
      error: validation.errorMessage,
      trace: [],
      equation: `det(K) = (${a}·${d} - ${b}·${c}) mod 26 = ${det}`,
      keyspace: 'GL(2, ℤ₂₆) = 157,248 matrices',
      timeComplexity: 'O(N) Linear'
    };
  }

  // Determine active transformation matrix
  let m00 = mod(a, 26);
  let m01 = mod(b, 26);
  let m10 = mod(c, 26);
  let m11 = mod(d, 26);

  if (!encrypt) {
    const inv = invMatrix2x2(matrixKey);
    if (!inv) {
      return {
        result: '[ERROR: Matrix is not invertible mod 26]',
        error: 'Matrix is not invertible mod 26',
        trace: [],
        equation: 'det(K) must be coprime to 26',
        keyspace: 'GL(2, ℤ₂₆) = 157,248 matrices',
        timeComplexity: 'O(N) Linear'
      };
    }
    [m00, m01, m10, m11] = inv;
  }

  const cleaned = text.toUpperCase().replace(/[^A-Z]/g, '');
  if (cleaned.length === 0) {
    return {
      result: '',
      trace: [],
      equation: encrypt ? `C = [${a}, ${b}; ${c}, ${d}] · P mod 26` : 'P = K⁻¹ · C mod 26',
      keyspace: 'GL(2, ℤ₂₆) = 157,248 matrices',
      timeComplexity: 'O(N) Linear'
    };
  }

  // Pair preparation with 'X' padding if odd length
  const pairs: number[][] = [];
  for (let i = 0; i < cleaned.length; i += 2) {
    const p1 = cleaned.charCodeAt(i) - 65;
    const p2 = i + 1 < cleaned.length ? cleaned.charCodeAt(i + 1) - 65 : 23; // pad 'X' (23)
    pairs.push([p1, p2]);
  }

  let result = '';
  const trace: TraceStep[] = [];

  for (const [p1, p2] of pairs) {
    const c1 = mod(m00 * p1 + m01 * p2, 26);
    const c2 = mod(m10 * p1 + m11 * p2, 26);
    const inPair = String.fromCharCode(65 + p1) + String.fromCharCode(65 + p2);
    const outPair = String.fromCharCode(65 + c1) + String.fromCharCode(65 + c2);

    result += outPair + (keepSpaces ? ' ' : '');

    if (trace.length < 6) {
      trace.push({
        from: inPair,
        fromCode: `[${p1}, ${p2}]ᵀ`,
        to: outPair,
        toCode: `[${c1}, ${c2}]ᵀ`,
        note: encrypt
          ? `[${m00}·${p1}+${m01}·${p2}, ${m10}·${p1}+${m11}·${p2}] mod 26`
          : `K⁻¹ · [${p1}, ${p2}]ᵀ mod 26`
      });
    }
  }

  const finalResult = keepSpaces ? result.trim() : result;

  return {
    result: finalResult,
    trace,
    equation: encrypt
      ? `C = [${a}, ${b}; ${c}, ${d}] · P mod 26 (det=${det})`
      : `P = [${m00}, ${m01}; ${m10}, ${m11}] · C mod 26`,
    keyspace: '157,248 Invertible Matrices in GL(2, ℤ₂₆)',
    timeComplexity: 'O(N) Linear',
    additionalInfo: {
      determinant: String(det),
      activeMatrix: `[${m00}, ${m01}; ${m10}, ${m11}]`,
      operation: encrypt ? 'Forward Transform (K)' : 'Inverse Transform (K⁻¹)'
    }
  };
}
