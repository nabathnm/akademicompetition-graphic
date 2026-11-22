# SplitTransition Component Documentation

The `SplitTransition` component is a flexible, frame-accurate Remotion transition primitive belonging to **Layer 2 (Transitions)** of the Motion Graphics Framework. It divides visual content into multiple panels, strips, or grid segments and animates each slice independently to assemble, disperse, or replace visual content.

## 1. Architectural Highlights

- **`clip-path: inset(...)` Partitioning**: Each panel renders with an exact, non-overlapping geometric clipping rectangle. When idle at \((0, 0)\), the slices join together into a **100% seamless, unbroken visual canvas** with zero seam drift or layout collapsing.
- **Aspect-Ratio-Agnostic Mathematics**: Panel percentages are computed directly from the row/column count, adapting flawlessly to 16:9 widescreen, 9:16 vertical reels, or 1:1 square compositions.
- **Independent Staggered Motion**: Each panel calculates its own progress, offset vector, and delay envelope according to customizable stagger ordering (`start-to-end`, `end-to-start`, `center-out`, `edges-in`).
- **Deterministic Frame Accuracy**: Relies on Remotion's `useCurrentFrame()`, avoiding browser-dependent animation timing (`requestAnimationFrame`, `setTimeout`, CSS transitions).

---

## 2. Supported Split Configurations

| Configuration | `splitDirection` | `panelCount` | `rows` x `cols` | Visual Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **Two Vertical Panels** | `'vertical'` | `2` | `1 x 2` | Splits down the center into left and right halves. |
| **Two Horizontal Panels** | `'horizontal'` | `2` | `2 x 1` | Splits horizontally into top and bottom halves. |
| **Four Quadrants** | `'quadrants'` | `4` | `2 x 2` | Divides into 4 equal quadrants parting to the 4 corners. |
| **Multiple Vertical Strips** | `'vertical'` | `3..N` | `1 x N` | Partitions into vertical slat blinds. |
| **Multiple Horizontal Strips**| `'horizontal'` | `3..N` | `N x 1` | Partitions into horizontal strip louvers. |
| **Custom Grid** | `'grid'` | `R * C` | `R x C` | Custom $R \times C$ rectangular tile matrix (e.g. 3x3, 4x4). |

---

## 3. Supported Movement Directions

1. **`outward`**:
   Panels move **away from the center** of the composition. In 2-panel vertical splits, the left panel slides left and the right panel slides right.
2. **`inward`**:
   Panels move **inward towards the center**, assembling from off-screen into place.
3. **`opposite` / `alternate`**:
   Adjacent panels slide in opposing directions. In vertical splits, even columns slide up while odd columns slide down (creating an alternating venetian blind shutter effect).
4. **`directional` (`'left'`, `'right'`, `'up'`, `'down'`)**:
   All panels slide uniaxially in the specified direction.

---

## 4. Supported Modes

1. **`enter` (aliases: `'in'`, `'reveal'`)**:
   Panels start at their offset displacement and animate into position \((0, 0)\) to assemble the content.
2. **`exit` (aliases: `'out'`, `'hide'`)**:
   Panels start seamlessly assembled at \((0, 0)\) and part away off-screen.
3. **`enter-exit` (alias: `'in-out'`)**:
   Three-phase envelope:
   - Entrance Phase (`inDuration`): panels slide in to assemble.
   - Hold Phase (`holdDuration`): panels remain seamlessly joined.
   - Exit Phase (`outDuration`): panels disperse away off-screen.
4. **`replace`**:
   Dual-layer transition:
   - Outgoing content layer (`fromContent` / `children[0]`) partitions and splits outward.
   - Incoming content layer (`toContent` / `children[1]`) is revealed underneath.

---

## 5. Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `splitDirection` | `SplitDirection` | `'vertical'` | Split geometry: `'vertical'`, `'horizontal'`, `'quadrants'`, or `'grid'`. |
| `panelCount` | `number` | `2` | Number of panels for 1D splits (`'vertical'`, `'horizontal'`). |
| `rows` | `number` | `2` | Row count when `splitDirection="grid"`. |
| `cols` | `number` | `2` | Column count when `splitDirection="grid"`. |
| `mode` | `SplitTransitionMode` | `'enter'` | Transition mode: `'enter'`, `'exit'`, `'enter-exit'`, `'replace'`. |
| `movementDirection` | `SplitMovementDirection` | `'outward'` | Movement vector: `'outward'`, `'inward'`, `'opposite'`, `'left'`, `'right'`, `'up'`, `'down'`. |
| `distance` | `number \| string` | `'100%'` | Movement travel distance (e.g. `'100%'`, `250`). |
| `panelGap` | `number` | `0` | Visible gap between panels in pixels. |
| `staggerDelay` | `number` | `0` | Frame delay between successive panel animations (0 = simultaneous). |
| `staggerOrder` | `SplitStaggerOrder` | `'start-to-end'` | Sequencing order: `'start-to-end'`, `'end-to-start'`, `'center-out'`, `'edges-in'`. |
| `duration` | `number` | `25` | Duration in frames for each panel's movement (alias: `durationInFrames`). |
| `delay` | `number` | `0` | Delay in frames before the transition begins. |
| `easing` | `EasingPresetName \| EasingFunction` | `'easeOut'` | Motion easing curve preset or custom easing function. |
| `fade` | `boolean` | `false` | Enables simultaneous opacity fade in tandem with panel motion. |
| `fromOpacity` | `number` | `0` | Starting opacity when `fade={true}`. |
| `toOpacity` | `number` | `1` | Ending opacity when `fade={true}`. |
| `spring` | `boolean \| string` | `false` | Physics-based spring motion (e.g. `'snappy'`, `'bouncy'`). |
| `overshoot` | `boolean` | `false` | Allows spring overshoot past target settlement. |
| `reverse` | `boolean` | `false` | Inverts timing progression direction. |
| `overflow` | `'hidden' \| 'visible'` | `'hidden'` | Container CSS overflow property. |
| `inDuration` | `number` | `auto` | Entrance duration in frames for `'enter-exit'` mode. |
| `holdDuration` | `number` | `auto` | Hold duration in frames for `'enter-exit'` mode. |
| `outDuration` | `number` | `auto` | Exit duration in frames for `'enter-exit'` mode. |
| `fromContent` | `React.ReactNode` | `undefined` | Outgoing scene layer for `'replace'` mode. |
| `toContent` | `React.ReactNode` | `undefined` | Incoming scene layer for `'replace'` mode. |
| `backgroundColor` | `string` | `undefined` | Container background fill. |
| `style` | `React.CSSProperties` | `undefined` | Custom container styling. |
| `className` | `string` | `undefined` | Custom CSS class name. |
| `children` | `React.ReactNode` | `undefined` | Content elements to be partitioned and animated. |

---

## 6. Usage Examples

### Example A: Dramatic Four-Quadrant Assembly
```tsx
import { SplitTransition } from '@/components/transitions';

export const QuadrantAssemble = () => {
  return (
    <SplitTransition
      splitDirection="quadrants"
      mode="enter"
      movementDirection="outward"
      distance="100%"
      duration={30}
      easing="easeOut"
      fade
    >
      <HeroTitleScreen />
    </SplitTransition>
  );
};
```

### Example B: Venetian Blind Strip Shutter Split
```tsx
import { SplitTransition } from '@/components/transitions';

export const VenetianBlindExit = () => {
  return (
    <SplitTransition
      splitDirection="vertical"
      panelCount={5}
      mode="exit"
      movementDirection="opposite"
      staggerDelay={2}
      staggerOrder="center-out"
      duration={20}
    >
      <ProductShowcase />
    </SplitTransition>
  );
};
```

### Example C: Cross-Scene Replacement via 3x3 Grid Parting
```tsx
import { SplitTransition } from '@/components/transitions';

export const GridReplaceScene = () => {
  return (
    <SplitTransition
      splitDirection="grid"
      rows={3}
      cols={3}
      mode="replace"
      movementDirection="outward"
      staggerDelay={2}
      duration={25}
      fromContent={<SceneOne />}
      toContent={<SceneTwo />}
    />
  );
};
```

---

## 7. Component File Links

- [SplitTransition.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/SplitTransition.tsx)
- [splitTransitionStyle.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/splitTransitionStyle.ts)
- [types.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/types.ts)
- [SplitTransitionShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/SplitTransitionShowcase.tsx)
- [split-transition.test.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/tests/split-transition.test.ts)
