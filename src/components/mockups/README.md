# Mockup Components (Layer 2 / Layer 3)

High-fidelity device frames, simulated digital software viewports, and presentation containers for showcasing product experiences.

## Production-Ready Components

- `SmartphoneMockup`: Specialized mobile mockup built on `DeviceFrame` with calibrated flagship presets (`flagship`, `compact`, `pro-max`, `fold`), arbitrary aspect ratios, photorealistic hardware finishes, deterministic Remotion floating and tilt kinetics, screenshot support, light/dark status bar contrast, and sequential screen reveals.
  - Documentation: [docs/SMARTPHONE_MOCKUP.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/SMARTPHONE_MOCKUP.md)
  - Showcase: [SmartphoneMockupShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/SmartphoneMockupShowcase.tsx)
- `DeviceFrame`: Foundational device frame container supporting concentric screen radii, multi-layered 2D depth shadows, hardware side buttons, notch/camera cutouts (dynamic-island, punch-hole, notch, speaker), status/home bars, glass glare overlays, and Remotion frame-accurate entrance/exit kinetics.
  - Documentation: [docs/DEVICE_FRAME.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/DEVICE_FRAME.md)
  - Showcase: [DeviceFrameShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/DeviceFrameShowcase.tsx)

## Planned Specialized Extensions

- `TabletMockup`: Tablet viewport container with landscape/portrait orientations and pencil dock accents.
- `BrowserFrame`: Clean glass/dark minimal browser window with address bar, tabs, and traffic light window controls.
- `AppInterface`: In-app mobile feed, booking flow, or map interface container.
- `FloatingCard`: Elevated perspective card with realistic soft drop shadow.

## Conventions

- **Concentric Screen Geometry**: Screen corner radius automatically maintains $R_{\text{inner}} = \max(0, R_{\text{outer}} - \text{frameThickness})$.
- **Deterministic Remotion Kinetics**: 100% driven by `useCurrentFrame()` and `useVideoConfig()`; zero CSS transitions or browser timers.
- **Dynamic Content Injection**: Device frames accept dynamic `children`, `screenContent`, or `screenshot` images to render live UI inside the viewport.
