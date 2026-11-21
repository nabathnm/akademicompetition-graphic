# LaptopMockup Component Documentation

High-fidelity 2D laptop mockup component for Remotion, designed to display software dashboards, websites, desktop applications, slides, and product demos inside a realistic laptop hardware chassis.

## Overview

`LaptopMockup` provides an ultra-polished presentation layer without requiring heavy WebGL or 3D engine overhead. Built using pure SVG and Remotion frame-based transforms, it renders:
- An ultra-thin **display lid** with camera dot, concentric rounded corners, and metallic rim.
- A **screen bezel** and concentric inner viewport with optional antireflective glare overlay.
- A centered **metallic hinge connector**.
- A flared **keyboard deck** featuring a recessed chiclet keybed, spacebar, and centered precision trackpad.
- Frame-accurate **lid opening kinetics** with perspective foreshortening.
- Remotion **entrance kinetics** (`spring`, `scale-in`, `slide-in`, `fade-in`, `pop`, `rotate`).
- Continuous **floating** and **perspective tilt** motions.
- Sequential screen content reveals with custom stagger delays.

All animations strictly adhere to Remotion best practices: 100% deterministic, driven exclusively by `useCurrentFrame()` and `useVideoConfig()`, with zero CSS transitions or browser timers.

---

## Architecture & Mathematical Foundations

### 1. Geometric Proportions and Dimensions

The component computes all hardware coordinates and sizes deterministically from the specified `width`, `height`, `aspectRatio`, or `preset`:

$$\text{Aspect Ratio } r = \frac{W_{\text{aspect}}}{H_{\text{aspect}}}$$

When `height` is not provided, it is derived from screen dimensions:

$$W_{\text{screen}} = W_{\text{laptop}} - 2 \cdot \text{bezel}$$

$$H_{\text{screen}} = \frac{W_{\text{screen}}}{r}$$

$$H_{\text{lid}} = H_{\text{screen}} + 2 \cdot \text{bezel}$$

$$\text{Deck Height } H_{\text{deck}} = \text{round}(W_{\text{laptop}} \cdot 0.042) \quad (\min 12\text{px})$$

$$\text{Total Height } H_{\text{total}} = H_{\text{lid}} + H_{\text{deck}}$$

Deck width flares slightly beyond lid width to mimic realistic laptop ergonomics:

$$W_{\text{deck}} = W_{\text{laptop}} + 28\text{px}$$

### 2. Concentric Corner Radius

To prevent distorted borders, the screen inner radius preserves concentric geometry relative to the lid outer corner radius:

$$R_{\text{screen}} = \max(2, R_{\text{lid}} - \text{bezel})$$

### 3. Lid Opening Kinetics

The lid opening animation simulates a physical laptop display unfolding upright from a closed or tilted angle to its operating position.

Given frame $f$, start frame $f_0$, and duration $D$:

$$t = \text{clamp}\left(\frac{f - f_0}{D}, 0, 1\right)$$

Progress is smoothed using ease-out cubic interpolation:

$$p(t) = 1 - (1 - t)^3$$

The current lid tilt angle $\theta(t)$ interpolates from $\theta_{\text{from}}$ (default $70^\circ$) to $\theta_{\text{to}}$ (default $0^\circ$):

$$\theta(t) = \theta_{\text{from}} + (\theta_{\text{to}} - \theta_{\text{from}}) \cdot p(t)$$

Perspective foreshortening is applied to the screen content opacity to simulate backlighting warming up as the lid opens:

$$\alpha(t) = \text{clamp}(0.15 + 0.85 \cdot p(t), 0, 1)$$

$$\text{transform} = \text{perspective}(1000\text{px}) \ \text{rotateX}(\theta(t)\text{deg})$$

$$\text{transformOrigin} = \text{"bottom center"}$$

---

## Component API

### `LaptopMockupProps`

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `preset` | `'compact' \| 'standard' \| 'pro'` | `'standard'` | Standard device size preset (13", 15", 16"). |
| `width` | `number` | Preset width (e.g. `680`) | Overall laptop lid width in pixels. |
| `height` | `number` | Derived from aspect ratio | Overall laptop height in pixels. |
| `aspectRatio` | `LaptopAspectRatio \| string` | `'16:10'` | Display aspect ratio (`'16:10'`, `'16:9'`, `'3:2'`). |
| `finish` | `LaptopFinish` | `'space-gray'` | Metallic color finish (`'space-gray'`, `'silver'`, `'midnight'`, `'starlight'`). |
| `deviceColor` | `string` | Derived from finish | Custom chassis body color override. |
| `screenBackground` | `string` | `'#0d1117'` | Background color for screen viewport. |
| `bezelWidth` | `number` | `14` | Screen bezel border width in pixels. |
| `borderRadius` | `number` | `16` | Lid outer corner radius. |
| `showWebcam` | `boolean` | `true` | Renders webcam lens dot centered in top bezel. |
| `showGlare` | `boolean` | `true` | Renders diagonal glass antireflection glare across the display. |
| `showKeyboard` | `boolean` | `true` | Renders chiclet keyboard keybed on deck. |
| `showTrackpad` | `boolean` | `true` | Renders precision trackpad on deck. |
| `shadow` | `'none' \| 'subtle' \| 'medium' \| 'strong' \| 'dramatic'` | `'medium'` | Depth drop shadow style for chassis. |
| `opening` | `LaptopOpeningConfig` | `undefined` | Lid opening animation configuration. |
| `animation` | `LaptopAnimationVariant` | `'none'` | Remotion entrance animation (`'spring'`, `'scale-in'`, `'slide-in'`, `'fade-in'`, `'pop'`, `'rotate'`). |
| `delay` | `number` | `0` | Delay before entrance animation starts in frames. |
| `durationInFrames` | `number` | `30` | Duration for entrance animation in frames. |
| `floating` | `FloatingConfig` | `undefined` | Continuous harmonic levitation animation. |
| `tilt` | `TiltConfig` | `undefined` | Continuous 3D perspective tilt animation. |
| `screenContent` | `React.ReactNode` | `undefined` | Custom content rendered in the screen viewport. |
| `screenshot` | `string` | `undefined` | Screenshot image URL rendered with Remotion `<Img />`. |
| `screenshotFit` | `'cover' \| 'contain' \| 'fill'` | `'cover'` | Object fit mode for screenshot image. |
| `screenDelay` | `number` | `0` | Delay in frames before screen content reveals. |
| `screenDurationInFrames` | `number` | `20` | Duration in frames for screen reveal fade-in. |
| `children` | `React.ReactNode` | `undefined` | Children rendered inside the screen viewport. |
| `style` | `React.CSSProperties` | `undefined` | Root wrapper CSS style override. |
| `className` | `string` | `undefined` | Root wrapper CSS class name. |

---

## Hardware Finish Palettes

| Finish | Body Color | Deck Edge | Keyboard Well | Key Color | Accent Glow |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `space-gray` | `#2d3139` | `#1a1d24` | `#1e2128` | `#14171d` | `#00d8f6` |
| `silver` | `#d8dde6` | `#b8bec8` | `#bfc6d0` | `#2a2e36` | `#0070f3` |
| `midnight` | `#161c28` | `#0d121c` | `#101520` | `#0a0d14` | `#38bdf8` |
| `starlight` | `#e8e4dc` | `#c8c4bc` | `#d2cecaa` | `#2c2a28` | `#f59e0b` |

---

## Usage Examples

### 1. Basic SaaS Dashboard on Space Gray Laptop

```tsx
import React from 'react';
import { LaptopMockup } from '@/components/mockups';

export const MyLaptopComposition: React.FC = () => {
  return (
    <LaptopMockup
      preset="standard"
      finish="space-gray"
      shadow="medium"
      animation="spring"
      delay={5}
    >
      <div style={{ width: '100%', height: '100%', padding: 24, backgroundColor: '#0d1117' }}>
        <h1 style={{ color: '#ffffff', fontSize: 24 }}>Analytics Overview</h1>
        <p style={{ color: '#8b949e', fontSize: 14 }}>Real-time user telemetry</p>
      </div>
    </LaptopMockup>
  );
};
```

### 2. Interactive Lid Opening Animation

```tsx
import React from 'react';
import { LaptopMockup } from '@/components/mockups';

export const UnfoldingLaptopScene: React.FC = () => {
  return (
    <LaptopMockup
      preset="pro"
      finish="midnight"
      opening={{
        enabled: true,
        startFrame: 10,
        durationInFrames: 45,
        fromAngle: 75,
        toAngle: 0,
      }}
      shadow="strong"
      screenshot="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200"
      screenshotFit="cover"
    />
  );
};
```

### 3. Hero Presentation with Continuous Floating & Tilt

```tsx
import React from 'react';
import { LaptopMockup } from '@/components/mockups';

export const HeroLaptopBanner: React.FC = () => {
  return (
    <LaptopMockup
      width={720}
      aspectRatio="16:10"
      finish="silver"
      animation="pop"
      floating={{ amplitude: 8, frequency: 0.6 }}
      tilt={{ maxAngle: 3, frequency: 0.4 }}
      shadow="dramatic"
    >
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1e293b, #0f172a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 28, color: '#38bdf8', fontWeight: 800 }}>Acme Cloud IDE</span>
      </div>
    </LaptopMockup>
  );
};
```

---

## Verification & Test Coverage

The unit test suite is located at [tests/laptop-mockup.test.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/tests/laptop-mockup.test.ts).

### Test Matrix

1. **Aspect Ratio Parsing**: Verifies standard numeric ratios (`16:10 = 1.6`, `16:9 = 1.7778`, `3:2 = 1.5`, `4:3 = 1.3333`) and defaults invalid strings to `1.6`.
2. **Dimension Calculations**: Validates screen width, screen height, lid height, deck height, and total height across all presets.
3. **Concentric Geometry**: Asserts $R_{\text{screen}} = \max(2, R_{\text{lid}} - \text{bezel})$.
4. **Lid Opening Kinetics**:
   - Frame $< f_0$: angle is clamped to `fromAngle`.
   - Frame in progress: angle smoothly eases from `fromAngle` toward `toAngle`.
   - Frame $\ge f_0 + D$: angle resolves to `toAngle` without negative zero artifacts.
   - Screen opacity warms up progressively.
5. **Hardware Finish Configs**: Ensures all 4 metallic finishes resolve valid CSS hex colors.

---

## Related Files

- Component Implementation: [src/components/mockups/LaptopMockup.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/LaptopMockup.tsx)
- Pure Calculations: [src/components/mockups/laptopMockupStyle.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/laptopMockupStyle.ts)
- Type Definitions: [src/components/mockups/types.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/types.ts)
- Interactive Showcase: [src/playground/showcases/LaptopMockupShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/LaptopMockupShowcase.tsx)
- Test Suite: [tests/laptop-mockup.test.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/tests/laptop-mockup.test.ts)
