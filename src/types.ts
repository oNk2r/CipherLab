export type CipherId = 
  | 'caesar'
  | 'mono'
  | 'playfair'
  | 'hill'
  | 'vigenere'
  | 'otp'
  | 'railfence'
  | 'columnar';

export interface TraceStep {
  from: string;
  fromCode: number | string;
  to: string;
  toCode: number | string;
  note?: string;
}

export interface CipherResult {
  result: string;
  trace: TraceStep[];
  equation: string;
  keyspace: string;
  timeComplexity: string;
  additionalInfo?: Record<string, string>;
  error?: string;
  warning?: string;
}

export interface CipherMeta {
  id: CipherId;
  name: string;
  category: 'SUBSTITUTION' | 'TRANSPOSITION' | 'POLYGRAPHIC' | 'POLYALPHABETIC' | 'VERNAM / OTP' | 'PERMUTATION' | 'RANDOM MAP' | 'DIGRAPH';
  cardColor: string;
  buttonHoverColor: string;
  badge: string;
  description: string;
  formula: string;
  inventorOrEra: string;
  keyspaceText: string;
  resistanceText: string;
}

export interface LetterFrequency {
  letter: string;
  count: number;
  percentage: number;
  expectedPercentage: number;
}
