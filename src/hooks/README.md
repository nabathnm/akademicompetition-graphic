# Motion Graphics Framework Hooks

This directory contains reusable custom hooks for deterministic motion and timeline management.

## Guidelines
- All animation hooks must rely strictly on Remotion's `useCurrentFrame()` and `useVideoConfig()`.
- Do not use `useState`, `useEffect`, `setTimeout`, or `requestAnimationFrame` for timeline progression.
- Return plain numeric values, normalized 0..1 values, or styling objects to preserve pure determinism.
