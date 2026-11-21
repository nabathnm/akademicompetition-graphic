# Transition Components (Layer 2)

Scene-to-scene transition primitives and spatial wipes.

## Production-Ready Components
- `MaskTransition`: Flexible geometric and SVG path mask transition utilizing `clipPathUnits="objectBoundingBox"` for aspect-ratio-agnostic clipping. Supports 6 mask types (circle, rectangle, rounded-rectangle, ellipse, polygon, and custom SVG paths), preset path library (heart, star, badge, cloud, flower), 9 origin anchor points, dynamic rotation, spring physics, and dual-layer cross-mask replacement.
  - Documentation: [docs/MASK_TRANSITION.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/MASK_TRANSITION.md)
  - Showcase: [MaskTransitionShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/MaskTransitionShowcase.tsx)
- `WipeTransition`: Deterministic moving clipping boundary transition supporting 8 wipe patterns (directional, center-out, diagonal, and radial iris), glowing leading edge bars, reveal/hide/replace modes, and combined fades.
  - Documentation: [docs/WIPE_TRANSITION.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/WIPE_TRANSITION.md)
  - Showcase: [WipeTransitionShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/WipeTransitionShowcase.tsx)
- `ZoomTransition`: Reusable scale transition component supporting Zoom In, Zoom Out, In-Out envelope, Hyper-Zoom Through camera, dual-layer Zoom Replace, custom transform origins, spring physics with overshoot, rotation, and synchronized opacity fades.
  - Documentation: [docs/ZOOM_TRANSITION.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/ZOOM_TRANSITION.md)
  - Showcase: [ZoomTransitionShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/ZoomTransitionShowcase.tsx)
- `SlideTransition`: Configurable directional spatial movement component supporting 8 cardinal and diagonal movement vectors, enter/exit/in-out/replace modes, spring physics with overshoot, and combined opacity fades.
  - Documentation: [docs/SLIDE_TRANSITION.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/SLIDE_TRANSITION.md)
  - Showcase: [SlideTransitionShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/SlideTransitionShowcase.tsx)
- `FadeTransition`: Smooth deterministic opacity transition supporting fade-in (`in`), fade-out (`out`), in-out envelope (`in-out`), and dual-layer crossfade dissolves (`crossfade`).
  - Documentation: [docs/FADE_TRANSITION.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/FADE_TRANSITION.md)
  - Showcase: [FadeTransitionShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/FadeTransitionShowcase.tsx)

## Planned Components
None (all Layer 2 Transition components are production ready).

## Conventions
- Seamlessly coordinate exit of Scene A and entrance of Scene B.
- Frame calculations must be clamped to the transition window.
