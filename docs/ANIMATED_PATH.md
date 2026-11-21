# AnimatedPath Component Documentation

`AnimatedPath` is a flexible, frame-accurate vector path component for the Remotion Motion Graphics Framework (`Layer 2: Graphic Components`). It renders resolution-independent SVG paths supporting arbitrary vector path data (`d`), progressive forward/reverse stroke drawing, sequenced fill reveals, stroke-width animations, and deterministic motion-along-path tracking without reliance on browser DOM APIs or CSS motion paths.

---

## 1. Features & Architectural Principles

- **Frame Determinism**: Purely computed from Remotion's `useCurrentFrame()`. Zero asynchronous browser animation loops, requestAnimationFrame, or CSS keyframes.
- **Pure SVG Geometry Engine**:
  - Full SVG path tokenizer and parser handling `M`, `L`, `H`, `V`, `C`, `S`, `Q`, `T`, `A`, and `Z`.
  - Converts elliptical arcs (`A`/`a`) to high-precision cubic Béziers.
  - Computes exact arc lengths through numerical subdivision.
  - Automatically calculates bounding boxes and responsive viewports with stroke padding.
- **Path Drawing Capabilities**:
  - `draw-in` / `progressive-reveal`: Forward stroke drawing via animated `strokeDashoffset` ($L \to 0$).
  - `reverse-draw`: Backwards stroke drawing from the path endpoint backward to start ($-L \to 0$).
  - `draw-out`: Retracts stroke along path direction ($0 \to L$).
  - `stroke-width`: Dynamic stroke thickness expansion.
- **Sequenced Fill Reveals**:
  - `with-draw`: Fill opacity fades in synchronously as stroke draws.
  - `after-draw`: Stroke outline draws first; upon completion, fill smoothly floods the closed area.
  - `independent`: Configurable `fillDelay` and `fillDurationInFrames`.
- **Deterministic Motion Along Path**:
  - Samples coordinates $(x, y)$ and tangent orientation $\theta = \text{atan2}(dy, dx) \cdot \frac{180}{\pi}$ at arbitrary distance or progress parameter $t \in [0, 1]$.
  - Automatic follower beacon rendering with optional auto-rotation to align with path curvature.
  - Custom follower render callback `renderFollower(point)` or `customElement`.
  - Child function support: `children?: ((point: PathPoint) => React.ReactNode) | React.ReactNode`.
- **Exit Transitions**: Supports optional `exitFrame`, `exitDurationInFrames`, and `exitAnimation` (`fade-out`, `scale-out`, `draw-out`).

---

## 2. Component Props Interface

```typescript
export interface AnimatedPathProps {
  // Path Geometry & ViewBox
  d: string;                                          // SVG path data string ('M ... L ... C ... Z')
  pathLength?: number;                                // Explicit path length override in px
  isClosed?: boolean;                                 // Explicit closed indicator (auto-detected from Z/z)
  viewBox?: string;                                   // SVG viewBox (auto-computed from path bounds if omitted)
  width?: number | string;                            // Outer SVG width (pixels or percentage)
  height?: number | string;                           // Outer SVG height (pixels or percentage)
  preserveAspectRatio?: string;                       // Default: 'xMidYMid meet'

  // Fill & Stroke Styling
  fill?: string;                                      // Fill color or gradient (default: 'none')
  fillRule?: 'nonzero' | 'evenodd';                   // Fill rule (default: 'nonzero')
  fillOpacity?: number;                               // Base fill opacity (0 to 1, default: 1)
  stroke?: string;                                    // Stroke color (default: '#276EF1')
  strokeWidth?: number;                               // Stroke width in px (default: 2)
  strokeLinecap?: 'round' | 'butt' | 'square';        // Default: 'round'
  strokeLinejoin?: 'round' | 'miter' | 'bevel';       // Default: 'round'
  strokeMiterlimit?: number;                          // Default: 4
  strokeDasharray?: string | number;                  // User dash pattern override
  strokeDashoffset?: number;                          // User dash offset override
  strokeOpacity?: number;                             // Stroke opacity (0 to 1, default: 1)
  opacity?: number;                                   // Overall container opacity (default: 1)

  // Spatial Transforms
  x?: number;                                         // Horizontal translation offset in px
  y?: number;                                         // Vertical translation offset in px
  rotation?: number;                                  // Angular rotation in degrees (default: 0)
  transformOrigin?: string;                           // CSS transform origin (default: 'center center')
  scale?: number;                                     // Uniform scale multiplier (default: 1)
  scaleX?: number;                                    // Horizontal scale multiplier
  scaleY?: number;                                    // Vertical scale multiplier

  // Animation Kinetics
  animation?: PathAnimation | PathAnimationConfig;    // 'draw-in' | 'draw-out' | 'reverse-draw' | 'fill-reveal' | 'motion-along-path' | ...
  animate?: boolean;                                  // Master toggle (default: true)
  delay?: number;                                     // Entrance delay in frames (default: 0)
  durationInFrames?: number;                          // Duration in frames (default: 30)
  easing?: EasingPresetName | EasingFunction;         // Easing function or preset name
  springPreset?: SpringPresetName;                    // Spring physics preset ('snappy', 'gentle', etc.)
  from?: number;                                      // Initial value override for scale/stroke-width/rotation
  to?: number;                                        // Target value override

  // Fill Reveal Sequencing
  fillRevealTiming?: PathFillRevealTiming;            // 'with-draw' | 'after-draw' | 'independent' (default: 'with-draw')
  fillDelay?: number;                                 // Delay before fill begins revealing
  fillDurationInFrames?: number;                      // Duration in frames for fill reveal (default: 20)

  // Motion Along Path & Follower Marker
  showFollower?: boolean;                             // Whether to render follower indicator (default: false)
  follower?: PathFollowerConfig;                      // Detailed follower configuration
  followerSize?: number;                              // Follower beacon size in px (default: 6)
  followerColor?: string;                             // Follower fill color (defaults to stroke)
  followerStroke?: string;                            // Follower border stroke
  followerStrokeWidth?: number;                       // Follower border width
  autoRotateFollower?: boolean;                       // Auto-orient follower with path tangent (default: true)
  followerDelay?: number;                             // Frame delay before follower motion starts
  followerDurationInFrames?: number;                  // Duration for follower traversal
  followerLoop?: boolean;                             // Continuous loop across frames
  followerProgress?: number;                          // Manual progress override (0 to 1)
  renderFollower?: (point: PathPoint) => React.ReactNode;

  // Exit Transitions
  exitFrame?: number;                                 // Frame trigger for exit transition
  exitDurationInFrames?: number;                      // Duration in frames for exit (default: 12)
  exitAnimation?: 'fade-out' | 'scale-out' | 'draw-out';

  // Overlays & Children
  children?: React.ReactNode | ((point: PathPoint) => React.ReactNode);
  style?: React.CSSProperties;
  svgStyle?: React.CSSProperties;
  className?: string;
}
```

---

## 3. Usage Examples

### A. Drawing a Curved Route Line
```tsx
import { AnimatedPath } from './components/graphics/AnimatedPath';
import { Colors } from './styles/colors';

export const RoutePreview = () => (
  <AnimatedPath
    d="M 20 120 C 80 20, 160 20, 220 120 S 360 220, 420 120"
    stroke={Colors.accent.cyan}
    strokeWidth={3}
    animation="draw-in"
    delay={5}
    durationInFrames={30}
    showFollower={true}
  />
);
```

### B. Closed Shield Icon with Sequenced Fill Reveal
```tsx
export const SecurityBadge = () => (
  <AnimatedPath
    d="M 100 15 L 180 45 C 180 110, 140 160, 100 185 C 60 160, 20 110, 20 45 Z"
    stroke={Colors.accent.emerald}
    strokeWidth={3}
    fill="rgba(5, 150, 105, 0.25)"
    fillRevealTiming="after-draw"
    fillDurationInFrames={15}
    animation="draw-in"
    delay={0}
    durationInFrames={20}
  />
);
```

### C. Looping Follower Drone along Wave Trajectory
```tsx
export const WaveSensor = () => (
  <AnimatedPath
    d="M 10 75 Q 60 15 110 75 T 210 75 T 310 75 T 410 75"
    stroke="rgba(255, 255, 255, 0.2)"
    strokeWidth={2}
    animation="none"
    showFollower={true}
    follower={{
      enabled: true,
      size: 8,
      color: Colors.accent.amber,
      delay: 0,
      duration: 45,
      loop: true,
      autoRotate: true,
    }}
  />
);
```

---

## 4. Verification & Testing

Validated across 29 unit tests in `tests/animated-path.test.ts`:
1. SVG path command tokenization and coordinate parsing (including negatives, decimals, scientific notation).
2. Segment decomposition (`line`, `quadratic`, `cubic`) and arc conversion (`A` $\to$ cubic Béziers).
3. Deterministic point and tangent angle sampling along straight and curved paths.
4. Viewport and bounding box calculations with padding.
5. Drawing variants: `draw-in`, `draw-out`, `reverse-draw`, and static `none`.
6. Sequenced fill reveal timings: `with-draw`, `after-draw`, `independent`.
7. Follower progression and tangent angle alignment.
8. Exit animations and framerate consistency (24, 30, 60 fps).
