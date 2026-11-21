# WipeTransition Component Documentation

The `WipeTransition` component is a high-performance, frame-accurate motion transition primitive for Remotion compositions. It progressively reveals or hides visual content across 8 distinct clipping geometries (linear directional, center expansion, 45° diagonal polygon, and radial circular masks) with an optional glowing leading edge bar indicator.

---

## 1. Mathematical & Spatial Clipping Model

### 1.1 Directional Insets & Polygons

Given progress factor $p \in [0, 1]$ calculated at frame $F \in [F_{\text{start}}, F_{\text{start}} + D]$:

| Direction | Clipping Expression | Description |
| :--- | :--- | :--- |
| `left-to-right` | `inset(0% ${(1 - p) * 100}% 0% 0%)` | Reveals left $\to$ right by retracting right inset |
| `right-to-left` | `inset(0% 0% 0% ${(1 - p) * 100}%)` | Reveals right $\to$ left by retracting left inset |
| `top-to-bottom` | `inset(0% 0% ${(1 - p) * 100}% 0%)` | Reveals top $\to$ bottom by retracting bottom inset |
| `bottom-to-top` | `inset(${(1 - p) * 100}% 0% 0% 0%)` | Reveals bottom $\to$ top by retracting top inset |
| `center-out` | `inset(${(1 - p) * 50}% ${(1 - p) * 50}% ${(1 - p) * 50}% ${(1 - p) * 50}%)` | Symmetrically expands outward from center |
| `center-in` | `inset(${p * 50}% ${p * 50}% ${p * 50}% ${p * 50}%)` | Collapses inward from perimeter toward center |
| `diagonal` | `polygon(...)` | Continuous 45° line sweep: triangle for $p \le 0.5$, 5-point polygon for $p > 0.5$ |
| `radial` | `circle(${p * 142}% at ${origin})` | Expanding circle covering full container aspect ratios |

### 1.2 Transition Modes

1. **`reveal` (`in`)**: Content starts completely hidden and is wiped into view as $p: 0 \to 1$.
2. **`hide` (`out`)**: Content starts fully visible and is progressively clipped away as $p: 0 \to 1$.
3. **`reveal-hide` (`in-out`)**: Envelope transition: reveals in, holds steady at 100% visibility, and wipes out.
4. **`replace` (`cross-wipe`)**: Outgoing content layer (`fromContent`) wipes away while the incoming content layer (`toContent`) wipes into view with zero gaps or seams.

### 1.3 Leading Edge Bar Indicator

When `edgeColor` (or `edgeStyle`) is specified, a precision visual bar tracks the leading boundary coordinate during the transition:
- **Horizontal Wipes**: $x = p \cdot 100\%$, top $0$, width `edgeWidth`, height $100\%$.
- **Vertical Wipes**: $y = p \cdot 100\%$, left $0$, width $100\%$, height `edgeWidth`.
- **Glow**: Configurable box-shadow creates a high-tech laser or broadcast sweep effect.

---

## 2. Component Properties (API Reference)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `direction` | `WipeDirection` | `'left-to-right'` | Wipe pattern: `'left-to-right'`, `'right-to-left'`, `'top-to-bottom'`, `'bottom-to-top'`, `'center-out'`, `'center-in'`, `'diagonal'`, `'radial'` |
| `mode` | `WipeTransitionMode` | `'reveal'` | Transition mode: `'reveal'`, `'hide'`, `'reveal-hide'`, `'replace'` |
| `duration` / `durationInFrames` | `number` | `25` | Total animation duration in frames |
| `delay` | `number` | `0` | Delay in frames before wipe begins |
| `easing` | `EasingName \| EasingFunction` | `'easeInOut'` | Interpolation curve name |
| `revealOrigin` | `string` | `'center'` | Pivot origin for radial/center wipes (`'center'`, `'top left'`, `'50% 50%'`) |
| `fade` | `boolean` | `false` | Synchronously fade opacity alongside clipping |
| `edgeColor` | `string` | `undefined` | Color of the moving leading edge bar |
| `edgeWidth` | `number` | `2` | Thickness of the leading edge bar in pixels |
| `edgeStyle` | `WipeEdgeStyle` | `undefined` | Advanced edge styling (`color`, `width`, `glow`, `shadow`) |
| `reverse` | `boolean` | `false` | Inverts the animation progression |
| `fromContent` | `React.ReactNode` | `undefined` | Outgoing scene layer for `'replace'` mode |
| `toContent` | `React.ReactNode` | `undefined` | Incoming scene layer for `'replace'` mode |
| `children` | `React.ReactNode` | `undefined` | Content for single-layer modes |
| `backgroundColor` | `string` | `undefined` | Background color for transition container |
| `style` | `React.CSSProperties` | `undefined` | Custom outer container styling |
| `className` | `string` | `undefined` | Custom container class names |

---

## 3. Usage Examples

### 3.1 Linear Left-to-Right Wipe with Glowing Edge

```tsx
import React from 'react';
import { WipeTransition } from './components/transitions/WipeTransition';

export const HeadlineReveal: React.FC = () => {
  return (
    <WipeTransition
      direction="left-to-right"
      mode="reveal"
      duration={30}
      edgeColor="#00d1ff"
      edgeWidth={3}
    >
      <div style={{ padding: 24, background: '#111827', borderRadius: 12 }}>
        <h1>Next-Gen Motion Graphics</h1>
      </div>
    </WipeTransition>
  );
};
```

### 3.2 Dual-Layer Scene Replacement (Cross-Wipe)

```tsx
import React from 'react';
import { WipeTransition } from './components/transitions/WipeTransition';

export const BroadcastSceneSwitch: React.FC = () => {
  return (
    <WipeTransition
      mode="replace"
      direction="diagonal"
      duration={25}
      easing="easeInOutCubic"
      edgeColor="#7b2cbf"
      fromContent={<SceneA />}
      toContent={<SceneB />}
    />
  );
};
```

### 3.3 Radial Iris Circular Wipe

```tsx
import React from 'react';
import { WipeTransition } from './components/transitions/WipeTransition';

export const IrisIntro: React.FC = () => {
  return (
    <WipeTransition
      direction="radial"
      mode="reveal"
      duration={35}
      revealOrigin="center"
    >
      <HeroArtwork />
    </WipeTransition>
  );
};
```

---

## 4. Pure Function Architecture

Deterministic testing without browser layout engines:

```ts
import { calculateWipeMetrics } from './components/transitions/wipeTransitionStyle';

const metrics = calculateWipeMetrics({
  currentFrame: 10,
  direction: 'left-to-right',
  mode: 'reveal',
  duration: 20,
});

console.log(metrics.clipPath); // "inset(0% 50% 0% 0%)"
console.log(metrics.progress); // 0.5
```
