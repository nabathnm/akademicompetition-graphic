# ComparisonScene Component Documentation

`ComparisonScene` is a Layer 3 scene template designed for presenting two or more visual states, products, feature tiers, or user experiences. It makes differences easy to understand through clear visual separation, synchronized or sequential panel reveals, animated center divider lines, and accent side highlighting.

---

## 1. Architecture & Design Principles

```
                   ┌───────────────────────────────────┐
                   │         ComparisonScene           │
                   └─────────────────┬─────────────────┘
                                     │
                                     ▼
                   ┌───────────────────────────────────┐
                   │         SceneContainer            │
                   │   • Standard Dimensions           │
                   │   • Broadcast Safe Area Bounds    │
                   │   • Gradient & Mesh Backdrops     │
                   └─────────────────┬─────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ calculateComparisonSceneKinematics()                        │
        │   • Title/Subtitle: delay + 0f..8f                          │
        │   • Left Panel:     delay + staggerDelay * 1                │
        │   • Right Panel:    sequential ? stagger * 2 : stagger * 1  │
        │   • Center Divider: delay + dividerDelay (scale 0 -> 1)     │
        │   • Highlight Side: harmonic breathing pulse on target side │
        └─────────────────────────────┬───────────────────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ Layout Grid Variations:                                     │
        │   • side-by-side:      [ Left 50% ] | [ Right 50% ]         │
        │   • top-and-bottom:    [ Top 50% ] / [ Bottom 50% ]         │
        │   • before-and-after:  [ Before (Muted) ] | [ After (Glow) ]│
        │   • left-and-right:    [ Primary 60% ] | [ Secondary 40% ]  │
        │   • split-screen:      [ Edge-to-Edge Split View ]          │
        └─────────────────────────────────────────────────────────────┘
```

---

## 2. Layout Variations

`ComparisonScene` supports 6 distinct layout variations:

1. **`side-by-side` (Default)**:
   Horizontal split featuring two symmetrical panels separated by a vertical divider line.
2. **`before-and-after`**:
   Specialized comparative styling where the Left panel is framed as a muted "Before" baseline and the Right panel is highlighted with radiant cyan borders and elevation shadows.
3. **`top-and-bottom`**:
   Vertical split featuring two stacked horizontal panels separated by a horizontal divider line.
4. **`left-and-right`**:
   Asymmetrical split (60/40) for emphasizing one primary product tier or feature over a secondary option.
5. **`split-screen`**:
   Edge-to-edge full bleed split canvas with sharp vertical demarcation.
6. **`custom`**:
   Unconstrained layout for specialized arrangements.

---

## 3. Divider & Panel Animation Capabilities

- **Sequential Reveal (`sequentialReveal: true`)**: Left panel enters first, followed by the right panel after `staggerDelay` frames.
- **Simultaneous Reveal (`sequentialReveal: false`)**: Both panels enter synchronously.
- **Divider Reveal**: Center divider expands smoothly from its center along its axis (`scaleY` for vertical, `scaleX` for horizontal).
- **Directional Slide**: Left panel slides inward from the left (-60px), right panel slides inward from the right (+60px).
- **Side Highlighting**: Continuous harmonic scale and glow on the selected side (`highlightSide: 'left' | 'right'`).

---

## 4. Component Properties (`ComparisonSceneProps`)

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `title` | `React.ReactNode` | `undefined` | Main comparison headline |
| `subtitle` | `React.ReactNode` | `undefined` | Supporting subtitle |
| `description` | `React.ReactNode` | `undefined` | Extended comparison context |
| `label` | `React.ReactNode` | `undefined` | Category badge or eyebrow pill |
| `leftContent` | `React.ReactNode` | `undefined` | Left/Top/Before comparison panel content |
| `rightContent` | `React.ReactNode` | `undefined` | Right/Bottom/After comparison panel content |
| `leftLabel` | `React.ReactNode` | `undefined` | Left panel badge label |
| `rightLabel` | `React.ReactNode` | `undefined` | Right panel badge label |
| `leftDescription` | `React.ReactNode` | `undefined` | Left panel description copy |
| `rightDescription` | `React.ReactNode` | `undefined` | Right panel description copy |
| `leftIcon` | `React.ReactNode` | `undefined` | Left panel header icon |
| `rightIcon` | `React.ReactNode` | `undefined` | Right panel header icon |
| `divider` | `boolean \| ComparisonDividerConfig` | `true` | Center divider configuration |
| `layout` | `ComparisonSceneLayout` | `'side-by-side'` | Layout structure mode |
| `animation` | `ComparisonSceneAnimationConfig` | `undefined` | Fine-grained animation timing options |
| `staggerDelay` | `number` | `6` | Base stagger delay in frames |
| `background` | `string` | `undefined` | CSS background gradient or pattern |
| `backgroundColor` | `string` | `Colors.dark.bgPrimary` | Solid background color |
| `backgroundImage` | `string` | `undefined` | Background image URL |
| `durationInFrames` | `number` | `undefined` | Total scene duration in frames |
| `delay` | `number` | `0` | Delay before entrance starts |
| `width` | `number \| string` | `composition width` | Scene container width |
| `height` | `number \| string` | `composition height` | Scene container height |
| `padding` | `ScenePadding` | `64` | Inner content padding |
| `safeArea` | `boolean \| number` | `true` | Broadcast safe area margin (60px) |
| `sceneId` | `string` | `'comparison-scene'` | Scene identifier |
| `debug` | `boolean` | `false` | Visual debug overlay toggle |

---

## 5. Usage Example

```tsx
import { ComparisonScene } from './components/scenes';

export const BenchmarkScene = () => (
  <ComparisonScene
    layout="before-and-after"
    label="PERFORMANCE BENCHMARK"
    title="Legacy Architecture vs Autonomous Engine"
    subtitle="Zero hydration jitter with 120 FPS frame-rate fidelity"
    leftLabel="BEFORE"
    leftDescription="Browser timers with 14% frame drops"
    leftContent={<LegacyBenchmarkView />}
    rightLabel="AFTER"
    rightDescription="Sub-frame deterministic rendering"
    rightContent={<AutonomousBenchmarkView />}
    divider={{ label: 'VS', thickness: 2 }}
    animation={{
      sequentialReveal: true,
      highlightSide: 'right',
      staggerDelay: 6,
    }}
  />
);
```
