# AnimatedToggle Component Documentation

`AnimatedToggle` is a production-grade, frame-accurate toggle and switch component for the Remotion Motion Graphics Framework (`Layer 2: Component Library`). It simulates realistic toggle interactions commonly found in mobile applications, operating systems, and commercial digital product interfaces.

---

## 1. Features & Architectural Principles

- **Frame Determinism**: Driven strictly by Remotion's `useCurrentFrame()`. Zero DOM events, `setTimeout`, `setInterval`, or CSS keyframe animations.
- **Physical Spring Kinetics**: Thumb travel supports configurable spring overshoot (`snappy`, `bouncy`, `smooth`, `gentle`, `stiff`), giving tactile physical realism.
- **Mid-Flight Squash & Stretch**: Physical scale feedback extends the thumb horizontally during travel and compresses it slightly along the vertical axis before settling.
- **5 Visual Presentation Variants**:
  - `default`: Standard mobile iOS/Material pill track with circular elevated thumb.
  - `minimal`: Thin track line with an overlapping floating thumb bead.
  - `outlined`: Transparent/translucent track with high-contrast accent border.
  - `filled`: Solid flat track with flush high-contrast thumb.
  - `labeled`: Internal track indicators showing miniature `ON` / `OFF` text with animated fade transitions.
- **7 Animation Variants**:
  - `slide`: Smooth cubic-eased translation.
  - `scale`: Directional squash-and-stretch during motion.
  - `spring`: Physics-based spring overshoot bounce.
  - `elastic`: Expressive elastic wobble and rebound oscillation.
  - `fade`: Internal and external label cross-fade.
  - `color-transition`: Continuous color interpolation between `offColor` and `onColor`.
  - `combined`: Integrated spring movement, scale squash/stretch, and smooth track color transitions.
- **4 Interaction States**:
  - `off`: Unchecked state.
  - `on`: Checked state.
  - `disabled`: Dimmed, non-interactive, not-allowed cursor.
  - `loading`: Integrated SVG rotating spinner inside thumb.
- **3 Size Presets**:
  - `small` (`sm`): 36×20px track, 16px thumb.
  - `medium` (`md`): 48×26px track, 20px thumb.
  - `large` (`lg`): 64×34px track, 26px thumb.
  - Supports custom dimensions (`trackWidth`, `trackHeight`, `thumbSize`, `borderRadius`).

---

## 2. Component Props Interface

```typescript
export interface AnimatedToggleProps {
  // Target & Timeline
  checked?: boolean;                     // Target checked state
  defaultChecked?: boolean;              // Initial checked state prior to toggleFrame
  startFrame?: number;                   // Baseline start frame (default: 0)
  toggleFrame?: number;                  // Frame at which toggle transition begins
  durationInFrames?: number;             // Duration in frames for transition (default: 12)

  // Styling & Variants
  variant?: AnimatedToggleVariant;       // Shorthand for visual or animation variant
  visualVariant?: AnimatedToggleVisualVariant; // 'default' | 'minimal' | 'outlined' | 'filled' | 'labeled'
  animationVariant?: AnimatedToggleAnimationVariant; // 'slide' | 'scale' | 'spring' | 'elastic' | 'fade' | 'color-transition' | 'combined'
  size?: AnimatedToggleSize;             // 'small' | 'medium' | 'large' | 'sm' | 'md' | 'lg'
  state?: AnimatedToggleState;           // 'off' | 'on' | 'disabled' | 'loading'

  // Physics & Timing
  easing?: EasingPresetName | EasingFunction;
  springPreset?: SpringPresetName;       // 'snappy' | 'bouncy' | 'smooth' | 'gentle' | 'stiff'

  // Colors
  onColor?: string;                      // Track color when ON (default: #0E8345)
  offColor?: string;                     // Track color when OFF (default: #2E2E33)
  thumbColor?: string;                   // Thumb color (default: #FFFFFF)
  thumbOnColor?: string;                 // Thumb color when ON
  disabledColor?: string;                // Track color when disabled

  // Custom Dimensions
  borderRadius?: number | string;
  trackWidth?: number;
  trackHeight?: number;
  thumbSize?: number;

  // Labels & Icons
  showLabel?: boolean;
  onLabel?: string;                      // Internal track label for ON (default: 'ON')
  offLabel?: string;                     // Internal track label for OFF (default: 'OFF')
  label?: string | React.ReactNode;      // Primary external label
  description?: string | React.ReactNode;// Secondary description
  leadingIcon?: LucideIcon | React.ReactNode;
  labelPosition?: 'left' | 'right';      // Position of label relative to switch (default: 'right')

  // Style Overrides
  style?: React.CSSProperties;
  trackStyle?: React.CSSProperties;
  thumbStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  descriptionStyle?: React.CSSProperties;
  className?: string;
}
```

---

## 3. Usage Examples

### 3.1 Basic Settings Switch (OFF to ON with Spring Bounce)

```tsx
import { AnimatedToggle } from '@/components/ui/AnimatedToggle';

export const AutoAcceptToggle: React.FC = () => {
  return (
    <AnimatedToggle
      defaultChecked={false}
      checked={true}
      toggleFrame={20}
      durationInFrames={14}
      animationVariant="combined"
      springPreset="bouncy"
      label="Auto-Accept Incoming Rides"
      description="Automatically accept passenger ride requests within 5 miles"
    />
  );
};
```

### 3.2 Minimal Modern Switch with Custom Brand Colors

```tsx
import { AnimatedToggle } from '@/components/ui/AnimatedToggle';

export const DarkModeToggle: React.FC = () => {
  return (
    <AnimatedToggle
      visualVariant="minimal"
      animationVariant="scale"
      size="large"
      defaultChecked={true}
      toggleFrame={30}
      onColor="#276EF1"
      offColor="#1A1A1D"
      label="Dark Appearance"
    />
  );
};
```

### 3.3 Internal Track Labeled Toggle (I/O Status)

```tsx
import { AnimatedToggle } from '@/components/ui/AnimatedToggle';

export const SystemStatusToggle: React.FC = () => {
  return (
    <AnimatedToggle
      visualVariant="labeled"
      onLabel="ON"
      offLabel="OFF"
      size="medium"
      defaultChecked={false}
      toggleFrame={15}
      label="Emergency Siren"
      onColor="#E11900"
    />
  );
};
```

### 3.4 Loading & Disabled State Handling

```tsx
import { AnimatedToggle } from '@/components/ui/AnimatedToggle';

export const DeviceSyncToggle: React.FC = () => {
  return (
    <AnimatedToggle
      state="loading"
      defaultChecked={true}
      label="Cloud Sync Active"
      description="Connecting to vehicle telematics server..."
    />
  );
};
```

---

## 4. Animation Engine & Math

1. **Deterministic Travel Kinematics**:
   - `travelDistance = trackWidth - thumbSize - (padding * 2)`
   - At frame $f < \text{toggleFrame}$, thumb position is strictly at $0$ (if initially OFF) or $\text{travelDistance}$ (if initially ON).
   - At $f \ge \text{toggleFrame}$, normalized progress evaluates via `createSpring()` or `resolveEasing()`.
2. **Spring Overshoot**:
   - Using `'snappy'` or `'bouncy'`, thumb position briefly travels past $1.0$ (e.g. $1.08 \times \text{travelDistance}$) before oscillating back to rest.
3. **Squash & Stretch (`animationVariant = 'scale' | 'combined'`)**:
   - Mid-flight progress creates directional stretching:
     $$\text{scaleX} = 1 + 0.24 \cdot \sin(\pi \cdot \text{progress})$$
     $$\text{scaleY} = 1 - 0.12 \cdot \sin(\pi \cdot \text{progress})$$
4. **Color Transition**:
   - Track color blends smoothly via Remotion's `interpolateColors(progress, [0, 1], [offColor, onColor])`.

---

## 5. Verification & Testing

Unit tests are located at [tests/animated-toggle.test.ts](../../tests/animated-toggle.test.ts).
Interactive playground showcase is registered in [src/playground/MotionPlayground.tsx](../../src/playground/MotionPlayground.tsx).
