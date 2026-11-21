# AnimatedCard Component

## 1. Overview

The `AnimatedCard` component is a reusable UI motion component for the **Remotion Motion Graphics Framework** (`Layer 2: Component Library`).

It provides a flexible, composable container layout with frame-based animations suitable for commercial product advertisements, digital mobility walkthroughs, feature showcases, and interactive UI demonstrations. It supports standalone hero cards, horizontal rows, image-led product cards, and staggered collections.

All motion is 100% deterministic, calculated frame-by-frame via `useCurrentFrame()`. It uses **no CSS transitions**, ensuring frame-accurate reproducibility during Remotion video rendering.

---

## 2. Key Capabilities

- **12 Animation Variants**:
  1. `fade`: Clean opacity reveal (`0 -> 1`).
  2. `slide-up`: Upward directional entry with distance offset.
  3. `slide-down`: Downward directional entrance.
  4. `slide-left`: Enters from the right sliding leftward.
  5. `slide-right`: Enters from the left sliding rightward.
  6. `scale`: Scales smoothly from `initialScale` (`default: 0.92`) to `1.0`.
  7. `pop`: Organic physics-driven overshoot bounce using `createSpring`.
  8. `flip`: 3D perspective rotation around the X-axis (`perspective(800px) rotateX(...)`).
  9. `blur`: Defocus to sharp focus transition (`blur(12px) -> blur(0px)`).
  10. `float`: Enters smoothly and maintains a subtle harmonic floating hover oscillation (`sin(t * 0.08) * 6px`).
  11. `expand`: Inward-to-outward scale expansion.
  12. `collapse`: Outward-to-inward scale settle.

- **7 Visual Presentation Styles**:
  1. `default`: Surface1 dark container (`Colors.dark.surface1`) with subtle border and elevation shadow.
  2. `outlined`: Crisp transparent or dark container with prominent boundary rule (`Colors.border.strong`) and no drop shadow.
  3. `elevated`: Elevated surface (`Colors.dark.surface2`) with prominent deep drop shadow (`0 12px 36px rgba(0,0,0,0.45)`).
  4. `flat`: Minimalist flat canvas without border or shadow.
  5. `image-card`: Photography/media-first presentation with top or cover image and clipped corner radius.
  6. `horizontal`: Flexible row layout (`flexDirection: row`) pairing a left image/icon with middle copy and trailing actions.
  7. `compact`: Dense typography and tight margins for list items and widget sidebars.

- **7 Interaction States**:
  1. `idle`: Resting neutral state.
  2. `focused`: Cyan/brand glowing focus ring and border highlight.
  3. `selected`: Brand accent background tint (`rgba(39, 110, 241, 0.12)`), solid blue border, and scale lift (`1.02`).
  4. `highlighted`: Emerald accent glow, prominent border, and scale lift (`1.03`).
  5. `expanded`: Active scale expansion (`1.04`) with deepened shadow.
  6. `collapsed`: Compact compression (`scale: 0.96`, `opacity: 0.85`).
  7. `disabled`: Reduced opacity (`0.45`) and `not-allowed` cursor.

- **Composable Card Architecture**:
  - `header`: Custom top bar element.
  - `icon`: Leading icon component or Lucide icon.
  - `badge`: Corner status pill (e.g. `'Popular'`, `'VIP'`, `'Top Rated'`).
  - `title`: Primary headline or React node.
  - `description`: Secondary body copy.
  - `children`: Arbitrary custom React children.
  - `image`: URL or image element supporting `top`, `left`, `right`, `bottom`, and `cover`.
  - `footer`: Supplementary metadata (e.g. ETA, route details).
  - `action`: Interactive element (e.g. CTA button, price tag).

- **Collection & Stagger Support**:
  - Supports staggered group entrances using `delay?: number`.
  - Helper utility `calculateCardCollectionStagger` enables sequential or reverse cascading entrances across multi-column grids or lists.

---

## 3. Component Props API

```typescript
export interface AnimatedCardProps {
  /** Optional custom React children rendered inside the content area */
  children?: React.ReactNode;

  /** Primary card headline or title */
  title?: string | React.ReactNode;

  /** Secondary card description or body text */
  description?: string | React.ReactNode;

  /** Visual presentation style (default: 'default') */
  variant?: 'default' | 'outlined' | 'elevated' | 'flat' | 'image-card' | 'horizontal' | 'compact';

  /** Proportional size preset (default: 'md') */
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';

  /** Entrance animation variant (default: 'fade') */
  animation?:
    | 'fade'
    | 'slide-up'
    | 'slide-down'
    | 'slide-left'
    | 'slide-right'
    | 'scale'
    | 'pop'
    | 'flip'
    | 'blur'
    | 'float'
    | 'expand'
    | 'collapse';

  /** Starting frame for entrance animation (default: 0) */
  startFrame?: number;

  /** Duration in frames for entrance animation (default: 14) */
  durationInFrames?: number;

  /** Frame at which exit animation begins */
  exitFrame?: number;

  /** Duration in frames for exit animation (default: 12) */
  exitDurationInFrames?: number;

  /** Additional frame delay offset (e.g. for collection stagger) */
  delay?: number;

  /** Easing curve for transitions (default: 'easeOutCubic') */
  easing?: EasingPresetName | EasingFunction;

  /** Spring physics preset for pop / bounce animation (default: 'snappy') */
  springPreset?: 'snappy' | 'smooth' | 'bouncy' | 'gentle' | 'stiff';

  /** Translation distance in pixels for slide/float animations (default: 24) */
  distance?: number;

  /** Initial scale factor for scale/pop/expand animations (default: 0.92) */
  initialScale?: number;

  /** Initial rotation in degrees for flip animations (default: 15) */
  initialRotation?: number;

  /** Explicit interaction state override */
  state?: 'idle' | 'focused' | 'selected' | 'highlighted' | 'expanded' | 'collapsed' | 'disabled';

  /** Frame at which focused state activates */
  focusFrame?: number;

  /** Frame at which selected state activates */
  selectFrame?: number;

  /** Frame at which highlighted state activates */
  highlightFrame?: number;

  /** Frame at which expanded state activates */
  expandFrame?: number;

  /** Frame at which collapsed state activates */
  collapseFrame?: number;

  /** Custom background color override */
  backgroundColor?: string;

  /** Custom border color override */
  borderColor?: string;

  /** Custom border radius override */
  borderRadius?: number | string;

  /** Custom box shadow override */
  shadow?: string;

  /** Custom padding override */
  padding?: number | string;

  /** Custom card width override */
  width?: number | string;

  /** Custom card height override */
  height?: number | string;

  /** Image URL or image element */
  image?: string | React.ReactNode;

  /** Image layout positioning (default: 'top') */
  imagePosition?: 'top' | 'left' | 'right' | 'bottom' | 'cover';

  /** Card icon element or Lucide icon */
  icon?: LucideIcon | React.ReactNode;

  /** Optional corner or header status badge */
  badge?: string | React.ReactNode;

  /** Background color for status badge */
  badgeColor?: string;

  /** Custom header element */
  header?: React.ReactNode;

  /** Custom footer element */
  footer?: React.ReactNode;

  /** Custom action element (e.g. CTA button) */
  action?: React.ReactNode;

  /** Outer container style overrides */
  style?: React.CSSProperties;

  /** Content area style overrides */
  contentStyle?: React.CSSProperties;

  /** Title typography style overrides */
  titleStyle?: React.CSSProperties;

  /** Description typography style overrides */
  descriptionStyle?: React.CSSProperties;

  /** CSS class name */
  className?: string;
}
```

---

## 4. Usage Examples

### 4.1 Standalone Hero CTA Card
```tsx
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export const HeroFeatureCard = () => (
  <AnimatedCard
    title="Uber Reserve"
    description="Schedule up to 90 days in advance with guaranteed on-time pickup."
    variant="elevated"
    size="lg"
    animation="pop"
    startFrame={10}
    durationInFrames={16}
    icon={Sparkles}
    badge="New Feature"
    action={
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#4B88F5' }}>
        <span>Explore Options</span>
        <ArrowRight size={16} />
      </div>
    }
  />
);
```

### 4.2 Staggered Multi-Card Collection
```tsx
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Car, ShieldCheck, Sparkles } from 'lucide-react';

const TIERS = [
  { title: 'UberX', price: '$24.50', desc: 'Affordable everyday rides', icon: Car },
  { title: 'Uber Comfort', price: '$32.00', desc: 'Extra legroom & top drivers', icon: ShieldCheck },
  { title: 'Uber Black', price: '$54.00', desc: 'Luxury premium sedans', icon: Sparkles },
];

export const TierSelectionCollection = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    {TIERS.map((tier, idx) => (
      <AnimatedCard
        key={tier.title}
        title={tier.title}
        description={tier.desc}
        variant="elevated"
        size="md"
        animation="slide-up"
        startFrame={0}
        delay={idx * 5}
        icon={tier.icon}
        action={<span style={{ fontWeight: 700, fontSize: 16 }}>{tier.price}</span>}
      />
    ))}
  </div>
);
```

### 4.3 Floating Metric / Stat Card
```tsx
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { TrendingUp } from 'lucide-react';

export const FloatingMetricCard = () => (
  <AnimatedCard
    title="99.4% On-Time"
    description="Average arrival rate across premier airport reserves."
    variant="default"
    size="sm"
    animation="float"
    startFrame={0}
    icon={TrendingUp}
    badge="Verified"
    width={280}
  />
);
```

---

## 5. Architecture & Verification

- **Pure Functional Math**: Separated into `src/components/ui/animatedCardStyle.ts` for clean testability and zero DOM dependencies.
- **Zero CSS Transitions**: All transforms, opacities, filters, and springs are calculated deterministically via `useCurrentFrame()`.
- **Unit Test Coverage**: Comprehensive suite in `tests/animated-card.test.ts` covering interaction milestones, size metrics, all 7 visual variants, all 12 animation variants, float oscillation, exit transitions, and collection staggering.
- **Showcase Integration**: Registered in `src/playground/MotionPlayground.tsx` with dedicated interactive test harness in `src/playground/showcases/AnimatedCardShowcase.tsx`.
