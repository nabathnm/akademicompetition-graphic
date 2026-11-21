# DeviceFrame Component Documentation

`DeviceFrame` is a foundational hardware mockup container for the Remotion Motion Graphics Framework (`Layer 2 / Layer 3: Mockups`). It provides mathematically concentric screen geometry, multi-layered 2D depth shadows, hardware side buttons, realistic camera and sensor cutouts, subtle glass glare reflections, and deterministic Remotion frame-accurate entrance kinetics.

It serves as the base architecture for all specialized digital product mockups (`SmartphoneMockup`, `TabletMockup`, `LaptopMockup`, `BrowserFrame`).

---

## 1. Features & Architectural Principles

- **Concentric Screen Geometry**:
  - Automatically calculates the inner screen viewport corner radius from the outer bezel radius and frame thickness:
    $$R_{\text{inner}} = \max(0, R_{\text{outer}} - \text{frameThickness})$$
  - Ensures uniform, parallel borders along rounded device corners without visual distortion or uneven corner gaps.
  - Overridable via `screenRadius` when specific custom corner radii are required.
- **Layered 2D Depth Shadows Without WebGL**:
  - Pre-calibrated multi-layer box-shadow presets (`subtle`, `medium`, `high`, `floating`) that create realistic elevation and depth:
    - `subtle`: Low elevation for card embedded contexts.
    - `medium`: Default balanced depth for floating UI presentation.
    - `high`: Deep drop shadow for focal hero presentations.
    - `floating`: Wide 96px ambient spread simulating floating device motion graphics.
  - Supports custom CSS box-shadow declarations and custom `shadowColor`.
- **Responsive Multi-Form Factor Geometry**:
  - Fully configurable `width`, `height`, and `frameThickness`.
  - Seamlessly models Smartphones ($320 \times 640$), Tablets ($520 \times 380$), Desktop viewports ($540 \times 340$), and Smart Watches ($200 \times 240$).
- **Realistic Hardware Details & Cutouts**:
  - **Hardware Buttons**: Side volume and power buttons with customizable positioning, length, thickness, and color.
  - **Camera & Sensor Cutouts**:
    - `dynamic-island`: Modern pill cutout with camera lens and ambient sensor dots.
    - `punch-hole`: Centered or offset circular camera lens with inner specular reflection.
    - `notch`: Classic trapezoidal top cutout with smooth rounded corners.
    - `speaker`: Minimal horizontal speaker slit.
    - `none`: Clean bezel-only display.
  - **Status Bar**: Integrated vector mobile status bar (time 9:41, cellular signal bars, wifi icon, battery indicator) or custom React node.
  - **Home Bar**: Bottom iOS-style pill indicator bar with auto-proportional width.
  - **Glass Glare Overlay**: Subtle diagonal gradient overlay (`linear-gradient(135deg, ...)`) producing authentic glass reflection without blocking pointer interactions.
- **Remotion Frame-Accurate Kinetics**:
  - Powered by `useCurrentFrame()` and `useVideoConfig()`.
  - Zero CSS transitions or browser timers; perfectly deterministic across local previews and headless server renders.
  - Supported entrance variants:
    - `spring`: Physical spring settle with snappy damping.
    - `pop`: Bouncy scale overshoot.
    - `slide-in`: Directional entrance (`up`, `down`, `left`, `right`).
    - `scale-in`: Smooth zoom interpolation from configurable `from` to `to`.
    - `rotate`: Angular tilt settle into neutral alignment.
    - `fade-in`: Pure opacity reveal.
    - `none`: Static device container.
  - Complete exit transition lifecycle: `exitFrame`, `exitDurationInFrames`, and `exitAnimation` (`fade-out`, `scale-out`, `slide-down`).

---

## 2. Component Props Interface

```typescript
export interface DeviceFrameProps {
  // Dimensions & Geometry
  width?: number;                                     // Outer frame width in px (default: 320)
  height?: number;                                    // Outer frame height in px (default: 640)
  frameThickness?: number;                            // Bezel thickness in px (default: 12)
  borderRadius?: number;                              // Outer corner radius in px (default: 38)
  screenRadius?: number;                              // Inner screen radius (default: max(0, borderRadius - frameThickness))

  // Materials & Colors
  frameColor?: string;                                // Outer bezel material color (default: '#1e2430')
  screenColor?: string;                               // Screen viewport background (default: '#000000')
  borderWidth?: number;                               // Outer bezel stroke width (default: 1)
  borderColor?: string;                               // Outer bezel stroke color (default: 'rgba(255, 255, 255, 0.12)')
  innerBorderWidth?: number;                          // Inner bezel stroke width (default: 1)
  innerBorderColor?: string;                          // Inner bezel stroke color (default: 'rgba(0, 0, 0, 0.4)')

  // Depth & Reflections
  shadow?: DeviceShadowPreset | string;               // 'none' | 'subtle' | 'medium' | 'high' | 'floating' | string
  shadowColor?: string;                               // Custom shadow tint
  glare?: boolean;                                    // Diagonal glass glare overlay (default: true)

  // Cutouts & Hardware Accents
  notch?: DeviceNotchType;                            // 'none' | 'punch-hole' | 'dynamic-island' | 'notch' | 'speaker'
  notchWidth?: number;                                // Custom notch width in px
  notchHeight?: number;                               // Custom notch height in px
  cameraPosition?: 'top' | 'center' | 'left' | 'right'; // Camera alignment (default: 'center')
  buttons?: boolean | DeviceButtonConfig[];           // Hardware side buttons (default: false)
  statusBar?: boolean | React.ReactNode;              // Mobile status bar (default: false)
  homeBar?: boolean;                                  // Bottom home indicator bar (default: false)

  // Screen Viewport Content
  children?: React.ReactNode;                         // React children rendered inside screen viewport
  screenContent?: React.ReactNode;                    // Dedicated screen content prop (alternative to children)

  // Remotion Animation Kinetics
  animation?: DeviceFrameAnimation | DeviceFrameAnimationConfig; // 'spring' | 'pop' | 'slide-in' | 'scale-in' | 'rotate' | 'fade-in' | 'none'
  animate?: boolean;                                  // Master animation toggle (default: true)
  delay?: number;                                     // Entrance delay in frames (default: 0)
  durationInFrames?: number;                          // Entrance duration in frames (default: 25)
  slideDirection?: DeviceSlideDirection;              // 'up' | 'down' | 'left' | 'right' (default: 'up')
  easing?: EasingPresetName | EasingFunction;         // Easing function or preset name
  springPreset?: SpringPresetName;                    // 'snappy' | 'gentle' | 'bouncy' | 'stiff' (default: 'snappy')

  // Exit Transitions
  exitFrame?: number;                                 // Frame trigger for exit animation
  exitDurationInFrames?: number;                      // Duration of exit animation in frames (default: 15)
  exitAnimation?: 'fade-out' | 'scale-out' | 'slide-down'; // Exit animation variant (default: 'fade-out')

  // Styles
  style?: React.CSSProperties;                        // Container styling
  screenStyle?: React.CSSProperties;                  // Inner screen viewport styling
  className?: string;                                 // Custom class name
}
```

---

## 3. Usage Examples

### Modern Smartphone with Dynamic Island & Spring Settle

```tsx
import React from 'react';
import { DeviceFrame } from './components/mockups';

export const PhoneHero: React.FC = () => {
  return (
    <DeviceFrame
      width={320}
      height={640}
      borderRadius={40}
      frameThickness={12}
      notch="dynamic-island"
      buttons={true}
      statusBar={true}
      homeBar={true}
      shadow="floating"
      animation="spring"
      durationInFrames={25}
    >
      <div style={{ padding: '54px 16px', color: '#fff' }}>
        <h2>Welcome to RideShare</h2>
        <p>Driver arriving in 3 mins</p>
      </div>
    </DeviceFrame>
  );
};
```

### Tablet Landscape Viewport

```tsx
<DeviceFrame
  width={600}
  height={420}
  borderRadius={28}
  frameThickness={14}
  notch="punch-hole"
  cameraPosition="top"
  shadow="high"
  animation="slide-in"
  slideDirection="up"
  durationInFrames={22}
>
  <AnalyticsDashboard />
</DeviceFrame>
```

### Exit Transition Sequence

```tsx
<DeviceFrame
  width={320}
  height={640}
  animation="spring"
  exitFrame={90}
  exitDurationInFrames={18}
  exitAnimation="slide-down"
>
  <CheckoutFlow />
</DeviceFrame>
```

---

## 4. Source Code & References

- Component: [DeviceFrame.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/DeviceFrame.tsx)
- Kinematics & Dimensions: [deviceFrameStyle.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/deviceFrameStyle.ts)
- Type Definitions: [types.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/types.ts)
- Unit Tests: [device-frame.test.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/tests/device-frame.test.ts)
- Interactive Showcase: [DeviceFrameShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/DeviceFrameShowcase.tsx)
