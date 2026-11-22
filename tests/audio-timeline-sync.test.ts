/**
 * Audio and Timeline Synchronization Unit Test Suite
 * Validates BackgroundMusic, SoundEffect, AudioTrack, TimelineManager, and AdvertisementComposition
 * for frame-accurate timing, fade envelopes, multi-track coexistence, ducking, and fault tolerance.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateAudioVolume,
  calculateAudioVolumeMetrics,
  calculateDuckedVolume,
  resolveTrackTiming,
  SILENT_AUDIO_DATA_URI,
  validateAudioTrackConfig,
} from '../src/components/audio/audioTrackStyle.ts';

import {
  interpolateVolumeKeyframes,
  resolveBackgroundMusicTiming,
} from '../src/components/audio/backgroundMusicStyle.ts';

import {
  createSoundCue,
  generateTextRevealSoundCues,
  resolveSoundEffectTiming,
  syncSoundWithTextReveal,
  syncSoundWithTransition,
} from '../src/components/audio/soundEffectStyle.ts';

import {
  calculateSimulatedVUMeterLevels,
  calculateTimelineAudioCoverage,
  detectAudioCollisions,
  validateAudioTimelineSynchronization,
  AUDIO_SYNC_SCENARIOS,
} from '../src/playground/showcases/audioTimelineSyncStyle.ts';

import {
  buildTimelineComposition,
  calculateAudioTimeline,
  framesToSeconds,
  inspectTimelineAtFrame,
  secondsToFrames,
} from '../src/utils/timing/TimelineManager.ts';

import { validateAdvertisementConfig } from '../src/compositions/advertisements/advertisementCompositionStyle.ts';
import type { TimelineInputConfig } from '../src/utils/timing/timelineTypes.ts';

describe('Audio Timeline Synchronization - Timing & Frame Consistency', () => {
  it('converts seconds to frames and frames to seconds accurately across 30 FPS', () => {
    assert.strictEqual(secondsToFrames(1.0, 30), 30);
    assert.strictEqual(secondsToFrames(2.5, 30), 75);
    assert.strictEqual(framesToSeconds(30, 30), 1.0);
    assert.strictEqual(framesToSeconds(75, 30), 2.5);
  });

  it('standardizes audio start and duration bounds on integer frames', () => {
    const timing = resolveTrackTiming({
      src: 'music.mp3',
      startAtFrame: 15.4,
      durationInFrames: 60.2,
    });

    assert.strictEqual(timing.startFrame, 15);
    assert.strictEqual(timing.durationInFrames, 60);
    assert.strictEqual(timing.endFrame, 75);
  });

  it('provides a valid standard silent audio data URI fallback', () => {
    assert.ok(SILENT_AUDIO_DATA_URI.startsWith('data:audio/wav;base64,'));
  });

  it('calculates audio timeline spans via calculateAudioTimeline', () => {
    const tracks = calculateAudioTimeline({ src: 'test.mp3', durationInFrames: 60 }, 100, 30);
    assert.strictEqual(tracks.length, 1);
    assert.strictEqual(tracks[0].durationInFrames, 60);
  });

  it('respects composition duration clamping when enabled', () => {
    const timing = resolveTrackTiming(
      {
        src: 'music.mp3',
        startAtFrame: 100,
        durationInFrames: 100, // 100 + 100 = 200 > composition (150)
        clampToComposition: true,
      },
      150,
    );

    assert.strictEqual(timing.startFrame, 100);
    assert.strictEqual(timing.durationInFrames, 50); // Clamped to 150 - 100
    assert.strictEqual(timing.endFrame, 150);
  });
});

describe('Audio Timeline Synchronization - BackgroundMusic Spanning & Envelopes', () => {
  it('automatically spans entire composition when duration is omitted', () => {
    const timing = resolveBackgroundMusicTiming(
      {
        src: 'ambient.mp3',
        startFrame: 0,
      },
      180,
    );

    assert.strictEqual(timing.startFrame, 0);
    assert.strictEqual(timing.durationInFrames, 180);
    assert.strictEqual(timing.endFrame, 180);
  });

  it('automatically calculates remaining span when startFrame is non-zero', () => {
    const timing = resolveBackgroundMusicTiming(
      {
        src: 'ambient.mp3',
        startFrame: 45,
      },
      180,
    );

    assert.strictEqual(timing.startFrame, 45);
    assert.strictEqual(timing.durationInFrames, 135); // 180 - 45
    assert.strictEqual(timing.endFrame, 180);
  });

  it('calculates deterministic fade-in and fade-out volume curves', () => {
    const config = {
      src: 'music.mp3',
      startAtFrame: 0,
      durationInFrames: 100,
      volume: 1.0,
      fadeInFrames: 20,
      fadeOutFrames: 20,
    };

    // Frame 0: starts at 0
    const atStart = calculateAudioVolume(config, 0);
    assert.strictEqual(atStart, 0);

    // Frame 10: midpoint of fade-in (0.5)
    const atMidFadeIn = calculateAudioVolume(config, 10);
    assert.strictEqual(atMidFadeIn, 0.5);

    // Frame 20: completed fade-in (1.0)
    const atHold = calculateAudioVolume(config, 20);
    assert.strictEqual(atHold, 1.0);

    // Frame 90: midpoint of fade-out (0.5)
    const atMidFadeOut = calculateAudioVolume(config, 90);
    assert.strictEqual(atMidFadeOut, 0.5);

    // Frame 100: ended at 0
    const atEnd = calculateAudioVolume(config, 100);
    assert.strictEqual(atEnd, 0);
  });

  it('scales down envelopes proportionally when fadeIn + fadeOut exceeds track duration', () => {
    const config = {
      src: 'music.mp3',
      startAtFrame: 0,
      durationInFrames: 30,
      volume: 1.0,
      fadeInFrames: 25,
      fadeOutFrames: 25, // Sum: 50 > 30 duration
    };

    const metrics = calculateAudioVolumeMetrics(config, {
      globalFrame: 15,
      trackStartFrame: 0,
      trackDurationInFrames: 30,
    });

    assert.ok(metrics.finalVolume >= 0 && metrics.finalVolume <= 1.0);
  });
});

describe('Audio Timeline Synchronization - SoundEffect Synchronization Helpers', () => {
  it('synchronizes sound effects with scene transitions at midpoint', () => {
    // Transition spans frames 40 to 60 (start: 40, duration: 20)
    const trigger = syncSoundWithTransition(40, 20, { alignment: 'midpoint' });
    assert.strictEqual(trigger, 50); // 40 + 10
  });

  it('synchronizes sound effects with scene transitions at start and end', () => {
    const triggerStart = syncSoundWithTransition(40, 20, { alignment: 'start' });
    assert.strictEqual(triggerStart, 40);

    const triggerEnd = syncSoundWithTransition(40, 20, { alignment: 'end' });
    assert.strictEqual(triggerEnd, 60);

    const triggerWithOffset = syncSoundWithTransition(40, 20, { alignment: 'midpoint', frameOffset: -2 });
    assert.strictEqual(triggerWithOffset, 48);
  });

  it('synchronizes sound effect with text reveal token milestones', () => {
    // Text starts at frame 15, words spaced by 6 frames
    assert.strictEqual(syncSoundWithTextReveal(15, 0, 6), 15);
    assert.strictEqual(syncSoundWithTextReveal(15, 1, 6), 21);
    assert.strictEqual(syncSoundWithTextReveal(15, 2, 6), 27);
    assert.strictEqual(syncSoundWithTextReveal(15, 3, 6), 33);
  });

  it('generates an array of typed SoundEffect cues for multi-token text reveal', () => {
    const cues = generateTextRevealSoundCues({
      textStartFrame: 20,
      tokenCount: 4,
      staggerInterval: 5,
      preset: 'pop',
      volume: 0.75,
    });

    assert.strictEqual(cues.length, 4);
    assert.strictEqual(cues[0].triggerFrame, 20);
    assert.strictEqual(cues[1].triggerFrame, 25);
    assert.strictEqual(cues[2].triggerFrame, 30);
    assert.strictEqual(cues[3].triggerFrame, 35);
    assert.strictEqual(cues[0].preset, 'pop');
    assert.strictEqual(cues[0].volume, 0.75);
  });

  it('resolves sound effect timing and builds sound cues', () => {
    const cue = createSoundCue(30, 'ui-click', { volume: 0.9 });
    assert.strictEqual(cue.triggerFrame, 30);
    assert.strictEqual(cue.preset, 'ui-click');

    const timing = resolveSoundEffectTiming(cue, 150);
    assert.strictEqual(timing.startFrame, 30);
    assert.strictEqual(timing.durationInFrames, 6); // default ui-click duration
  });
});

describe('Audio Timeline Synchronization - Multi-Track Coexistence & Ducking', () => {
  it('ducks background music volume deterministically during voiceover', () => {
    const nominalMusicVolume = 0.8;

    // Unducked when voiceover is inactive
    const unducked = calculateDuckedVolume({
      musicVolume: nominalMusicVolume,
      isVoiceActive: false,
    });
    assert.strictEqual(unducked, nominalMusicVolume);

    // Fully ducked to 0.2 when voiceover is active
    const ducked = calculateDuckedVolume({
      musicVolume: nominalMusicVolume,
      isVoiceActive: true,
      duckedVolume: 0.2,
      duckProgress: 1.0,
    });
    assert.strictEqual(ducked, 0.16); // 0.8 * 0.2

    // Halfway ramped
    const ramping = calculateDuckedVolume({
      musicVolume: nominalMusicVolume,
      isVoiceActive: true,
      duckedVolume: 0.2,
      duckProgress: 0.5,
    });
    assert.strictEqual(ramping, 0.48); // 0.8 * (1 - 0.8 * 0.5) = 0.8 * 0.6 = 0.48
  });

  it('interpolates volume keyframes across frame intervals', () => {
    const keyframes = [
      { frame: 0, volume: 1.0 },
      { frame: 30, volume: 0.3 },
      { frame: 60, volume: 1.0 },
    ];

    assert.strictEqual(interpolateVolumeKeyframes(keyframes, 0, 1.0), 1.0);
    assert.strictEqual(interpolateVolumeKeyframes(keyframes, 30, 1.0), 0.3);
    assert.strictEqual(interpolateVolumeKeyframes(keyframes, 60, 1.0), 1.0);
    // Interpolated midpoint (frame 15)
    const mid15 = interpolateVolumeKeyframes(keyframes, 15, 1.0);
    assert.ok(mid15 > 0.3 && mid15 < 1.0);
  });

  it('detects clipping risk when simultaneous tracks exceed nominal headroom', () => {
    const tracks = [
      { id: 'bgm', startFrame: 0, durationInFrames: 100, endFrame: 100, volume: 0.8 },
      { id: 'sfx', startFrame: 20, durationInFrames: 20, endFrame: 40, volume: 0.9 },
    ];

    const collision = detectAudioCollisions(tracks, 100);
    assert.strictEqual(collision.hasClippingRisk, true);
    assert.strictEqual(collision.maxCombinedVolume, 1.7);
    assert.strictEqual(collision.clippingFrames, 20);
    assert.strictEqual(collision.peakFrame, 20);
  });

  it('calculates timeline coverage and overlap frames accurately', () => {
    const tracks = [
      { id: 'track-1', startFrame: 0, durationInFrames: 60, endFrame: 60, volume: 0.8 },
      { id: 'track-2', startFrame: 40, durationInFrames: 60, endFrame: 100, volume: 0.8 },
    ];

    const coverage = calculateTimelineAudioCoverage(100, tracks);
    assert.strictEqual(coverage.totalCompositionFrames, 100);
    assert.strictEqual(coverage.coveredFrames, 100);
    assert.strictEqual(coverage.coveragePercentage, 100);
    assert.strictEqual(coverage.hasGaps, false);
    assert.strictEqual(coverage.overlapFrames, 20); // frames 40 to 60 overlap
  });

  it('calculates simulated VU meter levels deterministically', () => {
    const levels = calculateSimulatedVUMeterLevels(30, [
      { id: 'bgm', startFrame: 0, durationInFrames: 60, endFrame: 60, volume: 0.8 },
    ]);
    assert.strictEqual(levels.length, 1);
    assert.strictEqual(levels[0].isActive, true);
    assert.strictEqual(levels[0].bars.length, 6);
  });
});

describe('Audio Timeline Synchronization - Boundary Crossings & Scenes Alignment', () => {
  it('handles audio tracks that start before or span past individual scenes', () => {
    const scenes = [
      { id: 'scene-1', startFrame: 0, durationInFrames: 60, endFrame: 60 },
      { id: 'scene-2', startFrame: 60, durationInFrames: 60, endFrame: 120 },
    ];

    const tracks = [
      // Spans both scenes
      { id: 'bgm-long', startFrame: 0, durationInFrames: 120, endFrame: 120, volume: 0.7 },
      // Starts inside scene 1 and ends inside scene 2
      { id: 'audio-cross', startFrame: 30, durationInFrames: 60, endFrame: 90, volume: 0.5 },
    ];

    const syncValidation = validateAudioTimelineSynchronization({
      compositionDuration: 120,
      scenes,
      tracks,
    });

    assert.strictEqual(syncValidation.isValid, true);
    assert.strictEqual(syncValidation.errors.length, 0);
  });

  it('flags warning when audio track extends beyond composition duration', () => {
    const tracks = [
      { id: 'overflow-audio', startFrame: 80, durationInFrames: 60, endFrame: 140, volume: 0.8 },
    ];

    const syncValidation = validateAudioTimelineSynchronization({
      compositionDuration: 100,
      tracks,
    });

    assert.ok(syncValidation.warnings.some((w) => w.includes('extending beyond composition duration')));
  });
});

describe('Audio Timeline Synchronization - Silence, Disable & Fault Tolerance', () => {
  it('handles composition with zero audio safely without errors', () => {
    const config = validateAdvertisementConfig({
      width: 1920,
      height: 1080,
      fps: 30,
      durationInFrames: 150,
      scenes: [{ id: 'scene-1', durationInFrames: 60 }],
    });

    assert.strictEqual(config.isValid, true);
    assert.strictEqual(config.errors.length, 0);

    const coverage = calculateTimelineAudioCoverage(150, []);
    assert.strictEqual(coverage.coveredFrames, 0);
    assert.strictEqual(coverage.coveragePercentage, 0);
  });

  it('bypasses audio rendering and yields volume 0 when disabled', () => {
    const disabledConfig = {
      src: 'music.mp3',
      startAtFrame: 0,
      durationInFrames: 100,
      volume: 0.8,
      disabled: true,
    };

    const metrics = calculateAudioVolumeMetrics(disabledConfig, {
      globalFrame: 30,
      trackStartFrame: 0,
      trackDurationInFrames: 100,
    });

    assert.strictEqual(metrics.finalVolume, 0);
    assert.strictEqual(metrics.baseVolume, 0);
    assert.strictEqual(metrics.isMuted, true);
    assert.strictEqual(metrics.phase, 'complete');
  });

  it('falls back gracefully to silent audio data URI when src is empty', () => {
    const trackWithEmptySrc = {
      src: '',
      startAtFrame: 0,
      durationInFrames: 60,
    };

    const validation = validateAudioTrackConfig(trackWithEmptySrc);
    assert.strictEqual(validation.isValid, false);
    assert.ok(validation.errors.some((e) => e.includes('missing a required "src"')));

    // Timeline resolution still returns valid numeric bounds
    const timing = resolveTrackTiming(trackWithEmptySrc, 120);
    assert.strictEqual(timing.startFrame, 0);
    assert.strictEqual(timing.durationInFrames, 60);
    assert.strictEqual(timing.endFrame, 60);
  });
});

describe('Audio Timeline Synchronization - TimelineManager Multi-Track Integration', () => {
  it('integrates backgroundMusic, audio tracks, and sound effects into centralized timeline', () => {
    const timelineConfig: TimelineInputConfig = {
      fps: 30,
      totalDurationInFrames: 180,
      scenes: [
        { id: 'hero-scene', durationInFrames: 90 },
        { id: 'showcase-scene', durationInFrames: 90 },
      ],
      backgroundMusic: {
        src: 'bgm.mp3',
        volume: 0.7,
        loop: true,
      },
      audio: [
        {
          id: 'voiceover',
          src: 'voice.mp3',
          startAtFrame: 30,
          durationInFrames: 60,
          volume: 0.9,
        },
      ],
      soundEffects: [
        {
          id: 'sfx-transition',
          src: 'whoosh.mp3',
          startAtFrame: 85,
          durationInFrames: 15,
          volume: 0.85,
        },
      ],
    };

    const timeline = buildTimelineComposition(timelineConfig);

    assert.strictEqual(timeline.scenes.length, 2);
    assert.strictEqual(timeline.audio.length, 3);

    // Verify background music automatically spanned full 180 frames
    const bgmTrack = timeline.audio.find((a) => a.id === 'background-music');
    assert.ok(bgmTrack !== undefined);
    assert.strictEqual(bgmTrack.startFrame, 0);
    assert.strictEqual(bgmTrack.durationInFrames, 180);
    assert.strictEqual(bgmTrack.endFrame, 180);
    assert.strictEqual(bgmTrack.loop, true);

    // Verify voiceover track
    const voiceTrack = timeline.audio.find((a) => a.id === 'voiceover');
    assert.ok(voiceTrack !== undefined);
    assert.strictEqual(voiceTrack.startFrame, 30);
    assert.strictEqual(voiceTrack.durationInFrames, 60);

    // Inspect active audio tracks at frame 50 (both BGM and Voiceover active)
    const frame50 = inspectTimelineAtFrame(timeline, 50);
    assert.strictEqual(frame50.activeAudio.length, 2);
    assert.ok(frame50.activeAudio.some((a) => a.id === 'background-music'));
    assert.ok(frame50.activeAudio.some((a) => a.id === 'voiceover'));

    // Inspect active audio tracks at frame 90 (BGM and SFX active, Voiceover finished)
    const frame90 = inspectTimelineAtFrame(timeline, 90);
    assert.strictEqual(frame90.activeAudio.length, 2);
    assert.ok(frame90.activeAudio.some((a) => a.id === 'background-music'));
    assert.ok(frame90.activeAudio.some((a) => a.id === 'sfx-transition'));
  });

  it('covers all 8 required audio timeline sync scenarios in metadata', () => {
    assert.strictEqual(AUDIO_SYNC_SCENARIOS.length, 8);
    const expectedIds = [
      'bgm-full',
      'sfx-text',
      'sfx-transition',
      'sfx-overlap',
      'bgm-fade',
      'multi-audio-stagger',
      'no-audio',
      'audio-disabled',
    ];

    const actualIds = AUDIO_SYNC_SCENARIOS.map((s) => s.id);
    assert.deepStrictEqual(actualIds, expectedIds);

    for (const scenario of AUDIO_SYNC_SCENARIOS) {
      assert.ok(scenario.title.length > 0);
      assert.ok(scenario.description.length > 0);
      assert.ok(scenario.categoryTags.length >= 2);
    }
  });
});
