# FadeTransition Component Documentation

Reusable, frame-accurate Remotion transition component that smoothly fades visual content between visible and invisible states, supporting individual elements, nested groups, and scene-level crossfades.

## Overview

`FadeTransition` provides deterministic opacity transitions calculated purely from `useCurrentFrame()`:
- **Fade In** (`mode="in"`): Content smoothly transitions from initial opacity (`fromOpacity`, default 0) to final opacity (`toOpacity`, default 1).
- **Fade Out** (`mode="out"`): Content smoothly transitions from `toOpacity` (default 1) down to `fromOpacity` (default 0).
- **In-Out Envelope** (`mode="in-out"`): Complete entrance $\to$ hold plateau $\to$ exit sequence with configurable phase durations (`inDuration`, `holdDuration`, `outDuration`).
- **Crossfade** (`mode="crossfade"`): Dual-layer simultaneous cross-dissolve between outgoing (`fromContent`) and incoming (`toContent`) layers.
- **Configurable Timing**: Full support for `duration` / `durationInFrames`, `delay`, `reverse`, `direction`, and custom easing functions.
- **Strict Bounds & Zero Sanitization**: Opacity is clamped to $[0, 1]$ and sanitized against IEEE-754 signed negative zero (`-0`).

---

## Architecture & Mathematical Foundations

### 1. Mode "in" (Fade In)

Given current frame $f$, start frame $f_{\text{start}} = \text{delay}$, and duration $D$:

$$t = \text{clamp}\left(\frac{f - f_{\text{start}}}{D}, 0, 1\right)$$

If `reverse` is true:

$$t_{\text{eff}} = 1 - t$$

Otherwise:

$$t_{\text{eff}} = t$$

Given easing function $E(t)$:

$$\alpha(f) = \alpha_{\text{from}} + (\alpha_{\text{to}} - \alpha_{\text{from}}) \cdot E(t_{\text{eff}})$$

### 2. Mode "out" (Fade Out)

$$\alpha(f) = \alpha_{\text{to}} + (\alpha_{\text{from}} - \alpha_{\text{to}}) \cdot E(t_{\text{eff}})$$

### 3. Mode "in-out" (Three-Phase Envelope)

Given ingress duration $D_{\text{in}}$, hold duration $D_{\text{hold}}$, and egress duration $D_{\text{out}}$:

$$D_{\text{total}} = D_{\text{in}} + D_{\text{hold}} + D_{\text{out}}$$

1. **Ingress Phase** ($f_{\text{start}} \le f < f_{\text{start}} + D_{\text{in}}$):
   $$t_{\text{in}} = \frac{f - f_{\text{start}}}{D_{\text{in}}}$$
   $$\alpha(f) = \alpha_{\text{from}} + (\alpha_{\text{to}} - \alpha_{\text{from}}) \cdot E(t_{\text{in}})$$

2. **Hold Plateau** ($f_{\text{start}} + D_{\text{in}} \le f < f_{\text{start}} + D_{\text{in}} + D_{\text{hold}}$):
   $$\alpha(f) = \alpha_{\text{to}}$$

3. **Egress Phase** ($f_{\text{start}} + D_{\text{in}} + D_{\text{hold}} \le f < f_{\text{start}} + D_{\text{total}}$):
   $$t_{\text{out}} = \frac{f - (f_{\text{start}} + D_{\text{in}} + D_{\text{hold}})}{D_{\text{out}}}$$
   $$\alpha(f) = \alpha_{\text{to}} + (\alpha_{\text{from}} - \alpha_{\text{to}}) \cdot E(t_{\text{out}})$$

### 4. Mode "crossfade" (Dual-Layer Dissolve)

For crossfade transitions between Layer A (outgoing) and Layer B (incoming):

$$\alpha_{\text{outgoing}}(f) = \alpha_{\text{to}} + (\alpha_{\text{from}} - \alpha_{\text{to}}) \cdot E(t_{\text{eff}})$$

$$\alpha_{\text{incoming}}(f) = \alpha_{\text{from}} + (\alpha_{\text{to}} - \alpha_{\text{from}}) \cdot E(t_{\text{eff}})$$

At the midpoint $t = 0.5$ with symmetric or linear easing:

$$\alpha_{\text{outgoing}} = 0.5, \quad \alpha_{\text{incoming}} = 0.5$$

---

## Component API

### `FadeTransitionProps`

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `'in' \| 'out' \| 'in-out' \| 'crossfade'` | `'in'` | Transition mode. |
| `direction` | `'in' \| 'out'` | `'in'` | Alternative direction alias for `mode`. |
| `duration` / `durationInFrames` | `number` | `25` | Total transition duration in frames. |
| `delay` | `number` | `0` | Delay in frames before transition begins. |
| `fromOpacity` | `number` | `0` | Starting opacity value (clamped between 0 and 1). |
| `toOpacity` | `number` | `1` | Target ending opacity value (clamped between 0 and 1). |
| `reverse` | `boolean` | `false` | Inverts the direction of progress. |
| `easing` | `EasingPresetName \| EasingFunction` | `'easeInOut'` | Easing curve applied to progress. |
| `inDuration` | `number` | `round(duration * 0.35)` | Ingress duration in `in-out` mode. |
| `holdDuration` | `number` | `round(duration * 0.30)` | Plateau hold duration in `in-out` mode. |
| `outDuration` | `number` | `duration - inD - holdD` | Egress duration in `in-out` mode. |
| `fromContent` / `outgoingContent` | `React.ReactNode` | `undefined` | Outgoing content layer in `crossfade` mode. |
| `toContent` / `incomingContent` | `React.ReactNode` | `undefined` | Incoming content layer in `crossfade` mode. |
| `backgroundColor` | `string` | `undefined` | Optional background color for transition container. |
| `style` | `React.CSSProperties` | `undefined` | Container CSS style overrides. |
| `className` | `string` | `undefined` | Container class name. |
| `children` | `React.ReactNode` | `undefined` | Child elements to fade, or tuple `[outgoing, incoming]` for crossfade. |

---

## Usage Examples

### 1. Basic Fade In

```tsx
import React from 'react';
import { FadeTransition } from '@/components/transitions';

export const HeadlineFadeScene: React.FC = () => {
  return (
    <FadeTransition mode="in" duration={30} delay={5} easing="easeOut">
      <h1 style={{ color: '#ffffff', fontSize: 32 }}>Welcome to Remotion Akademi</h1>
    </FadeTransition>
  );
};
```

### 2. Timed In-Out Notification Envelope

```tsx
import React from 'react';
import { FadeTransition } from '@/components/transitions';

export const ToastScene: React.FC = () => {
  return (
    <FadeTransition
      mode="in-out"
      delay={10}
      inDuration={15}
      holdDuration={45}
      outDuration={15}
      easing="easeInOut"
    >
      <div style={{ padding: '12px 24px', backgroundColor: '#0e8345', color: '#fff', borderRadius: 8 }}>
        Project deployed successfully!
      </div>
    </FadeTransition>
  );
};
```

### 3. Scene-Level Crossfade Dissolve

```tsx
import React from 'react';
import { FadeTransition } from '@/components/transitions';

export const CrossfadeScene: React.FC = () => {
  return (
    <FadeTransition
      mode="crossfade"
      duration={30}
      delay={15}
      easing="easeInOut"
      fromContent={
        <div style={{ width: '100%', height: '100%', backgroundColor: '#0f172a', padding: 24 }}>
          <h2 style={{ color: '#00d1ff' }}>Scene A: Telemetry Grid</h2>
        </div>
      }
      toContent={
        <div style={{ width: '100%', height: '100%', backgroundColor: '#070a10', padding: 24 }}>
          <h2 style={{ color: '#7b2cbf' }}>Scene B: Deployment Pipeline</h2>
        </div>
      }
    />
  );
};
```

---

## Verification & Test Coverage

The unit test suite is located at [tests/fade-transition.test.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/tests/fade-transition.test.ts).

### Test Matrix

1. **Sanitization & Bounds**: Verifies strict $[0, 1]$ clamping, NaN handling, and `-0` sanitization.
2. **Mode "in"**: Asserts `opacity = 0` before start, progress $= 0.5$ at midpoint, and `opacity = 1` with `isComplete = true` at completion. Verifies `reverse` flag.
3. **Mode "out"**: Asserts full opacity at start, steady decrease through midpoint, and zero opacity with `isComplete = true` at completion.
4. **Mode "in-out"**: Verifies progression across pending $\to$ ingress $\to$ hold $\to$ egress $\to$ complete phases.
5. **Mode "crossfade"**: Asserts simultaneous cross-dissolve: Layer A ($1 \to 0$), Layer B ($0 \to 1$), equal midpoint balance ($0.5 / 0.5$), and role swapping under `reverse`.
6. **Custom Parameters**: Validates custom `fromOpacity` and `toOpacity` offsets and `direction="out"` alias.

---

## Related Files

- Component Implementation: [src/components/transitions/FadeTransition.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/FadeTransition.tsx)
- Styling & Mathematical Logic: [src/components/transitions/fadeTransitionStyle.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/fadeTransitionStyle.ts)
- Type Definitions: [src/components/transitions/types.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/types.ts)
- Interactive Showcase: [src/playground/showcases/FadeTransitionShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/FadeTransitionShowcase.tsx)
- Unit Test Suite: [tests/fade-transition.test.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/tests/fade-transition.test.ts)
