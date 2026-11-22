# CallToActionScene Component Documentation

`CallToActionScene` is a Layer 3 scene template designed to highlight a primary action through strong kinetic typography, high visual contrast, interactive `AnimatedButton` integration, and optional product visuals or hardware device mockups.

---

## 1. Architecture & Design Principles

```
                   ┌───────────────────────────────────┐
                   │        CallToActionScene          │
                   └─────────────────┬─────────────────┘
                                     │
                                     ▼
                   ┌───────────────────────────────────┐
                   │         SceneContainer            │
                   │   • Standard Dimensions           │
                   │   • Safe Area Bounds (60px)       │
                   │   • Radial & Linear Backdrops     │
                   └─────────────────┬─────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ calculateCallToActionSceneKinematics()                      │
        │   • Brand:         delay + 0f                               │
        │   • Headline:      delay + staggerDelay * 1                 │
        │   • Description:   delay + staggerDelay * 2                 │
        │   • Button Group:  delay + staggerDelay * 3                 │
        │   • Product Visual:delay + staggerDelay * 2                 │
        │   • Button Pulse:  sin(frame * 0.1) * 0.025 (breathing)     │
        └─────────────────────────────┬───────────────────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ Layout Grid Variations:                                     │
        │   • centered:              [ Centered Copy & Buttons ]      │
        │   • left-aligned:          [ Left-Aligned Editorial Copy ] │
        │   • cta-with-product:      [ Copy 50% ]  [ Product 50% ]    │
        │   • cta-with-device:       [ Copy 50% ]  [ Mockup 50% ]     │
        │   • full-screen-typography:[ Massive 76px Typography ]      │
        └─────────────────────────────────────────────────────────────┘
```

---

## 2. Layout Variations

`CallToActionScene` supports 6 distinct layout variations:

1. **`centered` (Default)**:
   Centered headline, description paragraph, and primary/secondary action buttons.
2. **`left-aligned`**:
   Editorial layout with left alignment and horizontal button group.
3. **`cta-with-product`**:
   Split two-column layout: Text copy and CTA buttons on the left, floating product card or asset on the right.
4. **`cta-with-device`**:
   Split two-column layout: Text copy and CTA buttons on the left, hardware mockup (`SmartphoneMockup`, `BrowserWindowMockup`) on the right.
5. **`full-screen-typography`**:
   Massive 76px headline dominating the screen with centered action buttons below.
6. **`custom`**:
   Unconstrained layout for custom arrangements.

---

## 3. Harmonic Button Pulse Physics

To draw user attention naturally toward conversion actions without visual jarring:
- The primary CTA button undergoes a subtle harmonic breathing pulse:
  $$\text{buttonPulse} = 1 + \sin(\text{frame} \cdot 0.1) \cdot 0.025$$
- Smooth deterministic scaling computed on every frame (`useCurrentFrame()`).

---

## 4. Component Properties (`CallToActionSceneProps`)

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `headline` | `React.ReactNode` | *(Required)* | Main primary CTA headline |
| `description` | `React.ReactNode` | `undefined` | Supporting description copy |
| `primaryAction` | `string \| CallToActionItem` | *(Required)* | Primary action button configuration |
| `secondaryAction` | `string \| CallToActionItem` | `undefined` | Optional secondary action button |
| `brand` | `React.ReactNode` | `undefined` | Brand name or category eyebrow |
| `logo` | `React.ReactNode` | `undefined` | Brand logo or icon element |
| `productVisual` | `React.ReactNode` | `undefined` | Product visual element |
| `deviceMockup` | `React.ReactNode` | `undefined` | Device mockup element |
| `decorativeElements`| `React.ReactNode` | `undefined` | Ambient decorative graphics |
| `layout` | `CallToActionSceneLayout`| `'centered'` | Layout structure mode |
| `animation` | `CallToActionAnimationConfig` | `undefined` | Animation timing and pulse options |
| `staggerDelay` | `number` | `4` | Stagger delay in frames |
| `background` | `string` | `undefined` | CSS background gradient or pattern |
| `backgroundColor` | `string` | `Colors.dark.bgPrimary` | Solid background color |
| `backgroundImage` | `string` | `undefined` | Background image URL |
| `durationInFrames` | `number` | `undefined` | Total scene duration in frames |
| `delay` | `number` | `0` | Delay before entrance begins |
| `width` | `number \| string` | `composition width` | Scene container width |
| `height` | `number \| string` | `composition height` | Scene container height |
| `padding` | `ScenePadding` | `64` | Inner content padding |
| `safeArea` | `boolean \| number` | `true` | Broadcast safe area margin (60px) |
| `sceneId` | `string` | `'cta-scene'` | Scene identifier |
| `debug` | `boolean` | `false` | Visual debug overlay toggle |

---

## 5. Usage Example

```tsx
import { CallToActionScene } from './components/scenes';

export const ClosingCTA = () => (
  <CallToActionScene
    layout="cta-with-device"
    brand="ANTIGRAVITY OS"
    headline="Experience Autonomous Synthesis"
    description="Build professional-grade motion graphics pipelines with sub-frame accuracy."
    primaryAction={{
      label: 'Start Free Trial',
      variant: 'primary',
    }}
    secondaryAction={{
      label: 'Read Documentation',
      variant: 'outline',
    }}
    deviceMockup={<SmartphoneMockup />}
    animation={{
      buttonPulse: true,
      staggerDelay: 4,
    }}
  />
);
```
