# MorphTransition Component Documentation

`MorphTransition` is a deterministic 2D SVG path morphing transition for Remotion motion graphics. It continuously interpolates arbitrary SVG path geometries, fill colors, stroke colors, stroke widths, rotation, and scale breathing without requiring third-party morphing libraries.

---

## 1. Architecture & Design Principles

```
                    ┌────────────────────────────┐
                    │      useCurrentFrame()     │
                    └─────────────┬──────────────┘
                                  │
                                  ▼
               ┌──────────────────────────────────────┐
               │ calculateMorphMetrics()               │
               │   • Progress u in [0, 1]             │
               │   • Spring / Easing interpolation    │
               │   • Scale & Rotation kinematics      │
               │   • Continuous Color Blending (RGBA) │
               │   • Point Interpolation:             │
               │     P_k(u) = (1 - u)*A_k + u*B_k     │
               └──────────────────┬───────────────────┘
                                  │
                                  ▼
                     ┌─────────────────────────┐
                     │   SVG Path Generation   │
                     │  d="M x0 y0 L x1 y1..." │
                     └────────────┬────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │ <svg viewBox="0 0 100 100">   │
                  │   <path d={currentPath} .../> │
                  │   {children}                  │
                  │ </svg>                        │
                  └───────────────────────────────┘
```

### Deterministic Arc-Length Resampling
Different SVG paths often have incompatible command counts and topologies (e.g. a circle with 4 Bézier segments vs. a 5-point star with 10 line segments). Traditional point-to-point interpolation breaks down without matching point arrays.

`MorphTransition` solves this deterministically:
1. Resolves input paths: Accepts either standard preset names (`circle`, `star`, etc.) or arbitrary SVG `d` strings.
2. Arc-length sampling: Uses `parseSvgPath` and `getPointAlongPath` to divide each path into $N$ equidistant arc-length sample points ($N = 48$ by default).
3. Frame calculation: For each frame progress $u \in [0, 1]$, each coordinate pair is computed as:
   $$P_k(u) = (1 - u) A_k + u B_k$$
4. SVG serialization: The resulting points are serialized into an SVG polygon path string `M x0 y0 L x1 y1 ... Z`.

### Zero External Heavy Dependencies
Rather than introducing heavy morphing dependencies like `flubber` or `d3-interpolate-path`, `MorphTransition` reuses existing mathematical path geometry utilities in `src/components/graphics/animatedPathStyle.ts`, keeping the bundle lean, robust, and completely deterministic across video rendering workers.

---

## 2. Built-in Preset Shapes

All presets are normalized to a standard `100 x 100` coordinate space:

| Preset Name | Description | Vertex / Anchor Style |
|:---|:---|:---|
| `circle` | Centered circle ($r = 44$) | 4 cubic Bézier curves |
| `rectangle` | Sharp-cornered square | 4 line segments |
| `rounded-rectangle` | Smooth rounded box ($r = 16$) | Arcs and line segments |
| `triangle` | Equilateral upward triangle | 3 sharp corners |
| `diamond` | Rotated 4-point diamond | 4 vertices |
| `star` | 5-point star | 10 alternating inner/outer points |
| `pentagon` | Regular 5-sided polygon | 5 vertices |
| `hexagon` | Regular 6-sided polygon | 6 vertices |
| `heart` | Symmetrical romantic heart | Dual top lobes and pointed base |
| `cloud` | Multi-lobed cloud contour | Smooth cubic curves |
| `check` | Verification checkmark | V-shaped stroke path |
| `cross` | Diagonal 'X' dismiss cross | Centered cross polygon |
| `play` | Media play triangle | Right-pointing directional polygon |
| `arrow` | Directional navigation arrow | Stem with triangular arrowhead |

---

## 3. Continuous Color Blending

Colors are parsed into 4-channel `RGBA` vectors:
- Hex colors: `#RGB`, `#RRGGBB`, `#RGBA`, `#RRGGBBAA`
- Functional strings: `rgb(r, g, b)`, `rgba(r, g, b, a)`
- Keywords: `transparent` $\to [0, 0, 0, 0]$, `none` $\to [0, 0, 0, 0]$

When transitioning from an opaque color to `transparent` or `none`, RGB channels are borrowed from the visible color while alpha interpolates $1 \to 0$, preventing gray muddy artifacts during fades.

---

## 4. Component Properties (`MorphTransitionProps`)

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `fromPath` | `BuiltinMorphShape \| string` | `'circle'` | Starting shape preset or SVG path data |
| `toPath` | `BuiltinMorphShape \| string` | `'star'` | Ending shape preset or SVG path data |
| `duration` | `number` | `30` | Duration of the morphing transition in frames |
| `delay` | `number` | `0` | Delay before the transition starts in frames |
| `easing` | `EasingFunction \| string` | `easeInOut` | Easing curve function or name |
| `spring` | `SpringConfig` | `undefined` | Optional Remotion spring physics configuration |
| `reverse` | `boolean` | `false` | When true, animates backward from `toPath` to `fromPath` |
| `samplePoints` | `number` | `48` | Number of equidistant points along the path ($16 \le N \le 128$) |
| `fromFill` | `string` | `'#06b6d4'` | Initial shape fill color |
| `toFill` | `string` | `'#a855f7'` | Target shape fill color |
| `fromStroke` | `string` | `'transparent'` | Initial shape stroke color |
| `toStroke` | `string` | `'transparent'` | Target shape stroke color |
| `fromStrokeWidth`| `number` | `0` | Initial stroke width |
| `toStrokeWidth` | `number` | `0` | Target stroke width |
| `initialRotation`| `number` | `0` | Initial rotation in degrees |
| `finalRotation` | `number` | `0` | Target rotation in degrees |
| `initialScale` | `number` | `1` | Initial scale factor |
| `finalScale` | `number` | `1` | Target scale factor |
| `fromOpacity` | `number` | `1` | Initial opacity |
| `toOpacity` | `number` | `1` | Target opacity |
| `width` | `number \| string` | `100` | Rendered width of the SVG container |
| `height` | `number \| string` | `100` | Rendered height of the SVG container |
| `viewBox` | `string` | `'0 0 100 100'` | SVG viewBox coordinate system |
| `transformOrigin`| `string` | `'center'` | CSS transform-origin point |
| `style` | `React.CSSProperties`| `undefined` | Additional inline styles |
| `className` | `string` | `undefined` | Additional CSS class names |
| `children` | `React.ReactNode` | `undefined` | Optional overlay content inside SVG |

---

## 5. Usage Examples

### Basic Preset Morph
```tsx
import { MorphTransition } from '@/components/transitions/MorphTransition';

export const IconMorphExample = () => {
  return (
    <MorphTransition
      fromPath="heart"
      toPath="star"
      fromFill="#ec4899"
      toFill="#eab308"
      duration={30}
      delay={5}
      width={120}
      height={120}
    />
  );
};
```

### Morph with Rotational Kinematics & Scale Breathing
```tsx
import { MorphTransition } from '@/components/transitions/MorphTransition';

export const DynamicMorphBadge = () => {
  return (
    <MorphTransition
      fromPath="circle"
      toPath="rounded-rectangle"
      fromFill="#3b82f6"
      toFill="#10b981"
      fromStroke="#60a5fa"
      toStroke="#34d399"
      fromStrokeWidth={2}
      toStrokeWidth={4}
      initialRotation={0}
      finalRotation={180}
      initialScale={0.8}
      finalScale={1.2}
      duration={45}
      width={140}
      height={140}
    />
  );
};
```

### Custom SVG Path Morph
```tsx
import { MorphTransition } from '@/components/transitions/MorphTransition';

const customWedge = "M 50 50 L 20 80 A 40 40 0 0 1 80 80 Z";
const customHex = "M 50 10 L 85 30 L 85 70 L 50 90 L 15 70 L 15 30 Z";

export const CustomGeometryExample = () => {
  return (
    <MorphTransition
      fromPath={customWedge}
      toPath={customHex}
      fromFill="#6366f1"
      toFill="#f43f5e"
      samplePoints={64}
      duration={35}
      width={160}
      height={160}
    />
  );
};
```

---

## 6. Unit Testing & Verification

Unit tests are implemented in `tests/morph-transition.test.ts`. Run with:

```bash
node --test tests/morph-transition.test.ts
```

All 17 tests verify:
- Accurate progress calculation with delays and durations.
- Point sampling and resampling resolution.
- Preset resolution for all 14 shapes.
- Deterministic point linear interpolation.
- Continuous hex and rgba color transitions.
- Kinematic rotation and scale breathing.
- Spring physics damping and reverse playback.
