import { gcd, det2x2 } from './math';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  warningMessage?: string;
}

export function validateCaesarKey(shift: unknown): ValidationResult {
  const s = Number(shift);
  if (isNaN(s)) {
    return { isValid: false, errorMessage: 'Shift must be a valid number.' };
  }
  if (!Number.isInteger(s)) {
    return { isValid: false, errorMessage: 'Shift must be an integer.' };
  }
  return { isValid: true };
}

export function validateMonoalphabeticKey(key: string): ValidationResult {
  const clean = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (clean.length !== 26) {
    return {
      isValid: false,
      errorMessage: `Key must be exactly 26 letters (currently ${clean.length}).`
    };
  }
  const unique = new Set(clean);
  if (unique.size !== 26) {
    const missing: string[] = [];
    for (let i = 65; i <= 90; i++) {
      const char = String.fromCharCode(i);
      if (!unique.has(char)) missing.push(char);
    }
    return {
      isValid: false,
      errorMessage: `Key contains duplicate letters. Missing: ${missing.join(', ')}`
    };
  }
  return { isValid: true };
}

export function validatePlayfairKey(keyword: string): ValidationResult {
  const clean = keyword.toUpperCase().replace(/[^A-Z]/g, '');
  if (clean.length === 0) {
    return {
      isValid: false,
      errorMessage: 'Keyword must contain at least one letter.'
    };
  }
  return { isValid: true };
}

export function validateHillMatrix(matrix: [number, number, number, number]): ValidationResult {
  const [a, b, c, d] = matrix;
  if ([a, b, c, d].some(v => isNaN(v) || !Number.isInteger(v))) {
    return {
      isValid: false,
      errorMessage: 'All 4 matrix entries [a, b, c, d] must be integers.'
    };
  }

  const det = det2x2(matrix);
  if (det === 0) {
    return {
      isValid: false,
      errorMessage: 'Determinant is 0 (mod 26). Singular matrix cannot be inverted.'
    };
  }

  const g = gcd(det, 26);
  if (g !== 1) {
    const factor = det % 2 === 0 ? 'even (shares factor 2)' : 'divisible by 13';
    return {
      isValid: false,
      errorMessage: `Determinant (${det}) is ${factor} with 26. gcd(det, 26) = ${g} ≠ 1. Invertible matrix required! (Try: [9, 4, 5, 7] or [3, 3, 2, 5])`
    };
  }

  return { isValid: true };
}

export function validateVigenereKey(keyword: string): ValidationResult {
  const clean = keyword.toUpperCase().replace(/[^A-Z]/g, '');
  if (clean.length === 0) {
    return {
      isValid: false,
      errorMessage: 'Keyword must contain at least one alphabetic letter.'
    };
  }
  return { isValid: true };
}

export function validateOTPKey(keyStream: string, textLength: number): ValidationResult {
  const cleanKey = keyStream.toUpperCase().replace(/[^A-Z]/g, '');
  if (cleanKey.length === 0) {
    return {
      isValid: false,
      errorMessage: 'Keystream cannot be empty. True random pad required.'
    };
  }
  if (cleanKey.length < textLength) {
    return {
      isValid: false,
      errorMessage: `One-Time Pad requires key length >= message length. Key: ${cleanKey.length}, Message: ${textLength}. (Click RANDOM to generate)`
    };
  }
  return { isValid: true };
}

export function validateRailFenceKey(rails: unknown, textLength: number = 0): ValidationResult {
  const r = Number(rails);
  if (isNaN(r) || !Number.isInteger(r) || r < 2) {
    return {
      isValid: false,
      errorMessage: 'Rail Fence depth must be an integer of at least 2 rails.'
    };
  }
  if (textLength > 0 && r > textLength) {
    return {
      isValid: true,
      warningMessage: `Rail count (${r}) exceeds text length (${textLength}).`
    };
  }
  return { isValid: true };
}

export function validateColumnarKey(keyword: string): ValidationResult {
  const clean = keyword.toUpperCase().replace(/[^A-Z]/g, '');
  if (clean.length < 2) {
    return {
      isValid: false,
      errorMessage: 'Columnar key must have at least 2 letters for column permutation.'
    };
  }
  return { isValid: true };
}
