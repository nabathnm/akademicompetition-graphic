# AnimatedText Component Documentation

The `AnimatedText` component is the foundational typography component of the Remotion Motion Graphics Framework. It provides deterministic, frame-based entrance, exit, and emphasis animations for any text or typographical element.

---

## 1. Supported Animation Variants

| Variant | Motion Type | Description |
|---|---|---|
| `fade` | Opacity | Pure alpha fade transition from 0 to 1 |
| `slide-up` | Vertical Translation | Enters from bottom (`translateY(+distance) -> 0`) |
| `slide-down` | Vertical Translation | Enters from top (`translateY(-distance) -> 0`) |
| `slide-left` | Horizontal Translation | Enters from right (`translateX(+distance) -> 0`) |
| `slide-right` | Horizontal Translation | Enters from left (`translateX(-distance) -> 0`) |
| `scale` | Transform Scale | Smooth geometric scale from `initialScale -> 1.0` |
| `pop` | Physics Spring | Elastic spring-driven arrival using presets (e.g., `snappy`, `bouncy`) |
| `blur` | Filter Blur | Gaussian blur-to-clear entrance (`blur(initialBlur px) -> blur(0px)`) |
| `rotate` | Angular Transform | Subtle rotational entrance (`rotate(initialRotation deg) -> 0deg`) |
| `fade-slide-up` | Composite | Coordinated vertical rise and opacity ramp |

---

## 2. Component Props API

```ts
export interface AnimatedTextProps {
  children?: React.ReactNode;
  variant?: AnimatedTextVariant;           // default: 'fade'
  startFrame?: number;                    // default: 0
  durationInFrames?: number;              // default: 18 (MOTION.duration.normal)
  exitFrame?: number;                     // optional exit start frame
  exitDurationInFrames?: number;          // default: 12 (MOTION.duration.fast)
  delay?: number;                         // default: 0
  easing?: EasingPresetName | EasingFunction; // default: 'easeOutCubic'
  springPreset?: SpringPresetName;         // default: 'snappy'
  distance?: number;                      // default: 40px
  initialScale?: number;                  // default: 0.85
  initialRotation?: number;               // default: -8 deg
  initialBlur?: number;                   // default: 10 px
  style?: React.CSSProperties;            // custom styling overrides
  className?: string;                     // custom CSS class
  as?: React.ElementType;                 // default: 'div'
  align?: 'left' | 'center' | 'right' | 'justify';
  direction?: 'in' | 'out' | 'both';      // default: 'both'
}
```

---

## 3. Usage Examples

### A. Basic Headline Entrance
```tsx
import { AnimatedText } from '../../components/typography';

export const HeroTitle = () => (
  <AnimatedText
    as="h1"
    variant="fade-slide-up"
    startFrame={0}
    durationInFrames={20}
    style={{ fontSize: 44, fontWeight: 700 }}
  >
    Autonomous Mobility
  </AnimatedText>
);
```

### B. Spring Pop Tag with Custom Preset
```tsx
<AnimatedText
  as="span"
  variant="pop"
  startFrame={15}
  springPreset="bouncy"
  style={{
    fontSize: 12,
    fontWeight: 600,
    color: '#0E8345',
    backgroundColor: 'rgba(14, 131, 69, 0.1)',
    padding: '4px 8px',
    borderRadius: 4,
  }}
>
  LIVE FLEET
</AnimatedText>
```

### C. Full Entrance and Exit Lifecycle
```tsx
<AnimatedText
  variant="slide-up"
  startFrame={10}
  durationInFrames={20}
  exitFrame={60}
  exitDurationInFrames={15}
  style={{ fontSize: 24 }}
>
  Temporary Notification Notice
</AnimatedText>
```

---

## 4. Timing & Lifecycle Behavior

1. **Before Entrance** (`currentFrame < startFrame + delay`):
   - Opacity is `0` and `visibility: 'hidden'`.
   - Prevents unstyled flashes before the scheduled appearance.
2. **Active Entrance** (`startFrame + delay <= currentFrame < startFrame + delay + durationInFrames`):
   - In-progress value (0..1) interpolated via Remotion's `interpolateValue()` or `createSpring()`.
   - `visibility: 'visible'`.
3. **Settled Hold** (`startFrame + delay + durationInFrames <= currentFrame < exitFrame`):
   - Opacity is `1.0`.
   - Transforms are settled (`scale(1.0)`, `translateY(0px)`, `rotate(0deg)`).
4. **Active Exit** (`exitFrame <= currentFrame < exitFrame + exitDurationInFrames`):
   - Out-progress value (0..1) smoothly fades or slides out towards destination.
5. **After Exit** (`currentFrame >= exitFrame + exitDurationInFrames`):
   - Opacity is `0` and `visibility: 'hidden'`.

---

## 5. How to Add Future Animation Variants

1. Open [`src/components/typography/types.ts`](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/typography/types.ts).
2. Add your new variant name to the `AnimatedTextVariant` union:
   ```ts
   export type AnimatedTextVariant =
     | ...
     | 'skew-x';
   ```
3. Open [`src/components/typography/animatedTextStyle.ts`](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/typography/animatedTextStyle.ts).
4. Add the transform/filter calculation inside the `switch (variant)` block:
   ```ts
   case 'skew-x': {
     const currentSkew = initialSkew * (1 - inProgress) - initialSkew * outProgress;
     calculatedTransform = `skewX(${currentSkew.toFixed(2)}deg)`;
     break;
   }
   ```
5. Add a corresponding test case in `tests/animated-text.test.ts`.
