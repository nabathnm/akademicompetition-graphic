# AnimatedNotification Component Documentation

`AnimatedNotification` is a production-grade, frame-accurate notification component for the Remotion Motion Graphics Framework (`Layer 2: Component Library`). It simulates mobile and web application push alerts, toast notifications, banners, and floating system feedback commonly featured in commercial motion graphics and digital product UI demonstrations.

---

## 1. Features & Architectural Principles

- **Frame Determinism**: Driven strictly by Remotion's `useCurrentFrame()`. No `setTimeout`, `setInterval`, or CSS keyframe animations.
- **6 Semantic Notification Types**: Pre-themed with icons, accent colors, and background tints:
  - `info`: Blue accent with info circle icon
  - `success`: Emerald accent with check circle icon
  - `warning`: Amber accent with alert triangle icon and subtle shake
  - `error`: Rose accent with alert octagon icon and attention shake
  - `message`: Cyan accent with message square icon
  - `custom`: Developer-configured icons, colors, and borders
- **5 Visual Variants**:
  - `toast`: Rounded pill container with backdrop blur, ideal for transient push alerts.
  - `banner`: Full-width banner spanning the composition with solid left accent rule.
  - `floating`: Elevated floating card with subtle border glow and drop shadow.
  - `compact`: Streamlined single-line notification for micro-status indicators.
  - `card`: Structured rich notification layout supporting timestamps, actions, and custom body text.
- **7 Canvas-Relative Positions**:
  - `top`, `top-left`, `top-right`, `center`, `bottom`, `bottom-left`, `bottom-right`.
  - Positioned relative to the composition container canvas using absolute coordinates and CSS transform centering.
- **8 Entrance & 4 Exit Animations**:
  - Entrances: `fade-in`, `slide-down`, `slide-up`, `slide-left`, `slide-right`, `scale-in`, `pop-in`, `expand`.
  - Exits: `fade-out`, `slide-out`, `scale-out`, `collapse`.
- **Integrated Action CTA**: Composes `AnimatedButton` seamlessly for interactive prompts ("View Details", "Accept", "Retry").
- **Determinate Progress Bar**: Synchronized linear countdown bar showing remaining display duration before dismissal.

---

## 2. Component Props Interface

```typescript
export interface AnimatedNotificationProps {
  // Content
  title: string;
  description?: string;
  timestamp?: string;
  icon?: LucideIcon | React.ReactNode;
  showIcon?: boolean;
  showCloseIcon?: boolean;
  onClose?: () => void;

  // Types & Visual Styles
  type?: AnimatedNotificationType;       // 'info' | 'success' | 'warning' | 'error' | 'message' | 'custom'
  variant?: AnimatedNotificationVariant; // 'toast' | 'banner' | 'floating' | 'compact' | 'card'
  position?: AnimatedNotificationPosition; // 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' | 'center'
  width?: number | string;

  // Action Button
  actionLabel?: string;
  actionVariant?: AnimatedButtonVariant;
  onAction?: () => void;

  // Frame Timing & Animations
  startFrame?: number;
  durationInFrames?: number;
  displayDuration?: number;              // Active duration before exit transition
  exitFrame?: number;                    // Explicit exit trigger frame
  exitDurationInFrames?: number;
  entranceAnimation?: AnimatedNotificationEntrance;
  exitAnimation?: AnimatedNotificationExit;

  // Progress Bar
  showProgress?: boolean;
  progressDuration?: number;             // Frames for progress bar to travel from 0% to 100%

  // Custom Color Overrides
  accentColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;

  // Custom Children & Container Styling
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}
```

---

## 3. Usage Examples

### 3.1 Simple Success Toast

```tsx
import { AnimatedNotification } from '@/components/ui/AnimatedNotification';

export const RideConfirmedNotification: React.FC = () => {
  return (
    <AnimatedNotification
      type="success"
      variant="toast"
      title="Driver Arrived"
      description="Your Tesla Model S is waiting outside"
      timestamp="Just now"
      position="top-right"
      startFrame={10}
      durationInFrames={18}
      showProgress={true}
      progressDuration={75}
      exitFrame={85}
      exitDurationInFrames={15}
    />
  );
};
```

### 3.2 Full-Width Warning Banner

```tsx
import { AnimatedNotification } from '@/components/ui/AnimatedNotification';

export const SystemWarningBanner: React.FC = () => {
  return (
    <AnimatedNotification
      type="warning"
      variant="banner"
      title="High Surge Pricing Active"
      description="Fares are currently 1.8x standard rates due to high demand"
      position="top"
      startFrame={0}
      entranceVariant="slide-down"
      actionLabel="Learn More"
      actionVariant="secondary"
    />
  );
};
```

### 3.3 Rich Action Card with Exit Transition

```tsx
import { AnimatedNotification } from '@/components/ui/AnimatedNotification';

export const DeliveryActionCard: React.FC = () => {
  return (
    <AnimatedNotification
      type="message"
      variant="card"
      title="Courier Near You"
      description="Alex is 2 minutes away with your delivery order."
      timestamp="2m ago"
      position="bottom-right"
      startFrame={15}
      durationInFrames={20}
      entranceVariant="slide-up"
      exitFrame={110}
      exitDurationInFrames={18}
      exitVariant="slide-out"
      actionLabel="Track Map"
      actionVariant="primary"
      showProgress={true}
      progressDuration={95}
    />
  );
};
```

---

## 4. Animation and Layout Engine

1. **Deterministic Motion Calculation (`calculateNotificationMotion`)**:
   - `springEntrance`: Evaluated from `startFrame` using snap spring physics (`damping: 18, stiffness: 220, mass: 0.8`).
   - `exitProgress`: Interpolated from `exitFrame` to `exitFrame + exitDurationInFrames`.
   - Directional transforms (`translateY`, `translateX`, `scale`) are combined with composite matrix calculations for seamless entrance-to-exit transitions.
   - Attention shake is triggered when `type === 'error'` or `type === 'warning'`, applying oscillating `sin(frame * 1.5) * 4px` damping over 14 frames.

2. **Canvas Coordinate System (`getNotificationPositionStyles`)**:
   - Absolute positioning anchors elements within Remotion root canvases (`1920x1080`, `1080x1920`, or responsive bounds).
   - Centering uses standard CSS offset percentages (`transform: translate(-50%, -50%)`).

3. **Synchronized Progress Bar**:
   - Calculates percentage: `clamp((currentFrame - startFrame) / Math.max(1, progressDuration), 0, 1) * 100`.
   - Visually indicates time remaining until auto-dismissal.

---

## 5. Verification & Testing

Unit tests for `AnimatedNotification` are located at [tests/animated-notification.test.ts](../../tests/animated-notification.test.ts).
Interactive playground showcases are registered in [src/playground/MotionPlayground.tsx](../../src/playground/MotionPlayground.tsx).
