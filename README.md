# CipherLab — Classical Cryptography Toolkit

CipherLab is an interactive, tactile educational laboratory for classical ciphers, modular mathematics, cryptanalysis, and client-side file encryption. Built with React, TypeScript, and Vite in a vibrant Neo-Brutalist design.

100% client-side execution — all encryption, decryption, matrix transformations, and file processing happen entirely in your browser with zero server data transfer and no external API keys required.

---

## Features

### 1. Interactive Workspace (8 Classical Ciphers)
- **Caesar Shift**: Character shifts in $\mathbb{Z}_{26}$ ($C = (P + K) \pmod{26}$) with quick shift presets (Shift 3, ROT13).
- **Monoalphabetic Substitution**: Arbitrary letter permutations ($\pi \in S_{26}$) with random shuffle and round-trip fidelity.
- **Playfair Cipher**: 5×5 keyed digraph coordinate matrix with automatic rule transformations and double-letter padding.
- **Hill 2×2 Matrix**: Linear algebra polygraphic substitution ($C = K \cdot P \pmod{26}$) with real-time determinant and modular invertibility verification.
- **Vigenère Polyalphabetic**: Periodic keyword stream substitution ($C_i = (P_i + K_i) \pmod{26}$).
- **One-Time Pad (Vernam)**: Mathematically unbreakable modular stream cipher with auto-expanding pseudo-random keystream pad generation.
- **Rail Fence Transposition**: Depth rail zig-zag trajectory transposition (2–12 rails).
- **Columnar Transposition**: Exact irregular columnar permutation based on keyword alphabetical sort rank.

### 2. Advanced Laboratory Tools
- **Compare Matrix**: Simultaneous benchmark testing across all 8 ciphers measuring execution speed, ciphertext size, and keyspace dimension.
- **Frequency Attack & Brute Force**: Automated letter frequency analysis, Index of Coincidence ($\text{IoC}$), and $\chi^2$ (Chi-Square) goodness-of-fit Caesar cracker.
- **File Encryptor & Batch Processor**: Client-side text file encryption (`.txt`, `.md`, `.csv`, `.log`) with pre-configured sample files, live text editing, round-trip transfer (`Use Output as Input`), and file downloads.
- **Reference Guide & Workbook**: Interactive mathematical foundation handbook covering modular arithmetic, Euclid's GCD, modular inverses, matrix algebra, and classical cryptanalysis.

---

## Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm**

### Installation

```bash
# Clone or navigate to the project directory
cd cipherlab-—-classical-cryptography-toolkit

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the local development server (runs on port 3000 / 3001)
npm run dev
```

### Running the Test Suite

```bash
# Executes the full mathematical and cipher invariant test suite (37 tests)
npm test
```

### Building for Production

```bash
# Type-check and generate production bundle
npm run build
```

---

## Tech Stack
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS + Custom Neo-Brutalist Design Tokens
- **Icons**: Material Symbols + Lucide Icons
- **Testing**: tsx + custom assertion test suite (37 tests)
