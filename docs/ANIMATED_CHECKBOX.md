# AnimatedCheckbox Component Documentation

`AnimatedCheckbox` is a production-grade, frame-accurate checkbox selection component for the Remotion Motion Graphics Framework (`Layer 2: Component Library`). It simulates realistic checkbox selections, SVG stroke-drawing animations, indeterminate states, and error feedback commonly featured in mobile applications, onboarding checklists, and digital product UI demonstrations.

---

## 1. Features & Architectural Principles

- **Frame Determinism**: Purely driven by Remotion's `useCurrentFrame()`. Zero DOM click events, CSS keyframes, or runtime timers.
- **Deterministic SVG Stroke Drawing**: The checkmark path (`M 5 12.5 L 9.5 17 L 19 7.5`, total length ~ 24px) animates progressively from start to finish via `strokeDashoffset = (1 - drawProgress) * totalLength`.
- **Indeterminate State Support**: Renders a horizontal minus/dash mark (`M 6 12 L 18 12`, total length ~ 12px) with animated stroke drawing.
- **Physical Spring Feedback**: Supports spring overshoot pop (`snappy`, `bouncy`, `smooth`) when transitioning states.
- **Reversible Transitions**: Seamlessly handles both checked $\rightarrow$ unchecked and unchecked $\rightarrow$ checked transitions deterministically.
- **Multiple Checkbox Stagger Utility**: Includes `calculateCheckboxStaggerFrames()` for composable sequential checklists.
- **6 Visual Presentation Variants**:
  - `default`: Clean rounded square with subtle border, filled on checked.
  - `rounded`: Circular checkbox pill (`borderRadius: 9999`).
  - `square`: Sharp modern corners (`borderRadius: 2`).
  - `filled`: Solid surface background with high-contrast accent fill.
  - `outlined`: Transparent background with crisp 2px solid border outline.
  - `minimal`: Borderless floating checkmark with subtle background tint.
- **8 Animation Variants**:
  - `scale`: Smooth directional scale expansion during selection.
  - `pop`: Spring-based pop feedback with overshoot bounce.
  - `check-draw`: Progressive SVG stroke-dashoffset path drawing.
  - `fill`: Solid background color interpolation.
  - `border`: Border color and width transition.
  - `fade`: Checkmark opacity fade-in.
  - `bounce`: Subtle spring rebound feedback.
  - `combined`: Integrated SVG checkmark drawing, background fill, and spring pop.
- **5 Interaction States**:
  - `unchecked`: Empty box with neutral border.
  - `checked`: Filled box with drawn checkmark.
  - `indeterminate`: Horizontal bar indicating partial selection.
  - `disabled`: Dimmed opacity (0.5), not-allowed cursor.
  - `error`: Crimson border highlight and horizontal attention shake oscillation.
- **3 Size Presets**:
  - `small` (`sm`): 18×18px box, 2.6px stroke, 12px label font.
  - `medium` (`md`): 24×24px box, 3.0px stroke, 14px label font.
  - `large` (`lg`): 32×32px box, 3.5px stroke, 16px label font.

---

## 2. Component Props Interface

```typescript
export interface AnimatedCheckboxProps {
  // Target & Timeline
  checked?: boolean;                     // Target checked state
  defaultChecked?: boolean;              // Initial checked state prior to checkFrame
  indeterminate?: boolean;               // Indeterminate state flag
  startFrame?: number;                   // Baseline start frame (default: 0)
  checkFrame?: number;                   // Frame at which state transition occurs
  durationInFrames?: number;             // Duration in frames for transition (default: 12)

  // Styling & Variants
  variant?: AnimatedCheckboxVariant;     // Shorthand for visual or animation variant
  visualVariant?: AnimatedCheckboxVisualVariant; // 'default' | 'rounded' | 'square' | 'filled' | 'outlined' | 'minimal'
  animationVariant?: AnimatedCheckboxAnimationVariant; // 'scale' | 'pop' | 'check-draw' | 'fill' | 'border' | 'fade' | 'bounce' | 'combined'
  size?: AnimatedCheckboxSize;           // 'small' | 'medium' | 'large' | 'sm' | 'md' | 'lg'
  state?: AnimatedCheckboxState;         // 'unchecked' | 'checked' | 'indeterminate' | 'disabled' | 'error'

  // Physics & Timing
  easing?: EasingPresetName | EasingFunction;
  springPreset?: SpringPresetName;       // 'snappy' | 'bouncy' | 'smooth' | 'gentle' | 'stiff'

  // Colors
  checkColor?: string;                   // Checkmark stroke color (default: #FFFFFF)
  uncheckedColor?: string;               // Box background when unchecked (default: transparent)
  checkedColor?: string;                 // Box background when checked (default: #0E8345)
  borderColor?: string;                  // Border color when unchecked
  checkedBorderColor?: string;           // Border color when checked
  disabledColor?: string;                // Background color when disabled
  errorColor?: string;                   // Border/tint color when in error state (default: #E11900)

  // Custom Dimensions & Custom Children
  borderRadius?: number | string;
  boxSize?: number;
  children?: React.ReactNode;            // Custom inner checkbox content

  // Labels & Icons
  label?: string | React.ReactNode;      // Primary external label text
  description?: string | React.ReactNode;// Secondary description text
  showLabel?: boolean;
  showDescription?: boolean;
  leadingIcon?: LucideIcon | React.ReactNode;
  labelPosition?: 'left' | 'right';      // Label position relative to checkbox box (default: 'right')

  // Style Overrides
  style?: React.CSSProperties;
  boxStyle?: React.CSSProperties;
  checkmarkStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  descriptionStyle?: React.CSSProperties;
  className?: string;
}
```

---

## 3. Usage Examples

### 3.1 Single Interactive Checkbox (Spring Pop & SVG Check Draw)

```tsx
import { AnimatedCheckbox } from '@/components/ui/AnimatedCheckbox';

export const TermsAgreementCheckbox: React.FC = () => {
  return (
    <AnimatedCheckbox
      defaultChecked={false}
      checked={true}
      checkFrame={20}
      durationInFrames={12}
      animationVariant="combined"
      springPreset="bouncy"
      label="I agree to the Terms of Service"
      description="Required to activate mobility passenger account"
    />
  );
};
```

### 3.2 Staggered Multi-Checkbox Safety Checklist

```tsx
import { AnimatedCheckbox, calculateCheckboxStaggerFrames } from '@/components/ui';

export const SafetyChecklist: React.FC = () => {
  const items = [
    { title: 'Seatbelt Fastened', desc: 'Mandatory passenger safety requirement' },
    { title: 'Match Vehicle License Plate', desc: 'Verify plate 8XYZ421 matches driver vehicle' },
    { title: 'Confirm Driver Identity', desc: 'Driver face matches profile in app' },
  ];

  const checkFrames = calculateCheckboxStaggerFrames(items.length, 12, 10);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((item, index) => (
        <AnimatedCheckbox
          key={item.title}
          defaultChecked={false}
          checkFrame={checkFrames[index]}
          durationInFrames={10}
          visualVariant="default"
          animationVariant="combined"
          label={item.title}
          description={item.desc}
        />
      ))}
    </div>
  );
};
```

### 3.3 Indeterminate & Error State Handling

```tsx
import { AnimatedCheckbox } from '@/components/ui/AnimatedCheckbox';

export const PermissionsChecklist: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Indeterminate state */}
      <AnimatedCheckbox
        state="indeterminate"
        label="Select All Fleet Vehicles"
        description="3 of 8 vehicles currently selected"
      />

      {/* Error state with attention shake */}
      <AnimatedCheckbox
        state="error"
        checkFrame={15}
        label="Emergency Contact Required"
        description="Please check this box to confirm emergency contact"
      />
    </div>
  );
};
```

---

## 4. Animation Engine & Math

1. **Progressive Checkmark Drawing**:
   - Checkmark path: `M 5 12.5 L 9.5 17 L 19 7.5`
   - Total arc length: $L = 24\text{px}$
   - At $f < \text{checkFrame}$, $\text{strokeDashoffset} = L$ (completely un-drawn).
   - At $f \ge \text{checkFrame}$, stroke dash offset decreases to $0$:
     $$\text{strokeDashoffset} = (1 - \text{drawProgress}) \times L$$
2. **Spring Overshoot Feedback**:
   - Using `'pop'` or `'combined'`, box scale evaluates via `createSpring()` or directional sine bump:
     $$\text{scale} = 1 + 0.18 \cdot \sin(\pi \cdot \text{progress})$$
3. **Attention Shake on Error**:
   - For `state === 'error'`, an oscillating displacement shake is evaluated over 16 frames:
     $$\text{errorShakeX} = \sin(\text{elapsed} \times 1.5) \times 3\text{px}$$
4. **Color Transition**:
   - Background and border interpolate via Remotion's `interpolateColors(progress, [0, 1], [uncheckedColor, checkedColor])`.

---

## 5. Verification & Testing

Unit tests for `AnimatedCheckbox` are located at [tests/animated-checkbox.test.ts](../../tests/animated-checkbox.test.ts).
Interactive playground showcase is registered in [src/playground/MotionPlayground.tsx](../../src/playground/MotionPlayground.tsx).
