import { CipherId } from '../types';

export interface CipherHelpInfo {
  id: CipherId;
  name: string;
  type: string;
  archetype: 'SUBSTITUTION' | 'TRANSPOSITION' | 'POLYGRAPHIC' | 'POLYALPHABETIC' | 'VERNAM / OTP';
  whatItIs: string;
  howEncryptionWorks: string;
  howDecryptionWorks: string;
  keyRequirements: string;
  smallExample: {
    plaintext: string;
    key: string;
    step: string;
    ciphertext: string;
  };
}

export const CIPHERS_HELP_DATA: Record<CipherId, CipherHelpInfo> = {
  caesar: {
    id: 'caesar',
    name: 'Caesar Shift Cipher',
    type: 'Monoalphabetic Substitution',
    archetype: 'SUBSTITUTION',
    whatItIs: 'A foundational cipher where each letter in the plaintext is shifted forward by a fixed numeric offset K in the alphabet.',
    howEncryptionWorks: 'Convert letter P to index 0–25 (A=0 ... Z=25). Compute C ≡ (P + K) mod 26 and convert back to a character.',
    howDecryptionWorks: 'Subtract the shift key modulo 26: P ≡ (C - K) mod 26 ≡ (C + 26 - K) mod 26.',
    keyRequirements: 'An integer shift value K ∈ [0, 25]. (Typically K = 3 for Julius Caesar, or K = 13 for ROT13).',
    smallExample: {
      plaintext: 'HELLO',
      key: 'Shift = 3',
      step: 'H(7)+3=K(10), E(4)+3=H(7), L(11)+3=O(14), L(11)+3=O(14), O(14)+3=R(17)',
      ciphertext: 'KHOOR'
    }
  },
  mono: {
    id: 'mono',
    name: 'Monoalphabetic Substitution',
    type: 'Arbitrary Permutation Substitution',
    archetype: 'SUBSTITUTION',
    whatItIs: 'Replaces every letter of the standard alphabet with a distinct corresponding letter from a shuffled 26-character substitution alphabet.',
    howEncryptionWorks: 'Map plaintext character at index i to character π[i] from the secret permutation key.',
    howDecryptionWorks: 'Find the position of ciphertext character in the key alphabet and look up the corresponding standard alphabet letter at that index.',
    keyRequirements: 'A permutation string of exactly 26 unique letters (A–Z) with no duplicates or missing letters (Keyspace: 26! ≈ 4.03 × 10²⁶).',
    smallExample: {
      plaintext: 'ATTACK',
      key: 'QWERTYUIOPASDFGHJKLZXCVBNM',
      step: 'A→Q, T→Z, T→Z, A→Q, C→E, K→A',
      ciphertext: 'QZZQEA'
    }
  },
  playfair: {
    id: 'playfair',
    name: 'Playfair Cipher',
    type: 'Digraph Substitution',
    archetype: 'POLYGRAPHIC',
    whatItIs: 'The first practical digraph cipher, encrypting pairs of letters instead of single letters using a 5×5 keyed coordinate matrix.',
    howEncryptionWorks: 'Fill 5×5 grid with keyword (omitting duplicates, merging J with I), then remaining alphabet. Split plaintext into 2-letter digraphs (inserting X between repeated letters). Apply rules: Same Row → shift right; Same Column → shift down; Rectangle → swap column coordinates.',
    howDecryptionWorks: 'Apply inverse geometric rules on digraphs: Same Row → shift left; Same Column → shift up; Rectangle → swap column coordinates.',
    keyRequirements: 'A keyword or phrase (non-empty). Automatically sanitizes "J" to "I" to fit 25 grid cells.',
    smallExample: {
      plaintext: 'BALLOON (split to BA LX LO ON)',
      key: 'MONARCHY',
      step: 'BA (Rectangle) → IB, LX (Rectangle) → SU, LO (Rectangle) → PM, ON (Same Row) → NA',
      ciphertext: 'IBSUPMNA'
    }
  },
  hill: {
    id: 'hill',
    name: 'Hill Cipher (2×2 Matrix)',
    type: 'Polygraphic Linear Algebra Substitution',
    archetype: 'POLYGRAPHIC',
    whatItIs: 'An algebraic cipher invented by Lester S. Hill that encrypts blocks of letters as vectors multiplied by an invertible key matrix modulo 26.',
    howEncryptionWorks: 'Group plaintext into 2-character column vectors [p1, p2]ᵀ. Multiply by key matrix K: [c1, c2]ᵀ ≡ [a·p1 + b·p2, c·p1 + d·p2]ᵀ mod 26.',
    howDecryptionWorks: 'Multiply ciphertext vectors by inverse key matrix: P ≡ K⁻¹ · C mod 26, where K⁻¹ = det(K)⁻¹ · [d, -b; -c, a] mod 26.',
    keyRequirements: 'A 2×2 integer matrix [a, b; c, d] where determinant det(K) = (ad - bc) mod 26 is coprime to 26 (i.e. gcd(det, 26) = 1).',
    smallExample: {
      plaintext: 'HELP (grouped as [H, E]=[7, 4], [L, P]=[11, 15])',
      key: 'Matrix [9, 4; 5, 7] (det = 17, gcd(17, 26)=1)',
      step: '[9·7 + 4·4, 5·7 + 7·4] mod 26 = [79, 63] mod 26 = [1, 11] = [B, L]',
      ciphertext: 'BLFE'
    }
  },
  vigenere: {
    id: 'vigenere',
    name: 'Vigenère Cipher',
    type: 'Polyalphabetic Substitution',
    archetype: 'POLYALPHABETIC',
    whatItIs: 'Historically known as "Le Chiffre Indéchiffrable", it uses a repeating keyword to apply cycling Caesar shifts across consecutive characters.',
    howEncryptionWorks: 'For character i, shift by key character K[i mod m]: Cᵢ ≡ (Pᵢ + K[i mod m]) mod 26.',
    howDecryptionWorks: 'Subtract the repeating key character value: Pᵢ ≡ (Cᵢ - K[i mod m]) mod 26.',
    keyRequirements: 'An alphabetic keyword of length m ≥ 1. Longer keywords provide greater resistance against Kasiski periodic frequency attacks.',
    smallExample: {
      plaintext: 'ATTACK',
      key: 'LEMON (repeated)',
      step: 'A(0)+L(11)=L, T(19)+E(4)=X, T(19)+M(12)=F, A(0)+O(14)=O, C(2)+N(13)=P, K(10)+L(11)=V',
      ciphertext: 'LXFOPV'
    }
  },
  otp: {
    id: 'otp',
    name: 'One-Time Pad (Vernam)',
    type: 'Information-Theoretic Stream Cipher',
    archetype: 'VERNAM / OTP',
    whatItIs: 'The only mathematically unbreakable encryption system, proven by Claude Shannon in 1949 to achieve Perfect Secrecy (H(M|C) = H(M)).',
    howEncryptionWorks: 'Each character is added modulo 26 to a truly random, non-repeating key character: Cᵢ ≡ (Pᵢ + Kᵢ) mod 26.',
    howDecryptionWorks: 'Subtract the exact identical keystream character: Pᵢ ≡ (Cᵢ - Kᵢ) mod 26.',
    keyRequirements: 'Key must be truly random (entropy), used exactly ONCE, and length(Key) ≥ length(Plaintext). Never reuse the pad.',
    smallExample: {
      plaintext: 'SECRET',
      key: 'XMCKLP (true random pad)',
      step: 'S(18)+X(23)=P(15), E(4)+M(12)=Q(16), C(2)+C(2)=E(4), R(17)+K(10)=B(1), E(4)+L(11)=P(15), T(19)+P(15)=I(8)',
      ciphertext: 'PQEBPI'
    }
  },
  railfence: {
    id: 'railfence',
    name: 'Rail Fence Cipher',
    type: 'Transposition (Zig-Zag Permutation)',
    archetype: 'TRANSPOSITION',
    whatItIs: 'A geometric transposition cipher that writes characters in a zig-zag wave along a set number of depth rails, then reads characters off row by row.',
    howEncryptionWorks: 'Place characters diagonally down and up across d rails. When finished, concatenate rail 1, rail 2, ..., rail d.',
    howDecryptionWorks: 'Create a template matrix marking the zig-zag bounce positions, fill in the characters along the rows, and read off column by column.',
    keyRequirements: 'An integer rail count depth d ≥ 2 (typically 2 to 12).',
    smallExample: {
      plaintext: 'DEFEND THE EAST',
      key: '3 Rails',
      step: 'R1: D...N...E...T\nR2: .E.E.D.T.E.A.S.\nR3: ..F...H...S..\nRead rows: DNET + EEDTEAS + FHS',
      ciphertext: 'DNETEEDTEASFHS'
    }
  },
  columnar: {
    id: 'columnar',
    name: 'Columnar Transposition',
    type: 'Permutation Transposition',
    archetype: 'TRANSPOSITION',
    whatItIs: 'A transposition cipher where plaintext is written horizontally into rows of width K, and ciphertext is read out vertically by ordering columns alphabetically according to a keyword.',
    howEncryptionWorks: 'Write text into grid of width = length(Keyword). Rank key letters alphabetically. Read each column in ascending alphabetical rank.',
    howDecryptionWorks: 'Determine column lengths from message length, place ciphertext into columns in key rank order, and read row by row.',
    keyRequirements: 'A keyword of length ≥ 2. Duplicate letters are handled deterministically using stable ranking.',
    smallExample: {
      plaintext: 'DEFENDTHEEAST',
      key: 'ZEBRA (Rank: A=1, B=2, E=3, R=4, Z=5)',
      step: 'Grid width 5:\nZ E B R A\nD E F E N\nD T H E E\nA S T\nRead cols in rank 1-5 (A, B, E, R, Z): NEE + FHT + ETS + EE + DDA',
      ciphertext: 'NEEFHTETSEEDDA'
    }
  }
};
