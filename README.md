# Remotion Motion Graphics Framework

A scalable, reusable, and modular motion graphics framework built with **Remotion**, **React**, and **TypeScript**. 

Designed to produce modern commercial advertisements inspired by the visual language of premium technology and mobility brands (such as Uber), characterized by high-contrast monochrome surfaces, surgical typography, fluid spring dynamics, and deterministic frame execution.

---

## 1. Project Overview

The framework establishes a decoupled, four-tier architecture separating isolated component prototyping from final commercial advertisement assembly:

```
┌────────────────────────────────────────────────────────┐
│             Layer 1: Motion Playground                 │
│    (Isolated testing, inspection & A/B tuning)         │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│             Layer 2: Component Library                 │
│      (Atomic motion, typography, UI, mockups)          │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│               Layer 3: Scene Library                   │
│   (Multi-component visual sections & safe layouts)     │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│         Layer 4: Advertisement Composition             │
│    (Final assembly, multi-scene timeline, audio)       │
└────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

- **Framework**: [Remotion](https://www.remotion.dev) (v4.0.545)
- **UI Engine**: React 19 + TypeScript 5
- **Bundler & Tooling**: Rspack via Remotion CLI
- **Iconography**: Lucide React
- **Design Tokens**: Centralized TypeScript token system (`Colors`, `Typography`, `Spacing`, `Motion`)
- **Animation Primitives**: Pure deterministic Remotion engine:
  - `useCurrentFrame()`
  - `useVideoConfig()`
  - `interpolate()`
  - `spring()`
  - `Easing`
  - `Sequence`

> **Deterministic Rule**: All animations are strictly calculated per-frame. The framework does NOT use CSS transitions, CSS keyframe animations, `setTimeout`, `setInterval`, or browser-dependent timers for rendered motion.

---

## 3. Architecture & Layer Responsibilities

### Layer 1: Motion Playground (`src/playground/`)
- **Composition**: `MotionPlayground`
- **Purpose**: Dedicated development and evaluation sandbox.
- **Responsibilities**:
  - Independent testing and previewing of components in isolation.
  - Side-by-side A/B comparison of motion parameters (e.g. Snappy vs Smooth springs).
  - Telemetry HUD displaying canvas resolution, active FPS, frame number, and SMPTE timecode.
  - Category filtering across all 6 component types without modifying the core player.

### Layer 2: Component Library (`src/components/`)
- **Purpose**: Atomic, reusable visual and motion building blocks.
- **Subdirectories**:
  1. `motion/`: Masked reveals, alpha fades, spring scale-ins, and stagger orchestrators.
  2. `typography/`: Display heroes, hierarchical headlines, rolling animated counters, kinetic text.
  3. `ui/`: Mobile-inspired metric cards, CTA buttons, status badges, progress bars.
  4. `mockups/`: Device hardware frames (smartphones, browsers, cards) with perspective tilt.
  5. `graphics/`: Technical coordinate grids, ambient gradient mesh spots, animated vector paths.
  6. `transitions/`: Directional bar wipes, camera slides, and zoom-in crossfades.

### Layer 3: Scene Library (`src/scenes/`)
- **Purpose**: Pre-composed, multi-component visual sections.
- **Responsibilities**:
  - Manages layered z-index hierarchy (`Background`, `Content`, `Overlay`).
  - Standardizes entrance, hold, and exit lifecycles via `SceneTimingConfig`.
  - Enforces action-safe and title-safe zones (default 80px for 1080p).
  - Provides modular layouts (`SplitScreen`, `CenteredHero`, `MetricShowcase`).

### Layer 4: Advertisement Composition (`src/compositions/`)
- **Composition**: `PlaceholderAd`
- **Purpose**: Final commercial assembly pipeline.
- **Responsibilities**:
  - Sequences scene templates across time using `<Sequence />`.
  - Coordinates soundtrack and SFX audio tracks.
  - Configures delivery formats (16:9 Landscape, 9:16 Vertical, 1:1 Square, 4K).
  - Exports final broadcast-ready video files.

---

## 4. Folder Structure

```
src/
├── assets/                  # Static media assets & manifests
│   ├── audio/               # Voiceovers, music, SFX
│   ├── fonts/               # Custom web fonts
│   ├── icons/               # SVG assets & vector symbols
│   ├── images/              # Raster images & product captures
│   ├── videos/              # Video loops & alpha clips
│   └── index.ts
│
├── components/              # Layer 2: Reusable Component Library
│   ├── graphics/            # Grids, gradient mesh, vector paths
│   ├── mockups/             # Device bezels, browser frames, perspective cards
│   ├── motion/              # Reveals, fades, scale-in, stagger groups
│   ├── transitions/         # Scene wipes, slides, zooms
│   ├── typography/          # DisplayHero, headlines, counters, kinetic text
│   ├── ui/                  # Badges, CTA buttons, metric cards, progress bars
│   ├── types.ts             # Base component props & metadata interfaces
│   └── index.ts
│
├── config/                  # Framework & Video Configuration
│   ├── project.ts           # Project metadata & layer registry
│   ├── video.ts             # Video resolution presets (1080p, 4K, 9:16)
│   └── index.ts
│
├── compositions/            # Layer 4: Final Commercial Compositions
│   ├── advertisements/      # Ad compositions (PlaceholderAd, future campaigns)
│   ├── configs/             # Scene sequence maps, audio configs
│   ├── types.ts             # Campaign & sequence contracts
│   └── index.ts
│
├── hooks/                   # Custom deterministic Remotion hooks
│   ├── useMotionTimeline.ts # Relative frame progress & window status
│   └── index.ts
│
├── playground/              # Layer 1: Motion Playground Sandbox
│   ├── components/          # StageCanvas, ShowcaseCard, CategorySection, VariantComparator
│   ├── layouts/             # PlaygroundShell (telemetry header, category nav, footer)
│   ├── showcases/           # Registry & blueprint placeholders for all 6 categories
│   ├── types.ts             # Playground state, view modes, and showcase contracts
│   ├── MotionPlayground.tsx # Main Playground composition
│   └── index.ts
│
├── scenes/                  # Layer 3: Scene Templates & Layouts
│   ├── layouts/             # Grid, split-screen, and centered layouts
│   ├── templates/           # BaseScene layered template
│   ├── types.ts             # Scene props, timing, and background configs
│   └── index.ts
│
├── styles/                  # Design System Foundation (Uber-inspired)
│   ├── tokens/              # Unified token export
│   ├── colors.ts            # High-contrast dark neutrals & surgical accents
│   ├── typography.ts        # Modular type scale (Hero 96px -> Micro 10px)
│   ├── spacing.ts           # 8-point geometric scale, radii, canvas safe padding
│   ├── motion.ts            # Standard frame durations, springs, easing curves
│   └── global.css           # Global reset & canvas CSS variables
│
├── utils/                   # Pure deterministic animation utilities
│   ├── animation/           # Spring helpers, clamped interpolate, easing curves
│   ├── helpers/             # Layout and positioning helpers
│   ├── timing/              # Frame-to-second converters, timecode, stagger delays
│   └── index.ts
│
├── Root.tsx                 # Remotion root registering compositions
└── index.ts                 # Entry point calling registerRoot()
```

---

## 5. Installation Instructions

1. Ensure **Node.js** (v20.19.0, v22.13.0, or >=24) is installed.
2. Clone or open the workspace directory.
3. Install dependencies:
   ```bash
   npm install
   ```

---

## 6. Development Commands

| Command | Action |
|---|---|
| `npm run dev` | Launch interactive Remotion Studio (`http://localhost:3000`) |
| `npm run lint` | Run ESLint and TypeScript typecheck (`tsc --noEmit`) |
| `npm run build` | Bundle code with Rspack to verify bundle integrity |
| `npm run upgrade` | Upgrade Remotion packages to latest matching release |

---

## 7. Rendering Commands

To render video compositions via the Remotion CLI:

```bash
# Render Motion Playground (Layer 1)
npx remotion render src/index.ts MotionPlayground out/playground.mp4

# Render Commercial Ad Composition (Layer 4)
npx remotion render src/index.ts PlaceholderAd out/commercial-ad.mp4

# Render with specific frame range
npx remotion render src/index.ts PlaceholderAd out/ad-clip.mp4 --frames=0-60
```

---

## 8. Component Development Conventions

When developing new components for **Layer 2**:

1. **Deterministic Frame Logic**:
   - Derive all animations from `useCurrentFrame()` and `useVideoConfig()`.
   - Never use `useEffect`, `requestAnimationFrame`, or CSS transition delays.
2. **Prop Standards**:
   - Extend `BaseMotionProps` from `src/components/types.ts`.
   - Support `delay` (in frames), `durationInFrames`, `springPreset`, and `easing`.
3. **Token Usage**:
   - Import colors from `src/styles/colors.ts`.
   - Import typography styles from `src/styles/typography.ts`.
   - Import spacing and radii from `src/styles/spacing.ts`.
   - Import spring physics presets from `src/styles/motion.ts`.
4. **Registration in Motion Playground**:
   - Add the component definition to `src/playground/showcases/showcaseRegistry.ts`.
   - Connect the component preview inside `src/playground/showcases/`.

---

## 9. Extending the Framework

```
Step 1: Prototype in Playground (Layer 1)
        └── Create component preview in playground/showcases/
Step 2: Implement Component (Layer 2)
        └── Author clean functional component in components/<category>/
Step 3: Assemble into Scene (Layer 3)
        └── Wrap with BaseScene in scenes/templates/ or scenes/layouts/
Step 4: Sequence into Ad (Layer 4)
        └── Add scene to sequence map in compositions/advertisements/
```

---

## 10. Development Sequence & Roadmap

- **Phase 1: Project Foundation** *(Current)*  
  Initialize architecture, centralized design tokens, base configurations, Root registration, and TypeScript setup.
- **Phase 2: Motion Playground** *(Current)*  
  Establish the interactive testing shell, telemetry header, category navigation, and A/B variant comparison harness.
- **Phase 3: Motion Utilities & Hooks**  
  Implement advanced spatial curves, multi-stage spring sequences, and sound cue sync helpers.
- **Phase 4: Reusable Component Library**  
  Implement atomic motion primitives, kinetic typography, mobile UI widgets, and hardware mockups.
- **Phase 5: Scene Library**  
  Implement pre-composed scene templates (SplitScreen, CenteredHero, MetricShowcase).
- **Phase 6: Advertisement Composition**  
  Assemble final commercial advertisements combining scenes, dynamic props, and narrative flow.
- **Phase 7: Audio, Polish, & Rendering**  
  Sound design integration, dynamic SFX triggers, final color grading, and multi-format export.
