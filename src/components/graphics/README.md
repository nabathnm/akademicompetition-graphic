# Shape & Graphic Components (Layer 2)

Vector shapes, coordinate grids, and ambient visual backdrops for commercial motion graphics.

## Available Components
- `AnimatedShape`: Foundation geometric 2D shape component supporting rectangles, rounded rectangles, ellipses/circles, regular polygons, triangles, and stars with frame-based Remotion animations (fade, scale, rotate, move, pop, bounce, and progressive SVG stroke-dash draw reveals). See [docs/ANIMATED_SHAPE.md](../../../docs/ANIMATED_SHAPE.md).

## Planned Components
- `GridBackground`: Geometric isometric or orthogonal dot/line grid.
- `GradientMesh`: Fluid ambient color blur that adds subtle atmospheric depth.
- `VectorPath`: Animated SVG stroke paths (e.g. route drawing, data line charts).
- `GeometricAccent`: Minimalist lines, crosses, brackets, and focus reticles.

## Conventions
- SVG paths must be deterministic with calculable `strokeDashoffset`.
- Lightweight rendering footprint with no heavy canvas filters.
