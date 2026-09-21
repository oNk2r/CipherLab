import { CipherResult, TraceStep } from '../../types';
import { validateColumnarKey } from '../utils/validation';

/**
 * Columnar Transposition Cipher
 * Permutes message columns according to the alphabetical sort rank of a secret keyword.
 * Uses exact irregular columnar transposition for 100% round-trip fidelity without lossy padding.
 */
export function runColumnar(
  text: string,
  keyword: string,
  encrypt: boolean = true,
  keepSpaces: boolean = true
): CipherResult {
  const validation = validateColumnarKey(keyword);
  if (!validation.isValid) {
    return {
      result: `[ERROR: ${validation.errorMessage}]`,
      error: validation.errorMessage,
      trace: [],
      equation: 'C = Columnar_Permute(P, Key)',
      keyspace: 'K! Column Permutations',
      timeComplexity: 'O(N log K)'
    };
  }

  const cleanKey = keyword.toUpperCase().replace(/[^A-Z]/g, '');
  let cleanText = text.toUpperCase();
  if (!keepSpaces) {
    cleanText = cleanText.replace(/\s+/g, '');
  }
  cleanText = cleanText.replace(/[^A-Z ]/g, '');

  if (cleanText.length === 0) {
    return {
      result: '',
      trace: [],
      equation: `Key = "${cleanKey}" (${cleanKey.length} Columns)`,
      keyspace: `${cleanKey.length}! Permutations`,
      timeComplexity: 'O(N log K)'
    };
  }

  const numCols = cleanKey.length;
  const numRows = Math.ceil(cleanText.length / numCols);

  // Alphabetical rank sorting of key indices (stable sort)
  const sortedKeyIndices = cleanKey
    .split('')
    .map((char, originalIndex) => ({ char, originalIndex }))
    .sort((a, b) => {
      if (a.char === b.char) return a.originalIndex - b.originalIndex;
      return a.char.localeCompare(b.char);
    })
    .map((item, rank) => ({ ...item, rank }));

  // Column lengths in the irregular rectangle
  const colLengths = new Array(numCols).fill(Math.floor(cleanText.length / numCols));
  const remainder = cleanText.length % numCols;
  if (remainder !== 0) {
    for (let c = 0; c < remainder; c++) {
      colLengths[c]++;
    }
  }

  if (encrypt) {
    // Fill grid row by row
    const grid: string[][] = Array.from({ length: numRows }, () => []);
    let charIdx = 0;
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        if (charIdx < cleanText.length) {
          grid[r][c] = cleanText[charIdx++];
        }
      }
    }

    // Read columns in alphabetical rank order of key characters
    let result = '';
    for (const item of sortedKeyIndices) {
      const colIdx = item.originalIndex;
      const lengthOfThisCol = colLengths[colIdx];
      for (let r = 0; r < lengthOfThisCol; r++) {
        if (grid[r] && grid[r][colIdx] !== undefined) {
          result += grid[r][colIdx];
        }
      }
    }

    const trace: TraceStep[] = sortedKeyIndices.slice(0, 6).map((k) => ({
      from: `Col ${k.originalIndex + 1} ('${k.char}')`,
      fromCode: k.originalIndex,
      to: `Rank ${k.rank + 1}`,
      toCode: colLengths[k.originalIndex],
      note: `Read Col ${k.originalIndex + 1} (len ${colLengths[k.originalIndex]})`
    }));

    return {
      result,
      trace,
      equation: `C = Columnar_Permute(P, "${cleanKey}")`,
      keyspace: `${numCols}! (${factorial(numCols)} Permutations)`,
      timeComplexity: 'O(N log K)',
      additionalInfo: {
        numCols: String(numCols),
        numRows: String(numRows),
        keyOrder: sortedKeyIndices.map((k) => `${k.char}:${k.rank + 1}`).join(' ')
      }
    };
  } else {
    // Decrypt: fill columns according to rank order and col lengths
    const columns: string[][] = Array.from({ length: numCols }, () => []);
    let currentIdx = 0;

    for (const item of sortedKeyIndices) {
      const colIdx = item.originalIndex;
      const len = colLengths[colIdx];
      columns[colIdx] = cleanText.slice(currentIdx, currentIdx + len).split('');
      currentIdx += len;
    }

    // Read off grid row by row
    let decoded = '';
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        if (columns[c] && columns[c][r] !== undefined) {
          decoded += columns[c][r];
        }
      }
    }

    return {
      result: decoded,
      trace: [
        {
          from: 'READ_COLS',
          fromCode: numCols,
          to: 'RECONSTRUCT_ROWS',
          toCode: numRows,
          note: `Inverse transposition across ${numCols} ordered columns`
        }
      ],
      equation: `P = Inverse_Columnar(C, "${cleanKey}")`,
      keyspace: `${numCols}! Permutations`,
      timeComplexity: 'O(N log K)',
      additionalInfo: {
        numCols: String(numCols),
        numRows: String(numRows)
      }
    };
  }
}

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
