/**
 * SoundEffect Showcase
 * Interactive motion graphics playground demonstrating:
 * - Short snappy UI click synchronized with button states
 * - Transition whoosh synchronized with wipe/slide boundary
 * - Notification chime synchronized with entrance animations
 * - Multi-cue sequential sound events along a commercial timeline
 * - Playback rate tuning (speed/pitch dynamics) and volume controls
 *
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React, { useMemo, useState } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Bell,
  CheckCircle,
  Layers,
  MousePointer,
  Radio,
  Sliders,
  Sparkles,
  Wind,
  Zap,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { SoundEffectGroup } from '../../components/audio/SoundEffectGroup.tsx';
import type { SoundEffectProps } from '../../components/audio/soundEffectTypes.ts';
import {
  calculateSoundEffectVolume,
  resolveSoundEffectTiming,
} from '../../components/audio/soundEffectStyle.ts';
import { formatTimecode } from '../../utils/timing/frame.ts';

export type SoundEffectDemoPreset =
  | 'ui-click'
  | 'transition-whoosh'
  | 'notification'
  | 'multi-cue'
  | 'pitch-rate-tune';

export const SoundEffectShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const compDuration = videoConfig?.durationInFrames ?? 180;
  const fps = videoConfig?.fps ?? 30;

  // Preset state
  const [preset, setPreset] = useState<SoundEffectDemoPreset>('multi-cue');

  // Interactive controls
  const [volume, setVolume] = useState<number>(1.0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [preservePitch, setPreservePitch] = useState<boolean>(true);
  const [masterVolume, setMasterVolume] = useState<number>(1.0);
  const [triggerOffset, setTriggerOffset] = useState<number>(0);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [debugHud, setDebugHud] = useState<boolean>(true);

  // Apply preset configs
  const applyPreset = (newPreset: SoundEffectDemoPreset) => {
    setPreset(newPreset);
    switch (newPreset) {
      case 'ui-click':
        setVolume(1.0);
        setPlaybackRate(1.0);
        setPreservePitch(true);
        setTriggerOffset(0);
        break;

      case 'transition-whoosh':
        setVolume(0.9);
        setPlaybackRate(1.0);
        setPreservePitch(false);
        setTriggerOffset(0);
        break;

      case 'notification':
        setVolume(1.0);
        setPlaybackRate(1.0);
        setPreservePitch(true);
        setTriggerOffset(0);
        break;

      case 'multi-cue':
        setVolume(1.0);
        setPlaybackRate(1.0);
        setPreservePitch(true);
        setTriggerOffset(0);
        break;

      case 'pitch-rate-tune':
        setVolume(1.1);
        setPlaybackRate(1.5);
        setPreservePitch(false); // Changing pitch with playback speed creates dramatic pitch shifts
        setTriggerOffset(0);
        break;
    }
  };

  // Sound cues definition for the current preset
  const activeEffects: SoundEffectProps[] = useMemo(() => {
    switch (preset) {
      case 'ui-click':
        return [
          {
            id: 'click-event',
            preset: 'ui-click',
            triggerFrame: Math.max(0, 30 + triggerOffset),
            volume,
            playbackRate,
            preservePitch,
          },
        ];

      case 'transition-whoosh':
        return [
          {
            id: 'whoosh-event',
            preset: 'whoosh',
            triggerFrame: Math.max(0, 30 + triggerOffset),
            volume,
            playbackRate,
            preservePitch,
          },
        ];

      case 'notification':
        return [
          {
            id: 'notif-event',
            preset: 'notification',
            triggerFrame: Math.max(0, 30 + triggerOffset),
            volume,
            playbackRate,
            preservePitch,
          },
        ];

      case 'pitch-rate-tune':
        return [
          {
            id: 'tuned-whoosh',
            preset: 'whoosh',
            name: `Tuned Whoosh (${playbackRate}x speed)`,
            triggerFrame: Math.max(0, 25 + triggerOffset),
            volume,
            playbackRate,
            preservePitch,
          },
          {
            id: 'tuned-pop',
            preset: 'pop',
            name: `Tuned Pop (${playbackRate}x speed)`,
            triggerFrame: Math.max(0, 75 + triggerOffset),
            volume,
            playbackRate,
            preservePitch,
          },
        ];

      case 'multi-cue':
      default:
        return [
          {
            id: 'scene-intro-whoosh',
            preset: 'whoosh',
            name: 'Scene Entrance Whoosh',
            triggerFrame: Math.max(0, 10 + triggerOffset),
            volume: 0.85,
          },
          {
            id: 'button-click',
            preset: 'ui-click',
            name: 'User Click Interaction',
            triggerFrame: Math.max(0, 45 + triggerOffset),
            volume: 1.0,
          },
          {
            id: 'notification-alert',
            preset: 'notification',
            name: 'Notification Card Pop',
            triggerFrame: Math.max(0, 80 + triggerOffset),
            volume: 0.95,
          },
          {
            id: 'toggle-switch',
            preset: 'switch',
            name: 'Feature Toggle Flip',
            triggerFrame: Math.max(0, 115 + triggerOffset),
            volume: 0.8,
          },
          {
            id: 'success-chime',
            preset: 'success',
            name: 'Purchase Complete Chime',
            triggerFrame: Math.max(0, 140 + triggerOffset),
            volume: 1.0,
          },
        ];
    }
  }, [preset, volume, playbackRate, preservePitch, triggerOffset]);

  // Compute live timing and volume for each cue
  const cueTelemetry = useMemo(() => {
    return activeEffects.map((cue) => {
      const timing = resolveSoundEffectTiming(cue, compDuration);
      const liveVol = calculateSoundEffectVolume(
        {
          ...cue,
          enabled: isEnabled,
          muted: isMuted,
        },
        frame,
        compDuration,
        masterVolume,
      );
      const isCurrentlyPlaying = frame >= timing.startFrame && frame < timing.endFrame;

      return {
        cue,
        timing,
        liveVol,
        isCurrentlyPlaying,
      };
    });
  }, [activeEffects, frame, compDuration, isEnabled, isMuted, masterVolume]);

  // Aggregate current volume across all sound effects
  const activeSoundCue = cueTelemetry.find((c) => c.isCurrentlyPlaying);
  const aggregateVolumePercent = Math.round((activeSoundCue?.liveVol ?? 0) * 100);

  // Synchronized visual animation for demo presets:
  // Button click animation around frame 30-40
  const clickSpring = spring({
    frame: frame - (30 + triggerOffset),
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 220 },
  });
  const buttonScale = frame >= 30 + triggerOffset && frame < 55 + triggerOffset
    ? interpolate(clickSpring, [0, 0.5, 1], [1.0, 0.88, 1.0])
    : 1.0;

  // Whoosh bar position across frame 30-50
  const whooshProgress = interpolate(frame, [30 + triggerOffset, 50 + triggerOffset], [-100, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Notification pop scale around frame 30-60
  const notifSpring = spring({
    frame: frame - (30 + triggerOffset),
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 180 },
  });
  const notifScale = frame >= 30 + triggerOffset
    ? interpolate(notifSpring, [0, 1], [0, 1])
    : 0;

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
              backgroundColor: 'rgba(236, 72, 153, 0.15)',
              color: '#EC4899',
            }}
          >
            <Zap size={20} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            SoundEffect Event Sequencer
          </h1>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 12,
              backgroundColor: 'rgba(236, 72, 153, 0.2)',
              color: '#EC4899',
              letterSpacing: '0.05em',
            }}
          >
            AUDIO LAYER 2/3
          </span>
        </div>
        <p style={{ margin: 0, color: Colors.text.tertiary, fontSize: 14 }}>
          Frame-accurate sound effect triggers synchronized with visual transitions, clicks, chimes,
          and UI notifications with strict playback boundary confinement.
        </p>
      </div>

      {/* 2. Preset Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {(
          [
            { id: 'multi-cue', label: 'Multi-Cue Commercial Timeline', icon: Layers },
            { id: 'ui-click', label: 'UI Click (Button Sync)', icon: MousePointer },
            { id: 'transition-whoosh', label: 'Transition Whoosh', icon: Wind },
            { id: 'notification', label: 'Notification Chime', icon: Bell },
            { id: 'pitch-rate-tune', label: 'Playback Rate & Pitch Tuning', icon: Sliders },
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
                backgroundColor: isSelected ? '#EC4899' : 'rgba(255, 255, 255, 0.04)',
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
        {/* SFX Volume */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
            SFX VOLUME ({Math.round(volume * 100)}%)
          </label>
          <input
            type="range"
            min={0}
            max={1.5}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#EC4899' }}
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
            <option value={0.5}>0.5x (Deep Impact)</option>
            <option value={0.75}>0.75x</option>
            <option value={1.0}>1.0x (Standard)</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x (Fast Swell)</option>
            <option value={2.0}>2.0x (Laser Snap)</option>
          </select>
        </div>

        {/* Trigger Frame Offset */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
            TRIGGER SHIFT ({triggerOffset > 0 ? `+${triggerOffset}` : triggerOffset}f)
          </label>
          <input
            type="range"
            min={-15}
            max={25}
            value={triggerOffset}
            onChange={(e) => setTriggerOffset(Number(e.target.value))}
            style={{ width: '100%', accentColor: Colors.accent.cyan }}
          />
        </div>

        {/* Master Gain */}
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
            style={{ width: '100%', accentColor: Colors.accent.emerald }}
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
              checked={preservePitch}
              onChange={(e) => setPreservePitch(e.target.checked)}
              style={{ accentColor: '#EC4899' }}
            />
            <span style={{ color: preservePitch ? '#CBD5E1' : '#F59E0B' }}>
              {preservePitch ? 'Preserve Pitch' : 'Pitch Shifts with Speed'}
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
            <input
              type="checkbox"
              checked={debugHud}
              onChange={(e) => setDebugHud(e.target.checked)}
              style={{ accentColor: Colors.accent.cyan }}
            />
            <span style={{ color: debugHud ? Colors.accent.cyan : '#CBD5E1' }}>Telemetry HUD</span>
          </label>
        </div>
      </div>

      {/* 4. Live Visual Interaction Sync Simulation */}
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
        {/* Playhead Status Bar */}
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
                backgroundColor: 'rgba(236, 72, 153, 0.2)',
                color: '#EC4899',
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
              Active Cue:{' '}
              <strong style={{ color: activeSoundCue ? '#EC4899' : '#94A3B8' }}>
                {activeSoundCue ? activeSoundCue.timing.name : 'None (Silent Guard)'}
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: Colors.text.tertiary }}>LIVE SFX OUTPUT:</span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: aggregateVolumePercent > 0 ? '#EC4899' : Colors.text.tertiary,
                fontFamily: Typography.fontFamily.mono,
              }}
            >
              {aggregateVolumePercent}%
            </span>
          </div>
        </div>

        {/* Visual Synchronized Stage */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 120,
            backgroundColor: '#0F172A',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            marginBottom: 20,
          }}
        >
          {preset === 'ui-click' && (
            <button
              style={{
                transform: `scale(${buttonScale})`,
                transformOrigin: 'center',
                padding: '14px 28px',
                borderRadius: 10,
                backgroundColor: frame >= 30 + triggerOffset && frame < 40 + triggerOffset ? '#EC4899' : '#3B82F6',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 15,
                border: 'none',
                boxShadow: frame >= 30 + triggerOffset && frame < 40 + triggerOffset
                  ? '0 0 25px rgba(236, 72, 153, 0.8)'
                  : '0 4px 15px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <MousePointer size={18} />
              {frame >= 30 + triggerOffset && frame < 40 + triggerOffset ? 'CLICK TRIGGERED!' : 'Click Me'}
            </button>
          )}

          {preset === 'transition-whoosh' && (
            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  position: 'absolute',
                  left: `${whooshProgress}%`,
                  width: 140,
                  height: '100%',
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(236, 72, 153, 0.6) 50%, transparent 100%)',
                  filter: 'blur(8px)',
                }}
              />
              <div style={{ margin: '0 auto', textAlign: 'center', zIndex: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#F8FAFC' }}>
                  Wipe Transition Midpoint: Frame {30 + triggerOffset + 10}
                </div>
                <div style={{ fontSize: 11, color: Colors.text.tertiary }}>
                  Whoosh sound envelope sweeps across boundary
                </div>
              </div>
            </div>
          )}

          {preset === 'notification' && (
            <div
              style={{
                transform: `scale(${notifScale})`,
                opacity: notifScale,
                padding: '12px 20px',
                borderRadius: 10,
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div style={{ padding: 6, borderRadius: '50%', backgroundColor: Colors.accent.emerald, color: '#000' }}>
                <CheckCircle size={16} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Payment Received</div>
                <div style={{ fontSize: 11, color: Colors.text.tertiary }}>Triggered at Frame {30 + triggerOffset}</div>
              </div>
            </div>
          )}

          {(preset === 'multi-cue' || preset === 'pitch-rate-tune') && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC', marginBottom: 4 }}>
                Commercial Sound Stage Active
              </div>
              <div style={{ fontSize: 12, color: Colors.text.tertiary }}>
                {activeSoundCue
                  ? `⚡ Playing: ${activeSoundCue.timing.name} (Frame ${activeSoundCue.timing.startFrame}..${activeSoundCue.timing.endFrame})`
                  : 'Idle (Protected against accidental playback)'}
              </div>
            </div>
          )}
        </div>

        {/* 5. Multi-Track Timeline Cue Strips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.tertiary, marginBottom: 2 }}>
            <span>SOUND EFFECT TIMELINE LANES</span>
            <span>Total Duration: {compDuration} frames ({Math.round(compDuration / fps)}s)</span>
          </div>

          {cueTelemetry.map((item, idx) => {
            const { cue, timing, liveVol, isCurrentlyPlaying } = item;
            const leftPercent = (timing.startFrame / compDuration) * 100;
            const widthPercent = (timing.durationInFrames / compDuration) * 100;
            const cueVolumePercent = Math.round(liveVol * 100);

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 12px',
                  borderRadius: 8,
                  backgroundColor: isCurrentlyPlaying ? 'rgba(236, 72, 153, 0.12)' : '#0F172A',
                  border: isCurrentlyPlaying
                    ? '1px solid rgba(236, 72, 153, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  transition: 'background-color 0.1s ease',
                }}
              >
                {/* Track Label */}
                <div style={{ width: 170, flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isCurrentlyPlaying ? '#EC4899' : '#F8FAFC' }}>
                    {timing.name}
                  </div>
                  <div style={{ fontSize: 10, color: Colors.text.tertiary }}>
                    Frame {timing.startFrame}..{timing.endFrame} ({timing.durationInFrames}f)
                  </div>
                </div>

                {/* Timeline Bar Lane */}
                <div
                  style={{
                    position: 'relative',
                    flex: 1,
                    height: 24,
                    backgroundColor: '#0A0E1A',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  {/* Sound Cue Span Block */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${leftPercent}%`,
                      width: `${Math.max(widthPercent, 1.5)}%`,
                      height: '100%',
                      backgroundColor: isCurrentlyPlaying ? '#EC4899' : 'rgba(236, 72, 153, 0.4)',
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isCurrentlyPlaying ? '0 0 10px rgba(236, 72, 153, 0.8)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: 9, color: '#FFFFFF', fontWeight: 700 }}>
                      {cue.preset ?? 'sfx'}
                    </span>
                  </div>

                  {/* Playhead Cursor */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${(frame / compDuration) * 100}%`,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      backgroundColor: '#FFFFFF',
                      zIndex: 10,
                    }}
                  />
                </div>

                {/* Live VU readout */}
                <div style={{ width: 60, textAlign: 'right', flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: Typography.fontFamily.mono,
                      fontWeight: 700,
                      color: isCurrentlyPlaying ? '#EC4899' : Colors.text.tertiary,
                    }}
                  >
                    {cueVolumePercent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Actual Remotion Component Mounting */}
      <SoundEffectGroup
        effects={activeEffects}
        masterVolume={masterVolume}
        muted={isMuted}
        disabled={!isEnabled}
        debug={debugHud}
      />

      {/* 7. Architecture Highlights */}
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
          <Sparkles size={16} color="#EC4899" />
          SoundEffect Architecture Highlights:
        </div>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>Accidental Playback Prevention:</strong> Remotion <code>&lt;Sequence&gt;</code> unmounts the element outside <code>[startFrame, endFrame)</code>, and the volume algorithm guarantees strictly 0 outside the span.
          </li>
          <li>
            <strong>Built-In Presets:</strong> Preconfigured with durations and frequencies for <code>ui-click</code>, <code>whoosh</code>, <code>notification</code>, <code>pop</code>, <code>success</code>, <code>error</code>, <code>switch</code>, and <code>shutter</code>.
          </li>
          <li>
            <strong>Transition Synchronization:</strong> Use <code>syncSoundWithTransition(startFrame, duration, &#123; alignment: 'midpoint' &#125;)</code> to effortlessly anchor whooshes to scene transitions.
          </li>
          <li>
            <strong>Speed & Pitch Manipulation:</strong> Adjust <code>playbackRate</code> to simulate slow-motion cinematic hits or high-speed whip transitions, with configurable <code>preservePitch</code>.
          </li>
        </ul>
      </div>
    </div>
  );
};
