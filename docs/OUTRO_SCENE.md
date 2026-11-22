# OutroScene Component Documentation

`OutroScene` is a Layer 3 scene template designed for closing commercial videos, presenting brand identity, logo marks, slogans, domain URLs, social media handles, and optional conversion links.

---

## 1. Architecture & Design Principles

```
                   ┌───────────────────────────────────┐
                   │            OutroScene             │
                   └─────────────────┬─────────────────┘
                                     │
                                     ▼
                   ┌───────────────────────────────────┐
                   │         SceneContainer            │
                   │   • Standard Dimensions           │
                   │   • Safe Area Bounds (60px)       │
                   │   • Ambient Backdrops             │
                   └─────────────────┬─────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ calculateOutroSceneKinematics()                             │
        │   • Logo Entrance:  delay + 0f                              │
        │   • Brand Name:     delay + staggerDelay * 1                │
        │   • Tagline:        delay + staggerDelay * 2                │
        │   • Meta Links:     delay + staggerDelay * 3                │
        │   • Logo Float:     sin(frame * 0.05) * 6 (continuous)      │
        └─────────────────────────────┬───────────────────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ Layout Grid Variations:                                     │
        │   • centered-brand:        [ Logo ] / [ Brand ] / [ Links ] │
        │   • logo-above-tagline:    [ Large Logo ] / [ Tagline ]     │
        │   • tagline-above-logo:    [ Tagline Lead ] / [ Logo ]      │
        │   • left-aligned:          [ Editorial Left Layout ]        │
        │   • brand-with-cta:        [ Brand 50% ]  [ CTA Links 50% ] │
        │   • full-screen-logo:      [ Hero 1.4x Logo Canvas ]        │
        └─────────────────────────────────────────────────────────────┘
```

---

## 2. Layout Variations

`OutroScene` supports 7 distinct layout variations:

1. **`centered-brand` (Default)**:
   Symmetrical centered composition: Brand logo on top, prominent brand name, supporting tagline, and social/website badges below.
2. **`logo-above-tagline`**:
   Clean brand lockup with dominant logo mark and tagline directly beneath.
3. **`tagline-above-logo`**:
   Editorial sequence where the tagline acts as an introductory statement leading into the logo mark.
4. **`left-aligned`**:
   Left-aligned editorial brand statement.
5. **`brand-with-cta`**:
   Two-column split: Brand lockup on the left, closing conversion CTA and social links on the right.
6. **`full-screen-logo`**:
   Oversized 1.4x hero logo centered on canvas with radiant ambient backlighting.
7. **`custom`**:
   Unconstrained layout for freeform brand elements.

---

## 3. Harmonic Logo Hover Physics

To keep the closing frame engaging:
- The brand logo subtly hovers along the vertical axis:
  $$\text{logoFloating} = \sin(\text{frame} \cdot 0.05) \cdot 6$$
- Fully deterministic and frame-based, compatible with export renderers.

---

## 4. Component Properties (`OutroSceneProps`)

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `brandName` | `React.ReactNode` | `undefined` | Brand name text or element |
| `logo` | `React.ReactNode` | `undefined` | Brand logo mark or visual element |
| `tagline` | `React.ReactNode` | `undefined` | Brand tagline or slogan |
| `website` | `string` | `undefined` | Website URL string |
| `socialHandle` | `string` | `undefined` | Social media handle |
| `cta` | `React.ReactNode` | `undefined` | Closing CTA button or action element |
| `supportingText` | `React.ReactNode` | `undefined` | Copyright or licensing copy |
| `decorativeElements`| `React.ReactNode` | `undefined` | Ambient decorative graphics |
| `layout` | `OutroSceneLayout` | `'centered-brand'` | Layout arrangement mode |
| `animation` | `OutroSceneAnimationConfig` | `undefined` | Animation timing and hover options |
| `staggerDelay` | `number` | `5` | Stagger delay in frames |
| `background` | `string` | `undefined` | CSS background gradient or pattern |
| `backgroundColor` | `string` | `Colors.dark.bgPrimary` | Solid background color |
| `backgroundImage` | `string` | `undefined` | Background image URL |
| `durationInFrames` | `number` | `undefined` | Total scene duration in frames |
| `delay` | `number` | `0` | Delay before entrance starts |
| `width` | `number \| string` | `composition width` | Scene container width |
| `height` | `number \| string` | `composition height` | Scene container height |
| `padding` | `ScenePadding` | `64` | Inner content padding |
| `safeArea` | `boolean \| number` | `true` | Broadcast safe area margin (60px) |
| `sceneId` | `string` | `'outro-scene'` | Scene identifier |
| `debug` | `boolean` | `false` | Visual debug overlay toggle |

---

## 5. Usage Example

```tsx
import { OutroScene } from './components/scenes';

export const BrandOutro = () => (
  <OutroScene
    layout="centered-brand"
    logo={<BrandLogoMark />}
    brandName="ANTIGRAVITY"
    tagline="The Autonomous Video Intelligence Platform"
    website="antigravity.io"
    socialHandle="@antigravity_ai"
    supportingText="© 2026 Antigravity Systems Inc. All rights reserved."
    animation={{
      floatingLogo: true,
      staggerDelay: 5,
    }}
  />
);
```
