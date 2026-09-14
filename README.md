# 🧩 PuzzleMaster: Interview Edition

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-6.2-646cff?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Puzzles-25%20Interactive%20Games-8b5cf6?style=for-the-badge" alt="25 Puzzles" />
  <img src="https://img.shields.io/badge/Target-FAANG%20%2F%20Tier%201-f59e0b?style=for-the-badge" alt="FAANG" />
</p>

An interactive, gamified web platform for mastering classic **FAANG & Tier-1 tech interview puzzles**. Rather than just reading static answers, candidates can play through **custom visual simulations**, experiment with constraints, test hypotheses in real-time, and unlock progressive hints, formal mathematical proofs, and algorithmic insights.

---

## 📸 Screenshots

### 1. Level Map & Themeable Dashboard
Explore all 25 puzzles categorized by logic, math, arrangement, and spatial reasoning. Filter instantly by target employer (**Google**, **Microsoft**, **Amazon**, **Apple**, **Meta**, **Goldman Sachs**), search keywords in real-time, bookmark favorites, and switch between 5 curated visual themes with ambient glow effects.

![Level Map Dashboard](screenshots/level_map.png)

#### 🎨 5 Dynamic Color Themes
Customize your learning environment with instant theme switching:
- **Cyber Indigo:** Deep futuristic tech aesthetic with violet & indigo accents.
- **Emerald Matrix:** Terminal hacker vibe with neon emerald & mint highlights.
- **Violet Nebula:** Cosmic dark space atmosphere with vivid purple & fuchsia glow.
- **Crimson Ember:** Fiery high-energy styling with rose & orange contrasts.
- **Golden Amber:** Warm, luxurious amber & bronze tones.

![Themes Matrix Preview](screenshots/themes_matrix.png)

---

### 2. Inside the Puzzles: Interactive Mini-Games

Every single puzzle includes a dedicated, responsive simulation built specifically for its constraints:

#### 🛶 River Crossing (Wolf, Goat & Cabbage) — Puzzle #21
A real-time river simulation with a Left Bank, Right Bank, and Rowboat. Enforces predator-prey rules and safe transport sequences.

![River Crossing Demo](screenshots/river_crossing.png)

#### 🚪 The 100 Doors Problem — Puzzle #25
A 10×10 visual door matrix simulation with step-by-step pass controls, fast-forward automation, and a dynamic Divisor Factor Inspector explaining factor parity.

![100 Doors Matrix Demo](screenshots/hundred_doors_matrix.png)

#### 🥢 Matchstick Puzzle — Puzzle #18
Interactive 2×2 geometric grid where players reposition matchsticks to discover nested multi-scale squares.

![Matchstick Demo](screenshots/matchstick_demo.png)

#### 🏆 Star Rewards & Performance Summary
Track your moves, time, and stars earned upon mastering each challenge.

![Puzzle Solved Modal](screenshots/puzzle_solved_modal.png)

---

## 📚 Complete Question Catalog (25 Puzzles)

| # | Puzzle Name | Category | Difficulty | Companies | Core Algorithmic Concept |
|---|---|---|---|---|---|
| **1** | **Water Jug Problem** | 🧠 Logical | Medium | Google, Microsoft, Goldman Sachs | Extended Euclidean & Bézout's Identity ($ax + by = d$) |
| **2** | **3 Bulbs and 3 Switches** | 🧠 Logical | Medium | Amazon, Qualcomm, MakeMyTrip | State Expansion via Thermal Physics (3-state encoding) |
| **3** | **Monty Hall Problem** | 📐 Math | Medium | Meta, Netflix, VMware | Bayesian Updating & Conditional Probability ($P = 2/3$) |
| **4** | **2 Eggs & 100 Floors** | 📐 Math | Hard | Google, Microsoft, Uber | Minimax Search & Triangular Numbers ($\frac{x(x+1)}{2} \ge 100$) |
| **5** | **Torch & Bridge** | 📐 Math | Medium | Google, Microsoft, Adobe | Greedy Pitfall & Slower Pair Parallelism (17 minutes) |
| **6** | **3 Ants on a Triangle** | 🔷 Spatial | Easy | Amazon, Intuit, ZS Associates | Independence Combinatorics ($2/2^n = 1/4$) |
| **7** | **Chessboard & Dominos** | 🔷 Spatial | Medium | Google, Palantir, Jane Street | Coloring Invariant & Graph Bipartite Matching |
| **8** | **3 Cuts for 8 Cake Pieces** | 🔷 Spatial | Medium | Adobe, Cognizant, Accenture | 3D Spatial Partitioning (Euler characteristics) |
| **9** | **50 Red & 50 Blue Marbles** | 📐 Math | Medium | Google, Microsoft, Twitter | Asymmetric Probability Maximization ($P \approx 74.7\%$) |
| **10** | **Days of Month with 2 Dice** | 🎯 Arrangement | Medium | Microsoft, Amazon, Morgan Stanley | Symmetry & Resource Folding ($6 \to 9$ inversion) |
| **11** | **10 Balls in 5 Lines** | 🎯 Arrangement | Hard | Deloitte, Cognizant, Publicis | Projective Geometry & Pentagram Dual Intersections |
| **12** | **Snail & Wall** | 📐 Math | Easy | TCS, Infosys, Wipro | Termination Check Before Loop Decrement (Off-by-one) |
| **13** | **Mislabeled Jars** | 🧠 Logical | Easy | Google, Microsoft, Apple | Constraint Satisfaction (Highest degree of constraint) |
| **14** | **100 Prisoners & Hats** | 🧠 Logical | Hard | Google, Microsoft, Palantir | Parity Bit & XOR Error Detection (Hamming Codes) |
| **15** | **Heaven & Hell** | 🧠 Logical | Easy | Amazon, Infosys, Bloomberg | Boolean Logic Involution & Inverting Gate Composition |
| **16** | **Camel & Banana** | 🧠 Logical | Hard | Amazon, Flipkart | Piecewise Linear Optimization & Dynamic Checkpoints |
| **17** | **Poison & Rat (Binary Bottles)** | 📐 Math | Hard | Amazon, Meta, Goldman Sachs | Information Theory & Binary Encoding ($2^k \ge N$) |
| **18** | **Matchstick Puzzle** | 🎯 Arrangement | Medium | Apple, Meta, Epic Systems | Multi-scale Geometric Reframing |
| **19** | **Round Table Coin Game** | 🎯 Arrangement | Medium | Goldman Sachs, Morgan Stanley | Game Theory & Point-Symmetric Invariants |
| **20** | **9 Dots Puzzle** | 🔷 Spatial | Medium | Apple, IDEO, Disney | Lateral Thinking & Boundary Constraint Elimination |
| **21** | **River Crossing (Wolf, Goat, Cabbage)** | 🧠 Logical | Medium | Google, Amazon, Microsoft | State-Space Graph Traversal & Backtracking |
| **22** | **Counterfeit Coin & Balance Scale** | 📐 Math | Hard | Goldman Sachs, Microsoft, Palantir | Ternary Search Trees & Scale Balancing ($3^k \ge N$) |
| **23** | **Burning Ropes (Measure 45 Min)** | 🧠 Logical | Medium | Google, Bloomberg, Apple | Non-Uniform Rate Integration & Flame Invariants |
| **24** | **Tower of Hanoi** | 🎯 Arrangement | Medium | Microsoft, Amazon, Cisco | Divide & Conquer Recursion ($T(n) = 2^n - 1$) |
| **25** | **The 100 Doors Problem** | 📐 Math | Easy | Amazon, Microsoft, Infosys | Number Theory & Divisor Parity (Square numbers) |

---

## ✨ Key Features

- **🎮 25 Interactive Simulations:** Custom interactive game demos for all 25 puzzles with move tracking, resets, and undo support.
- **🎨 5 Curated Color Themes:** Switch seamlessly across Cyber Indigo, Emerald Matrix, Violet Nebula, Crimson Ember, and Golden Amber with dynamic background glow and accent adaptation.
- **🔊 Web Audio Synthesizer:** Zero-dependency procedural sound effects for theme changes, moves, hint reveals, errors, and victory fanfares with persistent mute toggle.
- **✨ Enhanced Modern UI:** Built with Google Fonts (*Plus Jakarta Sans*, *Outfit*, *JetBrains Mono*), glassmorphic backdrops, smooth gradient badges, and responsive stats hero banner.
- **💡 3-Tier Progressive Hints:** Gradually reveals clues without spoiling the core breakthrough.
- **📐 Mathematical Proofs & Interview Breakdowns:** Rigorous formal explanations and edge case analysis.
- **⚡ Algorithmic Insights:** Connects each puzzle directly to data structures and algorithms (graphs, DP, binary search, information theory).
- **🏷️ Company Quick Filters & Instant Search:** Filter questions asked at Google, Microsoft, Amazon, Apple, Meta, and Goldman Sachs, or search by concept.
- **⭐ Favorites & Bookmarking:** Save challenging puzzles to review before your interview rounds.
- **📋 Formula & Logic Cheat Sheet Modal:** Quick-reference cheat sheet for Bézout's identity, Bayes' theorem, ternary scale bounds, and factor parity.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `bun`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Suraj6769/Puzzle-Interview-Question.git
   cd Puzzle-Interview-Question
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Type check & Lint:**
   ```bash
   npm run lint
   ```

---

## 🔐 Multi-User Authentication & Isolated Progress

PuzzleMaster includes a multi-account authentication and persistence service (`src/utils/authStorage.ts`):
- **Candidate Profiles:** Register custom candidate accounts specifying Name, Email, Target Company (**Google, Meta, Amazon, Apple, Microsoft, Goldman Sachs**), and Target Role (**L3/L4/L5 SWE**, **Quant Researcher**, **System Architect**).
- **Per-User Isolated Storage:** Progress, stars, completed levels, bookmarks, and streak metrics are completely separated per user (`puzzlemaster_progress_user_<id>`). When a new user creates an account, they begin fresh with zero solved levels and can independently solve puzzles.
- **1-Click Candidate Presets:** Instant test candidate switching:
  - **Alex Chen (Google Candidate):** 7 solved puzzles, 18 stars.
  - **Priya Sharma (Meta Candidate):** 12 solved puzzles, 34 stars.
  - **Marcus Vance (Amazon Candidate):** 20 solved puzzles, 58 stars.
- **Instant Guest Mode:** Jump directly into the application without registration.

---

## 📈 Difficulty-First Learning Progression

All 25 puzzles are canonically ordered and numbered to ensure optimal cognitive ramp-up:

| Tier | Levels | Difficulty | Focus Areas | Key Examples |
|:---:|:---:|:---:|:---|:---|
| **Tier 1** | **Levels 1–5** | 🟢 **Easy** | Parity, invariants, lateral reasoning, and mathematical fundamentals. | *Heaven & Hell (#1)*, *Mislabeled Jars (#2)*, *Snail & Wall (#3)*, *3 Ants on a Triangle (#4)*, *The 100 Doors Problem (#5)* |
| **Tier 2** | **Levels 6–19** | 🟡 **Medium** | State machines, probability, recursive transitions, and minimax optimization. | *Water Jug (#6)*, *3 Bulbs & Switches (#7)*, *Monty Hall (#8)*, *Torch & Bridge (#9)*, *River Crossing (#17)*, *Tower of Hanoi (#19)* |
| **Tier 3** | **Levels 20–25** | 🔴 **Hard** | Information theory, binary coding, ternary trees, and extreme minimax DP. | *100 Prisoners & Hats (#20)*, *Camel & Banana (#21)*, *2 Eggs & 100 Floors (#22)*, *Poison & Rat (#23)*, *Balance Scale (#25)* |

---

## 📱 Mobile App Experience & PWA / Capacitor

PuzzleMaster is engineered with mobile-first responsiveness:
- **Mobile Bottom Navigation Bar:** Dedicated bottom tab bar on mobile phones with 4 tabs:
  - **Puzzles:** Grid of interactive puzzle cards with search and company filters.
  - **Tiers:** Visual 3-tier roadmap with progress meters and quick-launch buttons.
  - **Mastery:** Real-time readiness gauge, star count, candidate rank, and domain breakdown.
  - **Profile:** Candidate credentials, theme switcher, sound effects toggle, and sign out.
- **Progressive Web App (PWA):** Equipped with `public/manifest.json`, high-resolution app squircle icon (`public/icon.svg`), and mobile web app meta tags for instant **"Add to Home Screen"** on iOS Safari and Android Chrome.
- **Native Mobile Apps (Capacitor):** Pre-configured `capacitor.config.ts` ready to build native Android APKs and iOS Xcode projects:
  ```bash
  npm i @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
  npx cap add android
  npx cap sync
  npx cap open android
  ```

---

## 🛠️ Technology Stack

- **Frontend Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript 5.8](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Bundler & Dev Server:** [Vite 6](https://vitejs.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Visual Effects:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio Engine:** Native Web Audio API Synthesizer
- **Mobile Runtime:** Progressive Web App (PWA) + Capacitor Config

---

## 📄 License

This project is licensed under the Apache-2.0 License.
