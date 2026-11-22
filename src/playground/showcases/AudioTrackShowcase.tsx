/**
 * AudioTrack Showcase
 * Interactive motion graphics playground demonstrating Remotion audio layers:
 * - Single ambient background track with fade envelopes
 * - Multi-track simultaneous mixing (Music, Voiceover, SFX)
 * - Delayed sound effects triggering
 * - Volume adjustment and real-time ducking
 * - Fade-in and fade-out envelopes
 * - Looping rhythm tracks
 */

import React, { useMemo, useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Volume2,
  Sliders,
  RotateCcw,
  Sparkles,
  Music,
  Mic,
  Bell,
  Radio,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { AudioTrackGroup } from '../../components/audio/AudioTrackGroup.tsx';
import type { AudioTrackConfig } from '../../components/audio/audioTrackTypes.ts';
import {
  calculateAudioVolumeMetrics,
  SILENT_AUDIO_DATA_URI,
} from '../../components/audio/audioTrackStyle.ts';
import { formatTimecode } from '../../utils/timing/frame.ts';

export type AudioDemoPreset =
  | 'single-ambient'
  | 'multi-track'
  | 'delayed-sfx'
  | 'volume-ducking'
  | 'looping-track';

export const AudioTrackShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const compDuration = videoConfig?.durationInFrames ?? 180;
  const fps = videoConfig?.fps ?? 30;

  // Preset state
  const [preset, setPreset] = useState<AudioDemoPreset>('multi-track');

  // Interactive controls
  const [masterVolume, setMasterVolume] = useState<number>(1.0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [fadeInFrames, setFadeInFrames] = useState<number>(20);
  const [fadeOutFrames, setFadeOutFrames] = useState<number>(20);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [debugHud, setDebugHud] = useState<boolean>(true);

  // Apply preset configs
  const applyPreset = (newPreset: AudioDemoPreset) => {
    setPreset(newPreset);
    switch (newPreset) {
      case 'single-ambient':
        setMasterVolume(1.0);
        setPlaybackRate(1.0);
        setFadeInFrames(30);
        setFadeOutFrames(30);
        setIsMuted(false);
        setIsDisabled(false);
        setIsLooping(false);
        break;

      case 'multi-track':
        setMasterVolume(1.0);
        setPlaybackRate(1.0);
        setFadeInFrames(15);
        setFadeOutFrames(20);
        setIsMuted(false);
        setIsDisabled(false);
        setIsLooping(false);
        break;

      case 'delayed-sfx':
        setMasterVolume(1.0);
        setPlaybackRate(1.25);
        setFadeInFrames(5);
        setFadeOutFrames(10);
        setIsMuted(false);
        setIsDisabled(false);
        setIsLooping(false);
        break;

      case 'volume-ducking':
        setMasterVolume(1.0);
        setPlaybackRate(1.0);
        setFadeInFrames(15);
        setFadeOutFrames(15);
        setIsMuted(false);
        setIsDisabled(false);
        setIsLooping(false);
        break;

      case 'looping-track':
        setMasterVolume(0.85);
        setPlaybackRate(1.0);
        setFadeInFrames(0);
        setFadeOutFrames(10);
        setIsMuted(false);
        setIsDisabled(false);
        setIsLooping(true);
        break;
    }
  };

  // Configure tracks based on current preset
  const tracks: AudioTrackConfig[] = useMemo(() => {
    switch (preset) {
      case 'single-ambient':
        return [
          {
            id: 'ambient-bed',
            name: 'Ambient Electronic Bed',
            src: SILENT_AUDIO_DATA_URI,
            startAtFrame: 0,
            durationInFrames: compDuration,
            volume: 0.85,
            fadeInFrames,
            fadeOutFrames,
            playbackRate,
            loop: isLooping,
            toneFrequency: 440,
          },
        ];

      case 'delayed-sfx':
        return [
          {
            id: 'ambient-bg',
            name: 'Subtle Background Tone',
            src: SILENT_AUDIO_DATA_URI,
            startAtFrame: 0,
            durationInFrames: compDuration,
            volume: 0.3,
            fadeInFrames: 15,
            fadeOutFrames: 15,
          },
          {
            id: 'sfx-chime-1',
            name: 'UI Reveal Chime (Delayed 45f)',
            src: SILENT_AUDIO_DATA_URI,
            startAtFrame: 45,
            durationInFrames: 30,
            volume: 0.9,
            fadeInFrames: 2,
            fadeOutFrames: 15,
            toneFrequency: 880,
          },
          {
            id: 'sfx-riser-2',
            name: 'Action Swoosh (Delayed 105f)',
            src: SILENT_AUDIO_DATA_URI,
            startAtFrame: 105,
            durationInFrames: 35,
            volume: 0.95,
            fadeInFrames: 4,
            fadeOutFrames: 12,
            toneFrequency: 660,
          },
        ];

      case 'volume-ducking':
        return [
          {
            id: 'bg-music',
            name: 'Cinematic Score Bed (Ducked)',
            src: SILENT_AUDIO_DATA_URI,
            startAtFrame: 0,
            durationInFrames: compDuration,
            volume: 0.85,
            fadeInFrames: 15,
            fadeOutFrames: 15,
            toneFrequency: 220,
          },
          {
            id: 'voiceover',
            name: 'Voiceover Narration [Frames 30..120]',
            src: SILENT_AUDIO_DATA_URI,
            startAtFrame: 30,
            durationInFrames: 90,
            volume: 1.0,
            fadeInFrames: 8,
            fadeOutFrames: 8,
            toneFrequency: 520,
          },
        ];

      case 'looping-track':
        return [
          {
            id: 'drum-loop',
            name: 'Short Rhythm Stem (30f Loop Cycle)',
            src: SILENT_AUDIO_DATA_URI,
            startAtFrame: 0,
            durationInFrames: compDuration,
            loop: true,
            loopDurationInFrames: 30,
            volume: 0.8,
            fadeInFrames,
            fadeOutFrames,
            toneFrequency: 330,
          },
        ];

      case 'multi-track':
      default:
        return [
          {
            id: 'music-bed',
            name: 'Commercial Theme (Music)',
            src: SILENT_AUDIO_DATA_URI,
            startAtFrame: 0,
            durationInFrames: compDuration,
            volume: 0.75,
            fadeInFrames,
            fadeOutFrames,
            playbackRate,
            loop: isLooping,
            toneFrequency: 260,
          },
          {
            id: 'voiceover-stem',
            name: 'Product Narration (Voice)',
            src: SILENT_AUDIO_DATA_URI,
            startAtFrame: 20,
            durationInFrames: 110,
            volume: 0.95,
            fadeInFrames: 10,
            fadeOutFrames: 10,
            toneFrequency: 550,
          },
          {
            id: 'ui-chime',
            name: 'Interface Notification (SFX)',
            src: SILENT_AUDIO_DATA_URI,
            startAtFrame: 75,
            durationInFrames: 40,
            volume: 0.8,
            fadeInFrames: 2,
            fadeOutFrames: 15,
            toneFrequency: 920,
          },
        ];
    }
  }, [preset, compDuration, fadeInFrames, fadeOutFrames, playbackRate, isLooping]);

  // Compute live frame metrics for all channels
  const trackMetrics = useMemo(() => {
    return tracks.map((track) => {
      return {
        track,
        metrics: calculateAudioVolumeMetrics(track, {
          globalFrame: frame,
          compositionDuration: compDuration,
          masterVolume: isMuted ? 0 : masterVolume,
        }),
      };
    });
  }, [tracks, frame, compDuration, masterVolume, isMuted]);

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
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              color: Colors.accent.cyan,
            }}
          >
            <Volume2 size={20} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            AudioTrack Mixing Console
          </h1>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 12,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: Colors.accent.emerald,
              border: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            Layer 2 Audio Engine
          </span>
        </div>
        <p style={{ margin: 0, color: Colors.text.tertiary, fontSize: 14, maxWidth: 840 }}>
          Declarative, deterministic Remotion audio layers. Supports independent positioning,
          fade-in and fade-out automation, volume ducking, playback rates, and multi-track orchestration.
        </p>
      </div>

      {/* 2. Preset Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 24,
          padding: 14,
          backgroundColor: '#0F172A',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <span
          style={{
            alignSelf: 'center',
            fontSize: 12,
            fontWeight: 600,
            color: Colors.text.tertiary,
            marginRight: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Scenarios:
        </span>
        {(
          [
            { id: 'multi-track', label: 'Multi-Track Mix', icon: Sliders },
            { id: 'single-ambient', label: 'Single Ambient Bed', icon: Music },
            { id: 'volume-ducking', label: 'Voiceover Ducking', icon: Mic },
            { id: 'delayed-sfx', label: 'Delayed Sound Effects', icon: Bell },
            { id: 'looping-track', label: 'Looping Rhythm', icon: RotateCcw },
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
                backgroundColor: isSelected ? Colors.accent.cyan : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? '#000000' : '#CBD5E1',
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

      {/* 3. Control Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 24,
          padding: 16,
          backgroundColor: '#0F172A',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Master Volume */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
            MASTER VOLUME ({Math.round(masterVolume * 100)}%)
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

        {/* Playback Rate */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
            PLAYBACK SPEED ({playbackRate}x)
          </label>
          <select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '6px 10px',
              borderRadius: 6,
              backgroundColor: '#1E293B',
              color: '#F8FAFC',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: 13,
            }}
          >
            <option value={0.5}>0.5x (Slow)</option>
            <option value={0.75}>0.75x</option>
            <option value={1.0}>1.0x (Normal)</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x (Fast)</option>
          </select>
        </div>

        {/* Fade In Frames */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
            FADE-IN ({fadeInFrames}f)
          </label>
          <input
            type="range"
            min={0}
            max={45}
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
            max={45}
            value={fadeOutFrames}
            onChange={(e) => setFadeOutFrames(Number(e.target.value))}
            style={{ width: '100%', accentColor: Colors.accent.electricViolet }}
          />
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
            <input
              type="checkbox"
              checked={isMuted}
              onChange={(e) => setIsMuted(e.target.checked)}
              style={{ accentColor: '#F59E0B' }}
            />
            <span style={{ color: isMuted ? '#F59E0B' : '#CBD5E1' }}>Mute Master</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
            <input
              type="checkbox"
              checked={isDisabled}
              onChange={(e) => setIsDisabled(e.target.checked)}
              style={{ accentColor: '#EF4444' }}
            />
            <span style={{ color: isDisabled ? '#EF4444' : '#CBD5E1' }}>Disable Tracks</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
            <input
              type="checkbox"
              checked={isLooping}
              onChange={(e) => setIsLooping(e.target.checked)}
              style={{ accentColor: Colors.accent.cyan }}
            />
            <span style={{ color: isLooping ? Colors.accent.cyan : '#CBD5E1' }}>Loop Tracks</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
            <input
              type="checkbox"
              checked={debugHud}
              onChange={(e) => setDebugHud(e.target.checked)}
              style={{ accentColor: Colors.accent.emerald }}
            />
            <span style={{ color: debugHud ? Colors.accent.emerald : '#CBD5E1' }}>Debug Telemetry</span>
          </label>
        </div>
      </div>

      {/* 4. Multi-Track Studio Monitor Viewport */}
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
            paddingBottom: 16,
            marginBottom: 20,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Radio size={18} color={Colors.accent.cyan} />
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.04em' }}>
              MULTI-TRACK CHANNEL MIXER
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, fontFamily: Typography.fontFamily.mono }}>
            <span>TIMECODE: <span style={{ color: Colors.accent.cyan }}>{formatTimecode(frame, fps)}</span></span>
            <span>FRAME: <span style={{ color: '#FACC15' }}>{frame}</span> / {compDuration}</span>
          </div>
        </div>

        {/* Channel Strips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {trackMetrics.map(({ track, metrics }, idx) => {
            const startAt = track.startAtFrame ?? track.startFrame ?? 0;
            const duration = track.durationInFrames ?? compDuration;
            const endAt = startAt + duration;

            const percent = Math.round(metrics.finalVolume * 100);
            const isPlaying = metrics.phase === 'fadeIn' || metrics.phase === 'hold' || metrics.phase === 'fadeOut';

            // Animated waveform bars
            const bars = Array.from({ length: 24 }).map((_, bIdx) => {
              if (!isPlaying || isMuted || isDisabled) return 2;
              const sinVal = Math.sin((frame * 0.3) + (bIdx * 0.4) + idx) * 0.4 + 0.6;
              return Math.max(2, Math.round(metrics.finalVolume * sinVal * 28));
            });

            return (
              <div
                key={track.id ?? idx}
                style={{
                  backgroundColor: '#0F172A',
                  borderRadius: 10,
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  padding: '14px 18px',
                  display: 'grid',
                  gridTemplateColumns: '220px 140px 1fr 100px',
                  alignItems: 'center',
                  gap: 20,
                }}
              >
                {/* Track Info */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#F8FAFC', marginBottom: 4 }}>
                    {track.name ?? `Track ${idx + 1}`}
                  </div>
                  <div style={{ fontSize: 11, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
                    [{startAt}f .. {endAt}f] ({duration}f)
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      fontFamily: Typography.fontFamily.mono,
                      padding: '3px 8px',
                      borderRadius: 4,
                      backgroundColor:
                        isDisabled || metrics.isMuted
                          ? 'rgba(239, 68, 68, 0.15)'
                          : metrics.phase === 'hold'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : metrics.phase === 'fadeIn'
                              ? 'rgba(6, 182, 212, 0.15)'
                              : metrics.phase === 'fadeOut'
                                ? 'rgba(168, 85, 247, 0.15)'
                                : 'rgba(255, 255, 255, 0.05)',
                      color:
                        isDisabled || metrics.isMuted
                          ? '#EF4444'
                          : metrics.phase === 'hold'
                            ? Colors.accent.emerald
                            : metrics.phase === 'fadeIn'
                              ? Colors.accent.cyan
                              : metrics.phase === 'fadeOut'
                                ? Colors.accent.electricViolet
                                : Colors.text.tertiary,
                    }}
                  >
                    {isDisabled ? 'DISABLED' : metrics.isMuted ? 'MUTED' : metrics.phase.toUpperCase()}
                  </span>
                </div>

                {/* Animated Waveform Visualizer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    height: 32,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    padding: '0 12px',
                    borderRadius: 6,
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  {bars.map((h, bIdx) => (
                    <div
                      key={bIdx}
                      style={{
                        flex: 1,
                        height: `${h}px`,
                        backgroundColor:
                          percent > 80
                            ? '#EF4444'
                            : percent > 50
                              ? Colors.accent.cyan
                              : 'rgba(255, 255, 255, 0.25)',
                        borderRadius: 1,
                        transition: 'height 0.05s ease',
                      }}
                    />
                  ))}
                </div>

                {/* Peak VU Meter */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, fontFamily: Typography.fontFamily.mono, color: percent > 85 ? '#EF4444' : Colors.accent.cyan }}>
                    {percent}%
                  </div>
                  <div style={{ width: '100%', height: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
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
            );
          })}
        </div>
      </div>

      {/* 5. Actual Remotion Audio Component Mounting */}
      {preset === 'volume-ducking' ? (
        <AudioTrackGroup
          tracks={tracks}
          masterVolume={masterVolume}
          muted={isMuted}
          disabled={isDisabled}
          ducking={{
            triggerTrackId: 'voiceover',
            targetTrackId: 'bg-music',
            duckedVolume: 0.2,
          }}
          debug={debugHud}
        />
      ) : (
        <AudioTrackGroup
          tracks={tracks}
          masterVolume={masterVolume}
          muted={isMuted}
          disabled={isDisabled}
          debug={debugHud}
        />
      )}

      {/* 6. Documentation / Architecture Notes */}
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
          <Sparkles size={16} color={Colors.accent.cyan} />
          Audio Engine Highlights:
        </div>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>Deterministic Remotion Audio:</strong> Uses Remotion's frame-accurate <code>&lt;Audio /&gt;</code> and <code>volume</code> callback with zero floating-point drift.
          </li>
          <li>
            <strong>Automated Fade Envelopes:</strong> Handles simultaneous fade-in and fade-out with standard cubic bezier curves and proportional scaling if fade duration exceeds track lifespan.
          </li>
          <li>
            <strong>Multi-Track Ducking:</strong> <code>AudioTrackGroup</code> automatically detects active voiceover frames and smooths background music down to designated ducked levels.
          </li>
          <li>
            <strong>Safe Offline Fallback:</strong> Includes <code>SILENT_AUDIO_DATA_URI</code> ensuring tests and offline rendering pipelines run without broken asset warnings.
          </li>
        </ul>
      </div>
    </div>
  );
};
