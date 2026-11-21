# AnimatedLine Component Documentation

`AnimatedLine` is a flexible, frame-accurate vector line component for the Remotion Motion Graphics Framework (`Layer 2: Graphic Components`). It renders resolution-independent SVG lines with configurable geometry, stroke styling, line caps, dash patterns, and deterministic motion animations—including progressive stroke drawing, center bilateral reveals, thickness dynamics, length expansion, and exit transitions.

---

## 1. Features & Architectural Principles

- **Frame Determinism**: Purely driven by Remotion's `useCurrentFrame()`. Zero DOM events, CSS keyframes, transitions, or asynchronous timers.
- **Pure SVG Rendering**: Renders resolution-independent `<line>` elements with sub-pixel alignment within an automatic bounding box.
- **Flexible Geometry**:
  - Horizontal lines (`orientation="horizontal"` or $x_1, y_1 \to x_1 + L, y_1$).
  - Vertical lines (`orientation="vertical"` or $x_1, y_1 \to x_1, y_1 + L$).
  - Diagonal lines (`orientation="diagonal"` or custom slope).
  - Arbitrary start and end coordinates: $(x_1, y_1)$ to $(x_2, y_2)$.
- **SVG Stroke Drawing & Reveals**:
  - `draw-in` / `reveal-left`: Progressive stroke reveal from start point $(x_1, y_1)$ to end point $(x_2, y_2)$ using `strokeDasharray = L` and `strokeDashoffset = (1 - p) * L`.
  - `draw-out`: Retracts or erases the stroke from start to end.
  - `reveal-right`: Reveals in reverse from end point $(x_2, y_2)$ backwards to start point using negative stroke dash offset.
  - `reveal-center`: Symmetrically expands outward from the center midpoint $(cx, cy)$ towards both endpoints using a progressive gap-dash SVG dasharray pattern.
- **Physical Kinematics**:
  - `length-expansion`: Physical expansion of the line's endpoint (or from center outward) across frames.
  - `stroke-width`: Dynamic growth of the stroke thickness from 0 to target strokeWidth.
  - `move-in`: Directional translation slide (`up`, `down`, `left`, `right`) coupled with opacity fade.
  - `fade-in` / `fade-out`: Deterministic alpha opacity ramp.
  - `none`: Static vector line without motion.
- **Stroke Caps & Textures**:
  - Supports `strokeLinecap`: `'round'`, `'butt'`, `'square'`.
  - Supports `strokeDasharray`: solid (undefined), dashed (`"8 4"`), dotted (`"2 4"`), or custom dash-dot combinations.
- **Exit Transitions**: Optional `exitFrame`, `exitDurationInFrames`, and `exitAnimation` (`fade-out`, `draw-out`, `stroke-width`).

---

## 2. Component Props Interface

```typescript
export interface AnimatedLineProps {
  // Geometry & Coordinates
  x1?: number;                                 // Starting x-coordinate in px (default: 0)
  y1?: number;                                 // Starting y-coordinate in px (default: 0)
  x2?: number;                                 // Ending x-coordinate in px
  y2?: number;                                 // Ending y-coordinate in px
  orientation?: LineOrientation;               // 'horizontal' | 'vertical' | 'diagonal' | 'custom'
  length?: number;                             // Preset length in px (default: 100)

  // Stroke Styling
  stroke?: string;                             // Stroke color (default: '#276EF1')
  strokeWidth?: number;                        // Stroke thickness in px (default: 2)
  strokeLinecap?: 'round' | 'butt' | 'square'; // SVG line cap style (default: 'round')
  strokeDasharray?: string | number;           // Custom SVG dash pattern (e.g. "8 4")
  strokeDashoffset?: number;                   // Base stroke offset
  strokeOpacity?: number;                      // Stroke opacity (default: 1)

  // Transforms & Positioning
  opacity?: number;                            // Overall container opacity (default: 1)
  rotation?: number;                           // Base rotation in degrees (default: 0)
  transformOrigin?: string;                    // Transform origin (default: 'center center')
  x?: number;                                  // Translation offset X in px
  y?: number;                                  // Translation offset Y in px
  scale?: number;                              // Uniform scale (default: 1)
  scaleX?: number;                             // Horizontal scale multiplier
  scaleY?: number;                             // Vertical scale multiplier
  width?: number;                              // Optional explicit SVG width
  height?: number;                             // Optional explicit SVG height

  // Animation Controls
  animation?: LineAnimation | LineAnimationConfig; // Animation mode shorthand or full config
  animate?: boolean;                           // Toggle animation on/off (default: true)
  delay?: number;                              // Delay in frames before animation begins
  durationInFrames?: number;                   // Animation duration in frames (default: 20)
  easing?: EasingPresetName | EasingFunction;  // Easing preset or custom function
  springPreset?: SpringPresetName;             // Optional spring preset
  direction?: LineAnimationDirection;          // 'up' | 'down' | 'left' | 'right' | 'start' | 'end' | 'center'
  from?: number;                               // Custom initial value override
  to?: number;                                 // Custom target value override

  // Exit Transitions
  exitFrame?: number;                          // Frame when exit transition triggers
  exitDurationInFrames?: number;               // Exit duration in frames (default: 12)
  exitAnimation?: 'fade-out' | 'draw-out' | 'stroke-width';

  // React Children & Styling
  children?: React.ReactNode;                  // Optional overlaid child elements
  style?: React.CSSProperties;                 // Container styling
  svgStyle?: React.CSSProperties;              // SVG element styling
  lineStyle?: React.CSSProperties;             // SVG <line> direct styling
  className?: string;                          // Optional CSS class
}
```

---

## 3. Supported Animation Modes

| Mode | Description | Kinematics Formula / SVG Property |
| :--- | :--- | :--- |
| `draw-in` / `draw` | Progressive draw from start to end | `strokeDashoffset = (1 - p) * L` |
| `draw-out` | Retracts/erases stroke from start to end | `strokeDashoffset = p * L` |
| `reveal-left` | Progressive start-to-end reveal | `strokeDashoffset = (1 - p) * L` |
| `reveal-right` | Reverse end-to-start reveal | `strokeDashoffset = -(1 - p) * L` |
| `reveal-center` | Symmetric bilateral reveal from center | `strokeDasharray = "0 (1-p)L/2 pL L"` |
| `length-expansion` | Physical endpoint interpolation | $x_2' = x_1 + p(x_2 - x_1)$, $y_2' = y_1 + p(y_2 - y_1)$ |
| `stroke-width` | Stroke thickness growth | `effectiveStrokeWidth = p * strokeWidth` |
| `move-in` | Directional translation slide + fade | Directional 30px offset settle + opacity fade |
| `fade-in` / `fade-out` | Alpha opacity transition | `opacity = p * baseOpacity` |
| `none` | Static vector line | Deterministic full render |

---

## 4. Usage Examples

### 4.1 Editorial Typographic Underline
```tsx
import { AnimatedLine } from './components/graphics/AnimatedLine';

export const HeadlineWithUnderline = () => (
  <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
    <h1>NEXT-GEN AUTONOMOUS MOBILITY</h1>
    <AnimatedLine
      orientation="horizontal"
      length={360}
      stroke="#276EF1"
      strokeWidth={4}
      strokeLinecap="round"
      animation="draw-in"
      delay={10}
      durationInFrames={24}
    />
  </div>
);
```

### 4.2 Expanding Center Card Divider
```tsx
<AnimatedLine
  orientation="horizontal"
  length={300}
  stroke="rgba(255, 255, 255, 0.2)"
  strokeWidth={1}
  strokeDasharray="6 4"
  animation="reveal-center"
  delay={5}
  durationInFrames={20}
/>
```

### 4.3 Custom Diagonal Connector
```tsx
<AnimatedLine
  x1={50}
  y1={50}
  x2={350}
  y2={200}
  stroke="#0E8345"
  strokeWidth={3}
  strokeLinecap="round"
  animation="draw-in"
  delay={15}
  durationInFrames={30}
/>
```
