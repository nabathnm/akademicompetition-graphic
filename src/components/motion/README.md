# Motion Primitives (Layer 2)

Atomic motion wrappers and primitive animators that control entrances, exits, and spatial transformations.

## Planned Components
- `Reveal`: Masked sliding or clipping entrance.
- `Fade`: Pure alpha opacity interpolation.
- `ScaleIn`: Elastic or smooth spring-based scaling.
- `StaggerGroup`: Container that orchestrates delayed arrival for children.
- `ParallaxLayer`: Frame-relative z-plane spatial drift.

## Conventions
- Every motion primitive wraps `children` without modifying their visual markup.
- All calculations derive strictly from `useCurrentFrame()`.
- Physics calculations use `createSpring()` or `clampedInterpolate()`.
