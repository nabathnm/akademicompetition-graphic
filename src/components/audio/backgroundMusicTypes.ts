/**
 * BackgroundMusic Component Type Definitions & Contracts
 * Specialized configuration models for continuous background music,
 * looping rhythm stems, and keyframed volume envelopes.
 *
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing.ts';
import type {
  AudioDuckingConfig,
  AudioVolumeMetrics,
  AudioVolumeProp,
} from './audioTrackTypes.ts';

/**
 * A volume keyframe representing a target volume at a specific frame in the timeline.
 */
export interface VolumeKeyframe {
  /** Global frame (or local frame if keyframesRelative is true) where this target volume is reached */
  frame: number;
  /** Volume multiplier at this keyframe (0.0 to 1.0+, where 1.0 represents nominal volume) */
  volume: number;
  /** Optional easing curve applied when transitioning from the previous keyframe to this one */
  easing?: EasingPresetName | EasingFunction;
}

/**
 * Props for the specialized BackgroundMusic component.
 */
export interface BackgroundMusicProps {
  /** Audio source file path, URL, staticFile reference, or data URI */
  src?: string;
  /** Optional unique identifier for logging and telemetry (default: 'background-music') */
  id?: string;
  /** Human-readable track label for timeline inspection and debugging (default: 'Background Music') */
  name?: string;
  /** Frame at which the background music starts playing (default: 0) */
  startAtFrame?: number;
  /** Alias for startAtFrame (default: 0) */
  startFrame?: number;
  /** Total playback duration in frames. If omitted, spans to composition end */
  durationInFrames?: number;
  /** Explicit end frame boundary in composition timeline (alternative to durationInFrames) */
  endFrame?: number;
  /** Trim offset into the source audio file in frames (starts playback from this offset) */
  trimBefore?: number;
  /** Alias for trimBefore */
  startFrom?: number;
  /** Base nominal volume multiplier (0.0 to 1.0, or custom dynamic function, default: 0.7) */
  volume?: AudioVolumeProp;
  /** Duration in frames for initial volume fade-in from 0 (default: 0) */
  fadeInFrames?: number;
  /** Alias for fadeInFrames */
  fadeInDuration?: number;
  /** Duration in frames for final volume fade-out to 0 (default: 0) */
  fadeOutFrames?: number;
  /** Alias for fadeOutFrames */
  fadeOutDuration?: number;
  /** Easing curve applied to the fade-in volume envelope (default: 'easeInOutCubic') */
  fadeInEasing?: EasingPresetName | EasingFunction;
  /** Easing curve applied to the fade-out volume envelope (default: 'easeInOutCubic') */
  fadeOutEasing?: EasingPresetName | EasingFunction;
  /**
   * When true (default: true), automatically anchors the fade-out to the composition's end frame
   * when durationInFrames is omitted.
   */
  fadeToCompositionEnd?: boolean;
  /**
   * Loops audio playback continuously throughout the allocated duration (default: true).
   */
  loop?: boolean;
  /**
   * Explicit loop chunk duration in frames when looping a short rhythmic sample or motif.
   */
  loopDurationInFrames?: number;
  /**
   * Optional volume keyframes for automated volume choreography across time.
   * Enables dynamic volume dips during narration or swells during climactic scenes.
   */
  keyframes?: VolumeKeyframe[];
  /** Alias for keyframes */
  volumeKeyframes?: VolumeKeyframe[];
  /**
   * When true, keyframe frame values are treated as relative to startFrame (0 = music start).
   * When false (default), keyframe frame values represent absolute composition frames.
   */
  keyframesRelative?: boolean;
  /** Playback speed multiplier (e.g. 0.5 to 2.0, default: 1.0) */
  playbackRate?: number;
  /** Preserves audio pitch when playback speed is altered (default: true) */
  preservePitch?: boolean;
  /** Master volume multiplier applied on top of track volume (default: 1.0) */
  masterVolume?: number;
  /** High-level enabled toggle (default: true). Setting to false disables track */
  enabled?: boolean;
  /** Disables the music track completely (default: false) */
  disabled?: boolean;
  /** Mutes audio playback (volume = 0) while keeping timing active (default: false) */
  muted?: boolean;
  /** Clamps track duration so it never overflows past composition end (default: true) */
  clampToComposition?: boolean;
  /** Synthesizer test tone frequency in Hz (supported natively by Remotion preview) */
  toneFrequency?: number;
  /** Displays a visual audio monitor HUD with VU meters and waveform telemetry (default: false) */
  debug?: boolean;
  /** Displays track sequence in Remotion Editor timeline (default: true) */
  showInTimeline?: boolean;
  /** Optional cross-track ducking configuration */
  ducking?: AudioDuckingConfig | AudioDuckingConfig[];
  /** Callback fired every frame with live volume metrics */
  onVolumeCalculated?: (metrics: AudioVolumeMetrics) => void;
  /** Optional React children rendered alongside the audio (e.g. audio visualizer, waveform overlay) */
  children?: React.ReactNode;
}
