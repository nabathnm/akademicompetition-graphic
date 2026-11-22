/**
 * AudioTimelineSyncShowcase
 * Live diagnostic Remotion testbed demonstrating audio and timeline synchronization
 * across BackgroundMusic, SoundEffect, AudioTrack, and visual scenes.
 *
 * Demonstrations:
 * 1. Background music spanning the entire composition
 * 2. Sound effects synchronized with text reveals
 * 3. Sound effects synchronized with scene transitions
 * 4. Multiple overlapping sound effects
 * 5. Background music with fade-in and fade-out
 * 6. Audio tracks with different start frames and voiceover ducking
 * 7. Composition with no audio
 * 8. Composition with audio disabled
 */

import React, { useMemo, useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Volume2,
  VolumeX,
  Music,
  Radio,
  Sliders,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { formatTimecode } from '../../utils/timing/frame.ts';
import {
  AUDIO_SYNC_SCENARIOS,
  AudioSyncScenarioId,
  calculateSimulatedVUMeterLevels,
  calculateTimelineAudioCoverage,
  detectAudioCollisions,
  TrackTimingBounds,
} from './audioTimelineSyncStyle.ts';

// Component imports
import { AdvertisementComposition } from '../../compositions/advertisements/AdvertisementComposition.tsx';
import {
  generateTextRevealSoundCues,
  syncSoundWithTransition,
} from '../../components/audio/soundEffectStyle.ts';
import { HeroScene } from '../../components/scenes/HeroScene.tsx';
import { ProductShowcaseScene } from '../../components/scenes/ProductShowcaseScene.tsx';
import { TransitionController } from '../../components/transitions/TransitionController.tsx';
import { WordReveal } from '../../components/typography/WordReveal.tsx';
import { AnimatedText } from '../../components/typography/AnimatedText.tsx';
import { SILENT_AUDIO_DATA_URI } from '../../components/audio/audioTrackStyle.ts';

export const AudioTimelineSyncShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps, durationInFrames: compositionDuration } = useVideoConfig();

  // Active scenario
  const [activeScenario, setActiveScenario] = useState<AudioSyncScenarioId>('bgm-full');

  const activeMeta =
    AUDIO_SYNC_SCENARIOS.find((s) => s.id === activeScenario) ?? AUDIO_SYNC_SCENARIOS[0];

  // Derive tracks for the active scenario to feed telemetry
  const scenarioTracks: TrackTimingBounds[] = useMemo(() => {
    switch (activeScenario) {
      case 'bgm-full':
        return [
          {
            id: 'bgm-full-span',
            name: 'Full Composition Score',
            startFrame: 0,
            durationInFrames: compositionDuration,
            endFrame: compositionDuration,
            volume: 0.75,
          },
        ];

      case 'sfx-text':
        return [
          {
            id: 'bgm-subtle',
            name: 'Ambient Underlay',
            startFrame: 0,
            durationInFrames: compositionDuration,
            endFrame: compositionDuration,
            volume: 0.35,
          },
          { id: 'sfx-word-0', name: 'Word 1 Pop', startFrame: 15, durationInFrames: 8, endFrame: 23, volume: 0.7 },
          { id: 'sfx-word-1', name: 'Word 2 Pop', startFrame: 21, durationInFrames: 8, endFrame: 29, volume: 0.7 },
          { id: 'sfx-word-2', name: 'Word 3 Pop', startFrame: 27, durationInFrames: 8, endFrame: 35, volume: 0.7 },
          { id: 'sfx-word-3', name: 'Word 4 Pop', startFrame: 33, durationInFrames: 8, endFrame: 41, volume: 0.7 },
        ];

      case 'sfx-transition':
        return [
          {
            id: 'bgm-cinematic',
            name: 'Cinematic Score',
            startFrame: 0,
            durationInFrames: compositionDuration,
            endFrame: compositionDuration,
            volume: 0.65,
          },
          {
            id: 'sfx-transition-whoosh',
            name: 'Transition Whoosh',
            startFrame: 50,
            durationInFrames: 20,
            endFrame: 70,
            volume: 0.9,
          },
        ];

      case 'sfx-overlap':
        return [
          {
            id: 'sfx-click',
            name: 'UI Click (f30)',
            startFrame: 30,
            durationInFrames: 6,
            endFrame: 36,
            volume: 0.8,
          },
          {
            id: 'sfx-whoosh',
            name: 'Camera Whoosh (f32)',
            startFrame: 32,
            durationInFrames: 20,
            endFrame: 52,
            volume: 0.85,
          },
          {
            id: 'sfx-chime',
            name: 'Notification Chime (f35)',
            startFrame: 35,
            durationInFrames: 24,
            endFrame: 59,
            volume: 0.9,
          },
        ];

      case 'bgm-fade':
        return [
          {
            id: 'bgm-envelope',
            name: 'Soundtrack (Fade in 20f, Fade out 30f)',
            startFrame: 0,
            durationInFrames: compositionDuration,
            endFrame: compositionDuration,
            volume: 0.8,
          },
        ];

      case 'multi-audio-stagger':
        return [
          {
            id: 'bgm-bed',
            name: 'Background Music (0f)',
            startFrame: 0,
            durationInFrames: compositionDuration,
            endFrame: compositionDuration,
            volume: currentFrame >= 30 && currentFrame < 90 ? 0.2 : 0.7,
          },
          {
            id: 'voiceover-track',
            name: 'Voiceover Narrative (30f-90f)',
            startFrame: 30,
            durationInFrames: 60,
            endFrame: 90,
            volume: 0.95,
          },
          {
            id: 'ambient-pads',
            name: 'Ambient Synth Pad (60f-150f)',
            startFrame: 60,
            durationInFrames: 90,
            endFrame: 150,
            volume: 0.5,
          },
        ];

      case 'no-audio':
        return [];

      case 'audio-disabled':
        return [
          {
            id: 'disabled-bgm',
            name: 'Muted Background Music',
            startFrame: 0,
            durationInFrames: compositionDuration,
            endFrame: compositionDuration,
            volume: 0,
            disabled: true,
          },
          {
            id: 'disabled-sfx',
            name: 'Muted Sound Effect',
            startFrame: 30,
            durationInFrames: 20,
            endFrame: 50,
            volume: 0,
            disabled: true,
          },
        ];
    }
  }, [activeScenario, compositionDuration, currentFrame]);

  // Telemetry computations
  const coverage = useMemo(() => {
    return calculateTimelineAudioCoverage(compositionDuration, scenarioTracks);
  }, [compositionDuration, scenarioTracks]);

  const collisionAnalysis = useMemo(() => {
    return detectAudioCollisions(scenarioTracks, compositionDuration);
  }, [scenarioTracks, compositionDuration]);

  const vuLevels = useMemo(() => {
    return calculateSimulatedVUMeterLevels(currentFrame, scenarioTracks, 6);
  }, [currentFrame, scenarioTracks]);

  // Dynamic sound effects for scenario 2
  const textRevealCues = useMemo(() => {
    return generateTextRevealSoundCues({
      textStartFrame: 15,
      tokenCount: 4,
      staggerInterval: 6,
      preset: 'pop',
      volume: 0.7,
    });
  }, []);

  // Transition trigger frame for scenario 3
  const transitionSfxTrigger = useMemo(() => {
    // Transition spans frames 50 to 70 (start: 50, duration: 20, midpoint: 60)
    return syncSoundWithTransition(50, 20, { alignment: 'midpoint' });
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#070B14',
        color: '#F8FAFC',
        fontFamily: Typography.fontFamily.sans,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. Header Toolbar */}
      <div
        style={{
          height: 64,
          padding: '0 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#0A0F1D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              backgroundColor: 'rgba(0, 209, 255, 0.12)',
              border: '1px solid rgba(0, 209, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: Colors.accent.cyan,
            }}
          >
            <Music size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF' }}>
                Audio & Timeline Synchronization Testbed
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  backgroundColor: 'rgba(0, 209, 255, 0.15)',
                  color: Colors.accent.cyan,
                  padding: '2px 6px',
                  borderRadius: 4,
                  border: '1px solid rgba(0, 209, 255, 0.3)',
                  fontFamily: Typography.fontFamily.mono,
                }}
              >
                LAYER 2 / LAYER 3 / LAYER 4
              </span>
            </div>
            <div style={{ fontSize: 11, color: Colors.text.tertiary }}>
              BackgroundMusic • SoundEffect • AudioTrack • TimelineManager • AdvertisementComposition
            </div>
          </div>
        </div>

        {/* Playhead HUD */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontFamily: Typography.fontFamily.mono,
              fontSize: 12,
            }}
          >
            <Activity size={14} color={Colors.accent.cyan} />
            <span style={{ color: Colors.text.tertiary }}>FRAME</span>
            <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>
              {currentFrame.toString().padStart(3, '0')}
            </span>
            <span style={{ color: Colors.text.tertiary }}>/ {compositionDuration}f</span>
            <span style={{ color: Colors.text.tertiary, marginLeft: 4 }}>
              ({formatTimecode(currentFrame, fps)})
            </span>
          </div>
        </div>
      </div>

      {/* 2. Scenario Switcher Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          padding: '10px 24px',
          backgroundColor: '#090E1B',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          overflowX: 'auto',
          flexShrink: 0,
        }}
      >
        {AUDIO_SYNC_SCENARIOS.map((scenario) => {
          const isActive = scenario.id === activeScenario;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => setActiveScenario(scenario.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 6,
                backgroundColor: isActive ? 'rgba(0, 209, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${isActive ? Colors.accent.cyan : 'rgba(255, 255, 255, 0.08)'}`,
                color: isActive ? Colors.accent.cyan : Colors.text.secondary,
                fontSize: 12,
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {scenario.id === 'bgm-full' && <Music size={13} />}
              {scenario.id === 'sfx-text' && <Sparkles size={13} />}
              {scenario.id === 'sfx-transition' && <Sliders size={13} />}
              {scenario.id === 'sfx-overlap' && <Layers size={13} />}
              {scenario.id === 'bgm-fade' && <Volume2 size={13} />}
              {scenario.id === 'multi-audio-stagger' && <Radio size={13} />}
              {scenario.id === 'no-audio' && <VolumeX size={13} />}
              {scenario.id === 'audio-disabled' && <VolumeX size={13} />}
              {scenario.title}
            </button>
          );
        })}
      </div>

      {/* 3. Main Workspace */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Live Remotion Visual Preview */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 820,
              height: 460,
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              position: 'relative',
            }}
          >
            {/* Scenario 1: BGM Spanning Full Composition */}
            {activeScenario === 'bgm-full' && (
              <AdvertisementComposition
                width={820}
                height={460}
                durationInFrames={compositionDuration}
                backgroundMusic={{
                  src: SILENT_AUDIO_DATA_URI,
                  name: 'Ambient Soundtrack',
                  volume: 0.75,
                  loop: true,
                  fadeOutFrames: 15,
                }}
                debug={false}
              >
                <div style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <AnimatedText
                    variant="fade"
                    startFrame={10}
                    style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}
                  >
                    Continuous Background Music
                  </AnimatedText>
                  <AnimatedText
                    variant="slide-up"
                    startFrame={22}
                    style={{ fontSize: 16, color: Colors.text.secondary, maxWidth: 540, lineHeight: 1.6 }}
                  >
                    Music automatically spans all 180 frames with seamless looping and resolves to silence at the end boundary.
                  </AnimatedText>
                </div>
              </AdvertisementComposition>
            )}

            {/* Scenario 2: SFX Synchronized with Text Reveal */}
            {activeScenario === 'sfx-text' && (
              <AdvertisementComposition
                width={820}
                height={460}
                durationInFrames={compositionDuration}
                backgroundMusic={{
                  src: SILENT_AUDIO_DATA_URI,
                  volume: 0.35,
                  loop: true,
                }}
                soundEffects={textRevealCues}
                debug={false}
              >
                <div style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.cyan, letterSpacing: '0.08em' }}>
                    FRAME-SYNCHRONIZED SFX CUES
                  </div>
                  <WordReveal
                    text="Harmonic Kinetic Typography Sync"
                    variant="pop"
                    startFrame={15}
                    staggerDelay={6}
                    style={{ fontSize: 36, fontWeight: 800, color: '#FFFFFF' }}
                  />
                  <div style={{ fontSize: 13, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
                    Cues triggered at frames 15, 21, 27, 33 matching word entrances
                  </div>
                </div>
              </AdvertisementComposition>
            )}

            {/* Scenario 3: SFX Synchronized with Transitions */}
            {activeScenario === 'sfx-transition' && (
              <AdvertisementComposition
                width={820}
                height={460}
                durationInFrames={compositionDuration}
                soundEffects={[
                  {
                    id: 'transition-whoosh',
                    triggerFrame: transitionSfxTrigger, // frame 60
                    preset: 'whoosh',
                    volume: 0.9,
                  },
                ]}
                debug={false}
              >
                <TransitionController
                  boundaryFrame={60}
                  transition={{
                    type: 'slide',
                    durationInFrames: 20,
                    direction: 'left',
                  }}
                  fromContent={
                    <HeroScene
                      headline="Scene 1: Introduction"
                      subtitle="Transition initiates at frame 50 towards Scene 2."
                      eyebrow="SCENE ONE"
                      cta="Next Scene"
                      style={{ width: '100%', height: '100%' }}
                    />
                  }
                  toContent={
                    <ProductShowcaseScene
                      title="Scene 2: Transition Complete"
                      subtitle="Whoosh SFX triggered at exact transition midpoint (frame 60)."
                      label="SCENE TWO"
                      details={[{ label: 'Alignment', value: 'Midpoint (f60)' }]}
                      style={{ width: '100%', height: '100%' }}
                    />
                  }
                />
              </AdvertisementComposition>
            )}

            {/* Scenario 4: Multiple Overlapping Sound Effects */}
            {activeScenario === 'sfx-overlap' && (
              <AdvertisementComposition
                width={820}
                height={460}
                durationInFrames={compositionDuration}
                soundEffects={[
                  { id: 'sfx-click', triggerFrame: 30, preset: 'ui-click', volume: 0.8 },
                  { id: 'sfx-whoosh', triggerFrame: 32, preset: 'whoosh', volume: 0.85 },
                  { id: 'sfx-chime', triggerFrame: 35, preset: 'notification', volume: 0.9 },
                ]}
                debug={false}
              >
                <div style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#EC4899', letterSpacing: '0.08em' }}>
                    POLYPHONIC AUDIO CONCURRENCY
                  </div>
                  <AnimatedText
                    variant="scale"
                    startFrame={25}
                    style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}
                  >
                    Overlapping Audio Cues
                  </AnimatedText>
                  <AnimatedText
                    variant="fade"
                    startFrame={35}
                    style={{ fontSize: 15, color: Colors.text.secondary, maxWidth: 520, lineHeight: 1.6 }}
                  >
                    Simultaneous playback: Click (f30-36), Whoosh (f32-52), and Chime (f35-59) execute together without audio distortion.
                  </AnimatedText>
                </div>
              </AdvertisementComposition>
            )}

            {/* Scenario 5: BGM with Fade-In and Fade-Out */}
            {activeScenario === 'bgm-fade' && (
              <AdvertisementComposition
                width={820}
                height={460}
                durationInFrames={compositionDuration}
                backgroundMusic={{
                  src: SILENT_AUDIO_DATA_URI,
                  volume: 0.8,
                  fadeInFrames: 20,
                  fadeOutFrames: 30,
                }}
                debug={false}
              >
                <div style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.emerald, letterSpacing: '0.08em' }}>
                    DETERMINISTIC FADE ENVELOPES
                  </div>
                  <AnimatedText
                    variant="fade-slide-up"
                    startFrame={10}
                    style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}
                  >
                    Automated Volume Curves
                  </AnimatedText>
                  <AnimatedText
                    variant="fade"
                    startFrame={25}
                    style={{ fontSize: 15, color: Colors.text.secondary, maxWidth: 520, lineHeight: 1.6 }}
                  >
                    Fade-in (0f - 20f) ramps smoothly to 0.8; fade-out (150f - 180f) resolves precisely to 0 at the composition end boundary.
                  </AnimatedText>
                </div>
              </AdvertisementComposition>
            )}

            {/* Scenario 6: Multi-Audio Stagger with Ducking */}
            {activeScenario === 'multi-audio-stagger' && (
              <AdvertisementComposition
                width={820}
                height={460}
                durationInFrames={compositionDuration}
                backgroundMusic={{
                  src: SILENT_AUDIO_DATA_URI,
                  volume: (f) => (f >= 30 && f < 90 ? 0.2 : 0.7),
                  loop: true,
                }}
                audio={[
                  {
                    src: SILENT_AUDIO_DATA_URI,
                    name: 'Voiceover Narrative',
                    startAtFrame: 30,
                    durationInFrames: 60,
                    volume: 0.95,
                  },
                  {
                    src: SILENT_AUDIO_DATA_URI,
                    name: 'Ambient Synth Pad',
                    startAtFrame: 60,
                    durationInFrames: 90,
                    volume: 0.5,
                  },
                ]}
                debug={false}
              >
                <div style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', letterSpacing: '0.08em' }}>
                    MULTI-TRACK STAGGER & DUCKING
                  </div>
                  <AnimatedText
                    variant="fade"
                    startFrame={10}
                    style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}
                  >
                    Speech & Score Coordination
                  </AnimatedText>
                  <AnimatedText
                    variant="slide-up"
                    startFrame={25}
                    style={{ fontSize: 15, color: Colors.text.secondary, maxWidth: 520, lineHeight: 1.6 }}
                  >
                    Background music automatically ducks from 0.7 to 0.2 while Voiceover is active (frames 30-90), then restores nominal volume.
                  </AnimatedText>
                </div>
              </AdvertisementComposition>
            )}

            {/* Scenario 7: Composition with No Audio */}
            {activeScenario === 'no-audio' && (
              <AdvertisementComposition
                width={820}
                height={460}
                durationInFrames={compositionDuration}
                debug={false}
              >
                <div style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: Colors.text.tertiary, letterSpacing: '0.08em' }}>
                    SILENT EXECUTION SAFETY
                  </div>
                  <AnimatedText
                    variant="fade"
                    startFrame={10}
                    style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}
                  >
                    Zero Audio Overhead
                  </AnimatedText>
                  <AnimatedText
                    variant="slide-up"
                    startFrame={20}
                    style={{ fontSize: 15, color: Colors.text.secondary, maxWidth: 520, lineHeight: 1.6 }}
                  >
                    When audio is omitted, no audio nodes are instantiated, eliminating unnecessary browser overhead and preventing crash risks.
                  </AnimatedText>
                </div>
              </AdvertisementComposition>
            )}

            {/* Scenario 8: Composition with Audio Disabled */}
            {activeScenario === 'audio-disabled' && (
              <AdvertisementComposition
                width={820}
                height={460}
                durationInFrames={compositionDuration}
                backgroundMusic={{
                  src: SILENT_AUDIO_DATA_URI,
                  volume: 0.8,
                  disabled: true,
                }}
                soundEffects={[
                  { triggerFrame: 30, preset: 'ui-click', disabled: true },
                ]}
                debug={false}
              >
                <div style={{ padding: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.crimson, letterSpacing: '0.08em' }}>
                    EXPLICIT AUDIO BYPASS
                  </div>
                  <AnimatedText
                    variant="fade"
                    startFrame={10}
                    style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF' }}
                  >
                    Disabled Audio Layers
                  </AnimatedText>
                  <AnimatedText
                    variant="slide-up"
                    startFrame={20}
                    style={{ fontSize: 15, color: Colors.text.secondary, maxWidth: 520, lineHeight: 1.6 }}
                  >
                    Audio tracks are configured in metadata but bypassed via disabled=true. Telemetry indicates muted state with zero audio output.
                  </AnimatedText>
                </div>
              </AdvertisementComposition>
            )}
          </div>
        </div>

        {/* Right: Audio Telemetry, VU Meters, & Synchronization Diagnostics */}
        <div
          style={{
            width: 380,
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#090E1D',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: 20,
            gap: 20,
            flexShrink: 0,
          }}
        >
          {/* Diagnostic Card: Scenario Info */}
          <div
            style={{
              padding: 14,
              borderRadius: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>{activeMeta.title}</span>
            </div>
            <div style={{ fontSize: 11, color: Colors.text.secondary, lineHeight: 1.4 }}>
              {activeMeta.description}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
              {activeMeta.categoryTags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: 4,
                    backgroundColor: 'rgba(0, 209, 255, 0.1)',
                    color: Colors.accent.cyan,
                    fontFamily: Typography.fontFamily.mono,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline Coverage Metrics */}
          <div
            style={{
              padding: 14,
              borderRadius: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: Colors.text.tertiary, letterSpacing: '0.06em' }}>
                TIMELINE COVERAGE
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: coverage.coveragePercentage > 0 ? Colors.accent.emerald : Colors.text.tertiary,
                  fontFamily: Typography.fontFamily.mono,
                }}
              >
                {coverage.coveragePercentage}%
              </span>
            </div>

            {/* Coverage bar */}
            <div
              style={{
                width: '100%',
                height: 6,
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${coverage.coveragePercentage}%`,
                  height: '100%',
                  backgroundColor: Colors.accent.cyan,
                  borderRadius: 3,
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
              <div>
                <span style={{ color: Colors.text.tertiary }}>Covered: </span>
                <span style={{ fontFamily: Typography.fontFamily.mono, fontWeight: 600 }}>
                  {coverage.coveredFrames}f
                </span>
              </div>
              <div>
                <span style={{ color: Colors.text.tertiary }}>Overlap: </span>
                <span style={{ fontFamily: Typography.fontFamily.mono, fontWeight: 600 }}>
                  {coverage.overlapFrames}f
                </span>
              </div>
            </div>
          </div>

          {/* Live Simulated VU Meters */}
          <div
            style={{
              padding: 14,
              borderRadius: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: Colors.text.tertiary, letterSpacing: '0.06em' }}>
                LIVE VU METERS ({vuLevels.length} TRACKS)
              </span>
              {collisionAnalysis.hasClippingRisk ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#F59E0B' }}>
                  <AlertTriangle size={12} /> Clipping Risk
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: Colors.accent.emerald }}>
                  <CheckCircle2 size={12} /> Clean Level
                </span>
              )}
            </div>

            {vuLevels.length === 0 ? (
              <div style={{ fontSize: 11, color: Colors.text.tertiary, fontStyle: 'italic', padding: '8px 0' }}>
                No active audio tracks (Silent mode)
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {vuLevels.map((lvl) => (
                  <div
                    key={lvl.trackId}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      padding: 8,
                      borderRadius: 6,
                      backgroundColor: lvl.isActive ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.01)',
                      border: `1px solid ${lvl.isActive ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)'}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: lvl.isActive ? '#FFFFFF' : Colors.text.tertiary,
                        }}
                      >
                        {lvl.name}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: Typography.fontFamily.mono,
                          color: lvl.isActive ? lvl.color : Colors.text.tertiary,
                          fontWeight: 700,
                        }}
                      >
                        {lvl.isActive ? `${Math.round(lvl.effectiveVolume * 100)}%` : 'OFF'}
                      </span>
                    </div>

                    {/* VU Bars */}
                    <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 26, paddingTop: 4 }}>
                      {lvl.bars.map((barH, bi) => (
                        <div
                          key={bi}
                          style={{
                            flex: 1,
                            height: barH,
                            backgroundColor: lvl.isActive ? lvl.color : 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
