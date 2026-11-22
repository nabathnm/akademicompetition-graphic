/**
 * SoundEffect Component Type Definitions & Contracts
 * Configuration interfaces for short event-driven sound effects, UI clicks,
 * whooshes, chimes, and multi-cue timelines.
 *
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing.ts';
import type { AudioVolumeMetrics, AudioVolumeProp } from './audioTrackTypes.ts';

/**
 * Standard built-in procedural sound effect presets.
 */
export type SoundEffectPresetName =
  | 'ui-click'
  | 'whoosh'
  | 'notification'
  | 'pop'
  | 'success'
  | 'error'
  | 'switch'
  | 'shutter'
  | 'impact';

/**
 * Metadata configuration for an SFX preset.
 */
export interface SoundEffectPresetConfig {
  /** Human-readable display label */
  name: string;
  /** Default allocated playback duration in frames at 30 FPS */
  durationInFrames: number;
  /** Test synthesizer frequency in Hz for deterministic audio emulation */
  toneFrequency: number;
  /** Default fade-in frames (usually 0 or very short for fast impact) */
  fadeInFrames?: number;
  /** Default fade-out frames (short decay for smooth sound release) */
  fadeOutFrames?: number;
  /** Suggested default volume multiplier (0.0 to 1.0) */
  defaultVolume?: number;
}

/**
 * Alignment point when synchronizing a sound effect with a scene transition.
 */
export type TransitionSoundAlignment = 'start' | 'midpoint' | 'end';

/**
 * Options for synchronizing a sound effect with a scene transition window.
 */
export interface TransitionSoundSyncOptions {
  /** Alignment of the sound effect relative to the transition window (default: 'midpoint') */
  alignment?: TransitionSoundAlignment;
  /** Additional frame offset added to the calculated alignment position */
  frameOffset?: number;
}

/**
 * Configuration for an individual sound effect event cue.
 */
export interface SoundEffectCueConfig {
  /** Audio source file path, URL, staticFile reference, or data URI */
  src?: string;
  /** Built-in procedural sound effect preset name */
  preset?: SoundEffectPresetName;
  /** Unique identifier for logging and telemetry */
  id?: string;
  /** Human-readable label for timeline debugging */
  name?: string;
  /** Target frame at which the sound effect is triggered (default: 0) */
  triggerFrame?: number;
  /** Alias for triggerFrame */
  startFrame?: number;
  /** Alias for triggerFrame */
  startAtFrame?: number;
  /** Additional frame delay offset added to the trigger frame (default: 0) */
  delayFrames?: number;
  /** Playback duration in frames. If omitted, uses preset default or 15 frames */
  durationInFrames?: number;
  /** Alternative end boundary in composition timeline */
  endFrame?: number;
  /** Base volume multiplier (0.0 to 1.0+, or dynamic function, default: 1.0) */
  volume?: AudioVolumeProp;
  /** Playback speed multiplier (e.g. 0.5 to 2.0, default: 1.0) */
  playbackRate?: number;
  /** Preserves audio pitch when playback speed changes (default: true) */
  preservePitch?: boolean;
  /** Trim offset into the source audio file in frames (starts playback from this offset) */
  trimBefore?: number;
  /** Alias for trimBefore */
  startFrom?: number;
  /** Entrance fade ramp duration in frames (default: 0) */
  fadeInFrames?: number;
  /** Alias for fadeInFrames */
  fadeInDuration?: number;
  /** Exit fade ramp / decay duration in frames (default: 0) */
  fadeOutFrames?: number;
  /** Alias for fadeOutFrames */
  fadeOutDuration?: number;
  /** Easing curve for fade-in ramp (default: 'linear') */
  fadeInEasing?: EasingPresetName | EasingFunction;
  /** Easing curve for fade-out decay (default: 'linear') */
  fadeOutEasing?: EasingPresetName | EasingFunction;
  /** Master volume multiplier (default: 1.0) */
  masterVolume?: number;
  /** Enables or disables the sound cue (default: true) */
  enabled?: boolean;
  /** Explicitly disables the sound cue */
  disabled?: boolean;
  /** Mutes the sound cue while keeping its timeline position active */
  muted?: boolean;
  /** Clamps duration so playback does not exceed composition end (default: true) */
  clampToComposition?: boolean;
  /** Synthesizer test tone frequency in Hz (supported natively by Remotion preview) */
  toneFrequency?: number;
  /** Displays a visual audio monitor HUD with VU meters and waveform telemetry */
  debug?: boolean;
  /** Displays sequence in Remotion Editor timeline (default: true) */
  showInTimeline?: boolean;
  /** Telemetry callback invoked every frame */
  onVolumeCalculated?: (metrics: AudioVolumeMetrics) => void;
}

/**
 * Props for the SoundEffect component.
 */
export interface SoundEffectProps extends SoundEffectCueConfig {
  /** Optional React children rendered alongside the audio (e.g. visual marker, flash overlay) */
  children?: React.ReactNode;
}

/**
 * Props for the SoundEffectGroup component orchestrating multiple sound effects.
 */
export interface SoundEffectGroupProps {
  /** Array of sound effect cues to schedule across the timeline */
  effects?: SoundEffectProps[];
  /** Master volume multiplier applied across all grouped sound effects (default: 1.0) */
  masterVolume?: number;
  /** Globally mutes all grouped sound effects (default: false) */
  muted?: boolean;
  /** Globally disables all grouped sound effects (default: false) */
  disabled?: boolean;
  /** Displays visual telemetry HUD across all active sound cues (default: false) */
  debug?: boolean;
  /** Optional React children */
  children?: React.ReactNode;
}
