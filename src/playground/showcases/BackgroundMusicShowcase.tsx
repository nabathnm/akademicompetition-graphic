/**
 * BackgroundMusic Showcase
 * Interactive motion graphics playground demonstrating:
 * - Continuous background music spanning the entire composition
 * - Frame-accurate fade-in and fade-out respecting composition end frame
 * - Dynamic volume levels with real-time slider controls
 * - Seamless looping of musical cues and rhythm stems
 * - Volume keyframing (dipping soundtrack during announcements/voiceover)
 * - Layered multi-track orchestration (BackgroundMusic + AudioTrack SFX)
 *
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React, { useMemo, useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Activity,
  Layers,
  Music,
  Radio,
  RotateCcw,
  Sliders,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { BackgroundMusic } from '../../components/audio/BackgroundMusic.tsx';
import { AudioTrack } from '../../components/audio/AudioTrack.tsx';
import type { VolumeKeyframe } from '../../components/audio/backgroundMusicTypes.ts';
import {
  calculateBackgroundMusicVolume,
  resolveBackgroundMusicTiming,
} from '../../components/audio/backgroundMusicStyle.ts';
import { SILENT_AUDIO_DATA_URI } from '../../components/audio/audioTrackStyle.ts';
import { formatTimecode } from '../../utils/timing/frame.ts';

export type BackgroundMusicPreset =
  | 'composition-span'
  | 'volume-keyframes'
  | 'looping-rhythm'
  | 'dynamic-levels'
  | 'layered-mix';

export const BackgroundMusicShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const compDuration = videoConfig?.durationInFrames ?? 180;
  const fps = videoConfig?.fps ?? 30;

  // Preset state
  const [preset, setPreset] = useState<BackgroundMusicPreset>('composition-span');

  // Interactive controls
  const [volume, setVolume] = useState<number>(0.75);
  const [masterVolume, setMasterVolume] = useState<number>(1.0);
  const [fadeInFrames, setFadeInFrames] = useState<number>(25);
  const [fadeOutFrames, setFadeOutFrames] = useState<number>(30);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [debugHud, setDebugHud] = useState<boolean>(true);

  // Apply preset configs
  const applyPreset = (newPreset: BackgroundMusicPreset) => {
    setPreset(newPreset);
    switch (newPreset) {
      case 'composition-span':
        setVolume(0.75);
        setMasterVolume(1.0);
        setFadeInFrames(25);
        setFadeOutFrames(30);
        setIsLooping(true);
        setIsEnabled(true);
        setIsMuted(false);
        break;

      case 'volume-keyframes':
        setVolume(0.85);
        setMasterVolume(1.0);
        setFadeInFrames(15);
        setFadeOutFrames(25);
        setIsLooping(true);
        setIsEnabled(true);
        setIsMuted(false);
        break;

      case 'looping-rhythm':
        setVolume(0.8);
        setMasterVolume(1.0);
        setFadeInFrames(0);
        setFadeOutFrames(15);
        setIsLooping(true);
        setIsEnabled(true);
        setIsMuted(false);
        break;

      case 'dynamic-levels':
        setVolume(0.6);
        setMasterVolume(1.2);
        setFadeInFrames(20);
        setFadeOutFrames(20);
        setIsLooping(true);
        setIsEnabled(true);
        setIsMuted(false);
        break;

      case 'layered-mix':
        setVolume(0.7);
        setMasterVolume(1.0);
        setFadeInFrames(15);
        setFadeOutFrames(20);
        setIsLooping(true);
        setIsEnabled(true);
        setIsMuted(false);
        break;
    }
  };

  // Define keyframes for the 'volume-keyframes' preset
  const demoKeyframes: VolumeKeyframe[] | undefined = useMemo(() => {
    if (preset === 'volume-keyframes') {
      return [
        { frame: 0, volume: 1.0 },
        { frame: 35, volume: 1.0 },
        { frame: 50, volume: 0.25, easing: 'easeInOutCubic' }, // Dip for speech
        { frame: 120, volume: 0.25 }, // Maintain low bed during speech
        { frame: 135, volume: 1.0, easing: 'easeInOutCubic' }, // Swell back to full
      ];
    }
    return undefined;
  }, [preset]);

  // Timing metadata
  const timing = useMemo(() => {
    return resolveBackgroundMusicTiming(
      {
        startFrame: 0,
        fadeInFrames,
        fadeOutFrames,
      },
      compDuration,
    );
  }, [fadeInFrames, fadeOutFrames, compDuration]);

  // Live volume at current frame
  const liveVolume = useMemo(() => {
    return calculateBackgroundMusicVolume(
      {
        volume,
        fadeInFrames,
        fadeOutFrames,
        keyframes: demoKeyframes,
        enabled: isEnabled,
        muted: isMuted,
      },
      frame,
      compDuration,
      masterVolume,
    );
  }, [volume, fadeInFrames, fadeOutFrames, demoKeyframes, isEnabled, isMuted, frame, compDuration, masterVolume]);

  const volumePercent = Math.round(liveVolume * 100);

  // Active phase descriptor
  const activePhase = useMemo(() => {
    if (!isEnabled) return 'Disabled';
    if (isMuted) return 'Muted';
    if (frame < timing.fadeInFrames) return `Fade In (${frame}/${timing.fadeInFrames}f)`;
    if (frame >= compDuration - timing.fadeOutFrames) {
      return `Fade Out (${compDuration - frame}/${timing.fadeOutFrames}f)`;
    }
    if (demoKeyframes && frame >= 50 && frame <= 135) {
      return 'Voiceover Dip (Keyframe 25%)';
    }
    return 'Active Bed (Hold)';
  }, [isEnabled, isMuted, frame, timing, compDuration, demoKeyframes]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#090D16',
        color: '#F8FAFC',
        fontFamily: Typography.fontFamily.sans,
        padding: '32px 40px',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div
            style={{
              padding: 6,
              borderRadius: 8,
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              color: Colors.accent.electricViolet,
            }}
          >
            <Music size={20} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            BackgroundMusic Control Suite
          </h1>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 12,
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              color: Colors.accent.electricViolet,
              letterSpacing: '0.05em',
            }}
          >
            AUDIO LAYER 3
          </span>
        </div>
        <p style={{ margin: 0, color: Colors.text.tertiary, fontSize: 14 }}>
          Specialized continuous background music abstraction with automatic composition spanning,
          looping, dynamic volume keyframes, and boundary-anchored fade envelopes.
        </p>
      </div>

      {/* 2. Preset Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {(
          [
            { id: 'composition-span', label: 'Full Composition Span', icon: Music },
            { id: 'volume-keyframes', label: 'Volume Keyframes (Speech Dip)', icon: Activity },
            { id: 'looping-rhythm', label: 'Continuous Loop (30f Chunk)', icon: RotateCcw },
            { id: 'dynamic-levels', label: 'Dynamic Level Mixer', icon: Sliders },
            { id: 'layered-mix', label: 'Layered Mix (+ SFX Stems)', icon: Layers },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const isSelected = preset === item.id;
          return (
            <button
              key={item.id}
              onClick={() => applyPreset(item.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: isSelected ? 600 : 500,
                backgroundColor: isSelected ? Colors.accent.electricViolet : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? '#FFFFFF' : '#CBD5E1',
                border: isSelected ? '1px solid transparent' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={14} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* 3. Controls Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 16,
          marginBottom: 24,
          padding: 16,
          backgroundColor: '#0F172A',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Nominal Volume */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
            MUSIC VOLUME ({Math.round(volume * 100)}%)
          </label>
          <input
            type="range"
            min={0}
            max={1.0}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ width: '100%', accentColor: Colors.accent.electricViolet }}
          />
        </div>

        {/* Master Volume */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
            MASTER GAIN ({Math.round(masterVolume * 100)}%)
          </label>
          <input
            type="range"
            min={0}
            max={1.5}
            step={0.05}
            value={masterVolume}
            onChange={(e) => setMasterVolume(Number(e.target.value))}
            style={{ width: '100%', accentColor: Colors.accent.cyan }}
          />
        </div>

        {/* Fade In Frames */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
            FADE-IN ({fadeInFrames}f)
          </label>
          <input
            type="range"
            min={0}
            max={50}
            value={fadeInFrames}
            onChange={(e) => setFadeInFrames(Number(e.target.value))}
            style={{ width: '100%', accentColor: Colors.accent.emerald }}
          />
        </div>

        {/* Fade Out Frames */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
            FADE-OUT ({fadeOutFrames}f)
          </label>
          <input
            type="range"
            min={0}
            max={50}
            value={fadeOutFrames}
            onChange={(e) => setFadeOutFrames(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#F59E0B' }}
          />
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              style={{ accentColor: Colors.accent.emerald }}
            />
            <span style={{ color: isEnabled ? Colors.accent.emerald : '#CBD5E1' }}>Enabled</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
            <input
              type="checkbox"
              checked={isMuted}
              onChange={(e) => setIsMuted(e.target.checked)}
              style={{ accentColor: '#EF4444' }}
            />
            <span style={{ color: isMuted ? '#EF4444' : '#CBD5E1' }}>Mute</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
            <input
              type="checkbox"
              checked={isLooping}
              onChange={(e) => setIsLooping(e.target.checked)}
              style={{ accentColor: Colors.accent.cyan }}
            />
            <span style={{ color: isLooping ? Colors.accent.cyan : '#CBD5E1' }}>Continuous Loop</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
            <input
              type="checkbox"
              checked={debugHud}
              onChange={(e) => setDebugHud(e.target.checked)}
              style={{ accentColor: Colors.accent.electricViolet }}
            />
            <span style={{ color: debugHud ? Colors.accent.electricViolet : '#CBD5E1' }}>Telemetry HUD</span>
          </label>
        </div>
      </div>

      {/* 4. Telemetry Waveform and Curve Visualization */}
      <div
        style={{
          width: '100%',
          backgroundColor: '#05070E',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: 24,
          boxSizing: 'border-box',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
          marginBottom: 24,
        }}
      >
        {/* Timeline Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: 12,
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                color: Colors.accent.electricViolet,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <Radio size={14} />
              PLAYHEAD: {formatTimecode(frame, fps)} ({frame}f / {compDuration}f)
            </div>
            <div
              style={{
                fontSize: 12,
                color: Colors.text.tertiary,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                padding: '4px 10px',
                borderRadius: 6,
              }}
            >
              Status: <strong style={{ color: '#F8FAFC' }}>{activePhase}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: Colors.text.tertiary }}>LIVE OUTPUT:</span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: volumePercent > 80 ? Colors.accent.emerald : Colors.accent.electricViolet,
                fontFamily: Typography.fontFamily.mono,
              }}
            >
              {volumePercent}%
            </span>
          </div>
        </div>

        {/* Dynamic Envelope Visualization */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.tertiary, marginBottom: 6 }}>
            <span>ENVELOPE CURVE & PLAYHEAD SCRUBBER</span>
            <span>Total Duration: {compDuration} frames ({Math.round(compDuration / fps)}s)</span>
          </div>

          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 100,
              backgroundColor: '#0A0F1D',
              borderRadius: 8,
              border: '1px solid rgba(255, 255, 255, 0.06)',
              overflow: 'hidden',
            }}
          >
            {/* Fade In visual indicator zone */}
            {fadeInFrames > 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: `${(fadeInFrames / compDuration) * 100}%`,
                  height: '100%',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  borderRight: '1px dashed rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 4,
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ fontSize: 9, color: Colors.accent.emerald, fontWeight: 600 }}>
                  Fade-In ({fadeInFrames}f)
                </span>
              </div>
            )}

            {/* Fade Out visual indicator zone */}
            {fadeOutFrames > 0 && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  width: `${(fadeOutFrames / compDuration) * 100}%`,
                  height: '100%',
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  borderLeft: '1px dashed rgba(245, 158, 11, 0.4)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  padding: 4,
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ fontSize: 9, color: '#F59E0B', fontWeight: 600 }}>
                  Fade-Out ({fadeOutFrames}f)
                </span>
              </div>
            )}

            {/* Keyframe Markers */}
            {demoKeyframes?.map((kf, idx) => {
              const xPercent = (kf.frame / compDuration) * 100;
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: `${xPercent}%`,
                    top: 10,
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: Colors.accent.cyan,
                      boxShadow: '0 0 8px rgba(6, 182, 212, 0.8)',
                    }}
                  />
                  <span style={{ fontSize: 9, color: Colors.accent.cyan, marginTop: 2, fontWeight: 600 }}>
                    {Math.round(kf.volume * 100)}%
                  </span>
                </div>
              );
            })}

            {/* Simulated Envelope Waveform line */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '100%',
                height: `${volumePercent}%`,
                background:
                  'linear-gradient(180deg, rgba(139, 92, 246, 0.4) 0%, rgba(139, 92, 246, 0.05) 100%)',
                borderTop: '2px solid #8B5CF6',
                transition: 'height 0.05s ease-out',
              }}
            />

            {/* Playhead Vertical Cursor */}
            <div
              style={{
                position: 'absolute',
                left: `${(frame / compDuration) * 100}%`,
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: '#FFFFFF',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.9)',
                zIndex: 10,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -2,
                  left: -4,
                  width: 10,
                  height: 6,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
        </div>

        {/* Audio Track Channel Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#0F172A',
            borderRadius: 10,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                color: Colors.accent.electricViolet,
              }}
            >
              <Volume2 size={16} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#F8FAFC' }}>
                Main Bed: Cinematic Score
              </div>
              <div style={{ fontSize: 11, color: Colors.text.tertiary }}>
                Source: <code>ambient_score.mp3</code> • Continuous Loop • {timing.durationInFrames}f duration
              </div>
            </div>
          </div>

          {/* Level Meter Bar */}
          <div style={{ width: 140, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.electricViolet }}>
              {volumePercent}%
            </div>
            <div
              style={{
                width: '100%',
                height: 6,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                marginTop: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${volumePercent}%`,
                  height: '100%',
                  backgroundColor: volumePercent > 80 ? '#EF4444' : Colors.accent.electricViolet,
                  transition: 'width 0.05s ease-out',
                }}
              />
            </div>
          </div>
        </div>

        {/* Layered Track Preview (Active in 'layered-mix' preset) */}
        {preset === 'layered-mix' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: '#0F172A',
              borderRadius: 10,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginTop: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: 'rgba(6, 182, 212, 0.2)',
                  color: Colors.accent.cyan,
                }}
              >
                <Activity size={16} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#F8FAFC' }}>
                  Overlay Stem: UI Chime SFX
                </div>
                <div style={{ fontSize: 11, color: Colors.text.tertiary }}>
                  Frame 45 to 85 • Triggered sound effect over music bed
                </div>
              </div>
            </div>

            <div style={{ fontSize: 11, color: frame >= 45 && frame <= 85 ? Colors.accent.cyan : Colors.text.tertiary }}>
              {frame >= 45 && frame <= 85 ? 'Playing (80%)' : 'Standby'}
            </div>
          </div>
        )}
      </div>

      {/* 5. Actual Remotion Audio Component Mounting */}
      {preset === 'layered-mix' ? (
        <>
          <BackgroundMusic
            src={SILENT_AUDIO_DATA_URI}
            id="bg-music-main"
            name="Cinematic Ambient Bed"
            volume={volume}
            fadeInFrames={fadeInFrames}
            fadeOutFrames={fadeOutFrames}
            loop={isLooping}
            enabled={isEnabled}
            muted={isMuted}
            masterVolume={masterVolume}
            toneFrequency={220}
            debug={debugHud}
          />
          <AudioTrack
            src={SILENT_AUDIO_DATA_URI}
            id="sfx-chime"
            name="Interface Overlay SFX"
            startAtFrame={45}
            durationInFrames={40}
            volume={0.8}
            fadeInFrames={4}
            fadeOutFrames={12}
            toneFrequency={660}
            muted={isMuted}
            disabled={!isEnabled}
            masterVolume={masterVolume}
            debug={debugHud}
          />
        </>
      ) : preset === 'looping-rhythm' ? (
        <BackgroundMusic
          src={SILENT_AUDIO_DATA_URI}
          id="bg-music-loop"
          name="Continuous Rhythm Loop"
          volume={volume}
          fadeInFrames={fadeInFrames}
          fadeOutFrames={fadeOutFrames}
          loop={true}
          loopDurationInFrames={30}
          enabled={isEnabled}
          muted={isMuted}
          masterVolume={masterVolume}
          toneFrequency={280}
          debug={debugHud}
        />
      ) : (
        <BackgroundMusic
          src={SILENT_AUDIO_DATA_URI}
          id="bg-music-standard"
          name="Dynamic Background Score"
          volume={volume}
          fadeInFrames={fadeInFrames}
          fadeOutFrames={fadeOutFrames}
          keyframes={demoKeyframes}
          loop={isLooping}
          enabled={isEnabled}
          muted={isMuted}
          masterVolume={masterVolume}
          toneFrequency={240}
          debug={debugHud}
        />
      )}

      {/* 6. Architecture Highlights */}
      <div
        style={{
          padding: 20,
          backgroundColor: '#0F172A',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: 13,
          lineHeight: 1.6,
          color: Colors.text.tertiary,
        }}
      >
        <div style={{ color: '#F8FAFC', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} color={Colors.accent.electricViolet} />
          BackgroundMusic Architecture Highlights:
        </div>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>Composition Spanning:</strong> When <code>durationInFrames</code> is omitted, <code>BackgroundMusic</code> automatically spans from <code>startFrame</code> to the end of the composition.
          </li>
          <li>
            <strong>End-Frame Bound Fade-Out:</strong> The fade-out envelope automatically counts backwards from the composition's final frame, ensuring a smooth exit without premature cutoffs.
          </li>
          <li>
            <strong>Piecewise Keyframe Automation:</strong> The <code>keyframes</code> prop allows precise volume ducking during voiceovers or swells during action shots with customizable easing curves.
          </li>
          <li>
            <strong>Reuses AudioTrack:</strong> Inherits all determinism, looping, Remotion Sequence integration, and offline-safe fallback logic without code duplication.
          </li>
        </ul>
      </div>
    </div>
  );
};
