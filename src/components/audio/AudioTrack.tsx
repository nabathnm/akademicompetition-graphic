/**
 * AudioTrack Component
 * Production-ready Remotion audio management layer with frame-accurate timing,
 * automated fade envelopes, volume automation, and playback rate control.
 *
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React, { useEffect, useMemo } from 'react';
import { Audio, Loop, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import type { AudioTrackProps, AudioVolumeMetrics } from './audioTrackTypes.ts';
import {
  calculateAudioVolume,
  calculateAudioVolumeMetrics,
  resolveTrackTiming,
  SILENT_AUDIO_DATA_URI,
  validateAudioTrackConfig,
} from './audioTrackStyle.ts';

export const AudioTrack: React.FC<AudioTrackProps> = (props) => {
  const {
    src,
    id,
    name,
    startAtFrame,
    startFrame,
    durationInFrames,
    endFrame,
    trimBefore,
    startFrom,
    playbackRate = 1.0,
    preservePitch = true,
    loop = false,
    loopDurationInFrames,
    disabled = false,
    clampToComposition = true,
    toneFrequency,
    masterVolume = 1.0,
    debug = false,
    showInTimeline = true,
    onVolumeCalculated,
    children,
  } = props;

  const videoConfig = useVideoConfig();
  const currentFrame = useCurrentFrame();

  const compositionDuration = videoConfig?.durationInFrames ?? 300;

  // Resolve timing bounds
  const timing = useMemo(() => {
    return resolveTrackTiming(
      {
        src,
        startAtFrame,
        startFrame,
        durationInFrames,
        endFrame,
        clampToComposition,
      },
      compositionDuration,
    );
  }, [src, startAtFrame, startFrame, durationInFrames, endFrame, clampToComposition, compositionDuration]);

  // Validation in development
  const validation = useMemo(() => {
    return validateAudioTrackConfig(props, compositionDuration);
  }, [props, compositionDuration]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (!validation.isValid) {
        console.error(`[AudioTrack${name ? ` - ${name}` : ''}] Validation Errors:`, validation.errors);
      }
      if (validation.warnings.length > 0) {
        console.warn(`[AudioTrack${name ? ` - ${name}` : ''}] Warnings:`, validation.warnings);
      }
    }
  }, [validation, name]);

  // Calculate live volume metrics for the current frame
  const currentMetrics = useMemo(() => {
    return calculateAudioVolumeMetrics(props, {
      globalFrame: currentFrame,
      trackStartFrame: timing.startFrame,
      trackDurationInFrames: timing.durationInFrames,
      compositionDuration,
      masterVolume,
    });
  }, [props, currentFrame, timing, compositionDuration, masterVolume]);

  // Notify volume callback if provided
  useEffect(() => {
    if (onVolumeCalculated) {
      onVolumeCalculated(currentMetrics);
    }
  }, [currentMetrics, onVolumeCalculated]);

  // If disabled, completely bypass audio rendering
  if (disabled) {
    return (
      <>
        {children}
        {debug && (
          <AudioTrackHUD
            name={name ?? id ?? 'AudioTrack'}
            metrics={{
              ...currentMetrics,
              finalVolume: 0,
              isMuted: true,
              phase: 'complete',
            }}
            timing={timing}
            disabled={true}
          />
        )}
      </>
    );
  }

  // Audio source fallback (ensures safe loading in test / offline Remotion environments)
  const resolvedSrc = src || SILENT_AUDIO_DATA_URI;
  const effectiveTrim = trimBefore ?? startFrom;

  // Render core Remotion Audio element
  const audioElement = (
    <Audio
      src={resolvedSrc}
      volume={(localFrame) => {
        const globalFrame = timing.startFrame + localFrame;
        return calculateAudioVolume(props, globalFrame, compositionDuration, masterVolume);
      }}
      playbackRate={playbackRate}
      preservePitch={preservePitch}
      loop={Boolean(loop && !loopDurationInFrames)}
      trimBefore={effectiveTrim}
      toneFrequency={toneFrequency}
      showInTimeline={showInTimeline}
    />
  );

  return (
    <>
      <Sequence
        from={timing.startFrame}
        durationInFrames={timing.durationInFrames}
        name={name ?? (id ? `Audio: ${id}` : 'AudioTrack')}
        layout="none"
      >
        {loop && loopDurationInFrames && loopDurationInFrames > 0 ? (
          <Loop durationInFrames={loopDurationInFrames}>
            {audioElement}
          </Loop>
        ) : (
          audioElement
        )}
      </Sequence>

      {/* Optional Visual Visualizer Children */}
      {children}

      {/* Visual Telemetry HUD */}
      {debug && (
        <AudioTrackHUD
          name={name ?? id ?? 'AudioTrack'}
          metrics={currentMetrics}
          timing={timing}
          disabled={false}
        />
      )}
    </>
  );
};

/**
 * Visual VU Meter & Telemetry HUD Overlay for Audio Tracks.
 */
interface AudioTrackHUDProps {
  name: string;
  metrics: AudioVolumeMetrics;
  timing: { startFrame: number; durationInFrames: number; endFrame: number };
  disabled: boolean;
}

const AudioTrackHUD: React.FC<AudioTrackHUDProps> = ({
  name,
  metrics,
  timing,
  disabled,
}) => {
  const percent = Math.round(metrics.finalVolume * 100);
  const isPlaying = metrics.phase === 'fadeIn' || metrics.phase === 'hold' || metrics.phase === 'fadeOut';

  // Deterministic animated VU bars based on volume and frame
  const barHeights = [0.8, 1.0, 0.6, 0.9, 0.7, 0.4].map((scale, i) => {
    if (!isPlaying || disabled || metrics.isMuted) return 2;
    const wave = Math.sin((metrics.globalFrame * 0.4) + i) * 0.3 + 0.7;
    return Math.max(2, Math.round(metrics.finalVolume * wave * scale * 24));
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: 10,
        padding: '10px 14px',
        color: '#F8FAFC',
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        lineHeight: 1.4,
        zIndex: 9999,
        pointerEvents: 'none',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
        minWidth: 220,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontWeight: 700, color: Colors.accent.cyan }}>🎵 {name}</span>
        <span
          style={{
            fontSize: 10,
            padding: '1px 6px',
            borderRadius: 4,
            backgroundColor: disabled
              ? 'rgba(239, 68, 68, 0.2)'
              : metrics.isMuted
                ? 'rgba(245, 158, 11, 0.2)'
                : 'rgba(16, 185, 129, 0.2)',
            color: disabled ? '#EF4444' : metrics.isMuted ? '#F59E0B' : Colors.accent.emerald,
            fontWeight: 600,
          }}
        >
          {disabled ? 'DISABLED' : metrics.isMuted ? 'MUTED' : metrics.phase.toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0' }}>
        {/* VU Level Meter Bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 26, width: 40 }}>
          {barHeights.map((h, idx) => (
            <div
              key={idx}
              style={{
                width: 4,
                height: `${h}px`,
                backgroundColor:
                  percent > 85 ? '#EF4444' : percent > 60 ? '#F59E0B' : Colors.accent.cyan,
                borderRadius: 1,
              }}
            />
          ))}
        </div>

        {/* Volume Progress Bar */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: Colors.text.tertiary, marginBottom: 2 }}>
            <span>VOL</span>
            <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{percent}%</span>
          </div>
          <div style={{ width: '100%', height: 4, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 2, overflow: 'hidden' }}>
            <div
              style={{
                width: `${percent}%`,
                height: '100%',
                backgroundColor: percent > 85 ? '#EF4444' : Colors.accent.cyan,
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: Colors.text.tertiary, display: 'flex', justifyContent: 'space-between' }}>
        <span>SPAN: [{timing.startFrame} .. {timing.endFrame}]</span>
        <span>FRAME: {metrics.globalFrame}</span>
      </div>
    </div>
  );
};
