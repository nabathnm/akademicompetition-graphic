# Developer Guide & Best Practices

This guide outlines setup instructions, architectural principles, development workflows, testing procedures, and best practices for developing and maintaining the Remotion Motion Graphics Framework.

---

## 1. System Requirements & Setup

### Prerequisites
- **Node.js**: `^20.19.0 || ^22.13.0 || >=24` (Node.js 24 recommended).
- **Package Manager**: `npm` (v10+).
- **RAM**: Minimum 8 GB recommended for full video rendering; low memory (<2 GB available RAM) may require rendering still frames or adjusting concurrency.

### Installation
```bash
git clone <repository-url>
cd akademi
npm install
```

---

## 2. Core Architecture & Rules

### Rule 1: Strictly Deterministic Frame Execution
All animation parameters, transforms, opacities, and positions **must be derived strictly from `frame` and `fps`**:
```typescript
// ✅ CORRECT: Pure deterministic derivation
const frame = useCurrentFrame();
const { fps } = useVideoConfig();
const progress = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

// ❌ FORBIDDEN: Runtime or wall-clock timing
setTimeout(() => setVisible(true), 1000); // NEVER
requestAnimationFrame(update);             // NEVER
<div style={{ transition: 'all 0.3s ease' }} /> // NEVER
```

### Rule 2: Token-Driven Styling
All colors, font families, font sizes, line heights, spacing, border radii, and spring configurations must reference centralized tokens from `src/styles/`:
- `Colors`: High-contrast dark neutrals (`Colors.dark.bgPrimary`), surgical accents (`Colors.accent.cyan`, `Colors.accent.electricViolet`).
- `Typography`: Modular scale (`Typography.sizes.hero`, `Typography.weights.bold`).
- `Spacing`: 8-point geometric scale (`Spacing.md`, `Spacing.safeArea.landscape1080p`).
- `Motion`: Standard frame durations and physics presets (`Motion.springs.snappy`, `Motion.springs.gentle`).

### Rule 3: Zero Unused Imports & Clean TypeScript
Strict TypeScript options are enforced (`"noUnusedLocals": true`, `"strict": true`). Always verify clean types before committing.

---

## 3. Essential Development Commands

| Command | Action | Notes |
|:---|:---|:---|
| `npm run dev` | Launch Remotion Studio | Opens interactive UI at `http://localhost:3000` |
| `npm test` | Run Unit Test Suite | Runs all 136 test suites (1,242 tests) with `node --test` |
| `npm run lint` | ESLint + TypeScript Typecheck | Executes `eslint src && tsc --noEmit` with zero errors |
| `npm run build` | Bundle Validation | Verifies Rspack bundling integrity into `build/` |
| `npm run upgrade` | Upgrade Remotion | Upgrades Remotion packages to the latest release |

---

## 4. Video & Still Rendering

### Rendering Video Compositions
```bash
# Render PlaceholderAd commercial composition
npx remotion render src/index.ts PlaceholderAd out/commercial-ad.mp4

# Render specific frame range (e.g. 0 to 60)
npx remotion render src/index.ts PlaceholderAd out/commercial-clip.mp4 --frames=0-60

# Render with concurrency control (recommended on machines with limited RAM)
npx remotion render src/index.ts PlaceholderAd out/commercial-ad.mp4 --concurrency=1
```

### Rendering Still Images (Keyframes / Posters)
```bash
# Render frame 0 of PlaceholderAd as JPEG
npx remotion still src/index.ts PlaceholderAd out/poster.jpeg --frame=0

# Render frame 45 as PNG
npx remotion still src/index.ts PlaceholderAd out/frame-45.png --frame=45
```

> **Note on Sandbox / Low-Memory Environments**:
> Remotion CLI video rendering spawns headless Chromium. On headless machines or environments with low available RAM (<1 GB free memory), Chromium may crash or exhaust memory during multi-frame video encoding. When working in resource-constrained environments:
> - Use still rendering (`npx remotion still`) to verify visual fidelity.
> - Render short frame ranges (`--frames=0-30`).
> - Use `--concurrency=1` to limit parallel browser worker instances.

---

## 5. Adding New Components (Step-by-Step)

```
Step 1: Define Types & Props       -> src/components/<category>/types.ts
Step 2: Implement Calculation Logic -> src/components/<category>/myComponentStyle.ts
Step 3: Implement Visual Component  -> src/components/<category>/MyComponent.tsx
Step 4: Create Unit Tests          -> tests/my-component.test.ts
Step 5: Create Showcase Wrapper    -> src/playground/showcases/MyComponentShowcase.tsx
Step 6: Register in Playground     -> src/playground/showcases/showcaseRegistry.ts
Step 7: Author Documentation       -> docs/MY_COMPONENT.md
```

### 1. Calculation Logic Separation
Keep math and style calculations in pure functions (`myComponentStyle.ts`) separate from the React JSX render tree (`MyComponent.tsx`). This allows fast unit testing in Node.js without requiring a heavy DOM environment.

### 2. React.memo Optimization
Wrap reusable components in `React.memo` so they only re-render when their props change or when `useCurrentFrame()` updates their local state:
```tsx
const MyComponentBase: React.FC<MyComponentProps> = (props) => { ... };
export const MyComponent = React.memo(MyComponentBase);
```

### 3. Comprehensive Unit Testing
Add a test suite in `tests/my-component.test.ts` covering:
- Parameter normalization and fallback defaults.
- Start and end frame boundaries.
- Interpolated property bounds (e.g. opacity 0 to 1, scale 0 to 1).
- Framerate independence (24, 30, 60 fps).
- Invalid or edge-case prop inputs.

---

## 6. Performance Best Practices

1. **Premount Window**: `remotion.config.ts` sets `Config.setDefaultPremountInSeconds(0.5)`. This prevents Remotion from pre-mounting unrendered DOM elements seconds in advance, significantly reducing memory consumption.
2. **Path & Sampling Caching**: For complex SVG paths and morph point sampling, use bounded in-memory LRU caches (see `PARSED_PATH_CACHE` in `animatedPathStyle.ts` and `MORPH_SAMPLE_CACHE` in `morphTransitionStyle.ts`).
3. **Viewport Culling**: For particle systems and repetitive graphics, cull elements outside the visible viewport dimensions.
4. **Fast Paths**: For transitions in complete or inactive states, bypass partition containers and render the single child directly (see `SplitTransition`).

---

## 7. Release Readiness Checklist

Before tagging a new version or releasing:
- [x] All unit test suites pass (`npm test` -> 136 suites, 1,242 tests passing).
- [x] Strict TypeScript check passes with zero errors (`tsc --noEmit`).
- [x] Linter passes with zero errors (`eslint src`).
- [x] Bundle builds cleanly with Rspack (`npm run build`).
- [x] Still rendering generates valid frame output (`npx remotion still`).
- [x] Showcase registry updated with all ready components.
- [x] Documentation updated in `docs/` and `README.md`.
