/**
 * AdvertisementPreview Component Type Definitions & Contracts
 * High-level orchestration contracts for previewing assembled advertisement
 * compositions with scenes, transitions, audio tracks, and telemetry in Remotion Studio.
 *
 * Layer 4 of the Motion Graphics Framework.
 */

import React from 'react';
import type {
  AudioTrackConfig,
  ScenePadding,
} from '../types.ts';
import type {
  SceneSequenceItemConfig,
  SceneTransitionType,
} from '../../components/scenes/types.ts';
import type { BackgroundMusicProps } from '../../components/audio/backgroundMusicTypes.ts';
import type { SoundEffectProps } from '../../components/audio/soundEffectTypes.ts';
import type { GlobalAnimationConfig } from '../../config/animation/animationConfigTypes.ts';
import type { EasingFunction, EasingPresetName } from '../../utils/animation/easing.ts';

/**
 * Universal transition configuration defaults applied across scenes in the preview.
 */
export interface PreviewTransitionSettings {
  /** Default transition type applied between adjacent scenes (default: 'fade') */
  defaultType?: SceneTransitionType;
  /** Default transition duration in frames (default: 15) */
  defaultDurationInFrames?: number;
  /** Default easing curve for transitions */
  defaultEasing?: EasingPresetName | EasingFunction;
}

/**
 * Props for the AdvertisementPreview component.
 */
export interface AdvertisementPreviewProps {
  /** Canvas width in pixels (defaults to VideoPresets.LANDSCAPE_1080P.width = 1920) */
  width?: number;
  /** Canvas height in pixels (defaults to VideoPresets.LANDSCAPE_1080P.height = 1080) */
  height?: number;
  /** Frame rate in frames per second (default: 30) */
  fps?: number;
  /** Explicit total composition duration in frames. If omitted, calculated from scenes and transitions */
  durationInFrames?: number;
  /** CSS background gradient or pattern */
  background?: string;
  /** Solid background color override (default: Colors.dark.bgPrimary) */
  backgroundColor?: string;
  /** Custom background React node rendered behind all scenes */
  backgroundContent?: React.ReactNode;
  /** Array of sequenced scene items conforming to the Scene Library architecture */
  scenes?: SceneSequenceItemConfig[];
  /** Default transition settings applied to scenes missing explicit transitions */
  transitionSettings?: PreviewTransitionSettings;
  /** Centralized global animation configuration (speedMultiplier, reducedMotion, defaultDuration) */
  animation?: GlobalAnimationConfig;
  /** Specialized background music track configuration */
  backgroundMusic?: BackgroundMusicProps;
  /** Sound effects array scheduled across the advertisement timeline */
  soundEffects?: SoundEffectProps[];
  /** Additional raw audio tracks */
  audio?: AudioTrackConfig | AudioTrackConfig[];
  /** Broadcast safe area boundary guide (default: true) */
  safeArea?: boolean | number;
  /** Inner layout padding */
  padding?: ScenePadding;
  /** Enables development-time inspection overlay, active scene info, and error banners (default: false) */
  debug?: boolean;
  /** Displays a visual timeline ruler bar with playhead scrub position at the bottom (default: false) */
  showTimeline?: boolean;
  /** Title or campaign label displayed in preview telemetry */
  title?: string;
  /** Unique composition identifier for profiling and logging */
  compositionId?: string;
  /** Inline style overrides for the outer preview viewport */
  style?: React.CSSProperties;
  /** CSS class name */
  className?: string;
  /** Direct React children (alternative or complement to scenes array) */
  children?: React.ReactNode;
}

/**
 * Development-time validation report for the preview configuration.
 */
export interface AdvertisementPreviewValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  computedTotalDuration: number;
  sceneCount: number;
  hasAudio: boolean;
}
