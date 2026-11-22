/**
 * Advertisement Composition Layer Types
 * Core contracts for commercial ad compositions, multi-scene timelines, and audio tracks.
 * Layer 4 of the Motion Graphics Framework.
 */

import React from 'react';
import { VideoResolution } from '../config/video.ts';
import type { EasingFunction, EasingPresetName } from '../utils/animation/easing.ts';
import type {
  ScenePadding,
  SceneTransitionType,
  SceneTransitionConfig,
  SceneItemRenderProps,
  SceneSequenceItemConfig,
  ScheduledSceneItem,
  SceneSequenceValidationResult,
  SequenceScheduleOptions,
  SceneSequenceProps,
  SceneSequenceItemProps,
} from '../components/scenes/types.ts';
import type { SoundEffectProps } from '../components/audio/soundEffectTypes.ts';
import type { BackgroundMusicProps } from '../components/audio/backgroundMusicTypes.ts';
import type { GlobalAnimationConfig } from '../config/animation/animationConfigTypes.ts';

export type {
  ScenePadding,
  SceneTransitionType,
  SceneTransitionConfig,
  SceneItemRenderProps,
  SceneSequenceItemConfig,
  ScheduledSceneItem,
  SceneSequenceValidationResult,
  SequenceScheduleOptions,
  SceneSequenceProps,
  SceneSequenceItemProps,
  SoundEffectProps,
  BackgroundMusicProps,
  GlobalAnimationConfig,
};

export interface SceneSequenceItem {
  sceneId: string;
  durationInFrames: number;
  transitionType?: string;
  transitionDurationFrames?: number;
}

export interface AudioTrackConfig {
  /** Audio source file path or URL */
  src: string;
  /** Volume multiplier (0 to 1, or dynamic frame function, default: 1) */
  volume?: number | ((frame: number) => number);
  /** Frame at which the audio track begins playing (default: 0) */
  startAtFrame?: number;
  /** Playback duration in frames */
  durationInFrames?: number;
  /** Ending frame boundary in composition timeline */
  endFrame?: number;
  /** Number of frames for initial volume fade-in (default: 0) */
  fadeInFrames?: number;
  /** Number of frames for final volume fade-out (default: 0) */
  fadeOutFrames?: number;
  /** Loop audio playback if shorter than composition */
  loop?: boolean;
  /** Optional audio track title or description for telemetry */
  name?: string;
}

export interface CommercialAdConfig {
  id: string;
  title: string;
  client?: string;
  resolution: VideoResolution;
  totalDurationInFrames: number;
  scenes: SceneSequenceItem[];
  audio?: AudioTrackConfig;
}

export interface PlaceholderAdProps {
  campaignName?: string;
  tagline?: string;
}

/* ========================================================================= */
/* AdvertisementComposition Types                                            */
/* ========================================================================= */

export type SceneItemConfig = SceneSequenceItemConfig;
export type SceneScheduleItem = ScheduledSceneItem;

export interface AdvertisementAnimationConfig extends GlobalAnimationConfig {
  /** Global stagger delay multiplier for child scenes */
  staggerDelay?: number;
  /** Global entrance animation preset */
  enterAnimation?: 'fade' | 'slide' | 'scale' | 'zoom' | 'none';
  /** Global exit animation preset */
  exitAnimation?: 'fade' | 'slide' | 'scale' | 'zoom' | 'none';
  /** Motion easing override */
  easing?: EasingPresetName | EasingFunction;
}

export interface AdvertisementCompositionProps {
  /** Composition width in pixels (defaults to VideoPresets.LANDSCAPE_1080P.width or video config) */
  width?: number;
  /** Composition height in pixels (defaults to VideoPresets.LANDSCAPE_1080P.height or video config) */
  height?: number;
  /** Composition frame rate in frames per second (default: 30) */
  fps?: number;
  /** Total duration in frames (auto-calculated from scenes sum if omitted) */
  durationInFrames?: number;
  /** Primary CSS background (gradient, pattern, or solid) */
  background?: string;
  /** Solid background color override (default: Colors.dark.bgPrimary) */
  backgroundColor?: string;
  /** Custom background React element rendered behind all scenes (e.g. particle canvas, ambient video) */
  backgroundContent?: React.ReactNode;
  /** Array of sequenced scene items */
  scenes?: SceneItemConfig[];
  /** Global animation configuration passed to or coordinating scenes */
  animation?: AdvertisementAnimationConfig;
  /** Single audio track or multiple layered audio tracks */
  audio?: AudioTrackConfig | AudioTrackConfig[];
  /** Optional background music soundtrack spanning the composition */
  backgroundMusic?: BackgroundMusicProps;
  /** Optional sound effects array placed across the advertisement timeline */
  soundEffects?: SoundEffectProps[];
  /** Broadcast safe area margin (boolean for default 60px or custom pixel number) */
  safeArea?: boolean | number;
  /** Inner content padding */
  padding?: ScenePadding;
  /** Visual telemetry debugging overlay (safe areas, frame counters, scene timeline) */
  debug?: boolean;
  /** Unique composition identifier for telemetry and profiling */
  compositionId?: string;
  /** Custom inline style overrides */
  style?: React.CSSProperties;
  /** Custom CSS class name */
  className?: string;
  /** Direct React children (alternative to or complementary to scenes array) */
  children?: React.ReactNode;
}

export interface AdvertisementValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
