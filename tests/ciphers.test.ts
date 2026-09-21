/**
 * CipherLab Classical Cryptography Test Suite
 * Validates mathematical correctness, bidirectional round-trips,
 * empty input handling, and invalid key rejection for all 8 ciphers.
 */

import {
  runCaesar,
  runMonoalphabetic,
  runPlayfair,
  runHill,
  runVigenere,
  runOTP,
  runRailFence,
  runColumnar
} from '../src/lib/ciphers';

import {
  gcd,
  mod,
  modInverse,
  det2x2,
  invMatrix2x2
} from '../src/lib/utils/math';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName} ${details ? `(${details})` : ''}`);
    failed++;
  }
}

console.log('=== RUNNING CIPHERLAB ALGORITHM TEST SUITE ===\n');

// 0. Mathematical Utilities
console.log('[Module 0: Mathematical Foundations]');
assert(gcd(9, 26) === 1, 'gcd(9, 26) === 1');
assert(gcd(4, 26) === 2, 'gcd(4, 26) === 2');
assert(mod(-5, 26) === 21, 'mod(-5, 26) === 21');
assert(mod(27, 26) === 1, 'mod(27, 26) === 1');
assert(modInverse(9, 26) === 3, 'modInverse(9, 26) === 3 because (9 * 3) % 26 === 1');
assert(modInverse(4, 26) === null, 'modInverse(4, 26) === null (even, non-coprime)');
const hillKey: [number, number, number, number] = [9, 4, 5, 7];
const det = det2x2(hillKey); // 9*7 - 4*5 = 63 - 20 = 43 = 17 mod 26
assert(det === 17, 'det2x2([9, 4, 5, 7]) === 17');
assert(gcd(det, 26) === 1, 'det(17) coprime to 26');
const invH = invMatrix2x2(hillKey);
assert(invH !== null, 'invMatrix2x2 returns valid inverse matrix');
if (invH) {
  // Check K * K^-1 = I mod 26
  const [a, b, c, d] = hillKey;
  const [ia, ib, ic, id] = invH;
  const r00 = mod(a * ia + b * ic, 26);
  const r01 = mod(a * ib + b * id, 26);
  const r10 = mod(c * ia + d * ic, 26);
  const r11 = mod(c * ib + d * id, 26);
  assert(r00 === 1 && r01 === 0 && r10 === 0 && r11 === 1, 'K * K^-1 === Identity Matrix mod 26');
}

// 1. Caesar Shift
console.log('\n[Module 1: Caesar Shift]');
const caesarEnc = runCaesar('HELLO WORLD', 3, true, true);
assert(caesarEnc.result === 'KHOOR ZRUOG', 'Caesar Encryption: "HELLO WORLD" + 3 -> "KHOOR ZRUOG"');
const caesarDec = runCaesar(caesarEnc.result, 3, false, true);
assert(caesarDec.result === 'HELLO WORLD', 'Caesar Decryption: recovers "HELLO WORLD"');
const caesarRoundTrip = runCaesar(runCaesar('NETWORK SECURITY CS304', 17, true, true).result, 17, false, true);
assert(caesarRoundTrip.result === 'NETWORK SECURITY CS304', 'Caesar Round-Trip Invariant');
assert(runCaesar('', 5).result === '', 'Caesar Empty Input Handling');
assert(runCaesar('TEST', NaN).error !== undefined, 'Caesar Invalid NaN Key Rejection');

// 2. Monoalphabetic Substitution
console.log('\n[Module 2: Monoalphabetic Substitution]');
const monoKey = 'QWERTYUIOPASDFGHJKLZXCVBNM';
const monoEnc = runMonoalphabetic('ATTACK AT DAWN', monoKey, true, true);
assert(monoEnc.result === 'QZZQEA QZ RQVF', 'Monoalphabetic Encryption mapping');
const monoDec = runMonoalphabetic(monoEnc.result, monoKey, false, true);
assert(monoDec.result === 'ATTACK AT DAWN', 'Monoalphabetic Decryption round-trip');
const invalidMono = runMonoalphabetic('TEST', 'DUPLICATEKEYWITHDUPLICATE');
assert(invalidMono.error !== undefined, 'Monoalphabetic Invalid Key Rejection (duplicates / length != 26)');

// 3. Playfair Cipher
console.log('\n[Module 3: Playfair Cipher]');
const playfairEnc = runPlayfair('BALLOON', 'MONARCHY', true, false);
// BALLOON: paired as BA LX LO ON -> transformed via MONARCHY 5x5 grid
assert(playfairEnc.result.length === 8, 'Playfair pads double letters and odd length to pairs (len 8)');
const playfairDec = runPlayfair(playfairEnc.result, 'MONARCHY', false, false);
assert(playfairDec.result.startsWith('BALXLOON'), 'Playfair Decryption recovers digraph sequence with filler X');
const playfairInvalid = runPlayfair('HELLO', '');
assert(playfairInvalid.error !== undefined, 'Playfair Empty Key Rejection');

// 4. Hill Cipher
console.log('\n[Module 4: Hill 2x2 Matrix]');
const hillValidKey: [number, number, number, number] = [9, 4, 5, 7];
const hillEnc = runHill('HELP', hillValidKey, true, false);
assert(hillEnc.result.length === 4, 'Hill Encrypts 4-char text to 4 chars');
const hillDec = runHill(hillEnc.result, hillValidKey, false, false);
assert(hillDec.result === 'HELP', 'Hill Decryption Round-Trip: recovers "HELP"');
const hillInvalidKey: [number, number, number, number] = [2, 4, 6, 8]; // det = 16 - 24 = -8 = 18 mod 26 (gcd(18, 26) = 2 != 1)
const hillBad = runHill('HELP', hillInvalidKey, true, false);
assert(hillBad.error !== undefined, 'Hill Non-Invertible Matrix Rejection (det shares factor 2 with 26)');

// 5. Vigenère Cipher
console.log('\n[Module 5: Vigenère Cipher]');
const vigEnc = runVigenere('ATTACKATDAWN', 'LEMON', true, true);
assert(vigEnc.result === 'LXFOPVEFRNHR', 'Vigenère Encryption: "ATTACKATDAWN" with "LEMON" -> "LXFOPVEFRNHR"');
const vigDec = runVigenere(vigEnc.result, 'LEMON', false, true);
assert(vigDec.result === 'ATTACKATDAWN', 'Vigenère Decryption: recovers "ATTACKATDAWN"');
const vigRoundTrip = runVigenere(runVigenere('SECRET MESSAGE WITH SPACES', 'KEYWORD', true, true).result, 'KEYWORD', false, true);
assert(vigRoundTrip.result === 'SECRET MESSAGE WITH SPACES', 'Vigenère Round-Trip with Spaces');
assert(runVigenere('TEST', '').error !== undefined, 'Vigenère Empty Key Rejection');

// 6. One-Time Pad
console.log('\n[Module 6: One-Time Pad / Vernam]');
const otpText = 'CONFIDENTIAL';
const otpStream = 'QAZWSXEDCRFVTGBYHN';
const otpEnc = runOTP(otpText, otpStream, true, true);
assert(otpEnc.result.length === otpText.length, 'OTP generates exact matching length');
const otpDec = runOTP(otpEnc.result, otpStream, false, true);
assert(otpDec.result === otpText, 'OTP Decryption Round-Trip Invariant');
const otpShort = runOTP(otpText, 'SHORT', true, true);
assert(otpShort.error !== undefined, 'OTP Key Length < Text Length Rejection');

// 7. Rail Fence Cipher
console.log('\n[Module 7: Rail Fence Transposition]');
const rfText = 'DEFEND THE EAST WALL';
const rfEnc = runRailFence(rfText, 3, true, true);
const rfDec = runRailFence(rfEnc.result, 3, false, true);
assert(rfDec.result === rfText, 'Rail Fence 3 Rails Round-Trip Invariant');
const rf5 = runRailFence('CRYPTOGRAPHY EXCELLENCE', 5, true, false);
const rf5Dec = runRailFence(rf5.result, 5, false, false);
assert(rf5Dec.result === 'CRYPTOGRAPHYEXCELLENCE', 'Rail Fence 5 Rails Round-Trip without Spaces');
assert(runRailFence('TEST', 1).error !== undefined, 'Rail Fence Rejects Rails < 2');

// 8. Columnar Transposition
console.log('\n[Module 8: Columnar Transposition]');
const colText = 'DEFENDTHEEASTWALL';
const colKey = 'GERMAN';
const colEnc = runColumnar(colText, colKey, true, true);
const colDec = runColumnar(colEnc.result, colKey, false, true);
assert(colDec.result === colText, 'Columnar Transposition Round-Trip (Irregular Grid without Lossy Padding)');
const colWithSpaces = 'ATTACK AT DAWN TODAY';
const colSpEnc = runColumnar(colWithSpaces, 'ZEBRAS', true, true);
const colSpDec = runColumnar(colSpEnc.result, 'ZEBRAS', false, true);
assert(colSpDec.result === colWithSpaces, 'Columnar Transposition Round-Trip with Spaces');
assert(runColumnar('TEST', 'A').error !== undefined, 'Columnar Key Rejection (< 2 letters)');

console.log(`\n========================================`);
console.log(`TEST SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
