# TabletMockup Component Documentation

Configurable, high-fidelity tablet mockup component for Remotion, designed to present tablet software applications, analytics dashboards, digital publications, e-books, slide decks, and creative interfaces.

## Overview

`TabletMockup` composes the foundational `DeviceFrame` architecture into a modern tablet form factor. It provides:
- Seamless **landscape** and **portrait** orientation switching without layout distortion or animation jitter.
- Calibrated **model presets**: `compact` (8.3" mini), `standard` (11" versatile), and `pro` (12.9" workstation canvas).
- Uniform **concentric bezels** engineered to allow realistic grip spacing while maintaining concentric screen corners.
- Front **camera dot** positioned on the bezel.
- Optional classic **Touch ID circular home button** with metallic chamfer and recessed sensor glyph.
- Optional **magnetic stylus / Apple Pencil charging dock** accent snapped along the chassis outer rim.
- High-contrast **tablet status bar** featuring dual-sided layouts (clock + date on left, cellular + wifi + battery with percentage on right).
- Deterministic **device rotation kinetics** (e.g. dynamic animated rotation from portrait to landscape over specified frame windows).
- Remotion **entrance kinetics** (`spring`, `scale-in`, `slide-in`, `fade-in`, `pop`, `rotate`).
- Continuous **floating** and **perspective tilt** motions.
- Sequential screen reveals with custom stagger delays.

All motion kinetics are 100% deterministic, calculated directly using Remotion's `useCurrentFrame()` and `useVideoConfig()`, ensuring 0% browser timing drift.

---

## Architecture & Mathematical Foundations

### 1. Orientation & Aspect Ratio Normalization

Tablet aspect ratios are defined symmetrically for landscape and portrait modes:

$$\text{Base Landscape Ratio } r_{\text{landscape}} = \max\left(\frac{W}{H}, \frac{H}{W}\right)$$

In portrait mode, the ratio is inverted:

$$r_{\text{portrait}} = \frac{1}{r_{\text{landscape}}}$$

For standard tablet aspect ratios ($4:3 \approx 1.3333$, $16:10 = 1.6$, $3:2 = 1.5$):

$$W_{\text{screen}} = W_{\text{tablet}} - 2 \cdot \text{frameThickness}$$

$$H_{\text{screen}} = \text{round}\left(\frac{W_{\text{screen}}}{r}\right)$$

$$H_{\text{tablet}} = H_{\text{screen}} + 2 \cdot \text{frameThickness}$$

### 2. Concentric Corner Geometry

To maintain uniform distance between outer chassis curvature and inner screen viewport:

$$R_{\text{screen}} = \max(2, R_{\text{outer}} - \text{frameThickness})$$

### 3. Device Orientation Rotation Kinetics

When `rotationAnimation` is enabled, the tablet rotates dynamically over a frame window $[f_0, f_0 + D]$:

$$t = \text{clamp}\left(\frac{f - f_0}{D}, 0, 1\right)$$

Progress is smoothed using ease-out cubic interpolation:

$$p(t) = 1 - (1 - t)^3$$

The device rotation angle $\theta(t)$ interpolates from $\theta_{\text{from}}$ to $\theta_{\text{to}}$:

$$\theta(t) = \theta_{\text{from}} + (\theta_{\text{to}} - \theta_{\text{from}}) \cdot p(t)$$

Combined with harmonic floating $Y_{\text{float}}(t)$ and perspective tilt $\phi_{\text{tilt}}(t)$:

$$\text{transform} = \text{translate3d}(0, Y_{\text{float}}(t), 0) \ \text{rotate}(\theta(t)\text{deg}) \ \text{rotateY}(\phi_{\text{tilt}}(t)\text{deg})$$

---

## Component API

### `TabletMockupProps`

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `orientation` | `'landscape' \| 'portrait'` | `'landscape'` | Primary tablet display orientation. |
| `model` / `preset` | `'compact' \| 'standard' \| 'pro' \| 'custom'` | `'standard'` | Form factor size preset (8.3", 11", 12.9"). |
| `width` | `number` | Preset width (e.g. `720` in landscape) | Outer tablet width in pixels. |
| `height` | `number` | Preset height (e.g. `520` in landscape) | Outer tablet height in pixels. |
| `aspectRatio` | `string \| number` | `'4:3'` | Screen aspect ratio (`'4:3'`, `'16:10'`, `'3:2'`). |
| `finish` | `TabletFinish` | `'space-gray'` | Metallic color finish (`'space-gray'`, `'silver'`, `'starlight'`, `'midnight'`, `'rose-gold'`, `'sky-blue'`). |
| `deviceColor` | `string` | Derived from finish | Custom chassis body color override. |
| `screenColor` | `string` | `'#000000'` | Screen viewport background color. |
| `frameThickness` | `number` | `16` (compact: `14`) | Bezel border thickness in pixels. |
| `borderRadius` | `number` | `26` (compact: `22`, pro: `28`) | Outer chassis corner radius in pixels. |
| `screenRadius` | `number` | Concentric $\max(2, R - T)$ | Inner screen corner radius override. |
| `showCamera` | `boolean` | `true` | Front camera lens dot centered in bezel. |
| `cameraPosition` | `'top' \| 'center' \| 'left' \| 'right'` | `'top'` | Camera placement relative to bezel. |
| `showHomeButton` | `boolean` | `false` | Classic circular Touch ID home button on bezel. |
| `showStatusBar` | `boolean \| 'light' \| 'dark' \| React.ReactNode` | `true` | Tablet status bar with clock, date, and battery icons. |
| `showHomeIndicator` | `boolean` | `true` | Bottom home gesture indicator pill. |
| `showStylus` | `boolean` | `false` | Magnetic Apple Pencil dock accent on outer chassis edge. |
| `showButtons` | `boolean` | `true` | Side hardware volume/power buttons. |
| `shadow` | `'none' \| 'subtle' \| 'medium' \| 'high' \| 'floating'` | `'medium'` | Depth drop shadow style for chassis. |
| `animation` | `DeviceFrameAnimation` | `'spring'` | Remotion entrance animation (`'spring'`, `'scale-in'`, `'slide-in'`, `'fade-in'`, `'pop'`, `'rotate'`, `'none'`). |
| `delay` | `number` | `0` | Delay before entrance animation starts in frames. |
| `durationInFrames` | `number` | `25` | Duration for entrance animation in frames. |
| `floating` | `boolean \| SmartphoneFloatingConfig` | `false` | Continuous harmonic levitation animation. |
| `tilt` | `boolean \| SmartphoneTiltConfig` | `false` | Continuous 3D perspective tilt animation. |
| `deviceRotation` | `number` | `undefined` | Static rotation angle in degrees. |
| `rotationAnimation` | `boolean \| TabletRotationConfig` | `false` | Frame-based device rotation animation. |
| `screenReveal` | `boolean \| SmartphoneScreenRevealConfig` | `false` | Sequential screen content reveal transition. |
| `screenContent` | `React.ReactNode` | `undefined` | Screen content element. |
| `screenshot` | `string` | `undefined` | Screenshot image URL rendered with Remotion `<Img />`. |
| `screenshotFit` | `'cover' \| 'contain' \| 'fill'` | `'cover'` | Object fit mode for screenshot image. |
| `children` | `React.ReactNode` | `undefined` | Children rendered inside the screen viewport. |
| `style` | `React.CSSProperties` | `undefined` | Root wrapper CSS style override. |
| `className` | `string` | `undefined` | Root wrapper CSS class name. |

---

## Form Factor Presets

| Preset | Screen Size | Landscape Dimensions | Portrait Dimensions | Bezel | Border Radius |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `compact` | 8.3" Mini | $620 \times 440\text{px}$ | $440 \times 620\text{px}$ | $14\text{px}$ | $22\text{px}$ |
| `standard` | 11" Standard | $720 \times 520\text{px}$ | $520 \times 720\text{px}$ | $16\text{px}$ | $26\text{px}$ |
| `pro` | 12.9" Pro | $840 \times 620\text{px}$ | $620 \times 840\text{px}$ | $16\text{px}$ | $28\text{px}$ |

---

## Hardware Finish Palettes

| Finish | Color Hex | Accent Tone | Description |
| :--- | :--- | :--- | :--- |
| `space-gray` | `#1e2430` | `#475569` | Deep anodized charcoal aluminum. |
| `silver` | `#d8dde6` | `#94a3b8` | Matte brushed natural silver. |
| `starlight` | `#e8e4dc` | `#d2cecaa` | Subtle champagne warm metallic tone. |
| `midnight` | `#161c28` | `#1e293b` | Dark obsidian deep navy. |
| `rose-gold` | `#e8cfc8` | `#f43f5e` | Warm tinted rose aluminum. |
| `sky-blue` | `#a8c6db` | `#0284c7` | Soft anodized pastel azure. |

---

## Usage Examples

### 1. Landscape Tablet with BI Analytics Dashboard

```tsx
import React from 'react';
import { TabletMockup } from '@/components/mockups';

export const AnalyticsTabletScene: React.FC = () => {
  return (
    <TabletMockup
      orientation="landscape"
      preset="standard"
      finish="space-gray"
      shadow="floating"
      showStylus={true}
      animation="spring"
    >
      <div style={{ width: '100%', height: '100%', backgroundColor: '#0a0e17', padding: 20 }}>
        <h2 style={{ color: '#ffffff' }}>Executive BI Dashboard</h2>
      </div>
    </TabletMockup>
  );
};
```

### 2. Portrait Tablet Digital Publication with Touch ID

```tsx
import React from 'react';
import { TabletMockup } from '@/components/mockups';

export const PublicationTabletScene: React.FC = () => {
  return (
    <TabletMockup
      orientation="portrait"
      preset="pro"
      finish="silver"
      showHomeButton={true}
      shadow="high"
      animation="pop"
    >
      <div style={{ width: '100%', height: '100%', backgroundColor: '#f8fafc', padding: 28 }}>
        <h1 style={{ color: '#0f172a' }}>Computational Aesthetics</h1>
      </div>
    </TabletMockup>
  );
};
```

### 3. Dynamic Orientation Rotation Animation ($0^\circ \to 90^\circ$)

```tsx
import React from 'react';
import { TabletMockup } from '@/components/mockups';

export const RotatingTabletScene: React.FC = () => {
  return (
    <TabletMockup
      orientation="landscape"
      preset="standard"
      finish="starlight"
      rotationAnimation={{
        startFrame: 15,
        duration: 40,
        fromAngle: 0,
        toAngle: 90,
      }}
      floating={{ amplitude: 6, frequency: 0.5 }}
      shadow="floating"
    >
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0284c7, #1e1b4b)' }} />
    </TabletMockup>
  );
};
```

---

## Verification & Test Coverage

The unit test suite is located at [tests/tablet-mockup.test.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/tests/tablet-mockup.test.ts).

### Test Coverage Highlights

- **Aspect Ratio Calculations**: Validates normalization for $4:3$, $16:10$, and $3:2$ across both landscape and portrait orientations.
- **Physical Geometry**: Asserts standard, compact, and pro dimensions matching presets.
- **Concentric Radii**: Verifies $R_{\text{screen}} = \max(2, R_{\text{chassis}} - \text{frameThickness})$.
- **Device Rotation Kinetics**: Validates start frame delay, easing progression, settled target angle, and sanitized zero output.
- **Hardware Finish Palettes**: Confirms all 6 metallic finishes resolve valid CSS hex colors.

---

## Related Files

- Component Implementation: [src/components/mockups/TabletMockup.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/TabletMockup.tsx)
- Styling & Mathematical Logic: [src/components/mockups/tabletMockupStyle.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/tabletMockupStyle.ts)
- Type Definitions: [src/components/mockups/types.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/types.ts)
- Interactive Showcase: [src/playground/showcases/TabletMockupShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/TabletMockupShowcase.tsx)
- Unit Test Suite: [tests/tablet-mockup.test.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/tests/tablet-mockup.test.ts)
