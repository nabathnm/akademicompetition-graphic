# SmartphoneMockup Component Documentation

`SmartphoneMockup` is a specialized, production-ready smartphone mockup component for the Remotion Motion Graphics Framework (`Layer 2 / Layer 3: Mockups`). It composes the foundational `DeviceFrame` architecture with calibrated flagship smartphone models, arbitrary aspect ratios, photorealistic hardware finishes, deterministic Remotion floating and tilt kinetics, and sequential screen reveal transitions.

---

## 1. Features & Architectural Principles

- **Composition Over Duplication**:
  - Reuses `DeviceFrame` for concentric screen radius clipping, layered 2D depth shadows, bezel edge highlights, hardware buttons, cutouts, and base entrance kinematics.
  - Augments the base container with smartphone-specific continuous motion (floating and gentle tilt), screenshot image display, aspect ratio parsing, and light/dark status bar themes.
- **Calibrated Flagship Model Presets**:
  - `flagship`: $320 \times 660\text{px}$, 12px bezel, 40px corner radius, Dynamic Island.
  - `compact`: $280 \times 560\text{px}$, 10px bezel, 34px corner radius, Punch-hole lens.
  - `pro-max`: $360 \times 740\text{px}$, 13px bezel, 44px corner radius, Dynamic Island.
  - `fold`: $300 \times 700\text{px}$, 11px bezel, 28px corner radius, Punch-hole lens.
  - `custom`: Explicit user dimensions and aspect ratios.
- **Configurable Aspect Ratio Engine**:
  - Parses string notations (`'9:19.5'`, `'9:20'`, `'9:16'`, `'19.5/9'`) or numeric values.
  - Dynamically calculates the corresponding missing dimension ($H = W \times \text{ratio}$ or $W = H / \text{ratio}$) while preserving concentric corner curves.
- **Deterministic Continuous Kinetics**:
  - **Floating Motion**: Vertical sinusoidal displacement:
    $$\Delta y = A \sin\left(\frac{2\pi \cdot f \cdot (\text{frame} - \text{delay})}{\text{fps}} + \phi\right)$$
  - **Gentle Harmonic Tilt**: Angular 2D oscillation:
    $$\Delta \theta = \theta_{\max} \sin\left(\frac{2\pi \cdot f \cdot (\text{frame} - \text{delay})}{\text{fps}}\right)$$
  - 100% deterministic and frame-accurate using `useCurrentFrame()`; zero browser timers or `requestAnimationFrame`.
- **Sequential Screen Reveal Transitions**:
  - Staggered screen content entrance (`wipe-up`, `fade`, `scale`) that reveals custom application UI after the hardware device finishes entering.
- **Screen Content Flexibility**:
  - Render live React UI, interactive widgets, typography heroes, or screenshots.
  - Screenshot slot via `screenshot` with configurable `imageFit` (`cover`, `contain`, `fill`).
  - Optional `clipScreen` to enforce strict concentric corner clipping (`overflow: 'hidden'`).
- **Status Bar Theme Contrast**:
  - `showStatusBar="dark"`: White icons and clock for dark application backgrounds.
  - `showStatusBar="light"`: Deep navy/dark icons (`#0f172a`) for light application backgrounds.
  - Supports custom React node for brand-specific status bars.

---

## 2. Component Props Interface

```typescript
export interface SmartphoneMockupProps {
  // Model & Geometry
  model?: 'flagship' | 'compact' | 'pro-max' | 'fold' | 'custom'; // (default: 'flagship')
  width?: number;                                     // Outer width in px (default: 320)
  height?: number;                                    // Outer height in px (default: 660, or computed from aspectRatio)
  aspectRatio?: string | number;                      // '9:19.5' | '9:20' | '9:16' | number
  frameThickness?: number;                            // Bezel thickness in px (default: 12)
  borderRadius?: number;                              // Outer frame radius in px (default: 40)
  screenRadius?: number;                              // Inner screen radius in px (concentric default)

  // Hardware Finishes & Colors
  deviceColor?: string;                               // Frame bezel color (default: '#1a1f2c')
  frameColor?: string;                                // Alias of deviceColor
  screenColor?: string;                               // Screen viewport background (default: '#000000')
  shadow?: DeviceShadowPreset | string;               // 'none' | 'subtle' | 'medium' | 'high' | 'floating' | string
  shadowColor?: string;                               // Custom shadow tint
  glare?: boolean;                                    // Diagonal glass glare overlay (default: true)

  // Cutouts & Hardware Details
  showCamera?: boolean | DeviceNotchType;             // (default: true -> 'dynamic-island')
  cameraCutout?: DeviceNotchType;                     // 'dynamic-island' | 'punch-hole' | 'notch' | 'speaker' | 'none'
  cameraPosition?: 'top' | 'center' | 'left' | 'right'; // Camera alignment (default: 'center')
  showStatusBar?: boolean | 'light' | 'dark' | React.ReactNode; // Status bar contrast (default: true)
  showHomeIndicator?: boolean;                        // Bottom home bar (default: true)
  showButtons?: boolean;                              // Hardware side buttons (default: true)
  buttons?: boolean | DeviceButtonConfig[];           // Custom button configuration

  // Content & Screenshot
  clipScreen?: boolean;                               // Enforce screen corner clipping (default: true)
  screenshot?: string;                                // Image URL to display inside screen
  imageFit?: 'cover' | 'contain' | 'fill';            // Object-fit mode for screenshot (default: 'cover')
  screenContent?: React.ReactNode;                    // Dedicated screen content prop
  children?: React.ReactNode;                         // React children rendered inside screen

  // Entrance & Exit Animations
  animation?: DeviceFrameAnimation | DeviceFrameAnimationConfig; // 'spring' | 'pop' | 'slide-in' | 'scale-in' | 'rotate' | 'fade-in'
  animate?: boolean;                                  // Master entrance toggle (default: true)
  delay?: number;                                     // Entrance delay in frames (default: 0)
  durationInFrames?: number;                          // Entrance duration in frames (default: 25)
  slideDirection?: DeviceSlideDirection;              // 'up' | 'down' | 'left' | 'right' (default: 'up')
  easing?: EasingPresetName | EasingFunction;         // Easing curve
  springPreset?: SpringPresetName;                    // 'snappy' | 'gentle' | 'bouncy' | 'stiff'
  exitFrame?: number;                                 // Frame trigger for exit
  exitDurationInFrames?: number;                      // Exit duration in frames (default: 15)
  exitAnimation?: 'fade-out' | 'scale-out' | 'slide-down';

  // Continuous Kinetics
  floating?: boolean | SmartphoneFloatingConfig;      // Subtle vertical floating motion
  tilt?: boolean | SmartphoneTiltConfig;              // Gentle harmonic tilt motion
  screenReveal?: boolean | SmartphoneScreenRevealConfig; // Sequential screen reveal transition

  // Styling
  style?: React.CSSProperties;                        // Outer container style
  screenStyle?: React.CSSProperties;                  // Inner screen viewport style
  className?: string;                                 // Custom CSS class
}
```

---

## 3. Usage Examples

### Flagship Smartphone with Dynamic Island & Floating Motion

```tsx
import React from 'react';
import { SmartphoneMockup } from './components/mockups';

export const ProductHero: React.FC = () => {
  return (
    <SmartphoneMockup
      model="flagship"
      deviceColor="#161a22"
      shadow="floating"
      cameraCutout="dynamic-island"
      showStatusBar="dark"
      showHomeIndicator={true}
      animation="spring"
      floating={{ amplitude: 8, frequency: 0.45 }}
      tilt={{ maxAngle: 2.5, frequency: 0.3 }}
      screenReveal={{ delay: 15, duration: 15, type: 'wipe-up' }}
    >
      <BankingAppScreen />
    </SmartphoneMockup>
  );
};
```

### Screenshot Mockup with Light Theme App Contrast

```tsx
<SmartphoneMockup
  model="compact"
  deviceColor="#e2e8f0"
  showStatusBar="light"
  screenshot="https://example.com/mobile-app-screen.png"
  imageFit="cover"
  shadow="high"
  animation="slide-in"
  slideDirection="up"
/>
```

### Multi-Device Composition (Dual Staggered Showcase)

```tsx
<div style={{ display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
  {/* Feed Overview Device */}
  <div style={{ transform: 'scale(0.88) translateX(-100px)', zIndex: 1, opacity: 0.85 }}>
    <SmartphoneMockup
      model="compact"
      animation="slide-in"
      slideDirection="left"
      delay={0}
    >
      <AppFeedView />
    </SmartphoneMockup>
  </div>

  {/* Hero Detail View Device */}
  <div style={{ transform: 'scale(1.0) translateX(70px)', zIndex: 2 }}>
    <SmartphoneMockup
      model="flagship"
      animation="spring"
      delay={6}
      floating={true}
    >
      <AppDetailView />
    </SmartphoneMockup>
  </div>
</div>
```

---

## 4. Source Code & References

- Component: [SmartphoneMockup.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/SmartphoneMockup.tsx)
- Style & Kinetics: [smartphoneMockupStyle.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/smartphoneMockupStyle.ts)
- Base Device Frame: [DeviceFrame.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/DeviceFrame.tsx)
- Type Definitions: [types.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/types.ts)
- Unit Tests: [smartphone-mockup.test.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/tests/smartphone-mockup.test.ts)
- Interactive Showcase: [SmartphoneMockupShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/SmartphoneMockupShowcase.tsx)
