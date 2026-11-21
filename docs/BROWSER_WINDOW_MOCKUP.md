# BrowserWindowMockup Component Documentation

`BrowserWindowMockup` is a specialized desktop web application and website viewport mockup component for the Remotion Motion Graphics Framework (`Layer 2 / Layer 3: Mockups`). It renders websites, dashboards, SaaS tools, and landing pages inside a desktop browser frame with configurable chrome (tabs, navigation toolbar, URL bar), deterministic scroll kinematics, and Remotion entrance and reveal transitions.

---

## 1. Features & Architectural Principles

- **Dual Chrome Presentation Styles**:
  - `full`: Complete desktop browser interface with a top tab bar (36px), traffic lights, new tab button, and a second toolbar row (42px) featuring back/forward/reload buttons, secure URL address bar, and action icons. Total chrome height: 78px.
  - `minimal`: Compact single-header layout (40px) with window controls on the left and a centered URL address pill or window title. Perfect for clean, modern product UI showcases.
- **Configurable Theme Palettes**:
  - `dark`: Deep slate/navy finish with high-contrast text and glowing subtle border highlights.
  - `light`: Clean paper/ceramic finish with crisp slate text and subtle address bar strokes.
  - Supports custom palette overrides via `themeColors`.
- **Deterministic Frame-Accurate Scrolling**:
  - Eliminates DOM scroll dependencies by calculating vertical scroll displacement directly from `useCurrentFrame()`:
    $$\Delta y_{\text{scroll}} = -\text{progress} \cdot \max(0, \text{contentHeight} - \text{viewportHeight})$$
  - Animated scroll supports configurable `startFrame`, `duration`, `from`, `to`, `contentHeight`, and custom easing curves.
- **Simulated Determinate Scrollbar**:
  - Vertical track and sliding thumb accurately proportional to the viewport-to-content ratio:
    $$\text{thumbHeight} = \max\left(24, \left\lfloor\frac{\text{viewportHeight}}{\text{contentHeight}} \times \text{viewportHeight}\right\rfloor\right)$$
    $$\text{thumbTop} = \left\lfloor\text{progress} \times (\text{viewportHeight} - \text{thumbHeight})\right\rfloor$$
- **Staggered Chrome & Viewport Reveals**:
  - `chromeReveal`: Top browser chrome drops into position with cubic ease-out.
  - `viewportReveal`: Web content fades in, zooms (`scale`), or wipes upward (`wipe-up`) after the frame settles.
- **Brand-Neutral Controls**:
  - Generic traffic light controls (`#ff5f57`, `#febc2e`, `#28c840`), monochrome dots, or subtle translucent dots without copying proprietary browser branding.

---

## 2. Component Props Interface

```typescript
export interface BrowserWindowMockupProps {
  // Dimensions & Variant
  width?: number;                                     // Outer window width in px (default: 800)
  height?: number;                                    // Outer window height in px (default: 520)
  variant?: 'minimal' | 'full';                       // Visual style (default: 'full')
  theme?: 'dark' | 'light';                           // Theme palette (default: 'dark')
  themeColors?: Partial<BrowserThemeColors>;          // Custom color overrides

  // Browser Chrome & Header
  title?: string;                                     // Window title or active tab label
  url?: string;                                       // URL address bar text (default: 'https://acme.io')
  tabs?: BrowserTab[];                                // Array of tabs for full variant
  activeTabId?: string | number;                      // Currently selected tab
  showToolbar?: boolean;                              // Show top toolbar (default: true)
  showTabs?: boolean;                                 // Show tab bar in full variant (default: true)
  showAddressBar?: boolean;                           // Show URL address bar (default: true)
  showWindowControls?: boolean;                       // Show traffic lights (default: true)
  windowControlsStyle?: 'traffic-lights' | 'monochrome' | 'subtle'; // (default: 'traffic-lights')
  showNavigationButtons?: boolean;                    // Back, forward, reload buttons
  showToolbarIcons?: boolean;                         // Utility icons (bookmark, share, menu)

  // Styling & Depth
  borderRadius?: number;                              // Outer corner radius in px (default: 14)
  borderWidth?: number;                               // Border width in px (default: 1)
  borderColor?: string;                               // Border color
  shadow?: DeviceShadowPreset | string;               // 'none' | 'subtle' | 'medium' | 'high' | 'floating' | string
  shadowColor?: string;                               // Custom shadow color

  // Viewport & Scrolling
  showScrollbar?: boolean;                            // Show vertical scrollbar track & thumb (default: true)
  scrollProgress?: number | BrowserScrollConfig;      // Static number 0-1 or animated scroll config
  contentHeight?: number;                             // Virtual content height for scroll calculations (default: 1200)
  children?: React.ReactNode;                         // Web content rendered inside viewport
  screenContent?: React.ReactNode;                    // Dedicated content prop

  // Entrance & Exit Kinetics
  animation?: DeviceFrameAnimation | DeviceFrameAnimationConfig; // 'spring' | 'pop' | 'slide-in' | 'scale-in' | 'rotate' | 'fade-in'
  animate?: boolean;                                  // Master entrance toggle (default: true)
  delay?: number;                                     // Entrance delay in frames (default: 0)
  durationInFrames?: number;                          // Entrance duration in frames (default: 25)
  slideDirection?: DeviceSlideDirection;              // 'up' | 'down' | 'left' | 'right' (default: 'up')
  easing?: EasingPresetName | EasingFunction;
  springPreset?: SpringPresetName;
  exitFrame?: number;                                 // Frame trigger for exit
  exitDurationInFrames?: number;                      // Duration of exit in frames (default: 15)
  exitAnimation?: 'fade-out' | 'scale-out' | 'slide-down';

  // Continuous Kinetics & Reveals
  floating?: boolean | SmartphoneFloatingConfig;      // Continuous subtle sinusoidal floating motion
  chromeReveal?: boolean | BrowserChromeRevealConfig; // Top chrome drop-in animation
  viewportReveal?: boolean | BrowserViewportRevealConfig; // Content reveal transition

  // Styles
  style?: React.CSSProperties;                        // Container styling
  viewportStyle?: React.CSSProperties;                // Inner viewport styling
  className?: string;
}
```

---

## 3. Usage Examples

### Full Browser Window with Animated Scroll & SaaS Dashboard

```tsx
import React from 'react';
import { BrowserWindowMockup } from './components/mockups';

export const DashboardMockup: React.FC = () => {
  return (
    <BrowserWindowMockup
      width={840}
      height={520}
      variant="full"
      theme="dark"
      url="https://console.acme.cloud/analytics"
      title="Acme Analytics"
      shadow="floating"
      animation="spring"
      floating={{ amplitude: 6, frequency: 0.4 }}
      scrollProgress={{
        startFrame: 25,
        duration: 45,
        from: 0,
        to: 80,
        contentHeight: 1200,
      }}
    >
      <AnalyticsDashboard />
    </BrowserWindowMockup>
  );
};
```

### Minimal Clean Browser Window

```tsx
<BrowserWindowMockup
  width={640}
  height={400}
  variant="minimal"
  theme="light"
  url="https://acme.io/docs"
  shadow="medium"
  animation="slide-in"
  slideDirection="up"
>
  <DocumentationPage />
</BrowserWindowMockup>
```

### Multi-Window Cascading Desktop Presentation

```tsx
<div style={{ position: 'relative', width: 900, height: 600 }}>
  {/* Background Window */}
  <div style={{ position: 'absolute', top: 20, left: 30, zIndex: 1, opacity: 0.85 }}>
    <BrowserWindowMockup
      width={560}
      height={360}
      variant="minimal"
      theme="dark"
      animation="slide-in"
      slideDirection="left"
    >
      <CodeEditor />
    </BrowserWindowMockup>
  </div>

  {/* Foreground Window */}
  <div style={{ position: 'absolute', bottom: 20, right: 30, zIndex: 2 }}>
    <BrowserWindowMockup
      width={640}
      height={400}
      variant="full"
      theme="dark"
      animation="spring"
      delay={6}
      floating={true}
    >
      <LivePreviewApp />
    </BrowserWindowMockup>
  </div>
</div>
```

---

## 4. Source Code & References

- Component: [BrowserWindowMockup.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/BrowserWindowMockup.tsx)
- Kinematics & Calculations: [browserWindowMockupStyle.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/browserWindowMockupStyle.ts)
- Base Device Frame: [DeviceFrame.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/DeviceFrame.tsx)
- Type Definitions: [types.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/types.ts)
- Unit Tests: [browser-window-mockup.test.ts](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/tests/browser-window-mockup.test.ts)
- Interactive Showcase: [BrowserWindowMockupShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/BrowserWindowMockupShowcase.tsx)
