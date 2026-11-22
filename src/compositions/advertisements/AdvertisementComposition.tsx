/**
 * AdvertisementComposition Component
 * Layer 4 of the Motion Graphics Framework.
 *
 * The foundational composition container for assembling multiple reusable scenes
 * into a single unified advertisement video with deterministic timing, background layering,
 * audio mixing, and broadcast safe area compliance.
 */

import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type {
  AdvertisementCompositionProps,
  AudioTrackConfig,
  SceneScheduleItem,
} from '../types.ts';
import {
  calculateSceneSchedule,
  getActiveSceneAtFrame,
  resolveAdvertisementLayout,
  validateAdvertisementConfig,
} from './advertisementCompositionStyle.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { VideoPresets } from '../../config/video.ts';
import { SceneSequence } from '../../components/scenes/SceneSequence.tsx';
import { AudioTrack } from '../../components/audio/AudioTrack.tsx';
import { BackgroundMusic } from '../../components/audio/BackgroundMusic.tsx';
import { SoundEffectGroup } from '../../components/audio/SoundEffectGroup.tsx';
import { AnimationConfigProvider } from '../../config/animation/AnimationConfigContext.tsx';

interface AdvertisementTelemetryHudProps {
  schedule: SceneScheduleItem[];
  effectiveDuration: number;
  effectiveFps: number;
  effectiveWidth: number;
  effectiveHeight: number;
  compositionId: string;
  audioTrackCount: number;
  validation: { isValid: boolean; errors: string[]; warnings: string[] };
}

/**
 * Isolated Telemetry HUD component subscribing to useCurrentFrame()
 * to prevent frame-by-frame re-rendering of the entire composition hierarchy.
 */
const AdvertisementTelemetryHud: React.FC<AdvertisementTelemetryHudProps> = ({
  schedule,
  effectiveDuration,
  effectiveFps,
  effectiveWidth,
  effectiveHeight,
  compositionId,
  audioTrackCount,
  validation,
}) => {
  const frame = useCurrentFrame();
  const activeScene = getActiveSceneAtFrame(schedule, frame);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        backgroundColor: 'rgba(5, 10, 20, 0.92)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${Colors.border.default}`,
        borderRadius: 8,
        padding: '10px 16px',
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        color: Colors.text.primary,
        zIndex: 10000,
        pointerEvents: 'none',
      }}
    >
      {/* Timeline progress bar */}
      <div
        style={{
          width: '100%',
          height: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${(frame / Math.max(1, effectiveDuration)) * 100}%`,
            height: '100%',
            backgroundColor: Colors.accent.cyan,
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>
            ● {compositionId}
          </span>
          <span>
            FRAME {frame} / {effectiveDuration} ({((frame / effectiveDuration) * 100).toFixed(1)}%)
          </span>
          <span>
            {effectiveWidth}x{effectiveHeight} @ {effectiveFps} FPS
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {activeScene ? (
            <span style={{ color: '#10b981', fontWeight: 700 }}>
              ACTIVE SCENE: {activeScene.name ?? activeScene.id} ({activeScene.computedStartFrame}f - {activeScene.computedEndFrame}f)
            </span>
          ) : (
            <span style={{ color: Colors.text.tertiary }}>
              NO ACTIVE SCENE
            </span>
          )}
          {audioTrackCount > 0 && (
            <span style={{ color: '#ec4899' }}>
              AUDIO: {audioTrackCount} TRACK{audioTrackCount > 1 ? 'S' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Validation Warnings / Errors Display */}
      {validation.errors.length > 0 && (
        <div style={{ color: '#ef4444', fontSize: 10 }}>
          ERRORS: {validation.errors.join(' | ')}
        </div>
      )}
      {validation.warnings.length > 0 && (
        <div style={{ color: '#f59e0b', fontSize: 10 }}>
          WARNINGS: {validation.warnings.join(' | ')}
        </div>
      )}
    </div>
  );
};

const AdvertisementCompositionBase: React.FC<AdvertisementCompositionProps> = (
  props,
) => {
  const {
    width: propWidth,
    height: propHeight,
    durationInFrames: propDuration,
    background,
    backgroundColor,
    backgroundContent,
    scenes = [],
    animation,
    audio,
    backgroundMusic,
    soundEffects,
    safeArea = true,
    debug = false,
    compositionId = 'advertisement-composition',
    style,
    className,
    children,
  } = props;

  // Remotion context - only query video dimensions & fps (static across frames)
  const videoConfig = useVideoConfig();

  // Resolve effective dimensions and timing
  const effectiveWidth = propWidth ?? videoConfig?.width ?? VideoPresets.LANDSCAPE_1080P.width;
  const effectiveHeight = propHeight ?? videoConfig?.height ?? VideoPresets.LANDSCAPE_1080P.height;
  const effectiveFps = videoConfig?.fps ?? 30;

  // Calculate schedule and total duration
  const schedule: SceneScheduleItem[] = useMemo(() => {
    return calculateSceneSchedule(scenes, propDuration ?? videoConfig?.durationInFrames);
  }, [scenes, propDuration, videoConfig?.durationInFrames]);

  const effectiveDuration = useMemo(() => {
    if (propDuration !== undefined) {
      return propDuration;
    }
    if (schedule.length > 0) {
      return Math.max(...schedule.map((s) => s.computedEndFrame));
    }
    return videoConfig?.durationInFrames ?? 150;
  }, [propDuration, schedule, videoConfig?.durationInFrames]);

  // Development validation
  const validation = useMemo(() => {
    return validateAdvertisementConfig({
      ...props,
      width: effectiveWidth,
      height: effectiveHeight,
      durationInFrames: effectiveDuration,
      fps: effectiveFps,
    });
  }, [props, effectiveWidth, effectiveHeight, effectiveDuration, effectiveFps]);

  // Warn in console during development if invalid
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (!validation.isValid) {
        console.error(`[AdvertisementComposition: ${compositionId}] Errors:`, validation.errors);
      }
      if (validation.warnings.length > 0) {
        console.warn(`[AdvertisementComposition: ${compositionId}] Warnings:`, validation.warnings);
      }
    }
  }, [validation, compositionId]);

  // Layout resolution
  const resolved = resolveAdvertisementLayout(
    effectiveWidth,
    effectiveHeight,
    safeArea,
    background,
    backgroundColor,
  );

  // Normalize audio tracks
  const audioTracks: AudioTrackConfig[] = useMemo(() => {
    if (!audio) return [];
    return Array.isArray(audio) ? audio : [audio];
  }, [audio]);

  return (
    <AbsoluteFill
      style={{
        ...resolved.containerStyle,
        ...style,
      }}
      className={className}
    >
      {/* 1. Background Content Layer (rendered behind scenes) */}
      {backgroundContent && (
        <AbsoluteFill style={{ zIndex: 0, pointerEvents: 'none' }}>
          {backgroundContent}
        </AbsoluteFill>
      )}

      {/* 2. Main Content Canvas */}
      <div style={resolved.contentStyle}>
        <AnimationConfigProvider value={animation}>
          {/* Render Sequenced Scenes via SceneSequence orchestrator */}
          {scenes.length > 0 && (
            <SceneSequence scenes={scenes} />
          )}

          {/* Direct Children (alternative or complement to scenes array) */}
          {children}
        </AnimationConfigProvider>
      </div>

      {/* 3. Audio Layers */}
      {backgroundMusic && (
        <BackgroundMusic
          id="advertisement-bgm"
          name="Advertisement Soundtrack"
          debug={debug}
          {...backgroundMusic}
        />
      )}

      {audioTracks.map((track, idx) => (
        <AudioTrack
          key={`audio-${idx}-${track.src}`}
          name={track.name ?? `Audio Track ${idx + 1}`}
          {...track}
        />
      ))}

      {/* 3b. Sound Effect Layers */}
      {soundEffects && soundEffects.length > 0 && (
        <SoundEffectGroup effects={soundEffects} debug={debug} />
      )}

      {/* 4. Safe Area Boundary Guide (only visible when debug is true) */}
      {debug && safeArea && (
        <div style={resolved.safeAreaStyle} />
      )}

      {/* 5. Telemetry & Debugging HUD Overlay */}
      {debug && (
        <AdvertisementTelemetryHud
          schedule={schedule}
          effectiveDuration={effectiveDuration}
          effectiveFps={effectiveFps}
          effectiveWidth={effectiveWidth}
          effectiveHeight={effectiveHeight}
          compositionId={compositionId}
          audioTrackCount={audioTracks.length}
          validation={validation}
        />
      )}
    </AbsoluteFill>
  );
};

export const AdvertisementComposition = React.memo(AdvertisementCompositionBase);
