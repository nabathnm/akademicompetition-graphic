/**
 * AudioTrackGroup Component
 * Multi-track audio management container providing collective master volume control,
 * global muting, cross-track ducking, and coordinated telemetry.
 *
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { AudioDuckingConfig, AudioTrackGroupProps } from './audioTrackTypes.ts';
import { AudioTrack } from './AudioTrack.tsx';
import {
  calculateDuckedVolume,
  resolveTrackTiming,
} from './audioTrackStyle.ts';

export const AudioTrackGroup: React.FC<AudioTrackGroupProps> = ({
  tracks = [],
  masterVolume = 1.0,
  muted = false,
  disabled = false,
  ducking,
  debug = false,
  children,
}) => {
  const currentFrame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const compositionDuration = videoConfig?.durationInFrames ?? 300;

  // Normalize ducking configs
  const duckingList: AudioDuckingConfig[] = useMemo(() => {
    if (!ducking) return [];
    return Array.isArray(ducking) ? ducking : [ducking];
  }, [ducking]);

  // Identify which trigger tracks are currently active at this frame
  const activeTriggerIds = useMemo(() => {
    const active = new Set<string>();
    duckingList.forEach((rule) => {
      const trigger = tracks.find((t) => t.id === rule.triggerTrackId);
      if (trigger && !trigger.disabled && !trigger.muted) {
        const timing = resolveTrackTiming(trigger, compositionDuration);
        if (currentFrame >= timing.startFrame && currentFrame < timing.endFrame) {
          active.add(rule.triggerTrackId);
        }
      }
    });
    return active;
  }, [duckingList, tracks, currentFrame, compositionDuration]);

  // If group is globally disabled, skip rendering
  if (disabled) {
    return null;
  }

  return (
    <>
      {/* 1. Configured Tracks Array */}
      {tracks.map((track, idx) => {
        const trackId = track.id ?? `track-${idx}`;
        const isMuted = muted || Boolean(track.muted);

        // Check if this track is targeted by an active ducking rule
        const applicableDucking = duckingList.find(
          (rule) => rule.targetTrackId === trackId && activeTriggerIds.has(rule.triggerTrackId),
        );

        // Modify volume dynamically if ducking is active
        const trackVolume = track.volume;
        const resolvedVolume = applicableDucking
          ? (f: number) => {
              const baseVol =
                typeof trackVolume === 'function'
                  ? trackVolume(f, {} as any)
                  : typeof trackVolume === 'number'
                    ? trackVolume
                    : 1.0;
              return calculateDuckedVolume({
                musicVolume: baseVol,
                isVoiceActive: true,
                duckedVolume: applicableDucking.duckedVolume ?? 0.25,
              });
            }
          : trackVolume;

        return (
          <AudioTrack
            key={trackId}
            {...track}
            id={trackId}
            volume={resolvedVolume}
            masterVolume={masterVolume}
            muted={isMuted}
            debug={debug && idx === 0} // Show single debug HUD if enabled
          />
        );
      })}

      {/* 2. Declarative JSX Children */}
      {children}
    </>
  );
};
