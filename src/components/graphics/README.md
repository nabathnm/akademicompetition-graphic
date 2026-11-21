# Shape & Graphic Components (Layer 2)

Vector shapes, coordinate grids, and ambient visual backdrops for commercial motion graphics.

## Available Components
- `ParticleSystem`: Deterministic seeded particle system supporting geometric particle shapes (circle, square, ring, star, triangle, cross), spatial topologies (random, grid, radial, circular, custom), and procedural motion modes (float, rise, fall, drift, burst, vortex). See [docs/PARTICLE_SYSTEM.md](../../../docs/PARTICLE_SYSTEM.md).
- `AnimatedPath`: Flexible SVG path component supporting custom vector paths (`d`), open and closed shapes, progressive forward and reverse stroke drawing, sequenced fill reveals, stroke width animations, and deterministic motion-along-path tracking. See [docs/ANIMATED_PATH.md](../../../docs/ANIMATED_PATH.md).
- `AnimatedArrow`: Configurable vector arrow component supporting straight, diagonal, and curved Bezier paths, single/double arrowheads, 5 arrowhead styles (triangle, chevron, stealth, barb, circle), and sequenced reveals. See [docs/ANIMATED_ARROW.md](../../../docs/ANIMATED_ARROW.md).
- `AnimatedCircle`: Specialized radial SVG circle component supporting filled circles, outlines, rings, partial arcs, circular progress indicators, and concentric compositions with frame-based animations (`scale-in`, `draw-in`, `radial-reveal`, `ring-expansion`, `pulse`, `progress`, `rotate`). See [docs/ANIMATED_CIRCLE.md](../../../docs/ANIMATED_CIRCLE.md).
- `AnimatedLine`: Flexible vector line component supporting horizontal, vertical, diagonal, and custom endpoint geometries, stroke caps (`round`, `butt`, `square`), dash patterns, and frame-accurate animations (`draw-in`, `draw-out`, `reveal-left`, `reveal-right`, `reveal-center`, `length-expansion`, `stroke-width`, `move-in`, `fade-in`). See [docs/ANIMATED_LINE.md](../../../docs/ANIMATED_LINE.md).
- `AnimatedShape`: Foundation geometric 2D shape component supporting rectangles, rounded rectangles, ellipses/circles, regular polygons, triangles, and stars with frame-based Remotion animations (fade, scale, rotate, move, pop, bounce, and progressive SVG stroke-dash draw reveals). See [docs/ANIMATED_SHAPE.md](../../../docs/ANIMATED_SHAPE.md).

## Planned Components
- `GridBackground`: Geometric isometric or orthogonal dot/line grid.
- `GradientMesh`: Fluid ambient color blur that adds subtle atmospheric depth.
- `VectorPath`: Animated SVG stroke paths (e.g. route drawing, data line charts).
- `GeometricAccent`: Minimalist lines, crosses, brackets, and focus reticles.

## Conventions
- SVG paths must be deterministic with calculable `strokeDashoffset`.
- Lightweight rendering footprint with no heavy canvas filters.
