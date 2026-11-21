# ZoomTransition Component Documentation

The `ZoomTransition` component is a high-performance, frame-accurate motion transition primitive for Remotion compositions. It smoothly scales visual content into or out of view, hyper-zooms past the camera, or conducts simultaneous dual-layer zoom push replacements with configurable transform origins, cubic easing or spring physics with overshoot, and optional rotation and fade effects.

---

## 1. Mathematical & Spatial Model

### 1.1 Scale Interpolation Formula

Given starting scale $s_{\text{init}}$ and target scale $s_{\text{final}}$ over duration $D$ starting at frame $F_{\text{start}} = \text{delay}$:

For frame $F \in [F_{\text{start}}, F_{\text{start}} + D]$, the normalized linear progress is:

$$u = \text{clamp}\left(\frac{F - F_{\text{start}}}{D}, 0, 1\right)$$

When an easing curve $E(u)$ or spring function $S(F - F_{\text{start}})$ is applied, progress $p \in [0, 1]$ (or $> 1.0$ during spring overshoot):

$$s(p) = s_{\text{init}} + (s_{\text{final}} - s_{\text{init}}) \cdot p$$

### 1.2 Transition Modes

1. **Zoom In (`in` / `zoom-in` / `zoomIn`)**:
   - $s_{\text{init}} = 0$ (or custom e.g. $0.5$) $\to s_{\text{final}} = 1.0$.
   - Opacity: $\text{fade} ? p : 1.0$.

2. **Zoom Out (`out` / `zoom-out` / `zoomOut`)**:
   - $s_{\text{init}} = 1.0 \to s_{\text{final}} = 0$ (or custom).
   - Opacity: $\text{fade} ? (1 - p) : 1.0$.

3. **Zoom In-Out Envelope (`in-out` / `zoom-in-out`)**:
   - Phase 1 (Enter): scales from $s_{\text{init}} \to 1.0$.
   - Phase 2 (Hold): stays steady at $1.0$.
   - Phase 3 (Exit): scales down from $1.0 \to s_{\text{final}}$.

4. **Zoom Through / Hyper-Zoom (`through` / `zoom-through`)**:
   - Simulates a dramatic fly-through past the camera:
   - For $u \le 0.5$: scales from $s_{\text{init}}$ ($0.2$) $\to 1.0$.
   - For $u > 0.5$: accelerates from $1.0 \to s_{\text{final}}$ ($2.8$), rapidly expanding past the frame edge while naturally fading out to $0$.

5. **Zoom Replace (`replace` / `zoom-replace` / `cross-zoom`)**:
   - **Outgoing Layer** (`fromContent`): scales from $1.0 \to s_{\text{out}}$ (default $1.4$) with fade out $1 \to 0$.
   - **Incoming Layer** (`toContent`): scales from $s_{\text{in}}$ (default $0.6$) $\to 1.0$ with fade in $0 \to 1$.

### 1.3 Transform Origin Pivots

The scale matrix is anchored to `transformOrigin`:
- `'center'` (`center center`)
- `'top left'`, `'top right'`, `'bottom left'`, `'bottom right'`
- `'top'`, `'bottom'`, `'left'`, `'right'`
- Any valid CSS pivot percentage (e.g. `'50% 50%'`, `'30% 70%'`)

---

## 2. Component Properties (API Reference)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `mode` | `ZoomTransitionMode` | `'in'` | Transition mode: `'in'`, `'out'`, `'in-out'`, `'through'`, `'replace'` |
| `initialScale` | `number` | `0` (or `1.0`) | Starting scale value |
| `finalScale` | `number` | `1.0` (or `0`) | Ending scale value |
| `throughScale` | `number` | `1.0` | Midpoint scale for `'through'` mode |
| `outgoingScale`| `number` | `1.4` | Scale target for outgoing layer in `'replace'` mode |
| `incomingScale`| `number` | `0.6` | Starting scale for incoming layer in `'replace'` mode |
| `transformOrigin`| `string` | `'center'` | Transform origin pivot point (`'center'`, `'top left'`, `'bottom right'`, etc.) |
| `duration` / `durationInFrames` | `number` | `25` | Duration of zoom transition in frames |
| `delay` | `number` | `0` | Delay in frames before zoom begins |
| `easing` | `EasingName \| EasingFunction` | `'easeOut'` | Animation curve name (`'easeInOutQuad'`, `'easeOutBack'`, etc.) |
| `fade` | `boolean` | `false` | Synchronously fade opacity during zoom |
| `fromOpacity` | `number` | `undefined` | Custom starting opacity override |
| `toOpacity` | `number` | `undefined` | Custom ending opacity override |
| `rotation` | `number` | `0` | Optional rotational angle in degrees during zoom |
| `initialRotation`| `number` | `0` | Starting rotation angle in degrees |
| `finalRotation`| `number` | `undefined` | Ending rotation angle in degrees |
| `spring` | `boolean \| string` | `false` | Enable Remotion spring physics |
| `overshoot` | `boolean` | `false` | Enable snappy/bouncy overshoot physics past target scale |
| `reverse` | `boolean` | `false` | Inverts transition progression |
| `clip` | `boolean` | `true` | Clips content outside container bounds (`overflow: 'hidden'`) |
| `fromContent` | `React.ReactNode` | `undefined` | Outgoing scene layer for `'replace'` mode |
| `toContent` | `React.ReactNode` | `undefined` | Incoming scene layer for `'replace'` mode |
| `children` | `React.ReactNode` | `undefined` | Content for single-layer modes |
| `backgroundColor`| `string` | `undefined` | Optional container background color |
| `style` | `React.CSSProperties` | `undefined` | Additional styles for outer container |
| `className` | `string` | `undefined` | Additional CSS class names |

---

## 3. Usage Examples

### 3.1 Basic Zoom In with Spring Overshoot

```tsx
import React from 'react';
import { ZoomTransition } from './components/transitions/ZoomTransition';

export const LogoReveal: React.FC = () => {
  return (
    <ZoomTransition
      mode="in"
      duration={30}
      delay={5}
      overshoot={true}
      fade={true}
      transformOrigin="center"
    >
      <div style={{ padding: 24, background: '#1e1b4b', borderRadius: 16 }}>
        <h2>Brand Identity</h2>
      </div>
    </ZoomTransition>
  );
};
```

### 3.2 Dual-Layer Scene Replacement (Cross-Zoom)

```tsx
import React from 'react';
import { ZoomTransition } from './components/transitions/ZoomTransition';

export const SceneTransition: React.FC = () => {
  return (
    <ZoomTransition
      mode="replace"
      duration={25}
      fade={true}
      transformOrigin="center"
      outgoingScale={1.5}
      incomingScale={0.5}
      fromContent={<SceneA />}
      toContent={<SceneB />}
    />
  );
};
```

### 3.3 Dramatic Hyper-Zoom Fly-Through with Rotation

```tsx
import React from 'react';
import { ZoomTransition } from './components/transitions/ZoomTransition';

export const HyperWarp: React.FC = () => {
  return (
    <ZoomTransition
      mode="through"
      duration={30}
      initialScale={0.2}
      finalScale={3.0}
      rotation={20}
      fade={true}
      clip={true}
    >
      <GalaxyCanvas />
    </ZoomTransition>
  );
};
```

---

## 4. Pure Function Architecture

All calculations can be tested directly in Node.js without a DOM:

```ts
import { calculateZoomMetrics } from './components/transitions/zoomTransitionStyle';

const metrics = calculateZoomMetrics({
  currentFrame: 15,
  fps: 30,
  mode: 'in',
  duration: 30,
  delay: 0,
});

console.log(metrics.scale);           // e.g. 0.75
console.log(metrics.transform);       // "scale3d(0.75, 0.75, 1)"
console.log(metrics.transformOrigin); // "center center"
```
