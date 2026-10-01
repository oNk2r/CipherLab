# CipherLab — Classical Cryptography Toolkit

An interactive, browser-based laboratory for exploring classical ciphers, modular mathematics, cryptanalysis, and text file encryption.

- **100% Client-Side:** Everything runs locally in your browser. No data leaves your machine.
- **Pure Implementation:** All 8 ciphers and math utilities are written from scratch with zero external crypto libraries.
- **Tested:** Includes an automated test suite with 37 unit tests covering algorithms and edge cases.

---

## Quick Start

### 1. Install & Run

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Open `http://localhost:3000` in your browser.

### 2. Run Tests

```bash
npm test
```

### 3. Build for Production

```bash
npm run build
```

---

## The 8 Ciphers

| Cipher | Type | Key | How It Works | Example |
|---|---|---|---|---|
| **Caesar Shift** | Substitution | Number (0–25) | Shifts each letter forward by a fixed number. Wraps around at Z. | `HELLO` + `3` $\to$ `KHOOR` |
| **Monoalphabetic** | Substitution | 26 unique letters | Replaces each letter using a scrambled alphabet lookup table. | `ATTACK` + Key $\to$ `QZZQEA` |
| **Playfair** | Digraph (pairs) | Keyword | Encrypts letter pairs using a 5×5 grid. Follows row, column, and rectangle rules. | `BALLOON` + `MONARCHY` $\to$ `IBSUPMNA` |
| **Hill (2×2)** | Polygraphic | 4 numbers ($2\times 2$ matrix) | Multiplies 2-letter vectors by an invertible key matrix modulo 26. | `HELP` + `[9, 4, 5, 7]` $\to$ `BLFE` |
| **Vigenère** | Polyalphabetic | Keyword | Applies repeating Caesar shifts based on the letters of a keyword. | `ATTACK` + `LEMON` $\to$ `LXFOPV` |
| **One-Time Pad** | Stream | Random letters | Adds a random key letter to each plaintext letter. Unbreakable if pad is never reused. | `SECRET` + `XMCKLP` $\to$ `PQEBPI` |
| **Rail Fence** | Transposition | Number of rails (2–12) | Writes letters in a zig-zag wave across rails, then reads off row by row. | `DEFEND` + `3 rails` $\to$ `DNET...` |
| **Columnar** | Transposition | Keyword | Writes text in rows, then reads out columns in alphabetical order of the key. | `DEFEND` + `ZEBRA` $\to$ `NEEF...` |

---

## Laboratory Tools

Beyond the main cipher workbench, CipherLab provides four specialized tools:

1. **Compare Matrix (Benchmark)**
   - Encrypts your text across all 8 ciphers simultaneously.
   - Compares live execution time, output size, and keyspace side-by-side.

2. **Frequency Attack & Caesar Cracker**
   - Displays a live letter frequency chart against standard English (`E`, `T`, `A`...).
   - Calculates the Index of Coincidence (IoC) to detect cipher types.
   - Uses a $\chi^2$ (Chi-Square) algorithm to automatically crack Caesar ciphertext without knowing the key.

3. **File Encryptor**
   - Encrypts and decrypts text files (`.txt`, `.md`, `.csv`, `.log`) entirely inside the browser.
   - Includes sample files, live preview, round-trip testing, and file download.

4. **Reference Guide & Workbook**
   - Explains the mathematical concepts behind the ciphers: modular arithmetic, $\gcd$, modular inverse, and matrix determinants.

---

## Project Structure

```
cipherlab/
├── docs/                 # Mini-project report, user manual & presentation
├── src/
│   ├── components/       # UI components & lab modals
│   ├── data/             # Cipher metadata, sample files & help content
│   ├── lib/
│   │   ├── ciphers/      # Pure TypeScript cipher algorithms
│   │   └── utils/        # Math helpers (gcd, modInverse, det) & key validation
│   ├── utils/            # Frequency analysis & Caesar auto-cracker
│   ├── App.tsx           # Main application shell
│   └── index.css         # Styling
├── tests/
│   └── ciphers.test.ts   # 37 automated unit tests
└── package.json
```

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS (Neo-Brutalist design)
- **Icons:** Lucide React
- **Testing:** tsx (37 unit tests passing)
