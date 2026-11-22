# Scene Components (Layer 3)

Foundational scene containers, layout frameworks, and commercial composition templates for Remotion video projects.

## Production-Ready Components

- `SceneContainer`: The foundational container for all scenes in the Remotion Motion Graphics Framework. Standardizes scene dimensions, layout modes (`centered`, `full-bleed`, `split`, `top-aligned`, `bottom-aligned`, `custom`), background styles (solid, gradient, image, mesh), safe area guide boundaries, content alignment, and deterministic scene-level kinematics (`fade`, `slide`, `scale`, `zoom`).
  - Documentation: [docs/SCENE_CONTAINER.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/SCENE_CONTAINER.md)
  - Showcase: [SceneContainerShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/SceneContainerShowcase.tsx)

- `HeroScene`: High-impact commercial hero scene template for introducing products, software applications, SaaS platforms, or brands. Built directly on `SceneContainer`, it establishes strong visual hierarchy between category eyebrow badges, kinetic headlines, subtitles, extended descriptions, CTA buttons, hardware mockup frames (`SmartphoneMockup`, `LaptopMockup`), and ambient floating decorative elements with customizable stagger delays.
  - Documentation: [docs/HERO_SCENE.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/HERO_SCENE.md)
  - Showcase: [HeroSceneShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/HeroSceneShowcase.tsx)

- `ProductShowcaseScene`: Commercial product presentation template that places a physical or digital product asset at the center of attention. Features continuous floating hover physics, subtle tilt rotation, floating spec detail badges, and multiple layout variations (`floating-details`, `center-product`, `product-left`, `product-right`, `full-screen`).
  - Documentation: [docs/PRODUCT_SHOWCASE_SCENE.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/PRODUCT_SHOWCASE_SCENE.md)
  - Showcase: [ProductShowcaseSceneShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/ProductShowcaseSceneShowcase.tsx)

- `FeatureHighlightScene`: Feature spotlight scene template for explaining specific capabilities, technical advantages, and core benefits. Features staggered kinetic typography, highlighted benefit statement pills with breathing pulse animations, and interactive callout annotations pointing to specific hardware/software elements.
  - Documentation: [docs/FEATURE_HIGHLIGHT_SCENE.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/FEATURE_HIGHLIGHT_SCENE.md)
  - Showcase: [FeatureHighlightSceneShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/FeatureHighlightSceneShowcase.tsx)

- `TypographyScene`: Typography-focused scene template where kinetic text is the primary visual element. Seamlessly composes Layer 2 Typography primitives (`AnimatedText`, `WordReveal`, `CharacterReveal`, `TextMask`, `TextHighlight`, `SplitText`) and supports 8 layout arrangements (`centered`, `left-aligned`, `right-aligned`, `oversized-headline`, `multi-line`, `split-text`, `text-with-graphics`, `custom`) with dynamic keyword highlight styling.
  - Documentation: [docs/TYPOGRAPHY_SCENE.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/TYPOGRAPHY_SCENE.md)
  - Showcase: [TypographySceneShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/TypographySceneShowcase.tsx)

- `DeviceShowcaseScene`: Digital product presentation scene template for showcasing applications, SaaS platforms, and responsive websites across hardware mockups (`SmartphoneMockup`, `TabletMockup`, `LaptopMockup`, `BrowserWindowMockup`, `DeviceFrame`). Features continuous deterministic floating hover physics, subtle tilt rotation, multi-device layered arrangements (`device-overlap`, `multiple-devices`, `device-stack`), and hardware/feature callout annotations.
  - Documentation: [docs/DEVICE_SHOWCASE_SCENE.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/DEVICE_SHOWCASE_SCENE.md)
  - Showcase: [DeviceShowcaseSceneShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/DeviceShowcaseSceneShowcase.tsx)

- `ComparisonScene`: Dual-panel comparative presentation template designed to clarify differences between two visual states, products, feature tiers, or user experiences. Features side-by-side, top-and-bottom, before-and-after, and split-screen layouts with synchronized reveals and animated center divider lines.
  - Documentation: [docs/COMPARISON_SCENE.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/COMPARISON_SCENE.md)
  - Showcase: [ComparisonSceneShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/ComparisonSceneShowcase.tsx)

- `CallToActionScene`: High-conversion closing action template pairing kinetic headline typography with interactive `AnimatedButton` components, continuous breathing pulse physics, and optional product visuals or hardware mockups.
  - Documentation: [docs/CALL_TO_ACTION_SCENE.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/CALL_TO_ACTION_SCENE.md)
  - Showcase: [CallToActionSceneShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/CallToActionSceneShowcase.tsx)

- `OutroScene`: Memorable brand closing scene template establishing company identity, logo marks with continuous harmonic hover physics, taglines, website pills, social media handles, and conversion links.
  - Documentation: [docs/OUTRO_SCENE.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/OUTRO_SCENE.md)
  - Showcase: [OutroSceneShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/OutroSceneShowcase.tsx)

## Architecture & Conventions

1. **Dimensional Agnosticism**:
   All scene components automatically resolve dimensions from `useVideoConfig()` (16:9 1080p, 4K, 9:16 vertical reels, 1:1 square) or custom pixel/percentage values.
2. **Safe Area Compliance**:
   Built-in broadcast-standard safe margins (default 60px) prevent visual elements and headlines from clipping on consumer televisions, mobile notch cutouts, or platform UI overlays.
3. **Deterministic Staggered Kinematics**:
   All scene-level and slot-level animations are computed strictly using frame numbers (`useCurrentFrame()`). Never use browser timers or non-deterministic randomization.
