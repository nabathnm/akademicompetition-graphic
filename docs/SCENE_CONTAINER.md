# SceneContainer Component Documentation

`SceneContainer` is the foundational container component for all scenes in the Remotion Motion Graphics Framework (Layer 3). It standardizes scene dimensions, layout positioning, background layers, safe area margins, overflow control, and deterministic scene-level entrance and exit animations.

---

## 1. Architecture & Design Principles

```
                    ┌────────────────────────────┐
                    │      useCurrentFrame()     │
                    │      useVideoConfig()      │
                    └─────────────┬──────────────┘
                                  │
                                  ▼
               ┌──────────────────────────────────────┐
               │ calculateSceneAnimationMetrics()     │
               │   • Progress u in [0, 1]             │
               │   • Phase (pending/enter/active/exit)│
               │   • Opacity, TranslateX/Y, Scale     │
               │   • Clamped frame-based timing       │
               └──────────────────┬───────────────────┘
                                  │
                                  ▼
               ┌──────────────────────────────────────┐
               │ resolveSceneLayoutStyles()           │
               │   • centered                         │
               │   • full-bleed                       │
               │   • split (2-column/row)             │
               │   • top-aligned / bottom-aligned     │
               │   • custom                           │
               └──────────────────┬───────────────────┘
                                  │
                                  ▼
               ┌──────────────────────────────────────┐
               │ resolveScenePadding(padding, safe)   │
               │   • Broadcast safe area (+60px)      │
               └──────────────────┬───────────────────┘
                                  │
                                  ▼
               ┌──────────────────────────────────────┐
               │ Root Scene Container                 │
               │   ├── Background Content Layer       │
               │   ├── Children Content Area          │
               │   └── Diagnostic Debug Overlay       │
               └──────────────────────────────────────┘
```

### Auto-Resolving Dimensions
When `width` or `height` is not specified, `SceneContainer` inspects `useVideoConfig()`, seamlessly matching the composition resolution (e.g. 1920x1080 Landscape, 1080x1920 Vertical Reels, 1080x1080 Square).

### Broadcast Safe Area Protection
Television broadcasts and mobile platforms (Reels, TikTok, YouTube Shorts) place system icons, account handles, and cutouts around the screen perimeter. When `safeArea={true}`, `SceneContainer` adds 60px of safe padding, ensuring critical headlines and buttons are never occluded.

---

## 2. Layout Modes

| Layout Mode | Description | Default Flex Alignment |
|:---|:---|:---|
| `centered` | Centered content block with balanced vertical and horizontal centering | `flex-direction: column; align-items: center; justify-content: center` |
| `full-bleed` | 100% edge-to-edge coverage with 0 margins, ideal for full-screen visuals or video backdrops | `display: block; width: 100%; height: 100%` |
| `split` | Dual-panel layout splitting content horizontally into 2 columns with configurable gap | `flex-direction: row; align-items: center; justify-content: space-between; gap: 48px` |
| `top-aligned` | Aligns content flush to the top edge (or safe area) | `flex-direction: column; justify-content: flex-start` |
| `bottom-aligned`| Aligns content flush to the bottom edge | `flex-direction: column; justify-content: flex-end` |
| `custom` | Freeform block container without forced flex constraints | `display: block; position: relative` |

---

## 3. Scene-Level Animation Presets

SceneContainer supports entrance and exit animations:

- **`fade`**: Smooth deterministic opacity ramp from `initialOpacity` (default 0) to 1.0.
- **`slide`**: Translates into view along `slideDirection` (`'bottom'`, `'top'`, `'left'`, `'right'`) by `slideDistance` pixels.
- **`scale`**: Scales smoothly from `initialScale` (default 0.9) to 1.0.
- **`zoom`**: Dramatic scale entrance from `initialScale` (default 0.5) to 1.0.
- **`none`**: Instant active presentation without transform kinematics.

---

## 4. Component Properties (`SceneContainerProps`)

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `width` | `number \| string` | `composition width` | Scene width in pixels or CSS string |
| `height` | `number \| string` | `composition height` | Scene height in pixels or CSS string |
| `background` | `string` | `undefined` | CSS background (e.g. `linear-gradient(...)`) |
| `backgroundColor` | `string` | `undefined` | Solid background color override |
| `backgroundImage` | `string` | `undefined` | Background image URL or path |
| `backgroundContent`| `React.ReactNode` | `undefined` | React node rendered behind content |
| `layout` | `SceneLayoutMode` | `'centered'` | Scene content layout arrangement |
| `horizontalAlignment`| `'left' \| 'center' \| 'right' \| 'space-between'` | `'center'` | Horizontal alignment |
| `verticalAlignment` | `'top' \| 'center' \| 'bottom' \| 'space-between'` | `'center'` | Vertical alignment |
| `padding` | `number \| string \| object` | `undefined` | Inner content padding |
| `safeArea` | `boolean \| number` | `false` | Broadcast safe area margin (60px default) |
| `overflow` | `'hidden' \| 'visible' \| 'clip'` | `'hidden'` | Content overflow behavior |
| `sceneId` | `string` | `undefined` | Scene identifier (`data-scene-id`) |
| `debug` | `boolean` | `false` | Visual debug overlay with safe area guide |
| `durationInFrames` | `number` | `composition duration` | Scene duration in frames |
| `delay` | `number` | `0` | Delay before entrance starts |
| `animation` | `SceneAnimationConfig \| SceneAnimationType` | `'none'` | Scene entrance/exit animation config |
| `style` | `React.CSSProperties` | `undefined` | Additional inline styles |
| `className` | `string` | `undefined` | Additional CSS class name |
| `children` | `React.ReactNode` | `undefined` | Scene content elements |

---

## 5. Usage Examples

### Centered Product Announcement
```tsx
import { SceneContainer } from '@/components/scenes/SceneContainer';

export const ProductIntroScene = () => {
  return (
    <SceneContainer
      layout="centered"
      background="radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.2) 0%, #030712 80%)"
      safeArea={true}
      padding={48}
      animation={{ type: 'fade', enterDuration: 20 }}
    >
      <h1 style={{ color: '#ffffff', fontSize: 56, fontWeight: 800 }}>
        Next-Generation Autonomous Cloud
      </h1>
      <p style={{ color: '#06b6d4', fontSize: 20 }}>
        Enterprise infrastructure orchestrated in real time.
      </p>
    </SceneContainer>
  );
};
```

### Split Layout with Slide Entrance
```tsx
import { SceneContainer } from '@/components/scenes/SceneContainer';
import { SmartphoneMockup } from '@/components/mockups/SmartphoneMockup';

export const MobileFeatureScene = () => {
  return (
    <SceneContainer
      layout="split"
      background="#090d16"
      safeArea={true}
      animation={{ type: 'slide', slideDirection: 'bottom', slideDistance: 80, enterDuration: 25 }}
    >
      <div style={{ flex: '1 1 50%' }}>
        <h2>Instant Biometric Sync</h2>
        <p>Seamlessly authenticate across all spatial touchpoints.</p>
      </div>
      <div style={{ flex: '1 1 50%', display: 'flex', justifyContent: 'center' }}>
        <SmartphoneMockup orientation="portrait" />
      </div>
    </SceneContainer>
  );
};
```

---

## 6. Unit Testing & Verification

Unit tests are implemented in `tests/scene-container.test.ts`:

```bash
node --test tests/scene-container.test.ts
```
Verifies dimensions, padding, safe area calculation, flex alignment, full-bleed coverage, fade/slide/scale animation timing, and duration exit coordination.
