/**
 * BackgroundMusic Component
 * Specialized, reusable background music abstraction built on top of AudioTrack.
 *
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 *
 * Provides:
 * - Automatic composition-spanning duration when duration is omitted
 * - Seamless looping enabled by default
 * - Piecewise volume keyframing for expressive dynamic soundtrack control
 * - Coordinated fade-in and fade-out envelopes honoring composition boundaries
 * - Full compatibility with AudioTrack and AudioTrackGroup
 */

import React, { useMemo } from 'react';
import { useVideoConfig } from 'remotion';
import { AudioTrack } from './AudioTrack.tsx';
import type { AudioTrackProps, AudioVolumeFunction } from './audioTrackTypes.ts';
import type { BackgroundMusicProps } from './backgroundMusicTypes.ts';
import {
  interpolateVolumeKeyframes,
  resolveBackgroundMusicTiming,
} from './backgroundMusicStyle.ts';
import { SILENT_AUDIO_DATA_URI } from './audioTrackStyle.ts';

export const BackgroundMusic: React.FC<BackgroundMusicProps> = (props) => {
  const {
    src = SILENT_AUDIO_DATA_URI,
    id = 'background-music',
    name = 'Background Music',
    volume = 0.7,
    fadeInEasing = 'easeInOutCubic',
    fadeOutEasing = 'easeInOutCubic',
    loop = true,
    loopDurationInFrames,
    keyframes,
    volumeKeyframes,
    keyframesRelative = false,
    playbackRate = 1.0,
    preservePitch = true,
    masterVolume = 1.0,
    enabled = true,
    disabled = false,
    muted = false,
    clampToComposition = true,
    toneFrequency,
    debug = false,
    showInTimeline = true,
    trimBefore,
    startFrom,
    onVolumeCalculated,
    children,
  } = props;

  const videoConfig = useVideoConfig();
  const compositionDuration = videoConfig?.durationInFrames ?? 300;

  // Resolve frame-accurate timing bounds
  const timing = useMemo(() => {
    return resolveBackgroundMusicTiming(props, compositionDuration);
  }, [props, compositionDuration]);

  // Combine keyframes if provided
  const activeKeyframes = keyframes ?? volumeKeyframes;

  // Resolve dynamic volume if keyframes are provided
  const resolvedVolume: AudioTrackProps['volume'] = useMemo(() => {
    if (!activeKeyframes || activeKeyframes.length === 0) {
      return volume;
    }

    const volumeFn: AudioVolumeFunction = (frame, metrics) => {
      let baseVal = 0.7;
      if (typeof volume === 'number') {
        baseVal = volume;
      } else if (typeof volume === 'function') {
        baseVal = volume(frame, metrics);
      }

      return interpolateVolumeKeyframes(
        activeKeyframes,
        frame,
        baseVal,
        keyframesRelative ? timing.startFrame : 0,
      );
    };

    return volumeFn;
  }, [activeKeyframes, volume, keyframesRelative, timing.startFrame]);

  // Determine effective disable state
  const isEffectivelyDisabled = disabled || !enabled;

  return (
    <AudioTrack
      src={src}
      id={id}
      name={name}
      startAtFrame={timing.startFrame}
      durationInFrames={timing.durationInFrames}
      volume={resolvedVolume}
      fadeInFrames={timing.fadeInFrames}
      fadeOutFrames={timing.fadeOutFrames}
      fadeInEasing={fadeInEasing}
      fadeOutEasing={fadeOutEasing}
      loop={loop}
      loopDurationInFrames={loopDurationInFrames}
      playbackRate={playbackRate}
      preservePitch={preservePitch}
      masterVolume={masterVolume}
      muted={muted}
      disabled={isEffectivelyDisabled}
      clampToComposition={clampToComposition}
      toneFrequency={toneFrequency}
      debug={debug}
      showInTimeline={showInTimeline}
      trimBefore={trimBefore ?? startFrom}
      onVolumeCalculated={onVolumeCalculated}
    >
      {children}
    </AudioTrack>
  );
};
