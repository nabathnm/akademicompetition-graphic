# Transition Components (Layer 2)

Scene-to-scene transition primitives and spatial wipes.

## Production-Ready Components
- `SlideTransition`: Configurable directional spatial movement component supporting 8 cardinal and diagonal movement vectors, enter/exit/in-out/replace modes, spring physics with overshoot, and combined opacity fades.
  - Documentation: [docs/SLIDE_TRANSITION.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/SLIDE_TRANSITION.md)
  - Showcase: [SlideTransitionShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/SlideTransitionShowcase.tsx)
- `FadeTransition`: Smooth deterministic opacity transition supporting fade-in (`in`), fade-out (`out`), in-out envelope (`in-out`), and dual-layer crossfade dissolves (`crossfade`).
  - Documentation: [docs/FADE_TRANSITION.md](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/FADE_TRANSITION.md)
  - Showcase: [FadeTransitionShowcase.tsx](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/playground/showcases/FadeTransitionShowcase.tsx)

## Planned Components
- `WipeTransition`: High-speed directional bar wipe.
- `ZoomTransition`: Perspective scale zoom in/out with blur.

## Conventions
- Seamlessly coordinate exit of Scene A and entrance of Scene B.
- Frame calculations must be clamped to the transition window.
