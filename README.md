# Remotion Motion Graphics Framework

A production-ready, modular motion graphics framework built with **Remotion**, **React 19**, and **TypeScript 5**.

Engineered to generate modern commercial advertisements and product showcases inspired by the design language of premium technology and mobility platforms. Features high-contrast monochrome surfaces, surgical accent highlights, fluid spring physics, and deterministic frame execution.

---

## 1. System Architecture: Four-Tier Model

The framework enforces a decoupled four-tier architecture, separating isolated component prototyping from final commercial advertisement assembly:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      Layer 1: Motion Playground                        │
│          Isolated development, diagnostic telemetry, A/B tuning        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Layer 2: Component Library                        │
│    Kinetic Typography • UI Widgets • Mockups • Graphics • Transitions   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Layer 3: Scene Library                          │
│     Pre-composed commercial scenes, safe areas, timeline sequencing     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Layer 4: Advertisement Assembly Pipeline               │
│   Campaign compositions, multi-track audio, transitions, studio export │
└────────────────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

1. **[Layer 1: Motion Playground](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/MOTION_PLAYGROUND.md)** (`src/playground/`):
   - Isolated preview environment for developing and evaluating components without scene or campaign overhead.
   - 10 dedicated view modes (`overview`, `utilities`, `typography`, `ui`, `mockups`, `graphics`, `transitions`, `scenes`, `comparison`, `isolated`).
   - Diagnostic telemetry HUD displaying active resolution, FPS, current frame index, and SMPTE timecode (`HH:MM:SS:FF`).
   - A/B variant comparator for synchronous visual tuning of spring physics and easing curves.

2. **Layer 2: Component Library** (`src/components/`):
   - Atomic, self-contained visual building blocks.
   - Separates math calculations (`*Style.ts`) from visual rendering (`*.tsx`) for rapid unit testing without DOM overhead.
   - Memoized with `React.memo` and optimized with LRU path/sampling caches.

3. **Layer 3: Scene Library** (`src/components/scenes/`):
   - Pre-composed narrative sections with standardized entrance, hold, and exit lifecycles.
   - Built-in broadcast safe areas (default 60px/80px margins).
   - Coordinated sequencing via `SceneSequence` and centralized calculations via `TimelineManager`.

4. **Layer 4: Advertisement Assembly Pipeline** (`src/compositions/`):
   - High-level campaign composition container (`AdvertisementComposition`) and studio previewer (`AdvertisementPreview`).
   - Frame-accurate multi-track audio orchestrator (`AudioTrack`, `BackgroundMusic`, `SoundEffect`).
   - Centralized animation configuration (`GlobalAnimationConfig`).

---

## 2. Reusable Component Catalog

The framework includes 30+ reusable, production-ready components organized into 6 functional libraries.

### 2.1 Kinetic Typography (`src/components/typography/`)

| Component | Description | Variants | Documentation |
|:---|:---|:---|:---|
| **[AnimatedText](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/typography/AnimatedText.tsx)** | Foundational text animator supporting 10 deterministic entrance and exit styles | `fade`, `slide-up`, `slide-down`, `slide-left`, `slide-right`, `scale`, `pop`, `blur`, `rotate`, `fade-slide-up` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/ANIMATED_TEXT.md) |
| **[WordReveal](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/typography/WordReveal.tsx)** | Sequentially animates text word-by-word with whitespace and punctuation preservation | `fade`, `slide-up`, `slide-down`, `slide-left`, `slide-right`, `scale`, `pop`, `blur`, `rotate`, `fade-slide-up` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/WORD_REVEAL.md) |
| **[CharacterReveal](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/typography/CharacterReveal.tsx)** | Animates text character-by-character with grapheme clustering, wave and elastic kinetics | `fade`, `slide-up`, `slide-down`, `scale`, `pop`, `blur`, `rotate`, `elastic`, `wave` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/CHARACTER_REVEAL.md) |
| **[TextMask](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/typography/TextMask.tsx)** | Editorial clipping and masking transitions including wipes, diagonal slices, and line reveals | `bottom-reveal`, `top-reveal`, `left-reveal`, `right-reveal`, `center-reveal`, `vertical-wipe`, `diagonal-wipe`, `line-reveal` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/TEXT_MASK.md) |
| **[TextHighlight](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/typography/TextHighlight.tsx)** | Visual emphasis behind, around, or underneath selected text tokens | `background`, `underline`, `marker`, `box`, `circle`, `strike`, `gradient`, `glow`, `bracket` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/TEXT_HIGHLIGHT.md) |
| **[SplitText](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/typography/SplitText.tsx)** | Advanced multi-unit segmentation across lines, words, characters, or sentences | `slide-up`, `slide-down`, `fade`, `scale`, `pop`, `rotate`, `blur`, `flip-up`, `flip-down`, `stagger`, `wave` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/SPLIT_TEXT.md) |

### 2.2 UI Animation Components (`src/components/ui/`)

| Component | Description | Variants | Documentation |
|:---|:---|:---|:---|
| **[AnimatedButton](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/ui/AnimatedButton.tsx)** | Commercial CTA button with press physics, spring release, rotating spinner, and feedback | `primary`, `secondary`, `outline`, `ghost`, `text`, `icon-only` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/ANIMATED_BUTTON.md) |
| **[AnimatedInput](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/ui/AnimatedInput.tsx)** | Realistic text input with frame-based simulated typing, focus rings, and validation | `outlined`, `filled`, `minimal`, `underline`, `rounded` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/ANIMATED_INPUT.md) |
| **[AnimatedSearchBar](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/ui/AnimatedSearchBar.tsx)** | Simulated search interaction flow with animated query typing, dropdown suggestions, and result cards | `outlined`, `filled`, `minimal`, `rounded`, `expanded` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/ANIMATED_SEARCH_BAR.md) |
| **[AnimatedCard](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/ui/AnimatedCard.tsx)** | Versatile content surface supporting 12 entrance styles, 7 visual styles, and 7 interaction states | `default`, `outlined`, `elevated`, `flat`, `image-card`, `horizontal`, `compact` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/ANIMATED_CARD.md) |
| **[AnimatedNotification](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/ui/AnimatedNotification.tsx)** | Toast, banner, alert, and floating card notifications with dynamic progress bars | `toast`, `banner`, `floating`, `compact`, `card` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/ANIMATED_NOTIFICATION.md) |
| **[AnimatedToggle](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/ui/AnimatedToggle.tsx)** | Interactive switch component with spring overshoot physics, labels, and icons | `default`, `minimal`, `outlined`, `filled`, `labeled` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/ANIMATED_TOGGLE.md) |
| **[AnimatedCheckbox](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/ui/AnimatedCheckbox.tsx)** | Progressive SVG checkmark drawing with spring selection feedback and indeterminate states | `default`, `rounded`, `square`, `filled`, `outlined`, `minimal` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/ANIMATED_CHECKBOX.md) |

### 2.3 Hardware Mockup Components (`src/components/mockups/`)

| Component | Description | Presets / Variants | Documentation |
|:---|:---|:---|:---|
| **[DeviceFrame](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/DeviceFrame.tsx)** | Foundational device frame with concentric screen radius, 2D depth shadows, glare overlay, and buttons | `spring`, `pop`, `slide-in`, `scale-in`, `rotate`, `fade-in` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/DEVICE_FRAME.md) |
| **[SmartphoneMockup](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/SmartphoneMockup.tsx)** | Smartphone mockup with Dynamic Island / notch cutouts, metallic finishes, and floating hover kinetics | `iPhone 16 Pro`, `iPhone 15`, `Pixel 9`, `Galaxy S24` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/SMARTPHONE_MOCKUP.md) |
| **[BrowserWindowMockup](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/BrowserWindowMockup.tsx)** | Desktop browser window with traffic light buttons, tabs, address bar, and simulated page scrolling | `minimal`, `full`, `dark`, `light`, `scroll-reveal` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/BROWSER_WINDOW_MOCKUP.md) |
| **[LaptopMockup](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/LaptopMockup.tsx)** | Laptop mockup with lid-opening kinetics, chiclet keyboard deck, trackpad, and screen reveals | `MacBook Pro 16"`, `MacBook Air 13"`, `lid-opening` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/LAPTOP_MOCKUP.md) |
| **[TabletMockup](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/mockups/TabletMockup.tsx)** | Tablet mockup supporting portrait and landscape orientations, magnetic stylus dock, and 90° rotation | `iPad Pro 12.9"`, `iPad Air 11"`, `portrait`, `landscape` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/TABLET_MOCKUP.md) |

### 2.4 Vector Graphics & Shape Components (`src/components/graphics/`)

| Component | Description | Variants | Documentation |
|:---|:---|:---|:---|
| **[AnimatedShape](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/graphics/AnimatedShape.tsx)** | Geometric shape component (rectangles, rounded rects, circles, polygons, stars) with SVG stroke drawing | `rectangle`, `rounded-rectangle`, `circle`, `polygon`, `triangle`, `star` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/ANIMATED_SHAPE.md) |
| **[AnimatedLine](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/graphics/AnimatedLine.tsx)** | Vector line component supporting horizontal, vertical, diagonal, and custom endpoint coordinates | `draw-in`, `draw-out`, `reveal-left`, `reveal-right`, `reveal-center`, `length-expansion` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/ANIMATED_LINE.md) |
| **[AnimatedCircle](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/graphics/AnimatedCircle.tsx)** | Radial SVG circle component supporting outlines, partial arcs, progress indicators, and radar sweeps | `scale-in`, `scale-out`, `draw-in`, `radial-reveal`, `ring-expansion`, `pulse`, `progress` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/ANIMATED_CIRCLE.md) |
| **[AnimatedArrow](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/graphics/AnimatedArrow.tsx)** | Configurable vector arrow supporting straight, diagonal, and curved Bezier paths with arrowhead reveals | `draw-in`, `draw-out`, `arrowhead-reveal`, `move-in`, `scale-in` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/ANIMATED_ARROW.md) |
| **[AnimatedPath](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/graphics/AnimatedPath.tsx)** | SVG path component with memoized path parsing, progressive stroke drawing, and motion along a path | `draw-in`, `reverse-draw`, `fill-reveal`, `motion-along-path`, `stroke-width` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/ANIMATED_PATH.md) |
| **[ParticleSystem](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/graphics/ParticleSystem.tsx)** | Deterministic seeded particle system with spatial culling, geometric shapes, and drift/burst kinetics | `float`, `rise`, `fall`, `drift`, `burst`, `vortex`, `sparkles` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/PARTICLE_SYSTEM.md) |

### 2.5 Transition Library (`src/components/transitions/`)

| Transition | Description | Modes / Directions | Documentation |
|:---|:---|:---|:---|
| **[FadeTransition](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/FadeTransition.tsx)** | Smooth deterministic opacity transition supporting fade-in, fade-out, envelopes, and crossfades | `in`, `out`, `in-out`, `crossfade` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/FADE_TRANSITION.md) |
| **[SlideTransition](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/SlideTransition.tsx)** | Camera push/pull shift across 8 directional vectors with spring physics and combined alpha fade | `left`, `right`, `top`, `bottom`, `top-left`, `top-right`, `bottom-left`, `bottom-right` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/SLIDE_TRANSITION.md) |
| **[ZoomTransition](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/ZoomTransition.tsx)** | Scale in-place with spring overshoot, custom transform origins, and hyper-zoom through camera | `in`, `out`, `in-out`, `through`, `replace` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/ZOOM_TRANSITION.md) |
| **[WipeTransition](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/WipeTransition.tsx)** | Moving clipping boundary reveal across 8 patterns (directional, center-out, diagonal, radial) | `left-to-right`, `right-to-left`, `top-to-bottom`, `center-out`, `diagonal`, `radial` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/WIPE_TRANSITION.md) |
| **[MaskTransition](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/MaskTransition.tsx)** | Geometric masks (circle, rect, ellipse, polygon) and custom SVG paths with multi-origin expansion | `circle`, `rectangle`, `rounded-rect`, `ellipse`, `polygon`, `svg-path` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/MASK_TRANSITION.md) |
| **[SplitTransition](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/SplitTransition.tsx)** | Partitions content into multiple panels and strips with independent directional and staggered motion | `vertical-2`, `horizontal-2`, `quadrants`, `vertical-strips`, `horizontal-strips`, `grid-3x3` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/SPLIT_TRANSITION.md) |
| **[MorphTransition](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/MorphTransition.tsx)** | Equidistant point-sampled 2D SVG path morphing with cached point sampling and fill interpolation | `CircleToRect`, `RectToRounded`, `CircleToStar`, `TriangleToDiamond`, `HeartToCloud` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/MORPH_TRANSITION.md) |
| **[GlitchTransition](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/GlitchTransition.tsx)** | Digital glitch transition with RGB channel separation, horizontal slice displacement, and CRT scanlines | `glitch-in`, `glitch-out`, `replace`, `burst`, `continuous` | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/GLITCH_TRANSITION.md) |
| **[TransitionController](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/transitions/TransitionController.tsx)** | Centralized transition coordinator bridging transition types with scene timing and envelope calculations | Orchestrates all transition types for adjacent scenes or single envelopes | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/TRANSITION_CONTROLLER.md) |

### 2.6 Scene Library (`src/components/scenes/`)

| Scene Template | Description | Documentation |
|:---|:---|:---|
| **[SceneContainer](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/scenes/SceneContainer.tsx)** | Foundational scene wrapper standardizing dimensions, safe areas, background layers, and entrance/exit lifecycles | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/SCENE_CONTAINER.md) |
| **[HeroScene](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/scenes/HeroScene.tsx)** | High-impact commercial hero presentation pairing kinetic typography with hardware mockup framing | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/HERO_SCENE.md) |
| **[ProductShowcaseScene](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/scenes/ProductShowcaseScene.tsx)** | Product centerpiece presentation with continuous hover kinetics and spec detail callouts | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/PRODUCT_SHOWCASE_SCENE.md) |
| **[FeatureHighlightScene](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/scenes/FeatureHighlightScene.tsx)** | Feature spotlight scene highlighting capabilities with benefit callouts and visual annotations | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/FEATURE_HIGHLIGHT_SCENE.md) |
| **[TypographyScene](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/scenes/TypographyScene.tsx)** | Typography-driven scene turning kinetic text into primary visual centerpieces with dynamic keyword emphasis | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/TYPOGRAPHY_SCENE.md) |
| **[DeviceShowcaseScene](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/scenes/DeviceShowcaseScene.tsx)** | Multi-device digital product presentation showcasing responsive application interfaces across viewports | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/DEVICE_SHOWCASE_SCENE.md) |
| **[ComparisonScene](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/scenes/ComparisonScene.tsx)** | Dual-panel comparison presentation with synchronized reveals, center divider lines, and side-by-side highlighting | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/COMPARISON_SCENE.md) |
| **[CallToActionScene](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/scenes/CallToActionScene.tsx)** | High-conversion call-to-action scene pairing kinetic headlines with animated CTA buttons and interface badges | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/CALL_TO_ACTION_SCENE.md) |
| **[OutroScene](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/scenes/OutroScene.tsx)** | Memorable brand closing template featuring floating logo physics, tagline, website pills, and social handles | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/OUTRO_SCENE.md) |
| **[SceneSequence](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/scenes/SceneSequence.tsx)** | Sequential scene orchestrator supporting frame-based offsets, transition durations, and collision prevention | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/SCENE_SEQUENCE.md) |
| **[TimelineManager](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/scenes/TimelineManager.tsx)** | Centralized timeline calculation engine and multi-track inspector for scenes, transitions, and audio tracks | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/TIMELINE_MANAGER.md) |

### 2.7 Audio & Composition System (`src/compositions/` & `src/components/audio/`)

| Module | Description | Documentation |
|:---|:---|:---|
| **[AdvertisementComposition](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/compositions/advertisements/AdvertisementComposition.tsx)** | Primary Layer 4 composition container orchestrating sequenced scenes, audio tracks, and broadcast safe areas | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/ADVERTISEMENT_COMPOSITION.md) |
| **[AdvertisementPreview](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/compositions/advertisements/AdvertisementPreview.tsx)** | Unified studio preview entry point assembling multi-scene compositions, transitions, background score, and SFX | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/ADVERTISEMENT_PREVIEW.md) |
| **[GlobalAnimationConfig](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/compositions/advertisements/GlobalAnimationConfig.ts)** | Centralized configuration system controlling durations, easings, speed multipliers, and reduced-motion modes | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/GLOBAL_ANIMATION_CONFIG.md) |
| **[AudioTrack](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/audio/AudioTrack.tsx)** | Frame-accurate Remotion audio layer supporting fade envelopes, volume automation, and multi-track ducking | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/AUDIO_TRACK.md) |
| **[BackgroundMusic](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/audio/BackgroundMusic.tsx)** | Continuous background music abstraction with automated composition spanning, looping, and fade envelopes | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/BACKGROUND_MUSIC.md) |
| **[SoundEffect](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/src/components/audio/SoundEffect.tsx)** | Frame-accurate sound effect triggers synchronized with visual scene events, text reveals, and UI clicks | [Docs](file:///c:/Users/ASUS/Desktop/Belajar/Belajar5/remotion/akademi/docs/SOUND_EFFECT.md) |

---

## 3. Design Tokens & Motion Foundations

The framework's visual language is governed strictly through centralized design tokens:

- **Colors** (`src/styles/colors.ts`):
  - Dark neutrals: `Colors.dark.bgPrimary` (`#010409`), `Colors.dark.surface1` (`#0d1117`), `Colors.dark.border` (`#30363d`).
  - Surgical accents: `Colors.accent.cyan` (`#00f0ff`), `Colors.accent.electricViolet` (`#7928ca`), `Colors.accent.emerald` (`#10b981`).
  - Text hierarchy: `Colors.text.primary` (`#ffffff`), `Colors.text.secondary` (`#8b949e`), `Colors.text.tertiary` (`#484f58`).
- **Typography** (`src/styles/typography.ts`):
  - Sans: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif`.
  - Mono: `ui-monospace, "SF Mono", "Fira Code", monospace`.
  - Sizes: `hero` (96px), `h1` (64px), `h2` (48px), `h3` (32px), `body` (16px), `caption` (12px), `micro` (10px).
- **Motion & Springs** (`src/styles/motion.ts`):
  - Standard frame durations: `instant` (5f), `fast` (12f), `medium` (24f), `slow` (40f).
  - Spring physics presets:
    - `snappy`: `{ mass: 0.6, damping: 15, stiffness: 200 }` (responsive UI clicks, toggles).
    - `smooth`: `{ mass: 1.0, damping: 20, stiffness: 120 }` (scene transitions, card entrances).
    - `bouncy`: `{ mass: 0.8, damping: 10, stiffness: 160 }` (playful pops, notification reveals).
    - `stiff`: `{ mass: 0.4, damping: 12, stiffness: 300 }` (quick micro-interactions).
    - `gentle`: `{ mass: 1.2, damping: 24, stiffness: 80 }` (ambient floats, gentle tilts).

---

## 4. Developer Workflows & Commands

### Prerequisites
- Node.js `^20.19.0 || ^22.13.0 || >=24` (Node.js 24 recommended).
- npm v10+.

### Available Scripts

| Command | Action | Output / Description |
|:---|:---|:---|
| `npm run dev` | Launch Remotion Studio | Opens interactive UI at `http://localhost:3000` |
| `npm test` | Run Test Suite | Runs all 136 test suites (1,242 unit tests) via Node.js test runner |
| `npm run lint` | Linter & Typecheck | Runs `eslint src && tsc --noEmit` with zero errors |
| `npm run build` | Bundle Validation | Compiles and bundles all assets with Rspack into `build/` |
| `npm run upgrade` | Upgrade Remotion | Upgrades Remotion packages to the latest release |

### Video & Still Image Rendering

```bash
# Render a still keyframe (e.g., poster image at frame 0)
npx remotion still src/index.ts PlaceholderAd out/poster.jpeg --frame=0

# Render a still image of Motion Playground
npx remotion still src/index.ts MotionPlayground out/playground.png --frame=30

# Render commercial advertisement MP4 video
npx remotion render src/index.ts PlaceholderAd out/commercial-ad.mp4

# Render specific frame range (e.g. 0 to 60)
npx remotion render src/index.ts PlaceholderAd out/commercial-clip.mp4 --frames=0-60

# Render with controlled concurrency (recommended on low-RAM machines)
npx remotion render src/index.ts PlaceholderAd out/commercial-ad.mp4 --concurrency=1
```

---

## 5. Verification & Test Results

The framework has been comprehensively verified across unit tests, strict TypeScript compilation, ESLint, bundling, and keyframe rendering:

- **Unit Test Suite**: **136 test suites, 1,242 tests passing, 0 failures** (`tests/*.test.ts`).
  - Core Animation Utilities & Hooks: 100% passing.
  - Typography Suite: 100% passing.
  - UI Animation Suite: 100% passing.
  - Hardware Mockups Suite: 100% passing.
  - Vector Graphics & Shapes Suite: 100% passing.
  - Transitions Library (8 types + Controller): 100% passing.
  - Scene Templates (8 templates + Container + Sequence): 100% passing.
  - Timeline & Global Animation Config: 100% passing.
  - Audio Orchestration & Timeline Synchronization: 100% passing.
  - Motion Playground Integration: 100% passing (`tests/motion-playground.test.ts`).
  - Performance & Optimization Benchmarks: 100% passing (`tests/performance-benchmark.test.ts`).
- **TypeScript Typecheck**: **0 errors** (`tsc --noEmit`).
- **ESLint**: **0 errors** (`eslint src`).
- **Rspack Bundling**: **Successful build** (`build/`).
- **Render Output**: Verified keyframe rendering output (`out/test.jpeg`).

---

## 6. Known Limitations & Operational Considerations

1. **Strictly Frame-Based Execution**:
   - The framework does not support runtime CSS transitions, `setTimeout`, `setInterval`, or `requestAnimationFrame`. All animations must be computed via `useCurrentFrame()` and Remotion interpolation/spring primitives.
2. **Host RAM Requirements for Chromium Multi-Frame Video Rendering**:
   - Remotion CLI video rendering launches headless Chromium. Rendering 1080p/4K multi-minute videos at 60 FPS requires at least 4–8 GB of available physical system memory. In low-memory host environments (<1 GB free RAM), Chromium may fail with out-of-memory errors; in such environments, render still frames (`npx remotion still`) or use `--concurrency=1`.
3. **Loopback Socket Access in Sandbox Environments**:
   - In sandboxed terminal environments where network/loopback sockets are blocked, headless browser control via DevTools WebSocket requires running outside the sandbox boundary.
4. **SVG Filter Performance on Complex Geometries**:
   - Heavy Gaussian blur filters (such as atmospheric spotlights or continuous CRT glitch shaders) increase per-frame rasterization time in Chromium. Use the provided bounded caches (`PARSED_PATH_CACHE`, `MORPH_SAMPLE_CACHE`) and disable decorative filters when rendering at high speed.

---

## 7. Recommended Next Steps

1. **Campaign Template Expansion**:
   - Develop additional vertical (9:16) and square (1:1) ad presets for TikTok, Instagram Reels, and YouTube Shorts.
2. **3D Perspective & Depth Layer**:
   - Integrate Remotion 3D transforms (`figma-3d-transforms` / CSS 3D perspective / Three.js canvas) for interactive 3D device rotations.
3. **Remotion Lambda Cloud Rendering**:
   - Configure AWS Lambda rendering via `@remotion/lambda` for parallel cloud rendering of commercial video spots in seconds.
4. **Dynamic Data Ingestion & Localization**:
   - Connect headless CMS / JSON data feeds to automatically generate localized commercial variations across multiple languages, currencies, and device presets.
