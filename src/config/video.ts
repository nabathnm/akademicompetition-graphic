/**
 * Video Configurations and Presets
 * Standardized video resolutions, aspect ratios, and frame rates for commercial ad productions.
 */

export interface VideoResolution {
  name: string;
  width: number;
  height: number;
  fps: number;
  aspectRatio: string;
  description: string;
}

export const VideoPresets = {
  // Standard 16:9 Landscape (YouTube, TV, Web)
  LANDSCAPE_1080P: {
    name: '1080p Landscape',
    width: 1920,
    height: 1080,
    fps: 30,
    aspectRatio: '16:9',
    description: 'Full HD horizontal video for commercial broadcast and web',
  },
  LANDSCAPE_4K: {
    name: '4K Landscape',
    width: 3840,
    height: 2160,
    fps: 30,
    aspectRatio: '16:9',
    description: 'Ultra HD horizontal video for premium commercial delivery',
  },
  LANDSCAPE_60FPS: {
    name: '1080p 60fps Landscape',
    width: 1920,
    height: 1080,
    fps: 60,
    aspectRatio: '16:9',
    description: 'High-frame-rate commercial render for hyper-fluid motion',
  },

  // 9:16 Vertical (Instagram Reels, TikTok, YouTube Shorts)
  VERTICAL_1080P: {
    name: '1080p Vertical',
    width: 1080,
    height: 1920,
    fps: 30,
    aspectRatio: '9:16',
    description: 'Vertical social format for Reels and Stories',
  },

  // 1:1 Square (Instagram Feed, LinkedIn, Twitter)
  SQUARE_1080P: {
    name: 'Square Feed',
    width: 1080,
    height: 1080,
    fps: 30,
    aspectRatio: '1:1',
    description: 'Square format for multi-platform feed placements',
  },
} as const satisfies Record<string, VideoResolution>;

export const DEFAULT_VIDEO_CONFIG = VideoPresets.LANDSCAPE_1080P;
