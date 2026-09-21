import { CipherResult, TraceStep } from '../../types';
import { validateRailFenceKey } from '../utils/validation';

/**
 * Rail Fence Transposition Cipher
 * Transposes characters along a zig-zag trajectory across depth rails.
 */
export function runRailFence(
  text: string,
  railsCount: number,
  encrypt: boolean = true,
  keepSpaces: boolean = true
): CipherResult {
  let cleanText = text.toUpperCase();
  if (!keepSpaces) {
    cleanText = cleanText.replace(/\s+/g, '');
  }
  cleanText = cleanText.replace(/[^A-Z ]/g, '');

  const validation = validateRailFenceKey(railsCount, cleanText.length);
  if (!validation.isValid) {
    return {
      result: `[ERROR: ${validation.errorMessage}]`,
      error: validation.errorMessage,
      trace: [],
      equation: 'C = ZigZag(P, rails)',
      keyspace: 'Rails Depth (d ∈ [2..12])',
      timeComplexity: 'O(N) Linear'
    };
  }

  const d = Math.max(2, Math.round(railsCount));

  if (cleanText.length === 0) {
    return {
      result: '',
      trace: [],
      equation: `Rails = ${d} Depth Zig-Zag`,
      keyspace: `${d} Rail Depth Configurations`,
      timeComplexity: 'O(N) Linear'
    };
  }

  // If text is shorter than or equal to rails, zig-zag doesn't bounce
  if (cleanText.length <= d || d <= 1) {
    return {
      result: cleanText,
      trace: [{ from: 'DEPTH', fromCode: d, to: 'DIRECT', toCode: d, note: 'Text length <= rails' }],
      equation: `Rails = ${d} (Degenerate case: text length <= rails)`,
      keyspace: `${d} Rail Configurations`,
      timeComplexity: 'O(N) Linear'
    };
  }

  if (encrypt) {
    const fence: string[][] = Array.from({ length: d }, () => []);
    let rail = 0;
    let dir = 1;

    for (let i = 0; i < cleanText.length; i++) {
      fence[rail].push(cleanText[i]);
      rail += dir;
      if (rail === d - 1) dir = -1;
      else if (rail === 0) dir = 1;
    }

    const result = fence.map((r) => r.join('')).join('');
    const trace: TraceStep[] = [
      { from: 'DEPTH', fromCode: d, to: 'RAILS', toCode: d, note: `Zig-zag trajectory across ${d} rails` }
    ];

    return {
      result,
      trace,
      equation: `C = RailFence_Traverse(P, ${d} rails)`,
      keyspace: `${d} Rail Configurations (d ∈ [2..12])`,
      timeComplexity: 'O(N) Linear',
      additionalInfo: {
        depthRails: String(d),
        railDistribution: fence.map((r, idx) => `R${idx + 1}:${r.length}`).join(' ')
      }
    };
  } else {
    // Decryption: construct zig-zag grid mask
    const pattern: (string | null)[][] = Array.from({ length: d }, () =>
      Array(cleanText.length).fill(null)
    );

    let rail = 0;
    let dir = 1;
    for (let i = 0; i < cleanText.length; i++) {
      pattern[rail][i] = '*';
      rail += dir;
      if (rail === d - 1) dir = -1;
      else if (rail === 0) dir = 1;
    }

    // Place ciphertext characters into grid along rows
    let charIdx = 0;
    for (let r = 0; r < d; r++) {
      for (let c = 0; c < cleanText.length; c++) {
        if (pattern[r][c] === '*' && charIdx < cleanText.length) {
          pattern[r][c] = cleanText[charIdx++];
        }
      }
    }

    // Read characters along zig-zag columns
    let decoded = '';
    rail = 0;
    dir = 1;
    for (let i = 0; i < cleanText.length; i++) {
      decoded += pattern[rail][i] || '';
      rail += dir;
      if (rail === d - 1) dir = -1;
      else if (rail === 0) dir = 1;
    }

    return {
      result: decoded,
      trace: [
        { from: 'INVERSE', fromCode: d, to: 'RECONSTRUCT', toCode: d, note: `Matrix read along ${d} rail trajectories` }
      ],
      equation: `P = Inverse_RailFence(C, ${d} rails)`,
      keyspace: `${d} Rail Configurations`,
      timeComplexity: 'O(N) Linear',
      additionalInfo: {
        depthRails: String(d)
      }
    };
  }
}
