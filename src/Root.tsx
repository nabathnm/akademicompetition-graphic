/**
 * Remotion Root
 * Registers all compositions available in Remotion Studio and rendering pipelines.
 */

import React from 'react';
import { Composition } from 'remotion';
import { MotionPlayground } from './playground/MotionPlayground';
import { PlaceholderAd } from './compositions/advertisements/PlaceholderAd';
import { VideoPresets } from './config/video';
import './styles/global.css';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Layer 1: Motion Playground (Isolated component testing & evaluation environment) */}
      <Composition
        id="MotionPlayground"
        component={MotionPlayground}
        durationInFrames={150} // 10 seconds at 30 FPS
        fps={VideoPresets.LANDSCAPE_1080P.fps}
        width={VideoPresets.LANDSCAPE_1080P.width}
        height={VideoPresets.LANDSCAPE_1080P.height}
        defaultProps={{
          selectedCategory: 'all' as const,
          viewMode: 'overview' as const,
          showGrid: true,
          variantA: 'Snappy Spring',
          variantB: 'Smooth Spring',
        }}
      />

      {/* Layer 4: Advertisement Assembly Pipeline (Placeholder ad composition) */}
      <Composition
        id="PlaceholderAd"
        component={PlaceholderAd}
        durationInFrames={150} // 5 seconds at 30 FPS
        fps={VideoPresets.LANDSCAPE_1080P.fps}
        width={VideoPresets.LANDSCAPE_1080P.width}
        height={VideoPresets.LANDSCAPE_1080P.height}
        defaultProps={{
          campaignName: 'COMMERCIAL AD CAMPAIGN',
          tagline: 'Layer 4: Assembly Pipeline Architecture',
        }}
      />
    </>
  );
};
