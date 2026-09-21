import { CipherMeta } from '../types';

export const CIPHERS_METADATA: CipherMeta[] = [
  {
    id: 'caesar',
    name: 'Caesar Shift',
    category: 'SUBSTITUTION',
    cardColor: '#FFE066',
    buttonHoverColor: '#FFE066',
    badge: 'SUBSTITUTION',
    description: 'Shift each plaintext character forward by a fixed numeric key (K mod 26). The bedrock of classical cryptography.',
    formula: 'Cᵢ = (Pᵢ + K) mod 26',
    inventorOrEra: '50 BC (Julius Caesar)',
    keyspaceText: '26 Keys (25 non-trivial)',
    resistanceText: 'Trivial (< 0.01s Brute-force)'
  },
  {
    id: 'mono',
    name: 'Monoalphabetic',
    category: 'RANDOM MAP',
    cardColor: '#C9A7FF',
    buttonHoverColor: '#C9A7FF',
    badge: 'RANDOM MAP',
    description: 'Map every letter to an arbitrary shuffled alphabet substitution table. Vulnerable to frequency cryptanalysis.',
    formula: 'C = π(P), π ∈ S₂₆',
    inventorOrEra: '9th Century (Al-Kindi)',
    keyspaceText: '26! ≈ 4.03 × 10²⁶ keys',
    resistanceText: 'Vulnerable to Unigram Frequency'
  },
  {
    id: 'playfair',
    name: 'Playfair Cipher',
    category: 'DIGRAPH',
    cardColor: '#B8F28B',
    buttonHoverColor: '#B8F28B',
    badge: 'DIGRAPH',
    description: 'First practical digraph substitution system. Encrypts paired letters across a 5×5 keyed coordinate matrix.',
    formula: 'C_pair = Grid_Rules(P_pair)',
    inventorOrEra: '1854 AD (Charles Wheatstone)',
    keyspaceText: '25! ≈ 1.55 × 10²⁵ keys',
    resistanceText: 'Moderate (Digraph Frequency Analysis)'
  },
  {
    id: 'hill',
    name: 'Hill Cipher',
    category: 'POLYGRAPHIC',
    cardColor: '#5ED9D1',
    buttonHoverColor: '#5ED9D1',
    badge: 'POLYGRAPHIC',
    description: 'Matrix-based polygraphic substitution invented by Lester S. Hill. Employs linear algebra and modular inverses.',
    formula: 'C = K · P mod 26',
    inventorOrEra: '1929 AD (Lester S. Hill)',
    keyspaceText: 'GL(2, Z₂₆) = 157,248 matrices',
    resistanceText: 'Vulnerable to Known Plaintext'
  },
  {
    id: 'vigenere',
    name: 'Vigenère Cipher',
    category: 'POLYALPHABETIC',
    cardColor: '#FF7373',
    buttonHoverColor: '#FF7373',
    badge: 'POLYALPHABETIC',
    description: '"Le Chiffre Indéchiffrable" — Uses a repeating keyword to weave shifting Caesar alphabets across the message.',
    formula: 'Cᵢ = (Pᵢ + K[i mod m]) mod 26',
    inventorOrEra: '1586 AD (Blaise de Vigenère)',
    keyspaceText: '26^m (m = key length)',
    resistanceText: 'Defeated by Kasiski / Babbage'
  },
  {
    id: 'otp',
    name: 'One-Time Pad',
    category: 'VERNAM / OTP',
    cardColor: '#FFFFFF',
    buttonHoverColor: '#FFFFFF',
    badge: 'VERNAM / OTP',
    description: 'Mathematically unbreakable cipher when keys are truly random, used once, and equal message length.',
    formula: 'C = P ⊕ K, H(M|C) = H(M)',
    inventorOrEra: '1917 AD (Gilbert Vernam & Joseph Mauborgne)',
    keyspaceText: '26^N Infinite Key Space',
    resistanceText: 'Unbreakable (Shannon Secrecy)'
  },
  {
    id: 'railfence',
    name: 'Rail Fence',
    category: 'TRANSPOSITION',
    cardColor: '#ECDCFF',
    buttonHoverColor: '#ECDCFF',
    badge: 'TRANSPOSITION',
    description: 'Transposition cipher writing characters in a zig-zag trajectory across depth rails before collecting rows.',
    formula: 'C = ZigZag(P, depth)',
    inventorOrEra: 'Ancient Greece',
    keyspaceText: 'Depth Rails (typically 2–12)',
    resistanceText: 'Weak (Trivial Anagramming)'
  },
  {
    id: 'columnar',
    name: 'Columnar',
    category: 'PERMUTATION',
    cardColor: '#E4F98E',
    buttonHoverColor: '#E4F98E',
    badge: 'PERMUTATION',
    description: 'Permute message columns based on alphabetical sort order of a secret keyword. Keeps frequencies, ruins bigrams.',
    formula: 'C = Permute_Cols(P, sort(Key))',
    inventorOrEra: 'American Civil War / WWI',
    keyspaceText: 'K! Permutations',
    resistanceText: 'Vulnerable to Multiple Anagramming'
  }
];

export const SAMPLE_TEXTS = [
  "NETWORK SECURITY",
  "ATTACK AT DAWN",
  "THE EAGLE HAS LANDED",
  "CRYPTOGRAPHY EXCELLENCE",
  "KERCKHOFFS PRINCIPLE",
  "SECRET CODE RED",
  "VENI VIDI VICI"
];
