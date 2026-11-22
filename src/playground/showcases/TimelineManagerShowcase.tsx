/**
 * TimelineManager Showcase
 * Interactive motion graphics playground demonstrating TimelineManager:
 * - Multi-track timeline visualization (Scenes, Transitions, Audio)
 * - Real-time frame-accurate inspection and SMPTE timecode resolution
 * - Scene start/end frame boundaries and duration metrics
 * - Audio layer ranges with fade-in / fade-out visualizations
 * - Transition ranges and directional parameters
 * - Interactive preset selector and overlap collision modes
 */

import React, { useMemo, useState } from 'react';
import { useCurrentFrame } from 'remotion';
import {
  Clock,
  Layers,
  Sparkles,
  Volume2,
  Film,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { TimelineManager } from '../../utils/timing/TimelineManager.ts';
import type { TimelineInputConfig } from '../../utils/timing/timelineTypes.ts';

export type TimelineDemoPreset =
  | 'commercial-spot'
  | 'staggered-delays'
  | 'overlapping-crossfade'
  | 'multi-audio';

export const TimelineManagerShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();

  // State
  const [preset, setPreset] = useState<TimelineDemoPreset>('commercial-spot');
  const [selectedFps, setSelectedFps] = useState<number>(30);
  const [manualScrub, setManualScrub] = useState<number | null>(null);

  // Active inspected frame (scrubbed or current Remotion frame)
  const activeFrame = manualScrub !== null ? manualScrub : currentFrame;

  // Timeline configuration based on active preset
  const timelineConfig: TimelineInputConfig = useMemo(() => {
    switch (preset) {
      case 'commercial-spot':
        return {
          fps: selectedFps,
          allowOverlap: false,
          scenes: [
            {
              id: 'hook-hero',
              name: '1. Brand Hero Hook',
              durationInFrames: 60,
              entranceTransition: { type: 'fade', durationInFrames: 15 },
              exitTransition: { type: 'fade', durationInFrames: 15 },
            },
            {
              id: 'product-feature',
              name: '2. Flagship Product Feature',
              durationInFrames: 90,
              entranceTransition: { type: 'slide', direction: 'left', durationInFrames: 15 },
              exitTransition: { type: 'slide', direction: 'left', durationInFrames: 15 },
            },
            {
              id: 'closing-cta',
              name: '3. Conversion Call to Action',
              durationInFrames: 60,
              entranceTransition: { type: 'zoom', durationInFrames: 15 },
              exitTransition: { type: 'fade', durationInFrames: 15 },
            },
          ],
          audio: [
            {
              id: 'track-bgm',
              name: 'Cinematic BGM Track',
              src: 'music/upbeat-corporate.mp3',
              startAtFrame: 0,
              durationInFrames: 210,
              fadeInFrames: 15,
              fadeOutFrames: 20,
              volume: 0.85,
            },
          ],
        };

      case 'staggered-delays':
        return {
          fps: selectedFps,
          allowOverlap: false,
          scenes: [
            {
              id: 'act-1',
              name: '1. Act One: Introduction',
              durationInFrames: 50,
              entranceTransition: { type: 'fade', durationInFrames: 12 },
            },
            {
              id: 'act-2',
              name: '2. Act Two: Deep Dive',
              durationInFrames: 60,
              delayBefore: 20, // 20 frames delay gap
              entranceTransition: { type: 'slide', direction: 'left', durationInFrames: 15 },
            },
            {
              id: 'act-3',
              name: '3. Act Three: Climax',
              durationInFrames: 45,
              delayBefore: 15, // 15 frames delay gap
              entranceTransition: { type: 'zoom', durationInFrames: 12 },
            },
          ],
          audio: [
            {
              id: 'bgm-track',
              name: 'Ambient Electronic Beat',
              src: 'music/ambient.mp3',
              startAtFrame: 0,
              fadeInFrames: 10,
              fadeOutFrames: 20,
            },
            {
              id: 'sfx-riser',
              name: 'SFX Whoosh Riser',
              src: 'sfx/riser.mp3',
              startAtFrame: 55,
              durationInFrames: 25,
            },
          ],
        };

      case 'overlapping-crossfade':
        return {
          fps: selectedFps,
          allowOverlap: true,
          scenes: [
            {
              id: 'scene-alpha',
              name: '1. Scene Alpha',
              durationInFrames: 70,
              entranceTransition: { type: 'fade', durationInFrames: 15 },
            },
            {
              id: 'scene-beta',
              name: '2. Scene Beta (15f Overlap)',
              startFrame: 55, // overlaps Alpha by 15f
              durationInFrames: 75,
              allowOverlap: true,
              entranceTransition: { type: 'slide', direction: 'left', durationInFrames: 15 },
            },
            {
              id: 'scene-gamma',
              name: '3. Scene Gamma (15f Overlap)',
              startFrame: 115, // overlaps Beta by 15f
              durationInFrames: 65,
              allowOverlap: true,
              entranceTransition: { type: 'fade', durationInFrames: 15 },
            },
          ],
          audio: [
            {
              id: 'crossfade-bgm',
              name: 'Continuous Dynamic Soundtrack',
              src: 'music/dynamic.mp3',
              startAtFrame: 0,
              fadeInFrames: 20,
              fadeOutFrames: 20,
            },
          ],
        };

      case 'multi-audio':
      default:
        return {
          fps: selectedFps,
          scenes: [
            { id: 'intro', name: '1. Intro Sequence', durationInFrames: 60 },
            { id: 'demo', name: '2. Product Walkthrough', durationInFrames: 90 },
            { id: 'outro', name: '3. Brand Closing', durationInFrames: 60 },
          ],
          audio: [
            {
              id: 'audio-bed',
              name: 'Background Music Bed (0.6x vol)',
              src: 'music/bed.mp3',
              startAtFrame: 0,
              durationInFrames: 210,
              fadeInFrames: 15,
              fadeOutFrames: 25,
              volume: 0.6,
            },
            {
              id: 'audio-voiceover',
              name: 'Narrator Voiceover Track',
              src: 'voice/voiceover.mp3',
              startAtFrame: 15,
              durationInFrames: 120,
              fadeInFrames: 5,
              fadeOutFrames: 10,
              volume: 1.0,
            },
            {
              id: 'audio-sfx',
              name: 'App Impact Sound Effect',
              src: 'sfx/impact.mp3',
              startAtFrame: 60,
              durationInFrames: 30,
              volume: 0.9,
            },
          ],
        };
    }
  }, [preset, selectedFps]);

  // Instantiate TimelineManager
  const manager = useMemo(() => {
    return new TimelineManager(timelineConfig);
  }, [timelineConfig]);

  const composition = manager.getComposition();
  const validation = manager.getValidation();
  const inspection = manager.inspectAt(activeFrame);

  // Palette for scenes
  const sceneColors = [
    Colors.accent.cyan,
    Colors.accent.electricViolet,
    Colors.accent.brand,
    Colors.accent.emerald,
    '#f59e0b',
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#030712',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: Typography.fontFamily.sans,
        color: Colors.text.primary,
        padding: 20,
        gap: 16,
      }}
    >
      {/* 1. Header & Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          padding: '12px 16px',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          borderRadius: 12,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        {/* Preset Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: Colors.accent.cyan,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              marginRight: 6,
            }}
          >
            <Film size={14} /> Presets:
          </span>

          {(
            [
              ['commercial-spot', 'Commercial Spot'],
              ['staggered-delays', 'Delays & Gaps'],
              ['overlapping-crossfade', 'Crossfade Overlap'],
              ['multi-audio', 'Multi-Audio Bed'],
            ] as const
          ).map(([key, label]) => {
            const isSelected = preset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setPreset(key);
                  setManualScrub(null);
                }}
                style={{
                  backgroundColor: isSelected ? Colors.accent.cyan : 'rgba(255,255,255,0.06)',
                  color: isSelected ? '#000000' : Colors.text.primary,
                  border: `1px solid ${isSelected ? Colors.accent.cyan : Colors.border.default}`,
                  borderRadius: 6,
                  padding: '5px 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* FPS & Scrub Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 11, color: Colors.text.secondary }}>FPS:</span>
            {([24, 30, 60] as const).map((fps) => (
              <button
                key={fps}
                type="button"
                onClick={() => setSelectedFps(fps)}
                style={{
                  backgroundColor: selectedFps === fps ? Colors.accent.electricViolet : 'rgba(255,255,255,0.06)',
                  color: selectedFps === fps ? '#ffffff' : Colors.text.secondary,
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  padding: '3px 8px',
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {fps}
              </button>
            ))}
          </div>

          {manualScrub !== null && (
            <button
              type="button"
              onClick={() => setManualScrub(null)}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                border: '1px solid #ef4444',
                borderRadius: 4,
                padding: '3px 8px',
                fontSize: 10,
                cursor: 'pointer',
              }}
            >
              Sync with Video Playhead
            </button>
          )}
        </div>
      </div>

      {/* 2. Live Inspector Summary Card */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        {/* Frame & Timecode */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 8,
            border: `1px solid ${Colors.border.default}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 10, textTransform: 'uppercase', color: Colors.text.secondary, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} color={Colors.accent.cyan} /> Playhead Timecode
          </span>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan }}>
            {inspection.timecode}
          </div>
          <span style={{ fontSize: 11, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
            FRAME {inspection.frame} / {composition.totalDurationInFrames} ({inspection.timeInSeconds.toFixed(2)}s)
          </span>
        </div>

        {/* Primary Active Scene */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 8,
            border: `1px solid ${Colors.border.default}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 10, textTransform: 'uppercase', color: Colors.text.secondary, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Layers size={12} color={Colors.accent.emerald} /> Active Scene
          </span>
          <div style={{ fontSize: 14, fontWeight: 700, color: inspection.primaryActiveScene ? Colors.accent.emerald : Colors.text.tertiary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {inspection.primaryActiveScene ? inspection.primaryActiveScene.name : 'NO SCENE (DELAY GAP)'}
          </div>
          <span style={{ fontSize: 11, color: Colors.text.secondary, fontFamily: Typography.fontFamily.mono }}>
            {inspection.primaryActiveScene
              ? `Range: ${inspection.primaryActiveScene.startFrame}f - ${inspection.primaryActiveScene.endFrame}f (${inspection.primaryActiveScene.durationInFrames}f)`
              : 'Idle gap between scenes'}
          </span>
        </div>

        {/* Active Transitions */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 8,
            border: `1px solid ${Colors.border.default}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 10, textTransform: 'uppercase', color: Colors.text.secondary, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Sparkles size={12} color={Colors.accent.electricViolet} /> Active Transition
          </span>
          <div style={{ fontSize: 14, fontWeight: 700, color: inspection.activeTransitions.length > 0 ? Colors.accent.electricViolet : Colors.text.tertiary }}>
            {inspection.activeTransitions.length > 0
              ? `${inspection.activeTransitions[0].directionType.toUpperCase()} (${inspection.activeTransitions[0].type})`
              : 'NONE'}
          </div>
          <span style={{ fontSize: 11, color: Colors.text.secondary, fontFamily: Typography.fontFamily.mono }}>
            {inspection.activeTransitions.length > 0
              ? `Frames ${inspection.activeTransitions[0].startFrame}f - ${inspection.activeTransitions[0].endFrame}f`
              : 'Normal playback state'}
          </span>
        </div>

        {/* Audio Layers */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 8,
            border: `1px solid ${Colors.border.default}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 10, textTransform: 'uppercase', color: Colors.text.secondary, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Volume2 size={12} color="#ec4899" /> Audio Layer State
          </span>
          <div style={{ fontSize: 14, fontWeight: 700, color: inspection.activeAudio.length > 0 ? '#ec4899' : Colors.text.tertiary }}>
            {inspection.activeAudio.length} ACTIVE TRACK{inspection.activeAudio.length !== 1 ? 'S' : ''}
          </div>
          <span style={{ fontSize: 11, color: Colors.text.secondary, fontFamily: Typography.fontFamily.mono }}>
            Total Duration: {composition.totalDurationInSeconds.toFixed(2)}s ({composition.totalDurationInFrames}f)
          </span>
        </div>
      </div>

      {/* 3. Interactive Multi-Track Timeline Visualizer */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'rgba(9, 14, 26, 0.95)',
          borderRadius: 12,
          border: `1px solid ${Colors.border.default}`,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: Colors.text.secondary, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={14} color={Colors.accent.cyan} /> Timeline Multi-Track Inspection
          </h3>
          <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            CLICK ANY TRACK TO SCRUB PLAYHEAD
          </span>
        </div>

        {/* Interactive Scrub Slider Track */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.secondary }}>
            <span>00:00:00 (0f)</span>
            <span style={{ color: Colors.accent.cyan }}>CURRENT: {inspection.timecode} ({activeFrame}f)</span>
            <span>{manager.format(composition.totalDurationInFrames)} ({composition.totalDurationInFrames}f)</span>
          </div>

          <input
            type="range"
            min={0}
            max={Math.max(1, composition.totalDurationInFrames - 1)}
            value={activeFrame}
            onChange={(e) => setManualScrub(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: Colors.accent.cyan,
              cursor: 'pointer',
            }}
          />
        </div>

        {/* Visual Multi-Track Lanes Container */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            padding: '16px 0',
            borderTop: `1px solid ${Colors.border.subtle}`,
            borderBottom: `1px solid ${Colors.border.subtle}`,
          }}
        >
          {/* Vertical Playhead Cursor Line */}
          <div
            style={{
              position: 'absolute',
              left: `${(activeFrame / Math.max(1, composition.totalDurationInFrames)) * 100}%`,
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: '#ffffff',
              boxShadow: '0 0 8px #ffffff',
              zIndex: 100,
              pointerEvents: 'none',
              transition: manualScrub === null ? 'left 0.05s linear' : 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -6,
                left: -4,
                width: 10,
                height: 10,
                backgroundColor: '#ffffff',
                borderRadius: '50%',
              }}
            />
          </div>

          {/* Lane 1: Scenes Track */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 700, color: Colors.text.secondary }}>
              1. Scene Sequence Track
            </span>
            <div
              style={{
                position: 'relative',
                height: 48,
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderRadius: 6,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {composition.scenes.map((scene, idx) => {
                const left = (scene.startFrame / Math.max(1, composition.totalDurationInFrames)) * 100;
                const width = (scene.durationInFrames / Math.max(1, composition.totalDurationInFrames)) * 100;
                const color = sceneColors[idx % sceneColors.length];
                const isActive = activeFrame >= scene.startFrame && activeFrame < scene.endFrame;

                return (
                  <div
                    key={scene.id}
                    onClick={() => setManualScrub(scene.startFrame)}
                    style={{
                      position: 'absolute',
                      left: `${left}%`,
                      width: `${width}%`,
                      height: '100%',
                      backgroundColor: `${color}${isActive ? 'dd' : '77'}`,
                      border: `1px solid ${color}`,
                      borderRadius: 4,
                      padding: '4px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      boxShadow: isActive ? `0 0 16px ${color}66` : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {scene.name}
                    </div>
                    <div style={{ fontSize: 9, fontFamily: Typography.fontFamily.mono, color: 'rgba(255,255,255,0.8)' }}>
                      {scene.startFrame}f - {scene.endFrame}f ({scene.durationInFrames}f)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lane 2: Transitions Track */}
          {composition.transitions.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 700, color: Colors.accent.electricViolet }}>
                2. Transition Envelopes
              </span>
              <div
                style={{
                  position: 'relative',
                  height: 32,
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  borderRadius: 6,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {composition.transitions.map((trans) => {
                  const left = (trans.startFrame / Math.max(1, composition.totalDurationInFrames)) * 100;
                  const width = (trans.durationInFrames / Math.max(1, composition.totalDurationInFrames)) * 100;
                  const isActive = activeFrame >= trans.startFrame && activeFrame < trans.endFrame;

                  return (
                    <div
                      key={trans.id}
                      onClick={() => setManualScrub(trans.startFrame)}
                      style={{
                        position: 'absolute',
                        left: `${left}%`,
                        width: `${Math.max(width, 1)}%`,
                        height: '100%',
                        backgroundColor: isActive ? 'rgba(168, 85, 247, 0.85)' : 'rgba(168, 85, 247, 0.35)',
                        border: '1px dashed #a855f7',
                        borderRadius: 4,
                        padding: '2px 6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        overflow: 'hidden',
                      }}
                    >
                      <span style={{ fontSize: 9, fontFamily: Typography.fontFamily.mono, color: '#ffffff', fontWeight: 700 }}>
                        {trans.directionType.toUpperCase()} ({trans.durationInFrames}f)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Lane 3: Audio Tracks */}
          {composition.audio.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 700, color: '#ec4899' }}>
                3. Audio Layers & Waveform Ranges
              </span>
              <div
                style={{
                  position: 'relative',
                  height: 40 * composition.audio.length,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                {composition.audio.map((track) => {
                  const left = (track.startFrame / Math.max(1, composition.totalDurationInFrames)) * 100;
                  const width = (track.durationInFrames / Math.max(1, composition.totalDurationInFrames)) * 100;
                  const isActive = activeFrame >= track.startFrame && activeFrame < track.endFrame;

                  return (
                    <div
                      key={track.id}
                      onClick={() => setManualScrub(track.startFrame)}
                      style={{
                        position: 'relative',
                        height: 34,
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        borderRadius: 6,
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: `${left}%`,
                          width: `${width}%`,
                          height: '100%',
                          backgroundColor: isActive ? 'rgba(236, 72, 153, 0.65)' : 'rgba(236, 72, 153, 0.25)',
                          border: '1px solid #ec4899',
                          borderRadius: 4,
                          padding: '3px 8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          overflow: 'hidden',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Volume2 size={12} color="#ffffff" />
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap' }}>
                            {track.name}
                          </span>
                        </div>
                        <span style={{ fontSize: 9, fontFamily: Typography.fontFamily.mono, color: 'rgba(255,255,255,0.8)' }}>
                          Fade In: {track.fadeInFrames}f | Out: {track.fadeOutFrames}f
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 4. Diagnostics & Validation Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            padding: '8px 12px',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            borderRadius: 6,
            fontSize: 11,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {validation.isValid ? (
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                <CheckCircle2 size={14} /> Timeline Validated: No frame drift or schedule collisions
              </span>
            ) : (
              <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                <AlertTriangle size={14} /> Validation Errors: {validation.errors.join('; ')}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: Typography.fontFamily.mono, color: Colors.text.secondary }}>
            <span>TRACKS: {composition.scenes.length} Scenes, {composition.transitions.length} Transitions, {composition.audio.length} Audio</span>
            <span style={{ color: Colors.accent.cyan }}>TOTAL: {composition.totalDurationInFrames}f ({composition.totalDurationInSeconds.toFixed(2)}s)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
