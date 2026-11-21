/**
 * Commercial Advertisement Default Configurations
 */

import { VideoPresets } from '../../config/video';
import { CommercialAdConfig } from '../types';

export const DEFAULT_AD_CONFIG: CommercialAdConfig = {
  id: 'CommercialPlaceholder',
  title: 'Commercial Ad Placeholder',
  client: 'Framework Prototype',
  resolution: VideoPresets.LANDSCAPE_1080P,
  totalDurationInFrames: 150, // 5.0 seconds at 30 FPS
  scenes: [
    {
      sceneId: 'intro-hero',
      durationInFrames: 60,
    },
    {
      sceneId: 'feature-showcase',
      durationInFrames: 60,
    },
    {
      sceneId: 'outro-brand-lockup',
      durationInFrames: 30,
    },
  ],
};
