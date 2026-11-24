/**
 * Social Media Advertisement Template Types & Safe Areas
 * Layer 4 of the Motion Graphics Framework.
 */

import type {
  AdvertisementAnimationConfig,
  AudioTrackConfig,
  SceneItemConfig,
} from '../../types.ts';
import type { BackgroundMusicProps } from '../../../components/audio/backgroundMusicTypes.ts';
import type { SoundEffectProps } from '../../../components/audio/soundEffectTypes.ts';

export type SocialPlatformType = 'reels' | 'tiktok' | 'shorts' | 'general';

export interface SocialMediaSafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const SOCIAL_SAFE_AREAS: Record<SocialPlatformType, SocialMediaSafeAreaInsets> = {
  reels: {
    top: 140, // Instagram top header & camera notch
    bottom: 260, // Account name, audio pill, caption
    left: 48,
    right: 120, // Like, comment, share action bar
  },
  tiktok: {
    top: 150, // Following/For You tabs
    bottom: 300, // Username, caption, sound disc
    left: 48,
    right: 130, // Avatar, like, comment, bookmark, share
  },
  shorts: {
    top: 120, // Search & camera
    bottom: 240, // Channel info, subscribe button
    left: 48,
    right: 110, // Like, dislike, comment, remix, share
  },
  general: {
    top: 140,
    bottom: 280,
    left: 54,
    right: 120,
  },
};

export interface SocialMediaAdvertisementTemplateProps {
  /** Unique composition identifier */
  id?: string;
  /** Campaign title for diagnostics */
  title?: string;
  /** Canvas width in pixels (default: 1080) */
  width?: number;
  /** Canvas height in pixels (default: 1920) */
  height?: number;
  /** Framerate (default: 30) */
  fps?: number;
  /** Total duration in frames (calculated from scenes if omitted) */
  durationInFrames?: number;
  /** Target social media platform for safe area calculations */
  platform?: SocialPlatformType;
  /** Sequenced scene timeline configuration */
  scenes: SceneItemConfig[];
  /** Continuous background music layer */
  backgroundMusic?: BackgroundMusicProps;
  /** Synchronized sound effect cues */
  soundEffects?: SoundEffectProps[];
  /** Additional raw audio tracks */
  audio?: AudioTrackConfig | AudioTrackConfig[];
  /** Global animation configuration override */
  animation?: AdvertisementAnimationConfig;
  /** Toggle ambient background particle layer */
  showBackgroundParticles?: boolean;
  /** Particle density count */
  particleCount?: number;
  /** Primary background color or CSS gradient */
  background?: string;
  /** Solid background color fallback */
  backgroundColor?: string;
  /** Toggle visual debug safe area boundaries and telemetry */
  debug?: boolean;
  /** Custom inline style */
  style?: React.CSSProperties;
  /** Optional class name */
  className?: string;
}
