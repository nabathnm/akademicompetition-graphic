# AnimatedShape Component Documentation

`AnimatedShape` is a foundational, frame-accurate 2D geometric shape component for the Remotion Motion Graphics Framework (`Layer 2: Graphic Components`). It renders vector geometry via SVG and provides deterministic, physics-informed motion graphics animations including progressive stroke-drawing reveals, spring overshoot pops, continuous angular rotations, and directional movement slides.

---

## 1. Features & Architectural Principles

- **Frame Determinism**: Purely driven by Remotion's `useCurrentFrame()`. Zero DOM events, CSS keyframes, or runtime timers.
- **Pure SVG Rendering**: Renders lightweight, resolution-independent SVG elements (`<rect>`, `<ellipse>`, `<polygon>`) with exact sub-pixel positioning.
- **6 Supported Shape Types**:
  - `rectangle`: Sharp or custom corner rectangle.
  - `rounded-rectangle`: Rounded rectangle with configurable `borderRadius`.
  - `circle` / `ellipse`: Circle or non-uniform ellipse.
  - `polygon`: Regular $N$-sided polygon (e.g., hexagon, pentagon, octagon) generated from vertex angle calculations.
  - `triangle`: Equilateral 3-sided polygon.
  - `star`: Configurable $N$-pointed star with inner/outer radius ratios.
- **Deterministic SVG Stroke-Draw Reveals**:
  - Calculates exact perimeters using Ramanujan's ellipse approximation, Euclidean polygon edge sums, or rectangular bounds.
  - Controls stroke drawing via `strokeDasharray = perimeter` and `strokeDashoffset = (1 - drawProgress) * perimeter`.
- **8 Animation Modes**:
  - `fade-in` / `fade-out`: Smooth opacity transitions.
  - `scale-in` / `scale-out`: Directional or uniform scale transitions.
  - `rotate`: Clockwise or counter-clockwise angular rotation (supports continuous looping).
  - `move`: Directional movement slide (`up`, `down`, `left`, `right`).
  - `pop`: Spring-based pop entrance with overshoot bounce.
  - `bounce`: Spring physics rebound settle.
  - `draw`: Progressive outline stroke trace.
  - `combined`: Integrated stroke draw, spring pop, and opacity fade.
  - `none`: Static shape without animation.
- **Exit Transitions**: Supports optional `exitFrame`, `exitDurationInFrames`, and `exitAnimation` (`fade-out`, `scale-out`).

---

## 2. Component Props Interface

```typescript
export interface AnimatedShapeProps {
  // Shape Geometry
  shape?: ShapeType;                     // 'rectangle' | 'rounded-rectangle' | 'ellipse' | 'circle' | 'polygon' | 'triangle' | 'star'
  width?: number;                        // Width in pixels (default: 100)
  height?: number;                       // Height in pixels (default: 100)
  borderRadius?: number;                 // Corner radius for rounded rectangles (default: 12)
  sides?: number;                        // Number of sides for polygons (default: 6)
  starPoints?: number;                   // Number of points for stars (default: 5)
  starInnerRadiusRatio?: number;         // Ratio of inner to outer star radius (default: 0.45)
  points?: string;                       // Optional custom polygon coordinate string

  // Colors & Strokes
  fill?: string;                         // Fill color or gradient (default: 'rgba(39, 110, 241, 0.2)')
  stroke?: string;                       // Stroke border color (default: '#276EF1')
  strokeWidth?: number;                  // Stroke width in pixels (default: 2)
  strokeDasharray?: string | number;     // Custom stroke dash pattern
  strokeLinecap?: 'round' | 'butt' | 'square';
  strokeLinejoin?: 'round' | 'miter' | 'bevel';

  // Base Transforms & Positioning
  opacity?: number;                      // Base opacity from 0 to 1 (default: 1)
  rotation?: number;                     // Base rotation in degrees (default: 0)
  x?: number;                            // Base horizontal position offset
  y?: number;                            // Base vertical position offset
  scale?: number;                        // Base scale multiplier (default: 1)
  scaleX?: number;                       // Base horizontal scale
  scaleY?: number;                       // Base vertical scale
  transformOrigin?: string;              // CSS transform origin (default: 'center center')

  // Animation Controls
  animation?: ShapeAnimation | ShapeAnimationConfig;
  animate?: boolean;                     // Toggle animation on/off (default: true)
  delay?: number;                        // Frame delay before animation begins (default: 0)
  durationInFrames?: number;             // Duration in frames (default: 20)
  easing?: EasingPresetName | EasingFunction;
  springPreset?: SpringPresetName;       // 'snappy' | 'bouncy' | 'smooth' | 'gentle' | 'stiff'
  direction?: ShapeAnimationDirection;  // 'up' | 'down' | 'left' | 'right' | 'clockwise' | 'counter-clockwise'
  from?: number;                         // Custom starting value override
  to?: number;                           // Custom target value override

  // Exit Transitions
  exitFrame?: number;                    // Frame at which exit transition triggers
  exitDurationInFrames?: number;         // Exit duration in frames (default: 12)
  exitAnimation?: ShapeAnimation;        // Exit animation preset (e.g. 'fade-out', 'scale-out')

  // Styling & Children
  children?: React.ReactNode;            // Optional overlay content
  style?: React.CSSProperties;           // Container style overrides
  svgStyle?: React.CSSProperties;        // SVG element style overrides
  className?: string;
}
```

---

## 3. Usage Examples

### 3.1 Progressive Stroke-Drawing Hexagon

```tsx
import { AnimatedShape } from '@/components/graphics/AnimatedShape';

export const RadarHexagon: React.FC = () => {
  return (
    <AnimatedShape
      shape="polygon"
      sides={6}
      width={160}
      height={160}
      fill="rgba(0, 209, 255, 0.1)"
      stroke="#00D1FF"
      strokeWidth={3}
      delay={10}
      durationInFrames={24}
      animation="draw"
    />
  );
};
```

### 3.2 Spring Pop Star with Continuous Rotation

```tsx
import { AnimatedShape } from '@/components/graphics/AnimatedShape';

export const RotatingBeaconStar: React.FC = () => {
  return (
    <AnimatedShape
      shape="star"
      starPoints={5}
      width={120}
      height={120}
      fill="#FFC043"
      stroke="#FFFFFF"
      strokeWidth={2}
      delay={5}
      durationInFrames={60}
      animation={{
        type: 'rotate',
        direction: 'clockwise',
        to: 360,
        loop: true,
      }}
    />
  );
};
```

### 3.3 Directional Movement Slide with Rounded Rect

```tsx
import { AnimatedShape } from '@/components/graphics/AnimatedShape';

export const SlidingCardBackdrop: React.FC = () => {
  return (
    <AnimatedShape
      shape="rounded-rectangle"
      width={240}
      height={140}
      borderRadius={16}
      fill="rgba(39, 110, 241, 0.15)"
      stroke="#276EF1"
      strokeWidth={2}
      delay={15}
      durationInFrames={20}
      animation="move"
      direction="up"
      to={80}
    />
  );
};
```

---

## 4. Verification & Testing

Unit tests for `AnimatedShape` are located at [tests/animated-shape.test.ts](../../tests/animated-shape.test.ts).
Interactive playground showcase is registered in [src/playground/MotionPlayground.tsx](../../src/playground/MotionPlayground.tsx).
