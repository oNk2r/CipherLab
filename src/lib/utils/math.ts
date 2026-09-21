/**
 * Mathematical utilities for classical cryptography.
 * Implements modular arithmetic and linear algebra in Z_26.
 */

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Mathematical modulo that always returns a positive integer in [0, m - 1].
 */
export function mod(n: number, m: number = 26): number {
  return ((n % m) + m) % m;
}

/**
 * Extended Euclidean Greatest Common Divisor.
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Modular Multiplicative Inverse in Z_m: finds x such that (a * x) % m === 1.
 * Returns null if gcd(a, m) !== 1.
 */
export function modInverse(a: number, m: number = 26): number | null {
  a = mod(a, m);
  if (gcd(a, m) !== 1) {
    return null;
  }
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      return x;
    }
  }
  return null;
}

/**
 * Computes determinant of a 2x2 matrix: [a, b; c, d] -> (ad - bc) mod 26.
 */
export function det2x2(matrix: [number, number, number, number]): number {
  const [a, b, c, d] = matrix;
  return mod(a * d - b * c, 26);
}

/**
 * Computes the modular inverse of a 2x2 matrix modulo 26.
 * K = [a, b; c, d]
 * K^-1 = det^-1 * [d, -b; -c, a] mod 26
 * Returns null if det is not coprime to 26.
 */
export function invMatrix2x2(matrix: [number, number, number, number]): [number, number, number, number] | null {
  const [a, b, c, d] = matrix;
  const det = det2x2(matrix);
  const invDet = modInverse(det, 26);

  if (invDet === null) {
    return null;
  }

  const m00 = mod(d * invDet, 26);
  const m01 = mod(-b * invDet, 26);
  const m10 = mod(-c * invDet, 26);
  const m11 = mod(a * invDet, 26);

  return [m00, m01, m10, m11];
}
