/**
 * AudioTrack Component Prop Types and Contracts
 * Centralized data models, timing definitions, and volume contracts for Remotion audio layers.
 *
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing.ts';

/**
 * Dynamic volume calculator function receiving the current frame and rich metrics.
 */
export type AudioVolumeFunction = (frame: number, metrics: AudioVolumeMetrics) => number;

/**
 * Volume multiplier: either a static number (0.0 to 1.0+) or dynamic function.
 */
export type AudioVolumeProp = number | AudioVolumeFunction;

/**
 * Phase of an audio track at a given frame.
 */
export type AudioTrackPhase = 'pending' | 'fadeIn' | 'hold' | 'fadeOut' | 'complete';

/**
 * Frame-accurate volume metrics calculated at any specific point in time.
 */
export interface AudioVolumeMetrics {
  /** Global frame in the parent composition timeline */
  globalFrame: number;
  /** Local frame relative to this audio track's start (0 to durationInFrames - 1) */
  localFrame: number;
  /** Base volume resolved before fade envelopes are applied */
  baseVolume: number;
  /** Envelope fade multiplier strictly between 0.0 and 1.0 */
  fadeMultiplier: number;
  /** Final calculated volume after master volume, muting, and fades */
  finalVolume: number;
  /** Whether the track is actively in its entrance fade-in phase */
  isFadingIn: boolean;
  /** Whether the track is actively in its exit fade-out phase */
  isFadingOut: boolean;
  /** Whether the track is completely muted (volume = 0) */
  isMuted: boolean;
  /** Current lifecycle phase of the audio track */
  phase: AudioTrackPhase;
}

/**
 * Universal configuration for an audio track asset.
 */
export interface AudioTrackConfig {
  /** Audio source file path, URL, staticFile reference, or data URI */
  src: string;
  /** Optional unique identifier for logging, telemetry, and ducking */
  id?: string;
  /** Human-readable track label for timeline inspection and debugging */
  name?: string;
  /** Frame at which the audio track begins playing in the composition (default: 0) */
  startAtFrame?: number;
  /** Alias for startAtFrame */
  startFrame?: number;
  /** Total playback duration allocated in frames. If omitted, spans to composition end */
  durationInFrames?: number;
  /** Ending frame boundary in composition timeline (alternative to durationInFrames) */
  endFrame?: number;
  /** Trim offset into the source audio file in frames (starts playback from this offset) */
  trimBefore?: number;
  /** Alias for trimBefore (deprecated Remotion startFrom) */
  startFrom?: number;
  /** Base volume multiplier (0.0 to 1.0, or custom dynamic function, default: 1.0) */
  volume?: AudioVolumeProp;
  /** Playback speed multiplier (e.g. 0.5 to 2.0, default: 1.0) */
  playbackRate?: number;
  /** Preserves audio pitch when playbackRate is altered (default: true) */
  preservePitch?: boolean;
  /** Loops audio playback continuously throughout its allocated duration (default: false) */
  loop?: boolean;
  /** Explicit duration of the loop cycle in frames when looping custom segments */
  loopDurationInFrames?: number;
  /** Duration in frames for initial volume fade-in from 0 to target volume (default: 0) */
  fadeInFrames?: number;
  /** Duration in frames for final volume fade-out to 0 (default: 0) */
  fadeOutFrames?: number;
  /** Easing curve preset or function applied to the fade-in volume envelope (default: 'linear') */
  fadeInEasing?: EasingPresetName | EasingFunction;
  /** Easing curve preset or function applied to the fade-out volume envelope (default: 'linear') */
  fadeOutEasing?: EasingPresetName | EasingFunction;
  /** Completely mutes audio playback (volume = 0) while keeping timing active */
  muted?: boolean;
  /** Completely disables the audio track, preventing it from mounting */
  disabled?: boolean;
  /** Clamps track duration so it never overflows past composition end (default: true) */
  clampToComposition?: boolean;
  /** Synthesizer test tone frequency in Hz (supported natively by Remotion preview) */
  toneFrequency?: number;
  /** Arbitrary metadata attached to the track for telemetry and sequencing */
  metadata?: Record<string, unknown>;
}

/**
 * Validation result for an audio track configuration.
 */
export interface AudioTrackValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  effectiveStartFrame: number;
  effectiveDurationInFrames: number;
  effectiveEndFrame: number;
}

/**
 * Props for the AudioTrack component.
 */
export interface AudioTrackProps extends AudioTrackConfig {
  /** Master volume multiplier applied on top of track volume (default: 1.0) */
  masterVolume?: number;
  /** Displays a visual audio monitor HUD with VU meters and waveform telemetry */
  debug?: boolean;
  /** Displays track in Remotion Studio timeline (default: true) */
  showInTimeline?: boolean;
  /** Optional callback receiving computed volume metrics at every frame */
  onVolumeCalculated?: (metrics: AudioVolumeMetrics) => void;
  /** Optional children (visual visualizer or complementary elements) */
  children?: React.ReactNode;
}

/**
 * Configuration for audio ducking between speech and background music.
 */
export interface AudioDuckingConfig {
  /** Identifier of the primary voiceover / speech track that triggers ducking */
  triggerTrackId: string;
  /** Identifier of the background music / ambience track to duck */
  targetTrackId: string;
  /** Reduced volume multiplier during ducking (e.g. 0.2 for 20% background volume) */
  duckedVolume?: number;
  /** Transition ramp duration in frames when ducking engages or releases (default: 8) */
  rampDurationInFrames?: number;
}

/**
 * Props for the AudioTrackGroup component.
 */
export interface AudioTrackGroupProps {
  /** Collection of audio track configurations */
  tracks?: AudioTrackConfig[];
  /** Master volume multiplier applied across all tracks in the group */
  masterVolume?: number;
  /** Global mute toggle for the entire group */
  muted?: boolean;
  /** Global disable toggle for the entire group */
  disabled?: boolean;
  /** Optional ducking configurations between tracks */
  ducking?: AudioDuckingConfig | AudioDuckingConfig[];
  /** Displays a collective multi-track mixing console HUD */
  debug?: boolean;
  /** Declarative JSX children (supports <AudioTrack /> elements) */
  children?: React.ReactNode;
}
