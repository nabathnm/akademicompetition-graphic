# GlitchTransition Component Documentation

`GlitchTransition` is a configurable, deterministic digital distortion transition for Remotion motion graphics. It simulates authentic digital tape degradation, signal infiltration, RGB channel separation (chromatic aberration), horizontal slice tearing, vertical jitter, digital noise blocks, CRT scanlines, and strobe flicker.

---

## 1. Architecture & Design Principles

```
                     ┌────────────────────────────┐
                     │     useCurrentFrame()      │
                     └─────────────┬──────────────┘
                                   │
                                   ▼
            ┌──────────────────────────────────────────────┐
            │ calculateGlitchMetrics()                     │
            │   • Progress u in [0, 1]                     │
            │   • Mode Envelope E(u)                       │
            │   • Seeded PRNG (FNV-1a + Mulberry32)        │
            │     - Is Glitch Frame trigger                │
            │     - Slices: clipPath + translateX/Y        │
            │     - RGB Chromatic Aberration: (dx, dy)     │
            │     - Vertical Jitter: jitterY               │
            │     - Strobe: flickerBrightness & opacity    │
            │     - Noise Blocks: [(x, y, w, h, col)]      │
            │     - Scanline Opacity                       │
            └──────────────────────┬───────────────────────┘
                                   │
                                   ▼
               ┌───────────────────────────────────────┐
               │         Glitch Layer Stack            │
               │   1. Sliced strip containers          │
               │   2. Red chromatic ghost (feColorMat) │
               │   3. Cyan chromatic ghost             │
               │   4. Digital macroblock artifacts     │
               │   5. Repeating CRT scanlines          │
               └───────────────────────────────────────┘
```

### Determinism via Seeded PRNG
In video rendering frameworks like Remotion, multiple worker processes render arbitrary frame sequences concurrently. Using `Math.random()`, `setTimeout`, or `requestAnimationFrame` breaks frame reproducibility across rendering threads.

`GlitchTransition` solves this with a two-stage deterministic PRNG:
1. **FNV-1a Hash**: Combines `(seed, frame, salt)` into a high-entropy 32-bit integer:
   $$h = \text{hashSeed}(\text{seed}, \text{frame}, \text{salt})$$
2. **Mulberry32 Generator**: Converts $h$ into a uniform pseudo-random float $r \in [0, 1)$:
   $$r = \text{pseudoRandom}(h)$$
For any fixed seed and frame, the generated slice displacements, jitter offsets, chromatic shifts, and noise blocks are 100% identical on every render run.

---

## 2. Visual Effects

| Effect | Implementation | Visual Appearance |
|:---|:---|:---|
| **Horizontal Slices** | `clipPath: polygon(...)` & `transform: translate(dx, dy)` | Digital tape tearing, shifted scan bands |
| **RGB Channel Split** | Dual ghost layers with SVG `<feColorMatrix>` and `mix-blend-mode: screen` | Vibrant chromatic aberration (red / cyan edge fringes) |
| **Vertical Jitter** | Discrete vertical container displacement (`jitterY`) | CRT vertical sync loss / tracking slip |
| **Digital Noise Blocks** | Semi-transparent colored rectangles scattered across the viewport | Codec macroblocking and signal corruption |
| **CRT Scanlines** | Repeating linear gradient overlay | Vintage display monitor scanlines |
| **Strobe / Flicker** | Frame-accurate `brightness()` and `opacity` dips | High-voltage digital strobe flicker |
| **Pixel Quantization** | Displacements quantized to discrete pixel steps (`pixelSize`) | Retro 8-bit / 16-bit rasterized glitch distortion |

---

## 3. Transition Modes

- **`in` (Glitch In)**:
  Starts in full digital glitch chaos (envelope = 1.0) with zero opacity, and smoothly resolves into clean, sharp content (envelope = 0.0, opacity = 1.0).
- **`out` (Glitch Out)**:
  Starts clean (envelope = 0.0, opacity = 1.0), escalates into heavy digital distortion, and vanishes into black (opacity = 0.0).
- **`replace` (Glitch Replace)**:
  Dual-layer transition that displays `fromContent` for progress $< 0.5$, then switches to `toContent` at progress $\ge 0.5$. The glitch envelope follows a parabolic curve peaking at $p = 0.5$, completely obscuring the cut point behind chaotic digital tearing.
- **`burst` (Glitch Burst)**:
  Content remains clean, experiences a sudden momentary glitch burst in the middle ($0.2 \le p \le 0.8$), and returns to clean. Opacity stays 1.0.
- **`continuous` (Continuous Glitch)**:
  Maintains constant glitch potential across all frames without settling. Glitch spikes occur intermittently based on `frequency`.

---

## 4. Component Properties (`GlitchTransitionProps`)

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `mode` | `GlitchTransitionMode` | `'in'` | Transition mode (`'in'`, `'out'`, `'replace'`, `'burst'`, `'continuous'`) |
| `intensity` | `number` | `1.0` | Distortion intensity multiplier ($0 \le \text{intensity} \le 3$) |
| `frequency` | `number` | `0.6` | Glitch trigger probability per frame ($0 \le \text{frequency} \le 1$) |
| `duration` | `number` | `30` | Duration of the transition in frames |
| `delay` | `number` | `0` | Delay before the transition begins in frames |
| `sliceCount` | `number` | `8` | Number of horizontal displacement slices ($2 \le N \le 32$) |
| `rgbOffset` | `number` | `12` | Maximum chromatic aberration separation in pixels |
| `jitter` | `number` | `6` | Maximum vertical jitter in pixels |
| `noise` | `number` | `0.4` | Digital noise block & scanline intensity ($0 \le \text{noise} \le 1$) |
| `seed` | `number \| string` | `42` | Seed for deterministic pseudo-random number generator |
| `pixelSize` | `number` | `4` | Pixel quantization step ($1$ for smooth, $4+$ for retro blocky) |
| `enableRgbSplit` | `boolean` | `true` | Toggle RGB chromatic aberration separation |
| `enableSlices` | `boolean` | `true` | Toggle horizontal slice displacement |
| `enableJitter` | `boolean` | `true` | Toggle vertical jitter |
| `enableNoise` | `boolean` | `true` | Toggle digital noise blocks |
| `enableScanlines` | `boolean` | `true` | Toggle CRT scanlines |
| `enableFlicker` | `boolean` | `true` | Toggle strobe / flicker |
| `reverse` | `boolean` | `false` | Inverts timeline progress |
| `fromContent` | `React.ReactNode` | `undefined` | Outgoing content for `replace` mode |
| `toContent` | `React.ReactNode` | `undefined` | Incoming content for `replace` mode |
| `width` | `number \| string` | `'100%'` | Container width |
| `height` | `number \| string` | `'100%'` | Container height |
| `style` | `React.CSSProperties` | `undefined` | Container styles |
| `className` | `string` | `undefined` | Container class name |
| `children` | `React.ReactNode` | `undefined` | Content elements to be glitched |

---

## 5. Usage Examples

### Basic Glitch In Entrance
```tsx
import { GlitchTransition } from '@/components/transitions/GlitchTransition';

export const HeroTitleGlitch = () => {
  return (
    <GlitchTransition
      mode="in"
      duration={30}
      intensity={1.2}
      seed={2077}
    >
      <h1 style={{ color: '#00f0ff', fontSize: 48, fontWeight: 900 }}>
        CYBERNETIC HORIZON
      </h1>
    </GlitchTransition>
  );
};
```

### Scene Cross-Cut Replacement
```tsx
import { GlitchTransition } from '@/components/transitions/GlitchTransition';

export const SceneTransition = () => {
  return (
    <GlitchTransition
      mode="replace"
      duration={35}
      intensity={1.5}
      sliceCount={12}
      rgbOffset={16}
      seed="neon-override"
      fromContent={<SceneAlpha />}
      toContent={<SceneOmega />}
      style={{ width: 1920, height: 1080 }}
    />
  );
};
```

### Ambient Continuous Glitch
```tsx
import { GlitchTransition } from '@/components/transitions/GlitchTransition';

export const SecurityCameraGlitch = () => {
  return (
    <GlitchTransition
      mode="continuous"
      intensity={0.8}
      frequency={0.3}
      sliceCount={6}
      noise={0.6}
      seed={1337}
    >
      <CameraFeedDisplay />
    </GlitchTransition>
  );
};
```

---

## 6. Unit Testing & Verification

Run the dedicated test suite:

```bash
node --test tests/glitch-transition.test.ts
```

All 26 unit tests verify:
- Hash & PRNG mathematical determinism.
- Strict envelope curves across `in`, `out`, `replace`, `burst`, and `continuous` modes.
- Frame-by-frame and seed-by-seed independence.
- Individual effect toggle isolation.
- Linear and quadratic intensity scaling.
