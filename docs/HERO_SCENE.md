# HeroScene Component Documentation

`HeroScene` is a production-ready commercial hero scene template for introducing products, applications, SaaS platforms, services, or brands. Built directly on top of `SceneContainer`, it establishes a clear visual hierarchy between category eyebrow badges, kinetic typography headlines, supporting subtitles, descriptions, CTA buttons, hardware mockups, and ambient decorative elements.

---

## 1. Architecture & Design Principles

```
                   ┌───────────────────────────────────┐
                   │           HeroScene               │
                   └─────────────────┬─────────────────┘
                                     │
                                     ▼
                   ┌───────────────────────────────────┐
                   │         SceneContainer            │
                   │   • Sizing & Aspect Ratio         │
                   │   • Safe Area Bounds (60px)       │
                   │   • Ambient Background Gradients  │
                   └─────────────────┬─────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ calculateHeroStaggerMetrics()                               │
        │   • Eyebrow:        delay + 0f                              │
        │   • Headline:       delay + staggerDelay * 1                │
        │   • Subtitle:       delay + staggerDelay * 2                │
        │   • Description:    delay + staggerDelay * 3                │
        │   • CTA Button:     delay + staggerDelay * 4                │
        │   • Hero Visual:    delay + staggerDelay * 2                │
        │   • Decorations:    delay + 0f (+ sine wave floatOffset)    │
        └─────────────────────────────┬───────────────────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ Layout Grid Structures:                                     │
        │   1. split-left:         [ Text Block 50% ]  [ Visual 50% ] │
        │   2. split-right:        [ Visual 50% ]  [ Text Block 50% ] │
        │   3. centered:           [ Text Block ] / [ Visual Below ]  │
        │   4. full-screen-visual: [ Glassmorphism Card Overlay ]     │
        └─────────────────────────────────────────────────────────────┘
```

### Staggered Kinetic Typography
Rather than animating all scene elements simultaneously, `HeroScene` orchestrates a sequential entrance:
1. Category badge / eyebrow appears first.
2. High-contrast headline slides upward into position.
3. Subtitle and extended description follow smoothly.
4. CTA button and hero visual settle with fluid easing.

### Hardware Mockup Compatibility
The hero visual slot (`children` or `heroVisual`) is designed to house:
- `SmartphoneMockup` (portrait or landscape, light or dark finish)
- `LaptopMockup` (macbook-style desktop interface viewport)
- `BrowserWindowMockup` (web dashboard frame with browser toolbar)
- `TabletMockup` (digital publication or tablet application frame)
- Vector graphics (`AnimatedCircle`, `ParticleSystem`, `AnimatedShape`)

---

## 2. Layout Variations

- **`split-left` (Default)**:
  Text content column on the left (50-55% width), hero visual on the right (45-50% width). Standard commercial landing-page orientation.
- **`split-right`**:
  Hero visual on the left, text content column on the right.
- **`centered`**:
  Headline, subtitle, and CTA centered horizontally, with the hero visual framed symmetrically below.
- **`full-screen-visual`**:
  Hero visual expands across the entire background canvas, with the text content rendered inside a floating glassmorphism card with `backdrop-filter: blur(16px)` and semi-transparent dark surface.
- **`custom`**:
  Unconstrained layout for specialized positioning.

---

## 3. Component Properties (`HeroSceneProps`)

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `headline` | `React.ReactNode` | *(Required)* | Main hero headline text or element |
| `subtitle` | `React.ReactNode` | `undefined` | Supporting subtitle text or element |
| `description` | `React.ReactNode` | `undefined` | Extended body description paragraph |
| `eyebrow` | `React.ReactNode` | `undefined` | Category badge or eyebrow pill label |
| `cta` | `React.ReactNode` | `undefined` | CTA button label or custom button element |
| `onCtaClick` | `() => void` | `undefined` | Optional CTA click callback |
| `children` | `React.ReactNode` | `undefined` | Main hero visual element |
| `heroVisual` | `React.ReactNode` | `undefined` | Alias slot for hero visual content |
| `decorativeElements`| `React.ReactNode`| `undefined` | Ambient visual layer (particles, glows, orbs) |
| `layout` | `HeroSceneLayout` | `'split-left'` | Layout variation (`split-left`, `split-right`, `centered`, `full-screen-visual`) |
| `background` | `string` | `undefined` | CSS background gradient or pattern |
| `backgroundColor` | `string` | `Colors.dark.bg` | Solid background color |
| `backgroundImage` | `string` | `undefined` | Background image URL |
| `animation` | `HeroSceneAnimationConfig` | `undefined` | Fine-grained animation and delay controls |
| `staggerDelay` | `number` | `4` | Stagger delay in frames between sequential elements |
| `durationInFrames`| `number` | `undefined` | Scene duration in frames |
| `delay` | `number` | `0` | Delay before scene entrance begins |
| `width` | `number \| string` | `composition width` | Container width |
| `height` | `number \| string` | `composition height` | Container height |
| `padding` | `ScenePadding` | `64` | Inner content padding |
| `safeArea` | `boolean \| number` | `true` | Broadcast safe area margin (60px) |
| `sceneId` | `string` | `'hero-scene'` | Scene debugging identifier |
| `debug` | `boolean` | `false` | Visual debug overlay |
| `style` | `React.CSSProperties` | `undefined` | Inline style overrides |
| `className` | `string` | `undefined` | CSS class name |

---

## 4. Usage Examples

### Classic SaaS Split Hero with Smartphone Mockup
```tsx
import { HeroScene } from '@/components/scenes/HeroScene';
import { SmartphoneMockup } from '@/components/mockups/SmartphoneMockup';

export const SaasHero = () => {
  return (
    <HeroScene
      layout="split-left"
      eyebrow="AI-POWERED PLATFORM"
      headline="Automate Everything in Real Time"
      subtitle="Next-Generation Enterprise Orchestration Engine"
      description="Deploy deterministic workflows across global cloud clusters with zero latency and complete visual observability."
      cta="Start Free Trial →"
      staggerDelay={4}
    >
      <SmartphoneMockup orientation="portrait" scale={0.9} />
    </HeroScene>
  );
};
```

### Centered Hero with Laptop Mockup
```tsx
import { HeroScene } from '@/components/scenes/HeroScene';
import { LaptopMockup } from '@/components/mockups/LaptopMockup';

export const DesktopAppHero = () => {
  return (
    <HeroScene
      layout="centered"
      eyebrow="VERSION 2.0 RELEASE"
      headline="Engineered For High-Velocity Creators"
      subtitle="The Complete Creative Suite for Spatial Media"
      cta="Download for macOS"
      background="radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.15) 0%, #05070a 80%)"
    >
      <LaptopMockup width={680} height={400} />
    </HeroScene>
  );
};
```

---

## 5. Unit Testing & Verification

Run the dedicated test suite:

```bash
node --test tests/hero-scene.test.ts
```

Verifies:
- Staggered sequence progression (`eyebrow` $\to$ `headline` $\to$ `subtitle` $\to$ `description` $\to$ `cta` $\to$ `visual`).
- Custom slot delay overrides.
- Deterministic sine-wave floating kinematics for ambient decorations.
- Layout flex and grid arrangements across all four variations.
