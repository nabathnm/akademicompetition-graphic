# AnimatedButton Component

## 1. Overview

The `AnimatedButton` component is a reusable UI motion component for the **Remotion Motion Graphics Framework** (`Layer 2`).

It simulates realistic, high-fidelity button interactions commonly seen in modern mobile applications and premium commercial digital product demonstrations (such as Uber, Apple, and Airbnb). The component choreographs frame-accurate user cursor hover transitions, physics-based press down compression, spring overshoot on release, rotating SVG loading states, success confirmations, validation error shakes, and directional entrances and exits.

All animations are 100% deterministic, calculated mathematically on every frame via `useCurrentFrame()`. It uses **no CSS transitions**, ensuring perfect frame-by-frame reproducibility during Remotion video rendering.

---

## 2. Key Capabilities

- **8 Interaction States**:
  1. `idle`: Baseline resting state; clean contrast and default elevation.
  2. `hover`: Subtle cursor proximity brightness lift (`brightness: 1.08`) and slight scale enlargement (`1.02`).
  3. `pressed`: Immediate physical compression down to `scaleOnPress` (default: `0.94`) with deepened shadow.
  4. `released`: Spring-driven bounce overshoot snapping back from pressed compression to resting scale `1.0`.
  5. `loading`: Label dims, replaced by an SVG loading spinner rotating at `(currentFrame * 12) % 360` deg.
  6. `success`: Emerald accent border and surface glow with animated checkmark indicator.
  7. `error`: Crimson accent border with horizontal harmonic vibration shake (`sin(t * 1.5) * 6px`) and warning icon.
  8. `disabled`: Reduced opacity (`0.42`), neutral borders, and muted typography.

- **6 Visual Variants**:
  1. `primary`: High-contrast solid brand CTA (Uber white or brand gradient) with dark text.
  2. `secondary`: Muted dark surface container (`Colors.dark.surface2`) with subtle border.
  3. `outline`: Transparent container with prominent boundary borders (`Colors.border.default` to hover highlight).
  4. `ghost`: Translucent dark surface (`rgba(255, 255, 255, 0.05)`) for tertiary actions.
  5. `text`: Borderless flat presentation with text and icon hover highlight.
  6. `icon-only`: Symmetrical square pill (`width === height`) containing a centered icon, ideal for circular mobility tools and navigation buttons.

- **Physics-Based Spring Release**:
  - Leverages Remotion's `createSpring` physics solver.
  - Supports customizable spring presets (`'snappy'`, `'smooth'`, `'bouncy'`, `'gentle'`, `'stiff'`) or explicit stiffness, damping, and mass parameters.
  - Generates realistic organic overshoot upon click release.

- **Proportional Size Presets**:
  - `small` / `sm`: 36px height, 13px font size, 14px icon, 12px horizontal padding.
  - `medium` / `md`: 44px height, 15px font size, 16px icon, 18px horizontal padding.
  - `large` / `lg`: 54px height, 17px font size, 20px icon, 24px horizontal padding.

- **Entrance & Exit Transitions**:
  - Entrance variants: `fade-in`, `slide-up`, `scale-in`, `pop-in`, `none`.
  - Exit variants: `fade-out`, `slide-out`, `scale-out`, `none`.
  - Configurable `startFrame`, `entranceDuration`, `exitFrame`, and `exitDuration`.

- **Rich Visual Elements**:
  - Leading and trailing React component icons (e.g. Lucide icons).
  - Configurable status badge pill (e.g. `"NEW"`, `"PRO"`, `"SAVE 20%"`).
  - Loading spinner, success checkmark, and error warning icons.

---

## 3. Component Props API

```typescript
export interface AnimatedButtonProps {
  /** Text label displayed inside the button (omitted when variant is 'icon-only') */
  label?: string;

  /** Visual variant (default: 'primary') */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text' | 'icon-only';

  /** Size preset (default: 'md') */
  size?: 'small' | 'medium' | 'large' | 'sm' | 'md' | 'lg';

  /** Forced interaction state. If omitted, state is derived dynamically from frame milestones */
  state?: 'idle' | 'hover' | 'pressed' | 'released' | 'loading' | 'success' | 'error' | 'disabled';

  /** Starting frame for entrance animation (default: 0) */
  startFrame?: number;

  /** Frame at which hover state activates */
  hoverFrame?: number;

  /** Frame at which press compression begins */
  pressFrame?: number;

  /** Frame at which press is released, triggering spring overshoot */
  releaseFrame?: number;

  /** Frame at which button enters loading spinner state */
  loadingFrame?: number;

  /** Frame at which button enters success state */
  successFrame?: number;

  /** Frame at which button enters error state */
  errorFrame?: number;

  /** Frame at which button entrance begins exit animation */
  exitFrame?: number;

  /** Duration in frames for entrance animation (default: 12) */
  entranceDuration?: number;

  /** Duration in frames for exit animation (default: 10) */
  exitDuration?: number;

  /** Entrance animation variant (default: 'scale-in') */
  entrance?: 'fade-in' | 'slide-up' | 'scale-in' | 'pop-in' | 'none';

  /** Exit animation variant (default: 'none') */
  exit?: 'fade-out' | 'slide-out' | 'scale-out' | 'none';

  /** Target scale compression factor on press (default: 0.94) */
  scaleOnPress?: number;

  /** Spring physics preset used for press release overshoot (default: 'snappy') */
  springPreset?: 'snappy' | 'smooth' | 'bouncy' | 'gentle' | 'stiff';

  /** Custom spring physics configuration (overrides springPreset if provided) */
  springConfig?: {
    damping?: number;
    mass?: number;
    stiffness?: number;
  };

  /** Component icon to render on the leading side */
  leadingIcon?: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;

  /** Whether to render the leading icon (default: false) */
  showLeadingIcon?: boolean;

  /** Component icon to render on the trailing side */
  trailingIcon?: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;

  /** Whether to render the trailing icon (default: false) */
  showTrailingIcon?: boolean;

  /** Optional text for a corner status badge (e.g. 'NEW', 'SAVE 20%') */
  badge?: string;

  /** Background color for the status badge (default: Colors.accent.brand) */
  badgeColor?: string;

  /** Custom override background color */
  backgroundColor?: string;

  /** Custom override text color */
  textColor?: string;

  /** Custom override border color */
  borderColor?: string;

  /** Custom corner border radius */
  borderRadius?: number | string;

  /** Whether button fills full container width (default: false) */
  fullWidth?: boolean;

  /** Additional style overrides for the outer container */
  style?: React.CSSProperties;

  /** Additional className */
  className?: string;
}
```

---

## 4. Interaction Milestones & State Resolution

When `state` is not explicitly provided, `AnimatedButton` resolves its interaction state deterministically according to frame order:

```
[startFrame: Entrance]
       │
       ▼
  [hoverFrame] ──> 'hover' (brightness 1.08, scale 1.02)
       │
       ▼
  [pressFrame] ──> 'pressed' (scale compresses linearly to 0.94)
       │
       ▼
 [releaseFrame] ──> 'released' (physics spring overshoot snaps to 1.00)
       │
       ├─────────────────────────┬─────────────────────────┐
       ▼                         ▼                         ▼
 [loadingFrame]            [successFrame]            [errorFrame]
'loading' (spinner)       'success' (checkmark)     'error' (shake + alert)
       │                         │                         │
       └─────────────────────────┼─────────────────────────┘
                                 │
                                 ▼
                           [exitFrame]
                        Exit transition
```

---

## 5. Usage Examples

### 5.1 Standard High-Impact Call to Action
```tsx
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { ArrowRight } from 'lucide-react';

export const HeroCta = () => (
  <AnimatedButton
    label="Confirm Uber Black"
    variant="primary"
    size="lg"
    startFrame={10}
    hoverFrame={30}
    pressFrame={45}
    releaseFrame={52}
    showTrailingIcon={true}
    trailingIcon={ArrowRight}
    springPreset="snappy"
  />
);
```

### 5.2 Async Action: Press, Loading, and Success Confirmation
```tsx
import { AnimatedButton } from '@/components/ui/AnimatedButton';

export const BookingFlowButton = () => (
  <AnimatedButton
    label="Book Now"
    variant="secondary"
    size="md"
    startFrame={0}
    pressFrame={20}
    releaseFrame={25}
    loadingFrame={26}
    successFrame={55}
    springPreset="bouncy"
  />
);
```

### 5.3 Icon-Only Mobility Action
```tsx
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { Compass } from 'lucide-react';

export const LocateButton = () => (
  <AnimatedButton
    variant="icon-only"
    size="md"
    startFrame={5}
    hoverFrame={25}
    pressFrame={40}
    releaseFrame={46}
    showLeadingIcon={true}
    leadingIcon={Compass}
  />
);
```

---

## 6. Architecture & Verification

- **Pure Functional Math**: All visual styles, metrics, physics transforms, spinner angles, and shake offsets are calculated via pure helper functions in `src/components/ui/animatedButtonStyle.ts`.
- **Zero CSS Transitions**: Prevents animation stutter and frame drift during parallel headless rendering.
- **Unit Test Coverage**: Comprehensive suite in `tests/animated-button.test.ts` verifying state transitions, size metrics, all 6 variants, press compression, spring overshoot, and error shake.
- **Showcase Integration**: Fully registered in `src/playground/MotionPlayground.tsx` with dedicated interactive testbeds in `src/playground/showcases/AnimatedButtonShowcase.tsx`.
