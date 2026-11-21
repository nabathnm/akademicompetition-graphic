# Mockup Components (Layer 2 / Layer 3)

High-fidelity device frames, simulated digital software viewports, and presentation containers for showcasing product experiences.

## Production-Ready Components

- `TabletMockup`: Configurable tablet mockup container supporting landscape and portrait orientations, calibrated model presets (`compact`, `standard`, `pro`), metallic hardware finishes, Touch ID home button, magnetic Apple Pencil stylus dock, tablet-wide status bar, deterministic device rotation kinetics, and sequential screen reveals.
  - Documentation: [docs/TABLET_MOCKUP.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/TABLET_MOCKUP.md)
  - Showcase: [TabletMockupShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/TabletMockupShowcase.tsx)
- `LaptopMockup`: Polished 2D laptop mockup with display lid, webcam dot, concentric screen bezel, metallic hinge, stylized chiclet keyboard deck, trackpad, deterministic lid-opening physics kinetics, floating/tilt kinematics, and sequential screen content reveals.
  - Documentation: [docs/LAPTOP_MOCKUP.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/LAPTOP_MOCKUP.md)
  - Showcase: [LaptopMockupShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/LaptopMockupShowcase.tsx)
- `BrowserWindowMockup`: Desktop browser window mockup supporting minimal and full chrome styles, tabs, address bar, dark and light theme palettes, deterministic frame-accurate scrolling, simulated determinate scrollbars, and staggered chrome/viewport reveals.
  - Documentation: [docs/BROWSER_WINDOW_MOCKUP.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/BROWSER_WINDOW_MOCKUP.md)
  - Showcase: [BrowserWindowMockupShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/BrowserWindowMockupShowcase.tsx)
- `SmartphoneMockup`: Specialized mobile mockup built on `DeviceFrame` with calibrated flagship presets (`flagship`, `compact`, `pro-max`, `fold`), arbitrary aspect ratios, photorealistic hardware finishes, deterministic Remotion floating and tilt kinetics, screenshot support, light/dark status bar contrast, and sequential screen reveals.
  - Documentation: [docs/SMARTPHONE_MOCKUP.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/SMARTPHONE_MOCKUP.md)
  - Showcase: [SmartphoneMockupShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/SmartphoneMockupShowcase.tsx)
- `DeviceFrame`: Foundational device frame container supporting concentric screen radii, multi-layered 2D depth shadows, hardware side buttons, notch/camera cutouts (dynamic-island, punch-hole, notch, speaker), status/home bars, glass glare overlays, and Remotion frame-accurate entrance/exit kinetics.
  - Documentation: [docs/DEVICE_FRAME.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/DEVICE_FRAME.md)
  - Showcase: [DeviceFrameShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/DeviceFrameShowcase.tsx)

## Planned Specialized Extensions

- `AppInterface`: In-app mobile feed, booking flow, or map interface container.
- `FloatingCard`: Elevated perspective card with realistic soft drop shadow.

## Conventions

- **Concentric Screen Geometry**: Screen corner radius automatically maintains $R_{\text{inner}} = \max(0, R_{\text{outer}} - \text{frameThickness})$.
- **Deterministic Remotion Kinetics**: 100% driven by `useCurrentFrame()` and `useVideoConfig()`; zero CSS transitions or browser timers.
- **Dynamic Content Injection**: Device frames and browser mockups accept dynamic `children`, `screenContent`, or screenshots to render live UI inside the viewport.
