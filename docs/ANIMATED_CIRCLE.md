# AnimatedCircle Component Documentation

`AnimatedCircle` is a specialized, frame-accurate radial SVG component for the Remotion Motion Graphics Framework (`Layer 2: Graphic Components`). It renders resolution-independent geometric circles, rings, partial arcs, and circular progress indicators with deterministic frame-based animations—including radial sweeps, circumference stroke drawing, pulse breathing, ring expansion, and multi-layer concentric compositions.

---

## 1. Features & Architectural Principles

- **Frame Determinism**: Driven purely by Remotion's `useCurrentFrame()`. Zero DOM timeouts, CSS transitions, keyframes, or non-pure browser rendering.
- **Pure SVG Geometry**: Renders lightweight, scalable `<circle>` and `<path>` SVG elements with exact sub-pixel positioning and zero clipping.
- **5 Supported Circle Geometries**:
  - `Filled Circle`: Solid or translucent interior fill.
  - `Outline Circle`: Clean perimeter stroke with transparent center.
  - `Ring`: Thick donut ring with customizable stroke width.
  - `Partial Arc / Sector`: Arc spanning arbitrary `startAngle` to `endAngle`, with optional `closed` sector wedge.
  - `Circular Progress`: Arc proportional to progress value (0 to 1 or 0% to 100%) with optional background track.
- **SVG Radial Drawing & Progress**:
  - `draw-in`: Progressive circumference stroke reveal using $C = 2\pi r$, `strokeDasharray = C`, and `strokeDashoffset = (1 - p) * C`.
  - `radial-reveal`: Sweeps arc angle from `startAngle` to `endAngle` clockwise or counter-clockwise.
  - `progress`: Fills circular arc from 0 to target progress with optional background track backing.
- **Physical Kinematics**:
  - `scale-in` / `scale-out`: Clean geometric scaling.
  - `fade-in` / `fade-out`: Alpha opacity transitions.
  - `ring-expansion`: Physical expansion of circle radius outward.
  - `pulse`: Harmonic periodic sine breathing ($1.0 \pm \text{magnitude}$) without boundary drift.
  - `rotate`: Smooth continuous or fixed angular rotation.
  - `stroke-width`: Dynamic growth of stroke thickness from 0 to full width.
  - `none`: Static deterministic circle.
- **Concentric Layering**: Multiple instances compose cleanly into radar reticles, target crosshairs, and multi-metric rings.
- **Centered Children**: Child elements (e.g. progress percentage text, center icons, badges) are automatically centered within the circle.
- **Exit Transitions**: Supports optional `exitFrame`, `exitDurationInFrames`, and `exitAnimation` (`fade-out`, `scale-out`, `draw-out`, `stroke-width`).

---

## 2. Component Props Interface

```typescript
export interface AnimatedCircleProps {
  // Dimensions & Geometry
  radius?: number;                                 // Radius in px (default: 50)
  size?: number;                                   // Overall diameter/size in px (overrides radius)
  startAngle?: number;                             // Starting arc angle in degrees (0 = 12 o'clock, default: 0)
  endAngle?: number;                               // Ending arc angle in degrees (default: 360)
  progress?: number;                               // Circular progress ratio (0 to 1, or 0 to 100)
  closed?: boolean;                                // Closed sector wedge when filled (default: false)

  // Colors & Strokes
  fill?: string;                                   // Fill color (default: 'transparent')
  stroke?: string;                                 // Stroke border color (default: '#276EF1')
  strokeWidth?: number;                            // Stroke thickness in px (default: 2)
  strokeLinecap?: 'round' | 'butt' | 'square';     // Line cap style (default: 'round')
  strokeDasharray?: string | number;               // Custom dash pattern (e.g. "6 4")
  strokeDashoffset?: number;                       // Base stroke offset
  strokeOpacity?: number;                          // Stroke opacity (default: 1)

  // Background Track (for Progress & Rings)
  showTrack?: boolean;                             // Render subtle background track (default: false)
  trackStroke?: string;                            // Track stroke color (default: 'rgba(255, 255, 255, 0.1)')
  trackStrokeWidth?: number;                       // Track stroke thickness

  // Transforms & Positioning
  opacity?: number;                                // Base container opacity (default: 1)
  rotation?: number;                               // Base rotation in degrees (default: 0)
  transformOrigin?: string;                        // CSS transform origin (default: 'center center')
  x?: number;                                      // Translation offset X in px
  y?: number;                                      // Translation offset Y in px
  scale?: number;                                  // Uniform scale multiplier (default: 1)
  scaleX?: number;                                 // Horizontal scale multiplier
  scaleY?: number;                                 // Vertical scale multiplier

  // Animation Controls
  animation?: CircleAnimation | CircleAnimationConfig; // Animation mode shorthand or full config
  animate?: boolean;                               // Toggle animation on/off (default: true)
  delay?: number;                                  // Delay in frames before animation begins
  durationInFrames?: number;                       // Duration in frames (default: 20)
  easing?: EasingPresetName | EasingFunction;      // Easing preset or custom function
  springPreset?: SpringPresetName;                 // Optional spring physics preset
  direction?: CircleAnimationDirection;              // 'clockwise' | 'counter-clockwise' | 'inward' | 'outward'
  from?: number;                                   // Custom starting value override
  to?: number;                                     // Custom target value override

  // Exit Transitions
  exitFrame?: number;                              // Frame when exit transition triggers
  exitDurationInFrames?: number;                   // Exit duration in frames (default: 12)
  exitAnimation?: 'fade-out' | 'scale-out' | 'draw-out' | 'stroke-width';

  // React Children & Styling
  children?: React.ReactNode;                      // Centered content (e.g. percentage, icons)
  style?: React.CSSProperties;                     // Outer container CSS
  svgStyle?: React.CSSProperties;                  // SVG element CSS
  className?: string;                              // Optional CSS class
}
```

---

## 3. Supported Animation Modes

| Mode | Description | Formula / Mechanism |
| :--- | :--- | :--- |
| **`scale-in` / `scale-out`** | Scale transition with eased settle | `scale = p * baseScale` |
| **`fade-in` / `fade-out`** | Alpha opacity ramp | `opacity = p * baseOpacity` |
| **`draw-in` / `draw`** | Progressive circumference stroke trace | `strokeDashoffset = (1 - p) * C` |
| **`draw-out`** | Retracts/erases circumference stroke | `strokeDashoffset = p * C` |
| **`radial-reveal`** | Sweeps arc angle from start to end | $\theta_{\text{end}} = \theta_{\text{start}} + p \cdot \Delta\theta$ |
| **`ring-expansion`** | Radius expands physically from 0 to $r$ | $r_{\text{eff}} = p \cdot r$ |
| **`pulse`** | Harmonic periodic sine breath oscillation | $\text{scale} = 1 + \sin(\phi) \cdot \text{mag}$ |
| **`progress`** | Circular progress arc fill | $\text{dash} = [p \cdot \text{targetP} \cdot C, C]$ |
| **`rotate`** | Continuous or fixed angular rotation | $\theta = p \cdot 360^\circ$ |
| **`stroke-width`** | Dynamic stroke thickness growth | $w_{\text{eff}} = p \cdot w$ |
| **`none`** | Static vector circle | Fully settled SVG render |

---

## 4. Usage Examples

### 4.1 Circular Progress with Centered Metric
```tsx
import { AnimatedCircle } from './components/graphics/AnimatedCircle';

export const BatteryProgress = () => (
  <AnimatedCircle
    radius={50}
    stroke="#0E8345"
    strokeWidth={8}
    progress={0.88}
    showTrack={true}
    trackStroke="rgba(255, 255, 255, 0.15)"
    animation="progress"
    delay={5}
    durationInFrames={25}
  >
    <span style={{ fontSize: 18, fontWeight: 800 }}>88%</span>
  </AnimatedCircle>
);
```

### 4.2 Multi-Ring Concentric Radar Reticle
```tsx
<div style={{ position: 'relative', width: 160, height: 160 }}>
  {/* Outer pulsing ring */}
  <div style={{ position: 'absolute', inset: 0 }}>
    <AnimatedCircle
      radius={75}
      stroke="#00D1FF"
      strokeWidth={1}
      strokeDasharray="6 4"
      animation="pulse"
    />
  </div>
  {/* Inner target circle */}
  <div style={{ position: 'absolute', inset: 0 }}>
    <AnimatedCircle
      radius={35}
      fill="rgba(0, 209, 255, 0.2)"
      stroke="#00D1FF"
      strokeWidth={2}
      animation="scale-in"
      delay={8}
    />
  </div>
</div>
```
