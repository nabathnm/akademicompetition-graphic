/**
 * SoundEffect Unit Test Suite
 * Tests deterministic frame-accurate triggering, duration resolution,
 * accidental playback prevention, preset properties, volume scaling, and transition sync.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSoundEffectVolume,
  createSoundCue,
  resolveSoundEffectTiming,
  SFX_PRESETS,
  syncSoundWithTransition,
} from '../src/components/audio/soundEffectStyle.ts';
import { SILENT_AUDIO_DATA_URI } from '../src/components/audio/audioTrackStyle.ts';

describe('SoundEffect - Timing Resolution & Preset Defaults', () => {
  it('resolves default startFrame and preset duration for ui-click', () => {
    const timing = resolveSoundEffectTiming({ preset: 'ui-click' }, 300);
    assert.strictEqual(timing.startFrame, 0);
    assert.strictEqual(timing.durationInFrames, SFX_PRESETS['ui-click'].durationInFrames);
    assert.strictEqual(timing.endFrame, SFX_PRESETS['ui-click'].durationInFrames);
    assert.strictEqual(timing.toneFrequency, SFX_PRESETS['ui-click'].toneFrequency);
  });

  it('resolves preset duration and decay for whoosh and notification', () => {
    const whooshTiming = resolveSoundEffectTiming({ preset: 'whoosh' }, 300);
    assert.strictEqual(whooshTiming.durationInFrames, 20);
    assert.strictEqual(whooshTiming.fadeInFrames, 5);
    assert.strictEqual(whooshTiming.fadeOutFrames, 9);

    const notifTiming = resolveSoundEffectTiming({ preset: 'notification' }, 300);
    assert.strictEqual(notifTiming.durationInFrames, 24);
    assert.strictEqual(notifTiming.toneFrequency, 1046);
  });

  it('combines triggerFrame with delayFrames offset', () => {
    const timing = resolveSoundEffectTiming(
      { triggerFrame: 40, delayFrames: 6, preset: 'pop' },
      300,
    );
    assert.strictEqual(timing.startFrame, 46);
    assert.strictEqual(timing.durationInFrames, 8);
    assert.strictEqual(timing.endFrame, 54);
  });

  it('respects explicit durationInFrames overriding preset default', () => {
    const timing = resolveSoundEffectTiming(
      { triggerFrame: 20, preset: 'ui-click', durationInFrames: 30 },
      300,
    );
    assert.strictEqual(timing.startFrame, 20);
    assert.strictEqual(timing.durationInFrames, 30);
    assert.strictEqual(timing.endFrame, 50);
  });

  it('respects explicit endFrame boundary', () => {
    const timing = resolveSoundEffectTiming({ startFrame: 50, endFrame: 65 }, 300);
    assert.strictEqual(timing.startFrame, 50);
    assert.strictEqual(timing.durationInFrames, 15);
    assert.strictEqual(timing.endFrame, 65);
  });

  it('clamps duration to composition end frame by default', () => {
    const timing = resolveSoundEffectTiming(
      { triggerFrame: 290, durationInFrames: 30, clampToComposition: true },
      300,
    );
    assert.strictEqual(timing.startFrame, 290);
    assert.strictEqual(timing.durationInFrames, 10);
    assert.strictEqual(timing.endFrame, 300);
  });

  it('allows duration to exceed composition when clampToComposition is false', () => {
    const timing = resolveSoundEffectTiming(
      { triggerFrame: 290, durationInFrames: 30, clampToComposition: false },
      300,
    );
    assert.strictEqual(timing.startFrame, 290);
    assert.strictEqual(timing.durationInFrames, 30);
    assert.strictEqual(timing.endFrame, 320);
  });

  it('falls back to SILENT_AUDIO_DATA_URI when src is not supplied', () => {
    const timing = resolveSoundEffectTiming({ preset: 'success' }, 300);
    assert.strictEqual(timing.resolvedSrc, SILENT_AUDIO_DATA_URI);
  });
});

describe('SoundEffect - Accidental Playback Prevention & Volume Evaluation', () => {
  const sampleSfx = {
    triggerFrame: 30,
    durationInFrames: 20,
    volume: 0.8,
    fadeInFrames: 4,
    fadeOutFrames: 6,
    fadeInEasing: 'linear' as const,
    fadeOutEasing: 'linear' as const,
  };

  it('returns strictly 0 before the trigger start frame', () => {
    assert.strictEqual(calculateSoundEffectVolume(sampleSfx, 0, 300), 0);
    assert.strictEqual(calculateSoundEffectVolume(sampleSfx, 29, 300), 0);
  });

  it('returns strictly 0 at or after the end frame', () => {
    // endFrame = 30 + 20 = 50
    assert.strictEqual(calculateSoundEffectVolume(sampleSfx, 50, 300), 0);
    assert.strictEqual(calculateSoundEffectVolume(sampleSfx, 51, 300), 0);
    assert.strictEqual(calculateSoundEffectVolume(sampleSfx, 100, 300), 0);
  });

  it('calculates linear fade-in ramp correctly', () => {
    // At startFrame (30): local frame 0 -> 0 volume
    assert.strictEqual(calculateSoundEffectVolume(sampleSfx, 30, 300), 0);
    // At local frame 2 (frame 32): 2/4 = 0.5 * 0.8 = 0.4
    assert.strictEqual(calculateSoundEffectVolume(sampleSfx, 32, 300), 0.4);
    // At local frame 4 (frame 34): full volume 0.8
    assert.strictEqual(calculateSoundEffectVolume(sampleSfx, 34, 300), 0.8);
  });

  it('calculates linear fade-out decay correctly', () => {
    // Fade out begins at duration - 6 = 14 (frame 44)
    // At frame 44: full volume 0.8
    assert.strictEqual(calculateSoundEffectVolume(sampleSfx, 44, 300), 0.8);
    // At frame 47: 3 frames into 6-frame fade -> 0.5 * 0.8 = 0.4
    assert.strictEqual(calculateSoundEffectVolume(sampleSfx, 47, 300), 0.4);
    // At frame 49: last active frame -> (1 - 5/6) * 0.8 = 0.1333
    const finalActive = calculateSoundEffectVolume(sampleSfx, 49, 300);
    assert.ok(finalActive > 0 && finalActive < 0.2);
  });

  it('scales final volume with masterVolume', () => {
    assert.strictEqual(calculateSoundEffectVolume(sampleSfx, 38, 300, 0.5), 0.4);
    assert.strictEqual(calculateSoundEffectVolume(sampleSfx, 38, 300, 1.5), 1.2);
  });

  it('returns strictly 0 when enabled is false, disabled is true, or muted is true', () => {
    assert.strictEqual(calculateSoundEffectVolume({ ...sampleSfx, enabled: false }, 38, 300), 0);
    assert.strictEqual(calculateSoundEffectVolume({ ...sampleSfx, disabled: true }, 38, 300), 0);
    assert.strictEqual(calculateSoundEffectVolume({ ...sampleSfx, muted: true }, 38, 300), 0);
  });

  it('supports dynamic volume functions', () => {
    const dynamicSfx = {
      triggerFrame: 10,
      durationInFrames: 20,
      volume: (frame: number) => (frame >= 20 ? 0.9 : 0.3),
    };

    assert.strictEqual(calculateSoundEffectVolume(dynamicSfx, 15, 300), 0.3);
    assert.strictEqual(calculateSoundEffectVolume(dynamicSfx, 25, 300), 0.9);
  });
});

describe('SoundEffect - Transition Synchronization & Cue Helpers', () => {
  it('synchronizes with transition midpoint by default', () => {
    // Transition from frame 40 to 60 (duration 20) -> midpoint is 40 + 10 = 50
    const trigger = syncSoundWithTransition(40, 20);
    assert.strictEqual(trigger, 50);
  });

  it('synchronizes with transition start alignment', () => {
    const trigger = syncSoundWithTransition(60, 25, { alignment: 'start' });
    assert.strictEqual(trigger, 60);
  });

  it('synchronizes with transition end alignment', () => {
    const trigger = syncSoundWithTransition(60, 25, { alignment: 'end' });
    assert.strictEqual(trigger, 85);
  });

  it('applies frameOffset to transition alignment', () => {
    const trigger = syncSoundWithTransition(40, 20, { alignment: 'midpoint', frameOffset: -2 });
    assert.strictEqual(trigger, 48);
  });

  it('creates sound cue configuration with preset name', () => {
    const cue = createSoundCue(75, 'whoosh', { volume: 0.9 });
    assert.strictEqual(cue.triggerFrame, 75);
    assert.strictEqual(cue.preset, 'whoosh');
    assert.strictEqual(cue.volume, 0.9);
  });

  it('creates sound cue configuration with custom src', () => {
    const cue = createSoundCue(100, 'custom_sound.mp3', { durationInFrames: 35 });
    assert.strictEqual(cue.triggerFrame, 100);
    assert.strictEqual(cue.src, 'custom_sound.mp3');
    assert.strictEqual(cue.durationInFrames, 35);
  });
});

describe('SoundEffect - Preset Catalog Completeness', () => {
  it('contains all required standard presets with valid parameters', () => {
    const required = [
      'ui-click',
      'whoosh',
      'notification',
      'pop',
      'success',
      'error',
      'switch',
      'shutter',
      'impact',
    ];

    for (const name of required) {
      const preset = SFX_PRESETS[name as keyof typeof SFX_PRESETS];
      assert.ok(preset, `Preset ${name} should exist`);
      assert.ok(preset.durationInFrames > 0, `${name} duration should be > 0`);
      assert.ok(preset.toneFrequency > 0, `${name} toneFrequency should be > 0`);
      assert.ok(preset.name.length > 0, `${name} display name should not be empty`);
    }
  });
});
