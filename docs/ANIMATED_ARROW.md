# AnimatedArrow Component Documentation

`AnimatedArrow` is a flexible, frame-accurate vector arrow component for the Remotion Motion Graphics Framework (`Layer 2: Graphic Components`). It renders resolution-independent SVG arrows supporting straight, diagonal, and curved Bezier paths, single/double arrowheads, multiple arrowhead styles (triangle, chevron, stealth, barb, circle), and sequenced reveals.

---

## 1. Features & Architectural Principles

- **Frame Determinism**: Driven purely by Remotion's `useCurrentFrame()`. Zero DOM timeouts, CSS keyframes, or asynchronous browser animation loops.
- **Pure SVG Geometry**: Renders resolution-independent `<path>` elements with calculated tangent orientations at endpoints.
- **Multiple Arrow Geometries**:
  - `Straight Arrows`: Linear paths across cardinal (`right`, `left`, `up`, `down`) and diagonal directions.
  - `Curved Bezier Arrows`: Configurable curvature ($k \in [-1, 1]$) with calculated normal displacement or explicit control points.
  - `Custom Endpoints`: Arbitrary $(x_1, y_1)$ to $(x_2, y_2)$ vector tracking.
- **5 Arrowhead Styles**:
  - `triangle`: Classic solid directional triangle.
  - `chevron`: Open V-shaped stroke barb.
  - `stealth`: Tactical notched stealth arrowhead.
  - `barb`: Swept curved flairs.
  - `circle`: Terminal node dot indicator.
- **Flexible Placement**:
  - Single-headed (`end` or `start`).
  - Double-headed (`both` for bidirectional flows).
- **Sequenced Arrowhead Timing**:
  - `with-line`: Arrowhead reveals concurrently with line progression.
  - `after-line`: Line draws in first, then arrowhead springs/scales in upon line completion.
  - `independent`: Arrowhead entrance timing is configured independently (`headDelay`, `headDurationInFrames`).
- **Motion Kinematics**:
  - `draw-in` / `draw` / `path-drawing`: Progressive stroke-dash draw reveal.
  - `draw-out`: Retracts stroke along arrow path.
  - `move-in`: Slides in backwards along orientation vector + opacity fade.
  - `arrowhead-reveal`: Static line with spring-settled arrowhead entrance.
  - `scale-in` / `scale-out`: Clean geometric scaling.
  - `fade-in` / `fade-out`: Deterministic alpha opacity ramp.
  - `none`: Static vector arrow.
- **Exit Transitions**: Supports optional `exitFrame`, `exitDurationInFrames`, and `exitAnimation` (`fade-out`, `scale-out`, `draw-out`).

---

## 2. Component Props Interface

```typescript
export interface AnimatedArrowProps {
  // Coordinates & Geometry
  x1?: number;                                 // Starting x-coordinate in px (default: 0)
  y1?: number;                                 // Starting y-coordinate in px (default: 0)
  x2?: number;                                 // Ending x-coordinate in px
  y2?: number;                                 // Ending y-coordinate in px
  direction?: ArrowDirection;                  // Direction preset ('right' | 'left' | 'up' | 'down' | diagonal | 'custom')
  length?: number;                             // Arrow length in px (default: 100)
  curvature?: number;                          // Curvature factor (-1 to 1, 0 = straight, default: 0)
  controlPoint?: { x: number; y: number };     // Optional explicit Bezier control point

  // Arrowhead Styling
  arrowheadStyle?: ArrowheadStyle;             // 'triangle' | 'chevron' | 'stealth' | 'barb' | 'circle' (default: 'triangle')
  arrowheadPlacement?: ArrowheadPlacement;     // 'end' | 'start' | 'both' (default: 'end')
  arrowheadSize?: number;                      // Arrowhead dimension in px (default: 14)
  arrowheadAngle?: number;                     // Arrowhead tip flare angle in degrees (default: 32)
  arrowheadFill?: string;                      // Fill color for closed arrowheads (defaults to stroke)

  // Arrowhead Timing
  headTiming?: ArrowheadTiming;                // 'with-line' | 'after-line' | 'independent' (default: 'with-line')
  headDelay?: number;                          // Independent delay in frames
  headDurationInFrames?: number;               // Independent duration in frames

  // Stroke Styling
  stroke?: string;                             // Stroke color (default: '#276EF1')
  strokeWidth?: number;                        // Stroke thickness in px (default: 2)
  strokeLinecap?: 'round' | 'butt' | 'square'; // SVG line cap (default: 'round')
  strokeLinejoin?: 'round' | 'miter' | 'bevel';// SVG line join (default: 'round')
  strokeDasharray?: string | number;           // Dash pattern for dashed arrows
  strokeDashoffset?: number;                   // Base stroke offset
  strokeOpacity?: number;                      // Stroke opacity (default: 1)

  // Transforms & Positioning
  opacity?: number;                            // Base container opacity (default: 1)
  rotation?: number;                           // Base rotation in degrees (default: 0)
  transformOrigin?: string;                    // CSS transform origin (default: 'center center')
  x?: number;                                  // Translation offset X in px
  y?: number;                                  // Translation offset Y in px
  scale?: number;                              // Uniform scale multiplier (default: 1)
  scaleX?: number;                             // Horizontal scale multiplier
  scaleY?: number;                             // Vertical scale multiplier
  width?: number;                              // Explicit SVG width
  height?: number;                             // Explicit SVG height

  // Animation Controls
  animation?: ArrowAnimation | ArrowAnimationConfig; // Animation mode shorthand or full config
  animate?: boolean;                           // Toggle animation on/off (default: true)
  delay?: number;                              // Delay in frames before animation begins
  durationInFrames?: number;                   // Duration in frames (default: 20)
  easing?: EasingPresetName | EasingFunction;  // Easing preset or custom function
  springPreset?: SpringPresetName;             // Optional spring physics preset
  from?: number;                               // Custom starting value override
  to?: number;                                 // Custom target value override

  // Exit Transitions
  exitFrame?: number;                          // Frame when exit transition triggers
  exitDurationInFrames?: number;               // Exit duration in frames (default: 12)
  exitAnimation?: 'fade-out' | 'scale-out' | 'draw-out';

  // React Children & Styling
  children?: React.ReactNode;                  // Overlaid child elements
  style?: React.CSSProperties;                 // Outer container CSS
  svgStyle?: React.CSSProperties;              // SVG element CSS
  className?: string;                          // Optional CSS class
}
```

---

## 3. Supported Animation Modes

| Mode | Description | Kinematics Mechanism |
| :--- | :--- | :--- |
| **`draw-in` / `draw`** | Progressive stroke drawing from start to end | `strokeDashoffset = (1 - lineProgress) * L` |
| **`draw-out`** | Retracts stroke from start to end | `strokeDashoffset = outProgress * L` |
| **`arrowhead-reveal`** | Static line with spring/eased arrowhead entrance | Head scales from 0 to 1 with settled line |
| **`move-in`** | Directional slide along orientation vector + fade | Directional 30px offset settle + opacity ramp |
| **`scale-in` / `scale-out`** | Geometric scale transition | `scale = p * baseScale` |
| **`fade-in` / `fade-out`** | Alpha opacity ramp | `opacity = p * baseOpacity` |
| **`none`** | Deterministic static arrow | Fully settled SVG render |

---

## 4. Usage Examples

### 4.1 Curved Waypoint Vector Arrow
```tsx
import { AnimatedArrow } from './components/graphics/AnimatedArrow';

export const RouteArrow = () => (
  <AnimatedArrow
    x1={20}
    y1={60}
    x2={280}
    y2={20}
    curvature={-0.45}
    arrowheadStyle="stealth"
    arrowheadSize={16}
    stroke="#00D1FF"
    strokeWidth={4}
    headTiming="after-line"
    animation="draw-in"
    delay={5}
    durationInFrames={25}
  />
);
```

### 4.2 Diagonal Momentum Indicator
```tsx
<AnimatedArrow
  direction="diagonal-up-right"
  length={70}
  arrowheadStyle="triangle"
  arrowheadSize={14}
  stroke="#0E8345"
  strokeWidth={4}
  animation="draw-in"
  durationInFrames={20}
/>
```

### 4.3 Bidirectional Double-Headed Connector
```tsx
<AnimatedArrow
  direction="right"
  length={160}
  arrowheadPlacement="both"
  arrowheadStyle="chevron"
  stroke="#7B2CBF"
  strokeWidth={3}
  animation="draw-in"
  delay={8}
/>
```
