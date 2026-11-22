/**
 * Audio and Timeline Synchronization Mathematical Utilities & Scenario Definitions
 * Layer 3 / Core Utility of the Motion Graphics Framework.
 *
 * Provides pure mathematical helpers for:
 * - Frame-accurate audio timeline coverage calculations
 * - Overlap and clipping risk detection
 * - Synchronization alignment verification across visual scenes and audio tracks
 * - Deterministic VU meter level simulations
 * - Presets for all 8 required integration scenarios
 */

import { Colors } from '../../styles/colors.ts';

export type AudioSyncScenarioId =
  | 'bgm-full'
  | 'sfx-text'
  | 'sfx-transition'
  | 'sfx-overlap'
  | 'bgm-fade'
  | 'multi-audio-stagger'
  | 'no-audio'
  | 'audio-disabled';

export interface AudioSyncScenarioMeta {
  id: AudioSyncScenarioId;
  title: string;
  subtitle: string;
  categoryTags: string[];
  description: string;
}

export const AUDIO_SYNC_SCENARIOS: AudioSyncScenarioMeta[] = [
  {
    id: 'bgm-full',
    title: 'Background Music Spanning Composition',
    subtitle: 'Full-Span Soundtrack with Seamless Looping',
    categoryTags: ['BackgroundMusic', 'Timeline'],
    description:
      'Continuous background music bed automatically spanning 100% of the composition duration with looping and end-of-composition fade.',
  },
  {
    id: 'sfx-text',
    title: 'Sound Effects Synchronized with Text Reveals',
    subtitle: 'Kinetic Word & Character Audio Cues',
    categoryTags: ['SoundEffect', 'Typography'],
    description:
      'Procedural sound cues synchronized frame-by-frame with word reveals and typing stagger offsets without audio drift.',
  },
  {
    id: 'sfx-transition',
    title: 'Sound Effects Synchronized with Transitions',
    subtitle: 'Scene Boundary Audio Alignment',
    categoryTags: ['SoundEffect', 'Transitions', 'Scenes'],
    description:
      'Directional whoosh effects aligned with the exact midpoint of scene transition windows between HeroScene and ProductShowcaseScene.',
  },
  {
    id: 'sfx-overlap',
    title: 'Multiple Overlapping Sound Effects',
    subtitle: 'High-Density Polyphonic Event Triggering',
    categoryTags: ['SoundEffect', 'AudioTrack'],
    description:
      'Simultaneous and staggered sound effects (click, whoosh, notification chime) overlapping cleanly without clipping or resource exhaustion.',
  },
  {
    id: 'bgm-fade',
    title: 'Background Music Fade-In & Fade-Out',
    subtitle: 'Deterministic Fade Envelopes',
    categoryTags: ['BackgroundMusic', 'Envelopes'],
    description:
      'Deterministic volume automation ramping up smoothly from frame 0 and resolving to complete silence exactly at the final composition frame.',
  },
  {
    id: 'multi-audio-stagger',
    title: 'Audio Tracks with Different Start Frames',
    subtitle: 'Multi-Track Layering & Voiceover Ducking',
    categoryTags: ['AudioTrack', 'BackgroundMusic', 'Ducking'],
    description:
      'Background music at frame 0, dialogue/voiceover entering at frame 30 with automatic music ducking, and ambient layers entering at frame 60.',
  },
  {
    id: 'no-audio',
    title: 'Composition with No Audio',
    subtitle: 'Silent Execution Safety & Zero Overhead',
    categoryTags: ['AdvertisementComposition', 'Safety'],
    description:
      'Clean composition execution with empty audio configurations, ensuring 0 audio elements rendered and 0 background overhead.',
  },
  {
    id: 'audio-disabled',
    title: 'Composition with Audio Disabled',
    subtitle: 'Master & Track Level Mute Controls',
    categoryTags: ['AudioTrack', 'MasterControl'],
    description:
      'Configured audio tracks and sound effects bypassed via disabled={true}, maintaining timeline telemetry while producing zero audio output.',
  },
];

export interface TrackTimingBounds {
  id: string;
  name?: string;
  startFrame: number;
  durationInFrames: number;
  endFrame: number;
  volume: number;
  disabled?: boolean;
}

/**
 * Calculates timeline coverage statistics across all active audio tracks.
 */
export function calculateTimelineAudioCoverage(
  compositionDuration: number,
  tracks: TrackTimingBounds[],
): {
  totalCompositionFrames: number;
  coveredFrames: number;
  coveragePercentage: number;
  hasGaps: boolean;
  gapCount: number;
  overlapFrames: number;
} {
  const safeDuration = Math.max(1, compositionDuration);
  const activeTracks = tracks.filter((t) => !t.disabled && t.durationInFrames > 0);

  // Bitset / boolean array of occupied frames
  const frameOccupied = new Uint8Array(safeDuration);
  let overlapFrames = 0;

  for (const track of activeTracks) {
    const start = Math.max(0, Math.min(safeDuration, track.startFrame));
    const end = Math.max(0, Math.min(safeDuration, track.endFrame));

    for (let f = start; f < end; f++) {
      if (frameOccupied[f] > 0) {
        overlapFrames++;
      }
      frameOccupied[f] = 1;
    }
  }

  let coveredFrames = 0;
  let gapCount = 0;
  let inGap = false;

  for (let f = 0; f < safeDuration; f++) {
    if (frameOccupied[f] === 1) {
      coveredFrames++;
      inGap = false;
    } else {
      if (!inGap) {
        gapCount++;
        inGap = true;
      }
    }
  }

  const coveragePercentage = Number(((coveredFrames / safeDuration) * 100).toFixed(1));

  return {
    totalCompositionFrames: safeDuration,
    coveredFrames,
    coveragePercentage,
    hasGaps: gapCount > 0,
    gapCount,
    overlapFrames,
  };
}

/**
 * Analyzes audio tracks for potential clipping caused by simultaneous high-volume signals.
 */
export function detectAudioCollisions(
  tracks: TrackTimingBounds[],
  compositionDuration: number,
): {
  hasClippingRisk: boolean;
  maxCombinedVolume: number;
  clippingFrames: number;
  peakFrame: number;
} {
  const safeDuration = Math.max(1, compositionDuration);
  const activeTracks = tracks.filter((t) => !t.disabled && t.durationInFrames > 0);

  let maxCombinedVolume = 0;
  let clippingFrames = 0;
  let peakFrame = 0;

  for (let f = 0; f < safeDuration; f++) {
    let combinedVolumeAtFrame = 0;

    for (const track of activeTracks) {
      if (f >= track.startFrame && f < track.endFrame) {
        combinedVolumeAtFrame += track.volume;
      }
    }

    if (combinedVolumeAtFrame > maxCombinedVolume) {
      maxCombinedVolume = combinedVolumeAtFrame;
      peakFrame = f;
    }

    if (combinedVolumeAtFrame > 1.0) {
      clippingFrames++;
    }
  }

  return {
    hasClippingRisk: maxCombinedVolume > 1.0,
    maxCombinedVolume: Number(maxCombinedVolume.toFixed(2)),
    clippingFrames,
    peakFrame,
  };
}

/**
 * Validates audio timeline synchronization against visual scenes.
 */
export function validateAudioTimelineSynchronization(params: {
  compositionDuration: number;
  scenes?: Array<{ id: string; startFrame: number; durationInFrames: number; endFrame: number }>;
  tracks: TrackTimingBounds[];
}): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const { compositionDuration, scenes = [], tracks } = params;
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const track of tracks) {
    // Start frame checks
    if (track.startFrame < 0) {
      errors.push(`Audio track '${track.id}' has negative startFrame: ${track.startFrame}`);
    }
    if (track.startFrame >= compositionDuration) {
      warnings.push(
        `Audio track '${track.id}' starts at frame ${track.startFrame}, which is at or past composition duration (${compositionDuration}f). It will not be audible.`,
      );
    }

    // End frame checks
    if (track.endFrame > compositionDuration) {
      warnings.push(
        `Audio track '${track.id}' ends at frame ${track.endFrame}, extending beyond composition duration (${compositionDuration}f). Playback will be truncated.`,
      );
    }
  }

  // Cross-reference with scenes if provided
  if (scenes.length > 0) {
    const scenesEnd = Math.max(...scenes.map((s) => s.endFrame));
    const audioPlayingAfterScenes = tracks.filter((t) => t.startFrame >= scenesEnd && !t.disabled);

    if (audioPlayingAfterScenes.length > 0) {
      warnings.push(
        `${audioPlayingAfterScenes.length} audio track(s) start after all visual scenes have completed.`,
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Pure deterministic calculation of simulated VU meter bars and volume levels.
 * Operates purely on currentFrame without browser Web Audio API.
 */
export function calculateSimulatedVUMeterLevels(
  currentFrame: number,
  tracks: TrackTimingBounds[],
  barCount = 6,
): Array<{
  trackId: string;
  name: string;
  isActive: boolean;
  effectiveVolume: number;
  bars: number[];
  color: string;
}> {
  const trackColors = [
    Colors.accent.cyan,
    Colors.accent.emerald,
    Colors.accent.electricViolet,
    '#F59E0B',
    '#EC4899',
  ];

  return tracks.map((track, trackIdx) => {
    const isActive =
      !track.disabled &&
      currentFrame >= track.startFrame &&
      currentFrame < track.endFrame;

    const effectiveVolume = isActive ? track.volume : 0;
    const color = trackColors[trackIdx % trackColors.length];

    const bars: number[] = [];
    for (let b = 0; b < barCount; b++) {
      if (!isActive) {
        bars.push(2);
      } else {
        // Deterministic pseudo-sine wave based on frame and bar index
        const wave = Math.sin(currentFrame * 0.35 + b * 1.1 + trackIdx) * 0.3 + 0.7;
        const barHeight = Math.max(3, Math.round(effectiveVolume * wave * 28));
        bars.push(barHeight);
      }
    }

    return {
      trackId: track.id,
      name: track.name ?? track.id,
      isActive,
      effectiveVolume,
      bars,
      color,
    };
  });
}
