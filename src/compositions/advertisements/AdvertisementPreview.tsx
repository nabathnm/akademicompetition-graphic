/**
 * AdvertisementPreview Component
 * Reusable preview entry point for assembling and previewing full commercial
 * advertisement compositions inside Remotion Studio and preview pipelines.
 *
 * Layer 4 of the Motion Graphics Framework.
 *
 * Provides:
 * - Unified preview wrapper combining AdvertisementComposition, SceneSequence,
 *   transitions, audio layers, and global animation settings
 * - 100% visual and temporal consistency with final Remotion renders
 * - Actionable development-time feedback and diagnostic HUD overlay
 * - Helpful empty-state guidance when scenes are not yet populated
 * - Support for background music, sound effects, and timeline scrub guides
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { VideoPresets } from '../../config/video.ts';
import { AdvertisementComposition } from './AdvertisementComposition.tsx';
import { BackgroundMusic } from '../../components/audio/BackgroundMusic.tsx';
import { SoundEffectGroup } from '../../components/audio/SoundEffectGroup.tsx';
import { formatTimecode } from '../../utils/timing/frame.ts';
import type { AdvertisementPreviewProps } from './advertisementPreviewTypes.ts';
import {
  resolvePreviewScenes,
  validateAdvertisementPreviewConfig,
} from './advertisementPreviewStyle.ts';

export const AdvertisementPreview: React.FC<AdvertisementPreviewProps> = (props) => {
  const {
    width,
    height,
    durationInFrames: propDuration,
    background,
    backgroundColor,
    backgroundContent,
    scenes = [],
    transitionSettings,
    animation,
    backgroundMusic,
    soundEffects,
    audio,
    safeArea = true,
    padding,
    debug = false,
    showTimeline = false,
    title = 'Advertisement Preview',
    compositionId = 'ad-preview',
    style,
    className,
    children,
  } = props;

  const currentFrame = useCurrentFrame();
  const videoConfig = useVideoConfig();

  const effectiveWidth = width ?? videoConfig?.width ?? VideoPresets.LANDSCAPE_1080P.width;
  const effectiveHeight = height ?? videoConfig?.height ?? VideoPresets.LANDSCAPE_1080P.height;
  const effectiveFps = videoConfig?.fps ?? 30;

  // Normalize scenes with global transition settings if configured
  const resolvedScenes = useMemo(() => {
    return resolvePreviewScenes(scenes, transitionSettings);
  }, [scenes, transitionSettings]);

  // Validate preview configuration
  const validation = useMemo(() => {
    return validateAdvertisementPreviewConfig({
      ...props,
      width: effectiveWidth,
      height: effectiveHeight,
      scenes: resolvedScenes,
    });
  }, [props, effectiveWidth, effectiveHeight, resolvedScenes]);

  // Development console logging for errors and warnings
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (!validation.isValid) {
        console.error(`[AdvertisementPreview: ${compositionId}] Errors:`, validation.errors);
      }
      if (validation.warnings.length > 0) {
        console.warn(`[AdvertisementPreview: ${compositionId}] Warnings:`, validation.warnings);
      }
    }
  }, [validation, compositionId]);

  const effectiveDuration = propDuration ?? validation.computedTotalDuration;

  // Empty state handling
  const isEmpty = resolvedScenes.length === 0 && !children;

  return (
    <div
      style={{
        position: 'relative',
        width: effectiveWidth,
        height: effectiveHeight,
        overflow: 'hidden',
        ...style,
      }}
      className={className}
    >
      {/* 1. Empty State Development Feedback */}
      {isEmpty ? (
        <EmptyStateFeedback
          title={title}
          compositionId={compositionId}
          validation={validation}
        />
      ) : (
        /* 2. Assembled Advertisement Composition (Exact Render Logic) */
        <AdvertisementComposition
          width={effectiveWidth}
          height={effectiveHeight}
          durationInFrames={effectiveDuration}
          background={background}
          backgroundColor={backgroundColor}
          backgroundContent={backgroundContent}
          scenes={resolvedScenes}
          animation={animation}
          audio={audio}
          soundEffects={soundEffects}
          safeArea={safeArea}
          padding={padding}
          debug={debug}
          compositionId={compositionId}
        >
          {/* Background Music Layer */}
          {backgroundMusic && (
            <BackgroundMusic
              id="preview-bgm"
              name="Preview Soundtrack"
              {...backgroundMusic}
            />
          )}

          {/* Sound Effects Group */}
          {soundEffects && soundEffects.length > 0 && (
            <SoundEffectGroup effects={soundEffects} />
          )}

          {/* Direct Child Elements */}
          {children}
        </AdvertisementComposition>
      )}

      {/* 3. Preview Telemetry & Diagnostics HUD (active when debug is true) */}
      {debug && (
        <PreviewDiagnosticsHUD
          title={title}
          compositionId={compositionId}
          frame={currentFrame}
          fps={effectiveFps}
          duration={effectiveDuration}
          validation={validation}
          sceneCount={resolvedScenes.length}
          hasAudio={validation.hasAudio}
        />
      )}

      {/* 4. Timeline Scrubber Guide (active when showTimeline is true) */}
      {showTimeline && !isEmpty && (
        <PreviewTimelineRuler
          frame={currentFrame}
          duration={effectiveDuration}
          fps={effectiveFps}
          scenes={resolvedScenes}
        />
      )}
    </div>
  );
};

// ============================================================================
// Development Subcomponents
// ============================================================================

interface EmptyStateFeedbackProps {
  title: string;
  compositionId: string;
  validation: { errors: string[]; warnings: string[] };
}

const EmptyStateFeedback: React.FC<EmptyStateFeedbackProps> = ({
  title,
  compositionId,
  validation,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#090D16',
        color: '#F8FAFC',
        fontFamily: Typography.fontFamily.sans,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 680,
          padding: 32,
          backgroundColor: '#0F172A',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            padding: '4px 12px',
            borderRadius: 20,
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            color: '#3B82F6',
            fontSize: 12,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          ADVERTISEMENT PREVIEW SETUP
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px 0' }}>
          {title} ({compositionId})
        </h2>
        <p style={{ color: Colors.text.tertiary, fontSize: 14, lineHeight: 1.6, margin: '0 0 24px 0' }}>
          No scenes or child components have been provided to this preview. To preview an assembled
          commercial, supply an array of scene configurations to <code>scenes</code> or pass React
          children to <code>&lt;AdvertisementPreview&gt;</code>.
        </p>

        {validation.warnings.length > 0 && (
          <div
            style={{
              textAlign: 'left',
              padding: 16,
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderRadius: 8,
              border: '1px solid rgba(245, 158, 11, 0.3)',
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', marginBottom: 6 }}>
              Configuration Notes:
            </div>
            {validation.warnings.map((w, idx) => (
              <div key={idx} style={{ fontSize: 12, color: '#FDE68A', marginBottom: 4 }}>
                • {w}
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            textAlign: 'left',
            padding: 16,
            backgroundColor: '#1E293B',
            borderRadius: 8,
            fontSize: 12,
            fontFamily: Typography.fontFamily.mono,
            color: '#94A3B8',
          }}
        >
          {`<AdvertisementPreview\n  title="My Commercial"\n  scenes={[\n    { id: 'hero', durationInFrames: 60, scene: <HeroScene /> },\n    { id: 'cta', durationInFrames: 60, scene: <CallToActionScene /> }\n  ]}\n  backgroundMusic={{ src: 'audio.mp3', volume: 0.8 }}\n/>`}
        </div>
      </div>
    </div>
  );
};

interface PreviewDiagnosticsHUDProps {
  title: string;
  compositionId: string;
  frame: number;
  fps: number;
  duration: number;
  validation: { isValid: boolean; errors: string[]; warnings: string[] };
  sceneCount: number;
  hasAudio: boolean;
}

const PreviewDiagnosticsHUD: React.FC<PreviewDiagnosticsHUDProps> = ({
  title,
  compositionId,
  frame,
  fps,
  duration,
  validation,
  sceneCount,
  hasAudio,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 9999,
        padding: '12px 18px',
        backgroundColor: 'rgba(9, 13, 22, 0.92)',
        backdropFilter: 'blur(12px)',
        borderRadius: 10,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        color: '#F8FAFC',
        fontFamily: Typography.fontFamily.mono,
        fontSize: 11,
        lineHeight: 1.5,
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
        maxWidth: 380,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <strong style={{ color: '#3B82F6', fontSize: 12 }}>{title}</strong>
        <span style={{ color: Colors.text.tertiary, fontSize: 10 }}>{compositionId}</span>
      </div>

      <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 6, marginBottom: 6 }}>
        <div>
          FRAME: <strong style={{ color: '#FFFFFF' }}>{frame}</strong>/{duration}
        </div>
        <div>
          TIMECODE: <strong style={{ color: Colors.accent.cyan }}>{formatTimecode(frame, fps)}</strong>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, color: Colors.text.tertiary }}>
        <span>Scenes: <strong style={{ color: '#F8FAFC' }}>{sceneCount}</strong></span>
        <span>Audio: <strong style={{ color: hasAudio ? Colors.accent.emerald : '#94A3B8' }}>{hasAudio ? 'Active' : 'None'}</strong></span>
        <span>Status: <strong style={{ color: validation.isValid ? Colors.accent.emerald : '#EF4444' }}>{validation.isValid ? 'Valid' : 'Errors'}</strong></span>
      </div>

      {validation.errors.length > 0 && (
        <div style={{ marginTop: 8, color: '#EF4444', fontSize: 10 }}>
          {validation.errors.map((err, i) => (
            <div key={i}>⚠️ {err}</div>
          ))}
        </div>
      )}
    </div>
  );
};

interface PreviewTimelineRulerProps {
  frame: number;
  duration: number;
  fps: number;
  scenes: { id: string; durationInFrames: number }[];
}

const PreviewTimelineRuler: React.FC<PreviewTimelineRulerProps> = ({
  frame,
  duration,
  scenes,
}) => {
  const percent = duration > 0 ? (frame / duration) * 100 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 36,
        backgroundColor: 'rgba(9, 13, 22, 0.94)',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        boxSizing: 'border-box',
        gap: 12,
      }}
    >
      <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, width: 80, flexShrink: 0 }}>
        TIMELINE
      </div>

      {/* Track bar */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          height: 14,
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          borderRadius: 4,
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        {/* Render scene division blocks */}
        {scenes.map((scene, idx) => {
          const sceneWidthPercent = duration > 0 ? (scene.durationInFrames / duration) * 100 : 0;
          return (
            <div
              key={scene.id || idx}
              style={{
                width: `${sceneWidthPercent}%`,
                height: '100%',
                borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                backgroundColor: idx % 2 === 0 ? 'rgba(59, 130, 246, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 4,
                boxSizing: 'border-box',
              }}
            >
              <span style={{ fontSize: 8, color: '#CBD5E1', fontFamily: Typography.fontFamily.mono, overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {scene.id}
              </span>
            </div>
          );
        })}

        {/* Playhead Marker */}
        <div
          style={{
            position: 'absolute',
            left: `${percent}%`,
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: '#EF4444',
            boxShadow: '0 0 6px rgba(239, 68, 68, 0.8)',
            zIndex: 10,
          }}
        />
      </div>

      <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: '#F8FAFC', width: 60, textAlign: 'right', flexShrink: 0 }}>
        {Math.round(percent)}%
      </div>
    </div>
  );
};
