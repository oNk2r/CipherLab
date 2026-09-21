export interface SampleFileItem {
  id: string;
  name: string;
  filename: string;
  description: string;
  recommendedCipher?: string;
  recommendedKey?: string | number | [number, number, number, number];
  content: string;
}

export const SAMPLE_FILE_PRESETS: SampleFileItem[] = [
  {
    id: 'dispatch',
    name: 'Classified Dispatch',
    filename: 'classified_dispatch.txt',
    description: 'Plaintext tactical transmission with military coordinates and authentication code.',
    recommendedCipher: 'caesar',
    recommendedKey: 3,
    content: `TOP SECRET // EYES ONLY // OPERATION ZEPHYR
COMMENCING AT 0400 HOURS. ALL UNITS MAINTAIN STRICT RADIO SILENCE UNTIL RENDEZVOUS AT COORDINATES GRID DELTA-9.
AUTHENTICATION CODE: SIGMA-SEVEN-BRAVO.
VERIFY INTEGRITY BEFORE ADVANCING.`
  },
  {
    id: 'diplomatic',
    name: 'Diplomatic Cable',
    filename: 'diplomatic_cable.txt',
    description: 'Plaintext diplomatic memorandum suitable for polyalphabetic and transposition ciphers.',
    recommendedCipher: 'vigenere',
    recommendedKey: 'CIPHER',
    content: `CONFIDENTIAL DIPLOMATIC MEMORANDUM
TO: SPECIAL ENVOY
FROM: MINISTRY OF FOREIGN AFFAIRS
SUBJECT: RATIFICATION OF ACCORDS

THE PROPOSED COVENANT HAS BEEN REVIEWED AND APPROVED BY THE SUPREME COUNCIL.
SECURE ALL ORIGINAL MANUSCRIPTS AND TRANSMIT SIGNATURES IMMEDIATELY.`
  },
  {
    id: 'caesar_intercept',
    name: 'Caesar Intercept (Shift 3)',
    filename: 'caesar_intercept.txt',
    description: 'Pre-encrypted ciphertext file. Select Caesar Shift 3 and click Decrypt to crack it!',
    recommendedCipher: 'caesar',
    recommendedKey: 3,
    content: `WRS VHFUHW // HBHV RQOB // RSHUDWLRQ CHSKBU
FRPPHQFLQJ DW 0400 KRXUV. DOO XQLWV PDLQWDLQ VWULFW UDGLR VLOHQFH XQWLO UHQGHCYRXV DW FRRUGLQDWHV JULG GHOWD-9.
DXWKHQWLFDWLRQ FRGH: VLJPD-VHYHQ-EUDYR.
YHULIB LQWHJULWB EHIRUH DGYDQFLQJ.`
  },
  {
    id: 'quick_note',
    name: 'Quick Test Note',
    filename: 'test_note.txt',
    description: 'Short pangram sentence for instantaneous verification across any algorithm.',
    recommendedCipher: 'railfence',
    recommendedKey: 3,
    content: `THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG
ATTACK AT DAWN ON THE NORTHEASTERN RIDGE`
  }
];
