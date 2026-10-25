<div align="center">

#  Ludo & Friends Pro

### The Timeless Classic Reimagined Through Apple’s Fluid Design System & TypeSafe System One Intelligence

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Apple Design](https://img.shields.io/badge/Apple_Design-Fluid_HIG-000000?style=for-the-badge&logo=apple&logoColor=white)](https://developer.apple.com/design/)
[![TypeSafe AI](https://img.shields.io/badge/TypeSafe_AI-System_One_(Jev)-0066CC?style=for-the-badge)](https://typesafe.ai)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

> *"When we align the interface to the way we think and move, something magical happens — it stops feeling like a computer and starts feeling like a seamless extension of us."*  
> — **Apple Human Interface & Fluid Interface Design**

<br/>

</div>

---

## ✦ Table of Contents

- [Vision & Architectural Philosophy](#-vision--architectural-philosophy)
- [Apple Design System & Fluid Motion Engine](#-apple-design-system--fluid-motion-engine)
- [TypeSafe System One: Evaluation & Routing Pattern](#-typesafe-system-one-evaluation--routing-pattern)
- [2008 J2ME Retro Heritage: ANYPLAYS™ Preservation](#-2008-j2me-retro-heritage-anyplays-preservation)
- [Official Game Rules & Mathematical Matrix](#-official-game-rules--mathematical-matrix)
- [Features & Capabilities](#-features--capabilities)
- [Project Architecture & File Map](#-project-architecture--file-map)
- [Getting Started & Local Development](#-getting-started--local-development)
- [YouTube Playables Certified Lifecycle](#-youtube-playables-certified-lifecycle)
- [Credits & Historical Acknowledgments](#-credits--historical-acknowledgments)

---

## 🌟 Vision & Architectural Philosophy

**Ludo & Friends Pro** bridges almost two decades of interactive entertainment:
1. **The 2008 Java ME Classic Heritage:** Faithfully preserving the beloved mechanics and whimsical soul of *Ludo & Friends 1.0* by **ANYPLAYS™** (Movilenio Servicios Móviles S.L.), originally built for Nokia Symbian, Sony Ericsson, and BlackBerry devices.
2. **Apple’s Fluid Design System:** Re-engineered from the ground up as a museum-grade digital product adhering strictly to Apple's Human Interface Guidelines (WWDC 2018–2026), featuring Liquid Glass translucency, critically damped spring physics, SF Pro Display negative tracking, and Action Blue (`#0066cc`) interaction grammar.
3. **TypeSafe System One AI Intelligence:** Powered by TypeSafe’s flagship **Jev** System One model architecture, transforming raw board states into typed judgments, calibrated probabilities, and real-time strategic routing without generative latency.

```
       ┌─────────────────────────────────────────────────────────────┐
       │                    LUDO & FRIENDS PRO                     │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
         ▼                            ▼                            ▼
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│  APPLE DESIGN    │        │  TYPESAFE AI     │        │  J2ME RETRO      │
│  FLUID SYSTEM    │        │  SYSTEM ONE      │        │  ANYPLAYS (2008) │
├──────────────────┤        ├──────────────────┤        ├──────────────────┤
│• SF Pro Display  │        │• Jev Model v1    │        │• Paladin / Knight│
│• Liquid Glass    │        │• Choice / Score  │        │• Wizard / Orc    │
│• Action Blue     │        │• Noul Conditions │        │• Impassable Wall │
│• Critically      │        │• Tactical Route  │        │• +20 Kill Bonus  │
│  Damped Springs  │        │  Arbitration     │        │• +10 Goal Bonus  │
└──────────────────┘        └──────────────────┘        └──────────────────┘
```

---

## 🍏 Apple Design System & Fluid Motion Engine

This application implements Apple's Web Design System specifications down to the pixel:

### 1. Color System & Surface Alternation
- **Action Blue (`#0066cc`, focus: `#0071e3`, dark: `#2997ff`):** The singular brand interactive accent. Every "click me" signal, active pill, and focus indicator routes through Action Blue.
- **Parchment (`#f5f5f7`):** The signature Apple off-white canvas for light surfaces.
- **Near-Black Ink (`#1d1d1f`):** Used for typography on light surfaces to deliver photographic warmth rather than printed black.
- **Apple Studio Dark (`#19191b` / `#272729` Tile 1):** Museum gallery dark canvas where the product takes center stage.
- **Pure Black Void (`#000000`):** Pinned to the 44px `AppleGlobalNav` top bar and Pro OLED mode.
- **Apple Human Interface System Tints:**
  - Red: `#FF3B30` (Paladin)
  - Blue: `#007AFF` (Knight)
  - Green: `#34C759` (Wizard)
  - Amber / Orange: `#FF9500` (Orc)

### 2. Typographic Hierarchy
| Role | Font Family | Size | Weight | Line Height | Tracking | Purpose |
|---|---|---|---|---|---|---|
| **Hero Display** | SF Pro Display | 40px–56px | 600 | 1.07 | `-0.028em` | Hero section headlines |
| **Tagline** | SF Pro Display | 21px | 600 | 1.19 | `-0.231px` | Product sub-nav title |
| **Body (Apple Signature)** | SF Pro Text | 17px | 400 | 1.47 | `-0.015em` | Reading rhythm, descriptions |
| **Pill Buttons** | SF Pro Text | 14px–15px | 600 | 1.00 | `0` | Action Blue capsule pills |
| **Telemetry / Mono** | SF Mono | 11px–12px | 400 | 1.20 | `0` | TypeSafe AI JSON & scores |

> **Note on Tracking:** Large headlines strictly employ negative letter-spacing (`-0.022em` to `-0.028em`) to achieve the iconic "Apple tight" display cadence.

### 3. Physics & Fluid Motion (`apple-design-fluid`)
- **Latency Elimination:** Immediate feedback on pointer-down (`active:scale-95`), never waiting for pointer-up.
- **Critically Damped Springs:** Configured at damping ratio `1.0` (response `0.35s`) for UI transitions, preventing disruptive oscillation.
- **Momentum Springs:** Damping ratio `0.8` for momentum events such as 3D dice tosses and token hop strides.
- **Liquid Glass Materials:** `backdrop-filter: blur(20px) saturate(180%)` paired with a translucent white border-top highlight representing light catching the glass bevel.
- **Single Product Elevation:** Elevation follows Apple's rule: exactly one soft drop shadow under the board surface (`rgba(0, 0, 0, 0.22) 3px 5px 30px 0px`).

---

## 🧠 TypeSafe System One: Evaluation & Routing Pattern

Rather than delegating game moves to slow, unstructured large language model prompts, **Ludo & Friends Pro** leverages **TypeSafe System One models (Jev)**. System One provides fast, calibrated, typed judgments usable as programming primitives.

```
┌────────────────────────────────────────────────────────────────────────┐
│                     TYPESAFE SYSTEM ONE ARCHITECTURE                   │
└────────────────────────────────────────────────────────────────────────┘

  [ Game Board State ] ──▶ [ extractSystemOneState() ]
                                    │
                                    ▼
                 ┌──────────────────────────────────────┐
                 │   TYPESAFE JEV SYSTEM ONE ENGINE     │
                 ├──────────────────────────────────────┤
                 │ • Choice: Strategic Route Selection  │
                 │ • Score:  5-Point Risk Dimension     │
                 │ • Noul:   Kill / Wall Probabilities  │
                 └──────────────────┬───────────────────┘
                                    │
           ┌────────────────────────┼────────────────────────┐
           ▼                        ▼                        ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  AI STRATEGIC MOVE  │  │ REAL-TIME ASSISTANT │  │  SOCIAL SENTIMENT   │
│  EXECUTION          │  │ TELEMETRY OVERLAY   │  │  & SAFETY ROUTING   │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

### The Three Foundational Primitives

#### 1. Choice Primitive (Categorical Route Selection)
Evaluates candidate actions across six defined strategic playbooks:
```typescript
type StrategicRoute =
  | 'OFFENSIVE_STRIKE'   // Land on opponent -> Send to yard (+20 bonus stride)
  | 'SANCTUARY_RETREAT'  // Seek shelter on safe star cell or colored column
  | 'GOAL_RUSH'          // Advance directly into victory center (+10 bonus stride)
  | 'FORTIFY_WALL'       // Form impassable 2-token blockade
  | 'MOBILIZE_RESERVE'   // Roll 5 -> Deploy fresh counter from home base
  | 'TACTICAL_TEMPO';    // Reposition runner to minimize counterattack exposure
```

#### 2. Score Primitive (Ordered Risk & Tension Gradients)
Discretizes multidimensional risk and tension into 5 calibrated levels:
- **Level 1 (NEGLIGIBLE):** Destination is a safe haven (star cell) or unthreatened.
- **Level 2 (LOW):** Trailing opponents are distant (> 6 cells away).
- **Level 3 (MODERATE):** Active race; opponent is within potential multi-turn range.
- **Level 4 (HIGH):** Direct line-of-fire within 1–6 cells of an approaching hunter.
- **Level 5 (CRITICAL):** Lethal exposure; non-safe tile directly exposed to multiple foes.

#### 3. Noul Primitive (Condition Probabilities)
Returns calibrated $P \in [0.0, 1.0]$:
- `is_kill_opportunity` ($P \ge 0.95$ when enemy single counter is vulnerable)
- `is_wall_formation` ($P \ge 0.90$ when partnering with own counter)
- `is_safe_refuge` ($P \ge 0.95$ on safe cells or home stretch)
- `requires_moderation` (toxicity & harassment detection for in-game chat)

### Real-Time Assistant & Developer Inspector
Players can toggle the **TypeSafe Intelligence Panel** directly from the top navigation to view live probabilities, strategic rationale, and inspected JSON payloads on every roll.

---

## 🕹️ 2008 J2ME Retro Heritage: ANYPLAYS™ Preservation

In 2008, Spanish mobile game studio **Movilenio Servicios Móviles S.L.** under their **ANYPLAYS™** publishing label launched *Ludo & Friends 1.0*. This project honors their original work:

### The Original 4 Character Classes
| Character | Color | Role | Personality & Archetype |
|---|---|---|---|
| 🦁 **Paladin** | Red | Vanguard | Bold offensive breaker; excels at yard breakouts |
| 🐲 **Knight** | Blue | Defender | Fortified wall master; controls bottleneck safe cells |
| 🧙 **Wizard** | Green | Strategist | Precision runner; calculates exact home goal approaches |
| 🦊 **Orc** | Yellow | Conqueror | Ambush hunter; pursues +20 elimination bonuses |

---

## 📜 Official Game Rules & Mathematical Matrix

```
                      [ GREEN HOME YARD ]
                              │
                    [06] [07] [08] ★ [10] [11]
                     ▲                      │
                     │   [ CENTER GOAL ]    ▼
[ RED HOME YARD ] ──▶│       ★ 🏆 ★        │◀── [ BLUE HOME YARD ]
                     ▲                      │
                     │   [50] [51] [00] ★   ▼
                              │
                     [ YELLOW HOME YARD ]
```

1. **Deploying from Home Base:** A roll of **5** is required to bring a counter out of the home yard onto the start position.
2. **Rolling a 6:** Grants an immediate extra turn.
3. **Triple 6 Penalty:** Rolling three consecutive sixes penalizes the player by immediately returning their last moved counter back to home base!
4. **Impassable Walls (Blockades):** When two counters of the same color occupy the same cell, they form an impassable wall. No counter can jump or pass through. If a player rolls a 6 and owns an active wall, the wall must be broken!
5. **Elimination & +20 Bonus Stride:** Landing on a tile occupied by a single opponent counter captures it, sending it back to their yard, and awards the capturing player an instant **20-cell bonus stride** for any of their other active tokens.
6. **Safe Cells (★):** Counters resting on safe star cells cannot be eliminated or captured.
7. **Exact Goal Entry & +10 Bonus:** Entering the center goal cell requires the exact roll number. Successful arrival grants a **10-cell bonus stride** to another counter.

---

## ⚡ Features & Capabilities

-  **Four Apple Themes:** Apple Studio Dark, Ceramic Light, Pro OLED Void, and Heritage Wood Table.
- 🎲 **Fluid Spring 3D Dice:** Physics-based tumbling animations with tactile recessed pips.
- 🏃 **Parabolic Token Hopping:** Smooth frame-by-frame hop animations along the 52-cell track.
- 🤖 **TypeSafe System One CPU:** Intelligent opponent routing balancing offense, defense, and safety.
- 👥 **Real-time Multiplayer:** Instant room creation, code-based invites, and synchronized turns powered by Supabase.
- 💬 **In-Game Chat & Sentiment:** Instant messaging with TypeSafe AI sentiment classification and quick reactions.
- 🔊 **Zero-Dependency Web Audio:** Procedural synthesis of dice rumbles, token steps, fanfare, and retro pings.
- ↩️ **Full Undo & Redo History:** Snapshot-based local state rollback for human practice turns.
- 📱 **Fully Responsive Layout:** Optimized from iPhone compact touch targets (44px) up to ultra-wide desktop displays (1440px).

---

## 📁 Project Architecture & File Map

```
Ludo-Board-Game/
├── src/
│   ├── components/
│   │   ├── AppleGlobalNav.tsx          #  44px pure black top navigation bar
│   │   ├── AppleSubNav.tsx             #  52px frosted glass sub-nav with action pill
│   │   ├── TypeSafeAssistantPanel.tsx  # Live System One Jev telemetry overlay
│   │   ├── TypeSafeStudioView.tsx      # Interactive System One pipeline simulator
│   │   ├── RetroHeritageModal.tsx      # 2008 J2ME historical gallery & credits
│   │   ├── HeritageArchiveView.tsx     # Full page evolution of ANYPLAYS 2008 -> 2026
│   │   ├── LudoBoard.tsx               # Apple squircle board with single drop-shadow
│   │   ├── TokenPiece.tsx              # Fluid specular glass tokens with spring hop
│   │   ├── Dice.tsx                    # Chamfered squircle die with tumble physics
│   │   ├── PlayerPanel.tsx             # Frosted pill player capsules with turn glow
│   │   ├── RulesModal.tsx              # Clean Apple typography rulebook dialog
│   │   ├── GameSetup.tsx               # Pre-match roster & avatar configurator
│   │   ├── MultiplayerLobby.tsx        # Real-time room matchmaking
│   │   ├── GameChat.tsx                # Social chat with emoji reaction tray
│   │   └── VictoryScreen.tsx           # Confetti fanfare & match statistics
│   ├── lib/
│   │   ├── typeSafeAI.ts               # TypeSafe System One Jev Engine & Primitives
│   │   ├── ludoGame.ts                 # Core board game rules & deterministic engine
│   │   ├── soundManager.ts             # Web Audio API procedural sound synthesizer
│   │   └── ytPlayables.ts              # YouTube Playables certified SDK bridge
│   ├── test/
│   │   ├── typeSafeAI.test.ts          # Unit tests for System One primitives
│   │   └── example.test.ts             # General test suite
│   ├── index.css                       # Apple Design tokens, typography & materials
│   └── main.tsx                        # React application root
├── tailwind.config.ts                  # Apple colors, typography & spring keyframes
├── package.json                        # Dependencies & scripts
└── README.md                           # Documentation
```

---

## 🚀 Getting Started & Local Development

### Prerequisites
- **Node.js:** v18.0.0 or higher (v26.x recommended)
- **npm:** v9.0.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/Rahul08319/Ludo-Board-Game.git
cd Ludo-Board-Game

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Running Unit Tests

```bash
# Run Vitest test suite
npm test
```

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📺 YouTube Playables Certified Lifecycle

The game includes full native hooks for the **YouTube Playables SDK**:
- `yt.firstFrameReady()` fired on initial component mount.
- `yt.gameReady()` triggered as soon as the board stage is interactable.
- `yt.onAudioEnabledChange()` synchronized directly with the Web Audio manager.
- `yt.onPause()` & `yt.onResume()` state serialization via `yt.saveData()` and `yt.loadData()`.
- Rewarded Ads integration with `yt.requestRewardedAd()` for guaranteed rolls.

---

## 🏆 Credits & Historical Acknowledgments

### Original 2008 J2ME Creation
- **Original Title:** *Ludo & Friends 1.0* (Java ME)
- **Publisher:** ANYPLAYS™ / Movilenio Servicios Móviles S.L. (2008)
- **Software Engineering:** Iñaki Segrelles
- **Art & Sprites:** Pablo Sánchez
- **Music & MIDI Score:** José Vázquez
- **Quality Assurance:** José Jimeno

### Modern Apple & TypeSafe Edition (2026)
- **Design & Architecture:** Built with the **Apple Design System** & **Apple Fluid Interfaces**.
- **Artificial Intelligence:** Integrated with **TypeSafe System One Models (Jev)**.
- **Repository Maintainer:** [Rahul08319](https://github.com/Rahul08319)

---

<div align="center">
  <p>Crafted with uncompromising attention to detail, reverence for retro gaming history, and cutting-edge agentic design.</p>
  <p> Designed in California & Bangalore • Licensed under the MIT License</p>
</div>
