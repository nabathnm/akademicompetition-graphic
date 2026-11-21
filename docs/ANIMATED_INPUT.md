# AnimatedInput Component

## 1. Overview

The `AnimatedInput` component is a reusable UI motion component for the **Remotion Motion Graphics Framework**.

It simulates realistic input field interactions for product commercials, UI demonstrations, application walkthroughs, and onboarding animations. The component choreographs frame-accurate user focus, character-by-character typewriter entry (reusing the centralized `useTyping` hook), blinking cursor states, text deletion, error vibration shakes, and confirmation feedback.

---

## 2. Key Capabilities

- **7 Interaction States**:
  1. `idle`: Initial resting state; placeholder visible, cursor hidden.
  2. `focus`: Focus acquired; border highlight and glowing focus ring active, cursor blinking.
  3. `typing`: Active character-by-character typewriter progression driven by `useTyping`.
  4. `filled`: Target text fully typed and settled within the viewport.
  5. `submitted`: Confirmation feedback; emerald border highlight, glow ring, and checkmark indicator.
  6. `error`: Validation failure state; crimson border highlight, alert icon, and horizontal vibration shake.
  7. `disabled`: Muted presentation (`opacity: 0.45`), reduced border contrast, and disabled cursor.
- **5 Visual Variants**:
  1. `outlined`: Modern dark container with high-contrast borders and active neon focus rings.
  2. `filled`: Elevated surface (`Colors.dark.surface2`) with subtle borders and deep contrast.
  3. `minimal`: Borderless container with subtle backdrop tint.
  4. `underline`: Clean editorial bottom rule (`borderBottom: 2px solid ...`) without bounding container borders.
  5. `rounded`: Full pill-shaped container (`borderRadius: 9999px`) optimized for mobility search bars.
- **Realistic Typing & Deletion**:
  - Reuses the existing `useTyping` hook.
  - Supports configurable typing speed (`typingSpeed`), characters per step (`charactersPerStep`), and delay milestones.
  - Optional `deleteStartFrame` parameter triggers backwards backspace deletion to simulate real-time typing corrections.
- **Proportional Size Presets**:
  - `sm`: 36px height, 13px font, compact paddings.
  - `md`: 44px height, 15px font, balanced layout.
  - `lg`: 52px height, 17px font, prominent headline input.
- **Entrance Transitions**:
  - Supports `fade`, `slide-up`, `scale-in`, and `none` with configurable start frames and durations.

---

## 3. Component Props API

```typescript
export interface AnimatedInputProps {
  /** The target string to type */
  value?: string;

  /** Placeholder text shown when input is empty (default: 'Enter text...') */
  placeholder?: string;

  /** Optional field label positioned above the input */
  label?: string;

  /** Optional helper text or error message displayed below the input */
  helperText?: string;

  /** Starting frame for the component entrance animation (default: 0) */
  startFrame?: number;

  /** Frame at which input acquires focus (default: 10) */
  focusFrame?: number;

  /** Frame at which character typing begins (default: 16) */
  typingStartFrame?: number;

  /** Frames per character typed (default: 2) */
  typingSpeed?: number;

  /** Number of characters revealed per typing step (default: 1) */
  charactersPerStep?: number;

  /** Optional frame at which text deletion begins */
  deleteStartFrame?: number;

  /** Optional frame at which input transitions to submitted state */
  submittedFrame?: number;

  /** Optional frame at which input transitions to error state */
  errorFrame?: number;

  /** Visual presentation variant (default: 'outlined') */
  variant?: 'outlined' | 'filled' | 'minimal' | 'underline' | 'rounded';

  /** Input size preset (default: 'md') */
  size?: 'sm' | 'md' | 'lg';

  /** Forced interaction state. If omitted, state is determined dynamically by currentFrame */
  state?: 'idle' | 'focus' | 'typing' | 'filled' | 'submitted' | 'error' | 'disabled';

  /** Whether to show the blinking text cursor (default: true) */
  showCursor?: boolean;

  /** Frames per cursor blink half-cycle (default: 16) */
  cursorBlinkInterval?: number;

  /** Whether to show leading icon (default: false) */
  showLeadingIcon?: boolean;

  /** Whether to show trailing icon (default: false) */
  showTrailingIcon?: boolean;

  /** Leading icon component or element */
  leadingIcon?: LucideIcon | React.ReactNode;

  /** Trailing icon component or element */
  trailingIcon?: LucideIcon | React.ReactNode;

  /** Border & ring color when focused (default: '#00D1FF') */
  focusColor?: string;

  /** Accent color in error state (default: '#E11900') */
  errorColor?: string;

  /** Accent color in submitted / success state (default: '#0E8345') */
  successColor?: string;

  /** Container border radius override */
  borderRadius?: number | string;

  /** Container padding override */
  padding?: string | number;

  /** Container width override (default: '100%') */
  width?: string | number;

  /** Container height override */
  height?: string | number;

  /** Entrance animation preset (default: 'slide-up') */
  entrance?: 'fade' | 'slide-up' | 'scale-in' | 'none';

  /** Duration of entrance animation in frames (default: 14) */
  entranceDuration?: number;

  /** Container style overrides */
  style?: React.CSSProperties;

  /** Input field text style overrides */
  inputStyle?: React.CSSProperties;

  /** Blinking cursor style overrides */
  cursorStyle?: React.CSSProperties;

  /** Placeholder style overrides */
  placeholderStyle?: React.CSSProperties;

  /** Label style overrides */
  labelStyle?: React.CSSProperties;

  /** Helper text style overrides */
  helperTextStyle?: React.CSSProperties;

  /** Container CSS class name */
  className?: string;
}
```

---

## 4. Usage Examples

### Example 1: Destination Search Bar with Autopilot Typing
```tsx
import { AnimatedInput } from './components/ui/AnimatedInput';
import { Search } from 'lucide-react';

export const DestinationSearch = () => (
  <AnimatedInput
    value="San Francisco International Airport"
    placeholder="Where to?"
    variant="rounded"
    size="lg"
    startFrame={0}
    focusFrame={8}
    typingStartFrame={14}
    typingSpeed={2}
    showLeadingIcon={true}
    leadingIcon={Search}
  />
);
```

### Example 2: Form Submission Confirmation
```tsx
export const CardVerification = () => (
  <AnimatedInput
    value="alex.rivera@mobility.io"
    placeholder="Enter account email"
    label="ACCOUNT VERIFICATION"
    helperText="Identity profile authenticated."
    startFrame={0}
    focusFrame={4}
    typingStartFrame={10}
    submittedFrame={32}
  />
);
```

### Example 3: Validation Error with Vibration Shake
```tsx
export const InvalidPromoCode = () => (
  <AnimatedInput
    value="EXPIREDPROMO2025"
    placeholder="Enter voucher code"
    label="PROMO CODE"
    helperText="Promo code has expired or is invalid."
    startFrame={0}
    focusFrame={4}
    typingStartFrame={10}
    errorFrame={26}
  />
);
```

### Example 4: Real-time Typo Backspace Correction
```tsx
export const TypoCorrection = () => (
  <AnimatedInput
    value="Incorrect address query"
    placeholder="Search address..."
    label="ADDRESS SEARCH"
    startFrame={0}
    focusFrame={4}
    typingStartFrame={10}
    deleteStartFrame={36}
  />
);
```

---

## 5. Architectural Separation & Testing

All interaction state derivations and visual calculations reside in `src/components/ui/animatedInputStyle.ts`:
- `deriveAnimatedInputState()`: Pure timeline evaluator returning `'idle' | 'focus' | 'typing' | 'filled' | 'submitted' | 'error' | 'disabled'`.
- `getInputSizeMetrics()`: Pure layout metric resolver for `'sm' | 'md' | 'lg'`.
- `calculateInputVisualStyles()`: Computes background, border colors, and focus rings.
- `calculateInputEntrance()`: Computes frame-clamped entrance transitions.
- `isCursorVisible()`: Pure mathematical cursor blinking half-cycle checker.
- `calculateErrorShake()`: Pure decaying horizontal sine vibration for error feedback.

Unit tests are located in `tests/animated-input.test.ts`.
