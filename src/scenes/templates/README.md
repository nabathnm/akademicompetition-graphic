# Scene Templates (Layer 3)

Standardized visual section templates that orchestrate multiple Layer 2 components.

## Core Principles
1. **Layer Separation**:
   - `Layer 0 (Background)`: Solid color, subtle gradient, or ambient video loop.
   - `Layer 1 (Content)`: Core typography, mockups, or UI cards within safe margins.
   - `Layer 2 (Overlay)`: Floating badges, HUD overlays, or brand watermarks.
2. **Deterministic Lifecycle**:
   - Entrance: `[0 ... entranceDurationFrames]`
   - Hold / Active: `[entranceDurationFrames ... durationInFrames - exitDurationFrames]`
   - Exit: `[durationInFrames - exitDurationFrames ... durationInFrames]`
3. **Composability**:
   - Scenes can be nested, sequenced in Remotion's `<Sequence />`, or tested individually in the Motion Playground.
