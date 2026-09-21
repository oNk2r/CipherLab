import { CipherResult, TraceStep } from '../../types';
import { ALPHABET } from '../utils/math';
import { validatePlayfairKey } from '../utils/validation';

/**
 * Generates the 5x5 Playfair coordinate matrix from a keyword.
 * 'J' is mapped to 'I'.
 */
export function generatePlayfairMatrix(keyword: string): string[][] {
  const cleanKey = keyword.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  const seen = new Set<string>();
  const letters: string[] = [];

  for (const ch of cleanKey) {
    if (!seen.has(ch)) {
      seen.add(ch);
      letters.push(ch);
    }
  }

  for (const ch of ALPHABET) {
    if (ch === 'J') continue;
    if (!seen.has(ch)) {
      seen.add(ch);
      letters.push(ch);
    }
  }

  const matrix: string[][] = [];
  for (let r = 0; r < 5; r++) {
    matrix.push(letters.slice(r * 5, (r + 1) * 5));
  }
  return matrix;
}

/**
 * Playfair Digraph Substitution Cipher
 * Encrypts/decrypts letter pairs across a 5x5 keyed coordinate matrix.
 */
export function runPlayfair(
  text: string,
  keyword: string,
  encrypt: boolean = true,
  keepSpaces: boolean = true
): CipherResult {
  const validation = validatePlayfairKey(keyword);
  if (!validation.isValid) {
    return {
      result: `[ERROR: ${validation.errorMessage}]`,
      error: validation.errorMessage,
      trace: [],
      equation: 'C_pair = Playfair_Rules(P_pair, 5×5 Matrix)',
      keyspace: '25! ≈ 1.55 × 10²⁵ keys',
      timeComplexity: 'O(N) Linear'
    };
  }

  const matrix = generatePlayfairMatrix(keyword);
  const letterMap = new Map<string, { r: number; c: number }>();
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      letterMap.set(matrix[r][c], { r, c });
    }
  }

  const cleaned = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  if (cleaned.length === 0) {
    return {
      result: '',
      trace: [],
      equation: 'C_pair = Playfair_Rules(P_pair, 5×5 Matrix)',
      keyspace: '25! ≈ 1.55 × 10²⁵ keys',
      timeComplexity: 'O(N) Linear'
    };
  }

  // Digraph formation
  const digraphs: string[] = [];
  if (encrypt) {
    let i = 0;
    while (i < cleaned.length) {
      const a = cleaned[i];
      if (i + 1 >= cleaned.length) {
        // Odd length ending: pad with X (or Z if already X)
        digraphs.push(a + (a === 'X' ? 'Z' : 'X'));
        i++;
      } else {
        const b = cleaned[i + 1];
        if (a === b) {
          // Double letter in same pair: insert filler X
          digraphs.push(a + (a === 'X' ? 'Z' : 'X'));
          i++;
        } else {
          digraphs.push(a + b);
          i += 2;
        }
      }
    }
  } else {
    // Decrypting: group into 2-letter blocks
    for (let i = 0; i < cleaned.length; i += 2) {
      if (i + 1 < cleaned.length) {
        digraphs.push(cleaned[i] + cleaned[i + 1]);
      } else {
        digraphs.push(cleaned[i] + 'X');
      }
    }
  }

  let result = '';
  const trace: TraceStep[] = [];

  for (const pair of digraphs) {
    const pos1 = letterMap.get(pair[0]) || { r: 0, c: 0 };
    const pos2 = letterMap.get(pair[1]) || { r: 0, c: 0 };
    let o1 = '';
    let o2 = '';
    let ruleNote = '';

    if (pos1.r === pos2.r) {
      // Same Row: shift columns right (encrypt) or left (decrypt)
      const shift = encrypt ? 1 : 4;
      o1 = matrix[pos1.r][(pos1.c + shift) % 5];
      o2 = matrix[pos2.r][(pos2.c + shift) % 5];
      ruleNote = encrypt ? 'Same Row (+1 Col)' : 'Same Row (-1 Col)';
    } else if (pos1.c === pos2.c) {
      // Same Column: shift rows down (encrypt) or up (decrypt)
      const shift = encrypt ? 1 : 4;
      o1 = matrix[(pos1.r + shift) % 5][pos1.c];
      o2 = matrix[(pos2.r + shift) % 5][pos2.c];
      ruleNote = encrypt ? 'Same Col (+1 Row)' : 'Same Col (-1 Row)';
    } else {
      // Rectangle Swap: swap column coordinates
      o1 = matrix[pos1.r][pos2.c];
      o2 = matrix[pos2.r][pos1.c];
      ruleNote = 'Rectangle (Col Swap)';
    }

    result += o1 + o2 + (keepSpaces ? ' ' : '');

    if (trace.length < 6) {
      trace.push({
        from: pair,
        fromCode: `[${pos1.r},${pos1.c}][${pos2.r},${pos2.c}]`,
        to: o1 + o2,
        toCode: ruleNote,
        note: `Matrix (${pair} → ${o1}${o2})`
      });
    }
  }

  const finalResult = keepSpaces ? result.trim() : result;

  return {
    result: finalResult,
    trace,
    equation: 'C_pair = Playfair_Rules(P_pair, 5×5 Matrix)',
    keyspace: '25! ≈ 1.55 × 10²⁵ keys',
    timeComplexity: 'O(N) Linear',
    additionalInfo: {
      keywordUsed: keyword.toUpperCase().replace(/[^A-Z]/g, ''),
      pairsCount: String(digraphs.length)
    }
  };
}
