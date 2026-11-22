# ProductShowcaseScene Component Documentation

`ProductShowcaseScene` is a commercial product presentation scene template for the Remotion Motion Graphics Framework (Layer 3). It places a physical product, digital application, hardware mockup, or custom visual asset at the center of attention.

---

## 1. Architecture & Design Principles

```
                  ┌─────────────────────────────────────┐
                  │       ProductShowcaseScene          │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │          SceneContainer             │
                  │   • Dimension Auto-Resolution       │
                  │   • Safe Area Bounds (60px)         │
                  │   • Background Atmosphere Layers    │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ calculateProductShowcaseKinematics()                        │
        │   • Product Entrance:  scale / fade / slide-up              │
        │   • Hover Sine Wave:   sin(frame * speed) * offset          │
        │   • Subtle Tilt:       sin(frame * 0.04) * 2.5deg           │
        │   • Typography Stagger: label -> title -> sub -> desc       │
        │   • Spec Badges:       staggered scale & fade               │
        └─────────────────────────────┬───────────────────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ Layout Staging Variations:                                  │
        │   1. floating-details: [ Centered Visual ] + [ Spec Badges ]│
        │   2. center-product:   [ Title ] / [ Visual ] / [ Subtitle ]│
        │   3. product-left:     [ Visual 50% ]  [ Details 50% ]      │
        │   4. product-right:    [ Details 50% ] [ Visual 50% ]       │
        │   5. full-screen:      [ Full-Bleed ] + [ Glassmorphism ]   │
        └─────────────────────────────────────────────────────────────┘
```

### Continuous Hover Physics
The product visual can gently float on an authentic physics-based vertical sine wave hover trajectory (`productFloating: true`, default offset 10px). When paired with subtle tilt rotation (`productRotation: true`), hardware mockups feel physical, tangible, and dynamic.

### Floating Detail Spec Badges
Spec badges can be positioned at preset corners (`top-left`, `top-right`, `bottom-left`, `bottom-right`) or custom `(x, y)` percentages, animating in with staggered scale-ups.

---

## 2. Layout Variations

- **`floating-details` (Default)**:
  Product visual centered with floating semi-transparent spec callouts surrounding the hardware/software frame.
- **`center-product`**:
  Balanced vertical column centering the product visual with title and subtitle stacked above and below.
- **`product-left`**:
  Product on the left column (50-55%), technical specs and narrative description on the right (45-50%).
- **`product-right`**:
  Specs on the left, product visual on the right.
- **`full-screen`**:
  Product spans full-bleed across canvas, with an overlaid dark glassmorphism card presenting key title and metrics.

---

## 3. Component Properties (`ProductShowcaseSceneProps`)

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `title` | `React.ReactNode` | *(Required)* | Main product title |
| `subtitle` | `React.ReactNode` | `undefined` | Supporting subtitle or model designation |
| `description` | `React.ReactNode` | `undefined` | Product narrative description |
| `label` | `React.ReactNode` | `undefined` | Category badge or release pill |
| `supportingText` | `React.ReactNode` | `undefined` | Secondary supporting info, price, or availability |
| `children` | `React.ReactNode` | `undefined` | Main product visual content |
| `productVisual` | `React.ReactNode` | `undefined` | Slot alias for product visual |
| `productImage` | `string` | `undefined` | Image URL fallback for physical product assets |
| `details` | `ProductDetailItem[]` | `[]` | Floating detail spec badges |
| `decorativeElements` | `React.ReactNode` | `undefined` | Ambient graphic layer |
| `layout` | `ProductShowcaseLayout` | `'center-product'` | Layout staging variation |
| `background` | `string` | `undefined` | CSS background gradient |
| `backgroundColor` | `string` | `Colors.dark.bgPrimary`| Solid background color |
| `animation` | `ProductShowcaseAnimationConfig`| `undefined`| Hover, rotation, and entrance animation config |
| `durationInFrames` | `number` | `undefined` | Scene duration in frames |
| `delay` | `number` | `0` | Delay before entrance starts |
| `padding` | `ScenePadding` | `64` | Inner content padding |
| `safeArea` | `boolean \| number` | `true` | Broadcast safe area margin (60px) |
| `sceneId` | `string` | `'product-showcase-scene'` | Scene identifier |
| `debug` | `boolean` | `false` | Visual debug overlay |

---

## 4. Usage Example

```tsx
import { ProductShowcaseScene } from '@/components/scenes/ProductShowcaseScene';
import { SmartphoneMockup } from '@/components/mockups/SmartphoneMockup';

export const FlagshipShowcase = () => {
  return (
    <ProductShowcaseScene
      layout="floating-details"
      label="FLAGSHIP EDITION // 2026"
      title="Aura Pro Spatial Headset"
      subtitle="Adaptive Spatial Audio Engine"
      description="Engineered with dual micro-OLED displays and zero-latency spatial raytracing."
      supportingText="$1,499 USD · Ships Q2 2026"
      details={[
        { label: 'Display Engine', value: 'Dual 4K Micro-OLED', position: 'top-left' },
        { label: 'Latency', value: '0.4ms Motion-to-Photon', position: 'top-right' },
        { label: 'Battery', value: '48h Continuous', position: 'bottom-left' },
      ]}
      animation={{ productFloating: true, productRotation: true }}
    >
      <SmartphoneMockup width={260} height={520} />
    </ProductShowcaseScene>
  );
};
```
