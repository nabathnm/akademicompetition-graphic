# TimelineManager

`TimelineManager` is a reusable timing engine and inspection utility for the **Remotion Motion Graphics Framework** (Core Utility / Timing Layer). It provides a centralized, deterministic system so that scene sequences, transitions, and multi-track audio layers share consistent, frame-accurate timing information without floating-point drift.

---

## 1. Architectural Highlights

- **Integer Frames as Source of Truth**: All scheduling, boundaries, and spans are calculated in discrete integer frames (`Math.round`, `Math.floor`, `Math.max`), completely eliminating floating-point rounding errors and timing drift.
- **Multi-Track Synchronization**: Models three distinct timeline tracks:
  1. **Scenes**: Sequenced or absolute start/end frames, durations, and delay offsets.
  2. **Transitions**: Frame-accurate entrance and exit envelopes attached to parent scenes.
  3. **Audio Layers**: Multi-track audio synchronization with start offsets, durations, and linear fade-in/fade-out spans.
- **Pure Functions & Fluent Class**:
  - Pure functions for headless rendering, CI/CD, and mathematical evaluations (`calculateSceneTimeline`, `calculateAudioTimeline`, `inspectTimelineAtFrame`, etc.).
  - Object-oriented `TimelineManager` class providing an ergonomic, fluent inspection API.
- **Independent from Rendering**: Timeline math is completely decoupled from React hooks and DOM rendering, allowing timeline queries across Node.js unit tests, build scripts, and Remotion rendering processes.
- **First-Class SceneSequence Integration**: Directly converts `SceneSequenceItemConfig[]` into an integrated `TimelineManager` via `createTimelineManagerFromSequence()`.

---

## 2. Centralized Timeline Data Model

```typescript
export interface TimelineSpan {
  /** Starting frame offset (0-indexed integer) */
  startFrame: number;
  /** Ending frame boundary (exclusive integer: startFrame + durationInFrames) */
  endFrame: number;
  /** Total duration in integer frames */
  durationInFrames: number;
  /** Duration in fractional seconds at composition FPS */
  durationInSeconds: number;
  /** Start time in fractional seconds at composition FPS */
  startTimeInSeconds: number;
  /** End time in fractional seconds at composition FPS */
  endTimeInSeconds: number;
}

export interface TimelineSceneTrack extends TimelineSpan {
  id: string;
  name: string;
  sequenceIndex: number;
  delayBefore: number;
  delayAfter: number;
  allowOverlap: boolean;
  entranceTransition?: TimelineTransitionTrack;
  exitTransition?: TimelineTransitionTrack;
  metadata?: Record<string, unknown>;
}

export interface TimelineTransitionTrack extends TimelineSpan {
  id: string;
  type: 'fade' | 'slide' | 'zoom' | 'wipe' | 'none';
  direction?: 'left' | 'right' | 'top' | 'bottom';
  directionType: 'entrance' | 'exit';
  parentSceneId: string;
}

export interface TimelineAudioTrack extends TimelineSpan {
  id: string;
  name: string;
  src: string;
  volume: number | ((frame: number) => number);
  fadeInFrames: number;
  fadeOutFrames: number;
  loop: boolean;
}

export interface TimelineComposition {
  fps: number;
  totalDurationInFrames: number;
  totalDurationInSeconds: number;
  scenes: TimelineSceneTrack[];
  transitions: TimelineTransitionTrack[];
  audio: TimelineAudioTrack[];
}

export interface TimelineFrameInspection {
  frame: number;
  timeInSeconds: number;
  timecode: string; // SMPTE MM:SS:FF
  progress: number; // 0..1 across total composition
  activeScenes: TimelineSceneTrack[];
  primaryActiveScene: TimelineSceneTrack | null;
  activeTransitions: TimelineTransitionTrack[];
  activeAudio: TimelineAudioTrack[];
  isWithinBounds: boolean;
}
```

---

## 3. Core Pure Functions

### Time Conversions

```typescript
// Seconds to exact integer frames
secondsToFrames(seconds: number, fps: number): number;

// Frames to fractional seconds (rounded to 3 decimal places)
framesToSeconds(frames: number, fps: number): number;

// Formats frame to SMPTE timecode (MM:SS:FF)
formatTimecode(frames: number, fps: number): string;
```

### Timeline Calculations & Validation

```typescript
// Validates scene durations, FPS, audio tracks, and flags collisions
validateTimelineConfig(config: TimelineInputConfig): TimelineValidationResult;

// Calculates start, end, and transition ranges for scenes
calculateSceneTimeline(scenes: TimelineSceneInput[], options: { fps: number; defaultDelay?: number; allowOverlap?: boolean }): { scenes: TimelineSceneTrack[]; transitions: TimelineTransitionTrack[] };

// Calculates start, end, and duration ranges for audio tracks
calculateAudioTimeline(audio: TimelineAudioInput | TimelineAudioInput[] | undefined, totalDurationInFrames: number, fps: number): TimelineAudioTrack[];

// Builds complete composition data structure
buildTimelineComposition(config: TimelineInputConfig): TimelineComposition;

// Inspects multi-track state at any specific frame
inspectTimelineAtFrame(composition: TimelineComposition, frame: number): TimelineFrameInspection;
```

---

## 4. `TimelineManager` Class API

```typescript
import { TimelineManager } from '@/utils/timing/TimelineManager';

const manager = new TimelineManager({
  fps: 30,
  scenes: [
    {
      id: 'hero',
      name: 'Brand Intro',
      durationInFrames: 60,
      entranceTransition: { type: 'fade', durationInFrames: 15 },
    },
    {
      id: 'cta',
      name: 'Closing CTA',
      durationInFrames: 60,
      delayBefore: 10,
    },
  ],
  audio: {
    src: 'audio/bgm.mp3',
    fadeInFrames: 15,
    fadeOutFrames: 15,
  },
});

// Queries
manager.getDurationInFrames();     // 130
manager.getDurationInSeconds();    // 4.333
manager.getFps();                  // 30
manager.getScenes();               // TimelineSceneTrack[]
manager.getTransitions();          // TimelineTransitionTrack[]
manager.getAudioTracks();          // TimelineAudioTrack[]

// Frame Inspection
const inspection = manager.inspectAt(25);
console.log(inspection.timecode);           // "00:00:25"
console.log(inspection.primaryActiveScene); // { id: "hero", startFrame: 0, endFrame: 60 }

// Unit Conversion
manager.toSeconds(90);             // 3.0
manager.toFrames(2.5);             // 75
manager.format(75);                // "00:02:15"
```

---

## 5. Usage Examples

### Example 1: Basic Sequential Ad Timeline

```typescript
import { TimelineManager } from '@/utils/timing/TimelineManager';

const timeline = new TimelineManager({
  fps: 30,
  scenes: [
    { id: 'hook', durationInFrames: 60 },
    { id: 'features', durationInFrames: 90 },
    { id: 'cta', durationInFrames: 60 },
  ],
});

console.log(`Total duration: ${timeline.getDurationInSeconds()}s (${timeline.getDurationInFrames()} frames)`);
// Total duration: 7s (210 frames)
```

---

### Example 2: Delays, Gaps, and Transitions

```typescript
const timeline = new TimelineManager({
  fps: 30,
  scenes: [
    {
      id: 'scene-1',
      durationInFrames: 45,
      entranceTransition: { type: 'fade', durationInFrames: 15 },
    },
    {
      id: 'scene-2',
      durationInFrames: 60,
      delayBefore: 15, // 15f gap between scene 1 and scene 2
      entranceTransition: { type: 'slide', direction: 'left', durationInFrames: 15 },
      exitTransition: { type: 'fade', durationInFrames: 15 },
    },
  ],
});

// At frame 50 (inside 15f gap):
const gapState = timeline.inspectAt(50);
console.log(gapState.activeScenes.length); // 0 (gap detected)
```

---

### Example 3: Integration with `SceneSequence`

```tsx
import { SceneSequence } from '@/components/scenes/SceneSequence';
import { createTimelineManagerFromSequence } from '@/components/scenes/sceneSequenceStyle';
import { HeroScene } from '@/components/scenes/HeroScene';
import { CallToActionScene } from '@/components/scenes/CallToActionScene';

const scenes = [
  { id: 'hero', durationInFrames: 60, component: <HeroScene headline="Hello" /> },
  { id: 'cta', durationInFrames: 60, delayBefore: 10, component: <CallToActionScene headline="Action" /> },
];

// Generate unified timeline manager
const timeline = createTimelineManagerFromSequence(scenes, { fps: 30 });

export const MySequence: React.FC = () => {
  return (
    <div>
      <div>Total Run: {timeline.format(timeline.getDurationInFrames())}</div>
      <SceneSequence scenes={scenes} />
    </div>
  );
};
```

---

## 6. Diagnostic Validation Rules

| Rule | Severity | Message | Remediation |
| :--- | :--- | :--- | :--- |
| Non-positive FPS | Error | `FPS must be a positive number greater than 0.` | Pass integer `fps > 0` (e.g. 24, 30, 60). |
| Missing Scene ID | Error | `Scene at index X is missing a required unique 'id'.` | Provide a non-empty string `id` for each scene. |
| Duplicate Scene ID | Error | `Duplicate scene ID detected: 'X'. IDs must be strictly unique.` | Ensure unique scene identifiers. |
| Non-positive Duration | Error | `Scene 'X' has invalid durationInFrames: 0. Must be > 0.` | Ensure `durationInFrames` is a positive number. |
| Negative Delay | Error | `Scene 'X' has negative delayBefore: -5` | Delays must be `>= 0`. |
| Missing Audio `src` | Error | `Audio track at index X is missing a required 'src' URL or file path.` | Provide valid audio file path or URL. |
| Transition Exceeds Scene | Warning | `Scene 'X' transition duration sum (40f) exceeds scene lifespan (30f).` | Reduce transition durations or lengthen scene. |
| Accidental Overlap | Warning | `Scene 'X' startFrame (30) overlaps with previous scene end (60). Overlap is prevented.` | Set `allowOverlap: true` if overlap is intentional. |
