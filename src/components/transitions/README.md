# Transition Components (Layer 2)

Scene-to-scene transition primitives and spatial wipes.

## Planned Components
- `WipeTransition`: High-speed directional bar wipe.
- `SlideTransition`: Cinematic push/pull slide.
- `ZoomTransition`: Perspective scale zoom in/out with blur.
- `CrossFadeTransition`: Pure opacity cross-dissolve.

## Conventions
- Seamlessly coordinate exit of Scene A and entrance of Scene B.
- Frame calculations must be clamped to the transition window.
