/**
 * Remotion Root
 * Registers all compositions available in Remotion Studio and rendering pipelines.
 */

import React from 'react';
import { Composition } from 'remotion';
import { MotionPlayground } from './playground/MotionPlayground';
import { PlaceholderAd } from './compositions/advertisements/PlaceholderAd';
import { AdvertisementComposition } from './compositions/advertisements/AdvertisementComposition';
import { SceneSequenceShowcase } from './playground/showcases/SceneSequenceShowcase';
import { TimelineManagerShowcase } from './playground/showcases/TimelineManagerShowcase';
import { TransitionControllerShowcase } from './playground/showcases/TransitionControllerShowcase';
import { AudioTrackShowcase } from './playground/showcases/AudioTrackShowcase';
import { BackgroundMusicShowcase } from './playground/showcases/BackgroundMusicShowcase';
import { SoundEffectShowcase } from './playground/showcases/SoundEffectShowcase';
import { VideoPresets } from './config/video';
import './styles/global.css';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Layer 1: Motion Playground (Isolated component testing & evaluation environment) */}
      <Composition
        id="MotionPlayground"
        component={MotionPlayground}
        durationInFrames={90} // 10 seconds at 30 FPS
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

      {/* Layer 4: Advertisement Assembly Pipeline (Foundation Container) */}
      <Composition
        id="AdvertisementComposition"
        component={AdvertisementComposition}
        durationInFrames={150} // 5 seconds at 30 FPS
        fps={VideoPresets.LANDSCAPE_1080P.fps}
        width={VideoPresets.LANDSCAPE_1080P.width}
        height={VideoPresets.LANDSCAPE_1080P.height}
        defaultProps={{
          compositionId: 'commercial-spot-foundation',
          debug: true,
          safeArea: true,
          background: 'linear-gradient(135deg, #091326 0%, #040711 50%, #0c1833 100%)',
        }}
      />

      {/* Layer 3: SceneSequence Timeline Orchestrator */}
      <Composition
        id="SceneSequence"
        component={SceneSequenceShowcase}
        durationInFrames={150}
        fps={VideoPresets.LANDSCAPE_1080P.fps}
        width={VideoPresets.LANDSCAPE_1080P.width}
        height={VideoPresets.LANDSCAPE_1080P.height}
      />

      {/* Layer 3 / Core: TimelineManager Timing System */}
      <Composition
        id="TimelineManager"
        component={TimelineManagerShowcase}
        durationInFrames={210}
        fps={VideoPresets.LANDSCAPE_1080P.fps}
        width={VideoPresets.LANDSCAPE_1080P.width}
        height={VideoPresets.LANDSCAPE_1080P.height}
      />

      {/* Layer 2 / Layer 3: TransitionController Orchestrator */}
      <Composition
        id="TransitionController"
        component={TransitionControllerShowcase}
        durationInFrames={180}
        fps={VideoPresets.LANDSCAPE_1080P.fps}
        width={VideoPresets.LANDSCAPE_1080P.width}
        height={VideoPresets.LANDSCAPE_1080P.height}
      />

      {/* Layer 2: AudioTrack Sound Layers */}
      <Composition
        id="AudioTrack"
        component={AudioTrackShowcase}
        durationInFrames={180}
        fps={VideoPresets.LANDSCAPE_1080P.fps}
        width={VideoPresets.LANDSCAPE_1080P.width}
        height={VideoPresets.LANDSCAPE_1080P.height}
      />

      {/* Layer 2 / Layer 3: BackgroundMusic Audio Abstraction */}
      <Composition
        id="BackgroundMusic"
        component={BackgroundMusicShowcase}
        durationInFrames={180}
        fps={VideoPresets.LANDSCAPE_1080P.fps}
        width={VideoPresets.LANDSCAPE_1080P.width}
        height={VideoPresets.LANDSCAPE_1080P.height}
      />

      {/* Layer 2 / Layer 3: SoundEffect Event Sequencer */}
      <Composition
        id="SoundEffect"
        component={SoundEffectShowcase}
        durationInFrames={180}
        fps={VideoPresets.LANDSCAPE_1080P.fps}
        width={VideoPresets.LANDSCAPE_1080P.width}
        height={VideoPresets.LANDSCAPE_1080P.height}
      />
    </>
  );
};
