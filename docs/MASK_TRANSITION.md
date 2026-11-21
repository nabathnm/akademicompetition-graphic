# MaskTransition Component Documentation

The `MaskTransition` component is a flexible, frame-accurate Remotion transition primitive belonging to **Layer 2 (Transitions)** of the Motion Graphics Framework. It reveals or hides visual content using normalized geometric masks and arbitrary SVG paths.

## 1. Architectural Highlights

- **`clipPathUnits="objectBoundingBox"`**: Normalizes all mask geometry coordinates to \([0, 1]\). This guarantees that clipping paths dynamically adapt to **any aspect ratio** (16:9 widescreen, 9:16 vertical reels, 1:1 square feeds) without layout collapsing or distortion.
- **Aspect-Ratio-Agnostic Transforms**: Scales and rotates around normalized origin coordinates \((ox, oy)\), dynamically covering all four viewport corners regardless of anchor placement.
- **Deterministic Frame Accuracy**: Relies on Remotion's `useCurrentFrame()`, completely eliminating CSS transitions, WebGL, or browser timer discrepancies (`requestAnimationFrame`, `setTimeout`).
- **SVG Path Presets & Custom Paths**: Includes built-in SVG shapes (`heart`, `star`, `diamond`, `badge`, `cloud`, `flower`) and accepts any arbitrary SVG path string.

---

## 2. Supported Mask Types

| Mask Type | Canonical Name | Description |
| :--- | :--- | :--- |
| **Circle** | `'circle'` | Classic iris circular mask opening or closing from an anchor point. |
| **Rectangle** | `'rectangle'`, `'rect'` | Sharp-cornered box mask expansion. |
| **Rounded Rectangle** | `'rounded-rectangle'`, `'roundedRectangle'` | Rounded box mask with configurable `cornerRadius` (default: 0.1 normalized). |
| **Ellipse** | `'ellipse'` | Smooth oval mask suitable for horizontal or vertical focal reveals. |
| **Polygon** | `'polygon'` | Regular geometric polygons: `'star'`, `'triangle'`, `'diamond'`, `'hexagon'`, `'pentagon'`, or custom `polygonPoints`. |
| **SVG Path** | `'path'`, `'svg-path'` | Complex vector shapes: built-in presets (`'heart'`, `'star'`, `'diamond'`, `'badge'`, `'cloud'`, `'flower'`) or arbitrary SVG path strings with custom `pathViewBox`. |

---

## 3. Supported Modes

1. **`reveal` (aliases: `'expand'`, `'in'`)**:
   Mask scales up from zero at the designated origin until it completely covers the viewport, revealing the content.
2. **`hide` (aliases: `'contract'`, `'out'`)**:
   Mask scales down from maximum coverage towards the designated origin, contracting until content is fully clipped out.
3. **`reveal-hide` (aliases: `'in-out'`, `'revealHide'`)**:
   Three-phase envelope:
   - Entrance Phase (`inDuration`): mask expands to full coverage.
   - Hold Phase (`holdDuration`): mask stays fully visible.
   - Exit Phase (`outDuration`): mask contracts back to zero.
4. **`replace` (aliases: `'cross-mask'`, `'crossMask'`)**:
   Dual-layer scene transition:
   - Outgoing content layer (`fromContent` / `children[0]`) is rendered full-screen.
   - Incoming content layer (`toContent` / `children[1]`) is revealed by the expanding geometric mask over the outgoing content.

---

## 4. Origin Anchor Points

The origin defines the focal pivot point where the mask begins expanding or contracting:
- `'center'` (default: `50% 50%`)
- `'top'` (`50% 0%`)
- `'bottom'` (`50% 100%`)
- `'left'` (`0% 50%`)
- `'right'` (`100% 50%`)
- `'top-left'` (`0% 0%`)
- `'top-right'` (`100% 0%`)
- `'bottom-left'` (`0% 100%`)
- `'bottom-right'` (`100% 100%`)
- Custom percentage coordinates (e.g. `'25% 75%'`)

---

## 5. Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `maskType` | `MaskType` | `'circle'` | Geometric mask primitive (`'circle'`, `'rectangle'`, `'rounded-rectangle'`, `'ellipse'`, `'polygon'`, `'path'`). |
| `mode` | `MaskTransitionMode` | `'reveal'` | Transition behavior (`'reveal'`, `'hide'`, `'reveal-hide'`, `'replace'`). |
| `origin` | `string` | `'center'` | Anchor point for expansion/contraction (`'center'`, `'top-left'`, `'25% 75%'`, etc.). |
| `duration` | `number` | `25` | Transition duration in frames (alias: `durationInFrames`). |
| `delay` | `number` | `0` | Delay in frames before transition begins. |
| `easing` | `EasingPresetName \| EasingFunction` | `'easeInOut'` | Curve easing preset or custom easing function. |
| `shape` | `MaskPolygonShape` | `'star'` | Polygon subtype when `maskType="polygon"` (`'star'`, `'triangle'`, `'diamond'`, `'hexagon'`, `'pentagon'`). |
| `polygonPoints` | `string` | `undefined` | Custom normalized polygon vertex coordinates string. |
| `pathData` | `string` | `undefined` | Preset name (`'heart'`, `'star'`, `'diamond'`, `'badge'`, `'cloud'`, `'flower'`) or custom SVG `d` string (alias: `d`). |
| `pathViewBox` | `string` | `'0 0 100 100'` | SVG viewBox for custom SVG path data normalization. |
| `cornerRadius` | `number` | `0.1` | Normalized corner radius for rectangles and rounded rectangles. |
| `rotation` | `number` | `0` | Static rotation angle in degrees or animated pivot angle. |
| `initialRotation` | `number` | `undefined` | Starting rotation angle in degrees. |
| `finalRotation` | `number` | `undefined` | Ending rotation angle in degrees. |
| `scaleMultiplier` | `number` | `1.0` | Multiplier applied to the calculated full-coverage scale. |
| `maxScale` | `number` | `undefined` | Explicit maximum scale override. |
| `fade` | `boolean` | `false` | Enables simultaneous opacity fade in tandem with mask scale. |
| `fromOpacity` | `number` | `0` | Starting opacity when `fade={true}`. |
| `toOpacity` | `number` | `1` | Ending opacity when `fade={true}`. |
| `spring` | `boolean \| string` | `false` | Physics-based spring motion (e.g. `'snappy'`, `'bouncy'`, `'gentle'`). |
| `overshoot` | `boolean` | `false` | Allows spring overshoot past target scale before settling. |
| `reverse` | `boolean` | `false` | Inverts the animation progression direction. |
| `clipId` | `string` | auto | Unique ID override for SVG `<clipPath>`. |
| `overflow` | `'hidden' \| 'visible'` | `'hidden'` | Container CSS overflow property. |
| `inDuration` | `number` | `auto` | Entrance duration in frames for `'reveal-hide'` mode. |
| `holdDuration` | `number` | `auto` | Hold duration in frames for `'reveal-hide'` mode. |
| `outDuration` | `number` | `auto` | Exit duration in frames for `'reveal-hide'` mode. |
| `fromContent` | `React.ReactNode` | `undefined` | Outgoing scene layer for `'replace'` mode. |
| `toContent` | `React.ReactNode` | `undefined` | Incoming scene layer for `'replace'` mode. |
| `backgroundColor` | `string` | `undefined` | Container background fill. |
| `style` | `React.CSSProperties` | `undefined` | Custom container styling. |
| `className` | `string` | `undefined` | Custom CSS class name. |
| `children` | `React.ReactNode` | `undefined` | Content elements to be masked. |

---

## 6. Usage Examples

### Example A: Iris Circular Reveal from Top-Left
```tsx
import { MaskTransition } from '@/components/transitions';

export const HeroIntro = () => {
  return (
    <MaskTransition
      maskType="circle"
      mode="reveal"
      origin="top-left"
      duration={30}
      easing="easeOut"
      fade
    >
      <VideoHeroBanner />
    </MaskTransition>
  );
};
```

### Example B: Star Polygon Mask with Dynamic 90° Rotation
```tsx
import { MaskTransition } from '@/components/transitions';

export const StarBadgeReveal = () => {
  return (
    <MaskTransition
      maskType="polygon"
      shape="star"
      mode="reveal"
      origin="center"
      initialRotation={0}
      finalRotation={90}
      duration={25}
      spring="snappy"
    >
      <AchievementBadge />
    </MaskTransition>
  );
};
```

### Example C: Cross-Scene Replacement with Heart SVG Path
```tsx
import { MaskTransition } from '@/components/transitions';

export const SceneTransition = () => {
  return (
    <MaskTransition
      maskType="path"
      pathData="heart"
      mode="replace"
      origin="center"
      duration={30}
      fromContent={<IntroScene />}
      toContent={<FeaturesScene />}
    />
  );
};
```

---

## 7. Component File Links

- [MaskTransition.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/MaskTransition.tsx)
- [maskTransitionStyle.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/maskTransitionStyle.ts)
- [types.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/types.ts)
- [MaskTransitionShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/MaskTransitionShowcase.tsx)
- [mask-transition.test.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/tests/mask-transition.test.ts)
