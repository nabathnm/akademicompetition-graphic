# SlideTransition Component Documentation

The `SlideTransition` component is a high-performance, frame-accurate motion transition primitive for Remotion compositions. It smoothly translates visual content into or out of view—or conducts simultaneous dual-layer content push replacements—using 8 directional vectors, configurable distances (px or %), Remotion spring physics or cubic easing curves, and optional synchronized fade effects.

---

## 1. Mathematical & Spatial Model

### 1.1 Vector Mapping

Each transition direction corresponds to a unit displacement direction vector $\vec{u} = (u_x, u_y)$:

| Direction | $\vec{u} = (u_x, u_y)$ | Movement Direction |
| :--- | :--- | :--- |
| `left` (or `horizontal`) | $(-1, 0)$ | Content moves towards the left ($\leftarrow$) |
| `right` | $(+1, 0)$ | Content moves towards the right ($\rightarrow$) |
| `top` / `up` (or `vertical`) | $(0, -1)$ | Content moves upwards ($\uparrow$) |
| `bottom` / `down` | $(0, +1)$ | Content moves downwards ($\downarrow$) |
| `top-left` | $(-1, -1)$ | Content moves diagonally up-left ($\nwarrow$) |
| `top-right` | $(+1, -1)$ | Content moves diagonally up-right ($\nearrow$) |
| `bottom-left` | $(-1, +1)$ | Content moves diagonally down-left ($\swarrow$) |
| `bottom-right` | $(+1, +1)$ | Content moves diagonally down-right ($\searrow$) |

### 1.2 Displacement Calculation

Given distance $D$ (either in pixels or parsed percentage strings like `'100%'`):

$$\vec{d} = (d_x, d_y) = (u_x \cdot D, u_y \cdot D)$$

For any completion factor $p \in [0, 1]$ computed at frame $f$:

1. **Enter Mode (`enter` / `in`)**:
   - Starting offset at $p = 0$: $\vec{\Delta}_{\text{start}} = -\vec{d}$ (comes from the opposite direction into view)
   - Ending offset at $p = 1$: $\vec{\Delta}_{\text{end}} = (0, 0)$
   - Offset: $\vec{\Delta}(p) = (1 - p) \cdot (-\vec{d})$

2. **Exit Mode (`exit` / `out`)**:
   - Starting offset at $p = 0$: $\vec{\Delta}_{\text{start}} = (0, 0)$
   - Ending offset at $p = 1$: $\vec{\Delta}_{\text{end}} = \vec{d}$
   - Offset: $\vec{\Delta}(p) = p \cdot \vec{d}$

3. **Enter-Exit Mode (`enter-exit` / `in-out`)**:
   - Phase 1 ($f \in [0, \text{duration}]$): Enters from $-\vec{d} \to 0$.
   - Phase 2 ($f \in [\text{duration}, \text{totalFrames} - \text{duration}]$): Rests stationary at $(0, 0)$.
   - Phase 3 ($f \in [\text{totalFrames} - \text{duration}, \text{totalFrames}]$): Exits from $0 \to \vec{d}$.

4. **Replace Mode (`replace` / `cross-slide`)**:
   - **Outgoing Layer** (`fromContent`): Moves from $(0, 0) \to \vec{d}$.
   - **Incoming Layer** (`toContent`): Moves from $-\vec{d} \to (0, 0)$.

When `reverse={true}` is set, the displacement vector $\vec{d}$ is inverted: $\vec{d}_{\text{rev}} = -\vec{d}$.

---

## 2. Component Properties (API Reference)

`SlideTransitionProps` extends standard React props:

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `direction` | `SlideDirection` | `'left'` | Movement direction: `'left'`, `'right'`, `'top'`, `'bottom'`, `'up'`, `'down'`, `'horizontal'`, `'vertical'`, `'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'` |
| `mode` | `SlideTransitionMode` | `'enter'` | Transition mode: `'enter'` (`'in'`), `'exit'` (`'out'`), `'enter-exit'` (`'in-out'`), `'replace'` |
| `distance` | `number \| string` | `'100%'` | Translation distance in pixels (`number`) or CSS percentage string (e.g. `'100%'`) |
| `duration` / `durationInFrames`| `number` | `30` | Duration of the transition phase in frames |
| `delay` | `number` | `0` | Delay in frames before transition begins |
| `easing` | `EasingName \| EasingFunction`| `'easeOut'` | Animation curve name (`'easeInOutQuad'`, `'easeOutBack'`, etc.) |
| `spring` | `boolean \| SpringPreset \| SpringConfig`| `false` | Enable Remotion spring physics simulation |
| `overshoot` | `boolean` | `false` | Quick preset to apply bouncy spring overshoot dynamics |
| `fade` | `boolean` | `false` | Synchronously fade opacity during slide movement |
| `reverse` | `boolean` | `false` | Reverse directional orientation |
| `clip` | `boolean` | `true` | Clip container bounds (`overflow: 'hidden'`) |
| `fromContent` | `React.ReactNode` | `undefined` | Outgoing scene layer for `replace` mode |
| `toContent` | `React.ReactNode` | `undefined` | Incoming scene layer for `replace` mode |
| `children` | `React.ReactNode` | `undefined` | Content for single-layer modes (`enter`, `exit`, `enter-exit`) |
| `backgroundColor` | `string` | `'transparent'` | Background color for transition wrapper |
| `style` | `React.CSSProperties` | `undefined` | Additional styles for outer container |
| `className` | `string` | `undefined` | Additional CSS class names |

---

## 3. Usage Examples

### 3.1 Single Element Slide-In with Spring Physics

```tsx
import React from 'react';
import { SlideTransition } from './components/transitions/SlideTransition';

export const HeroBanner: React.FC = () => {
  return (
    <SlideTransition
      direction="bottom"
      mode="enter"
      distance="100%"
      duration={30}
      spring="snappy"
      fade={true}
    >
      <div style={{ padding: 24, background: '#111827', borderRadius: 12 }}>
        <h1>Welcome to Remotion Motion Graphics</h1>
      </div>
    </SlideTransition>
  );
};
```

### 3.2 Dual-Layer Scene Replacement (Cross-Slide Push)

```tsx
import React from 'react';
import { SlideTransition } from './components/transitions/SlideTransition';

export const SceneTransition: React.FC = () => {
  return (
    <SlideTransition
      mode="replace"
      direction="left"
      distance="100%"
      duration={25}
      easing="easeInOutCubic"
      clip={true}
      fromContent={<SceneA />}
      toContent={<SceneB />}
    />
  );
};
```

### 3.3 Diagonal Slide with Custom Pixel Offset

```tsx
import React from 'react';
import { SlideTransition } from './components/transitions/SlideTransition';

export const FloatingCard: React.FC = () => {
  return (
    <SlideTransition
      direction="top-right"
      mode="enter-exit"
      distance={300}
      duration={20}
      fade={true}
      overshoot={true}
    >
      <CardContent />
    </SlideTransition>
  );
};
```

---

## 4. Pure Function Architecture

The component separates all math and style calculations into `computeSlideStyle`:

```ts
import { computeSlideStyle } from './components/transitions/slideTransitionStyle';

const metrics = computeSlideStyle({
  frame: 15,
  fps: 30,
  totalFrames: 90,
  direction: 'left',
  mode: 'enter',
  distance: 100,
  duration: 30,
  delay: 0,
});

console.log(metrics.transform); // "translate3d(-50px, 0px, 0px)"
console.log(metrics.progress);  // 0.5
console.log(metrics.opacity);   // 1.0
```

This guarantees 100% deterministic testability with zero dependencies on browser animation engines or DOM layout engines.
