/**
 * SoundEffect Component
 * Specialized, reusable sound effect abstraction built on top of AudioTrack.
 *
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 *
 * Provides:
 * - Frame-accurate triggering synchronized with visual transitions, clicks, reveals
 * - Built-in procedural sound presets (ui-click, whoosh, notification, pop, success, etc.)
 * - Strict playback boundary confinement (loop: false, zero audio bleed)
 * - Playback rate and pitch control
 * - Coordinated entrance and exit decay envelopes
 * - Full integration with AudioTrack, AudioTrackGroup, and AdvertisementComposition
 */

import React, { useMemo } from 'react';
import { useVideoConfig } from 'remotion';
import { AudioTrack } from './AudioTrack.tsx';
import type { SoundEffectProps } from './soundEffectTypes.ts';
import { resolveSoundEffectTiming } from './soundEffectStyle.ts';

export const SoundEffect: React.FC<SoundEffectProps> = (props) => {
  const {
    id,
    volume,
    playbackRate = 1.0,
    preservePitch = true,
    masterVolume = 1.0,
    enabled = true,
    disabled = false,
    muted = false,
    clampToComposition = true,
    debug = false,
    showInTimeline = true,
    trimBefore,
    startFrom,
    fadeInEasing = 'linear',
    fadeOutEasing = 'linear',
    onVolumeCalculated,
    children,
  } = props;

  const videoConfig = useVideoConfig();
  const compositionDuration = videoConfig?.durationInFrames ?? 300;

  // Resolve timing, preset parameters, and bounds
  const timing = useMemo(() => {
    return resolveSoundEffectTiming(props, compositionDuration);
  }, [props, compositionDuration]);

  // Determine effective disable state
  const isEffectivelyDisabled = disabled || !enabled;

  return (
    <AudioTrack
      src={timing.resolvedSrc}
      id={id ?? (props.preset ? `sfx-${props.preset}` : 'sfx')}
      name={timing.name}
      startAtFrame={timing.startFrame}
      durationInFrames={timing.durationInFrames}
      volume={volume}
      fadeInFrames={timing.fadeInFrames}
      fadeOutFrames={timing.fadeOutFrames}
      fadeInEasing={fadeInEasing}
      fadeOutEasing={fadeOutEasing}
      loop={false} // Sound effects NEVER loop
      playbackRate={playbackRate}
      preservePitch={preservePitch}
      masterVolume={masterVolume}
      muted={muted}
      disabled={isEffectivelyDisabled}
      clampToComposition={clampToComposition}
      toneFrequency={timing.toneFrequency}
      debug={debug}
      showInTimeline={showInTimeline}
      trimBefore={trimBefore ?? startFrom}
      onVolumeCalculated={onVolumeCalculated}
    >
      {children}
    </AudioTrack>
  );
};
