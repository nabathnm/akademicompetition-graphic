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
import type { AudioTrackConfig } from '../src/components/audio/audioTrackTypes.ts';

describe('AudioTrack Unit Tests', () => {
  describe('resolveTrackTiming', () => {
    it('defaults startFrame to 0 and uses durationInFrames', () => {
      const config: AudioTrackConfig = {
        src: 'track.mp3',
        durationInFrames: 90,
      };
      const timing = resolveTrackTiming(config, 150);
      assert.strictEqual(timing.startFrame, 0);
      assert.strictEqual(timing.durationInFrames, 90);
      assert.strictEqual(timing.endFrame, 90);
    });

    it('respects startAtFrame and endFrame', () => {
      const config: AudioTrackConfig = {
        src: 'track.mp3',
        startAtFrame: 30,
        endFrame: 120,
      };
      const timing = resolveTrackTiming(config, 150);
      assert.strictEqual(timing.startFrame, 30);
      assert.strictEqual(timing.durationInFrames, 90);
      assert.strictEqual(timing.endFrame, 120);
    });

    it('spans remaining composition duration when duration and endFrame are omitted', () => {
      const config: AudioTrackConfig = {
        src: 'ambient.mp3',
        startAtFrame: 45,
      };
      const timing = resolveTrackTiming(config, 150);
      assert.strictEqual(timing.startFrame, 45);
      assert.strictEqual(timing.durationInFrames, 105);
      assert.strictEqual(timing.endFrame, 150);
    });

    it('clamps duration to composition bounds when clampToComposition is true', () => {
      const config: AudioTrackConfig = {
        src: 'long-song.mp3',
        startAtFrame: 100,
        durationInFrames: 200,
        clampToComposition: true,
      };
      const timing = resolveTrackTiming(config, 150);
      assert.strictEqual(timing.startFrame, 100);
      assert.strictEqual(timing.durationInFrames, 50); // 150 - 100
      assert.strictEqual(timing.endFrame, 150);
    });

    it('permits duration to exceed composition duration when clampToComposition is false', () => {
      const config: AudioTrackConfig = {
        src: 'extended.mp3',
        startAtFrame: 100,
        durationInFrames: 200,
        clampToComposition: false,
      };
      const timing = resolveTrackTiming(config, 150);
      assert.strictEqual(timing.startFrame, 100);
      assert.strictEqual(timing.durationInFrames, 200);
      assert.strictEqual(timing.endFrame, 300);
    });
  });

  describe('validateAudioTrackConfig', () => {
    it('returns isValid: true for standard valid track', () => {
      const config: AudioTrackConfig = {
        src: 'music.mp3',
        startAtFrame: 0,
        durationInFrames: 120,
        volume: 0.8,
        fadeInFrames: 15,
        fadeOutFrames: 15,
      };
      const res = validateAudioTrackConfig(config, 150);
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.errors.length, 0);
      assert.strictEqual(res.warnings.length, 0);
    });

    it('catches missing or empty src', () => {
      const config: AudioTrackConfig = {
        src: '',
      };
      const res = validateAudioTrackConfig(config);
      assert.strictEqual(res.isValid, false);
      assert.strictEqual(res.errors.length, 1);
      assert.match(res.errors[0], /missing a required "src"/i);
    });

    it('catches negative start frame and non-positive duration', () => {
      const config: AudioTrackConfig = {
        src: 'sfx.mp3',
        startAtFrame: -10,
        durationInFrames: 0,
      };
      const res = validateAudioTrackConfig(config);
      assert.strictEqual(res.isValid, false);
      assert.strictEqual(res.errors.length, 2);
      assert.match(res.errors[0], /cannot be negative/i);
      assert.match(res.errors[1], /greater than 0/i);
    });

    it('catches negative volume and non-positive playbackRate', () => {
      const config: AudioTrackConfig = {
        src: 'sfx.mp3',
        volume: -0.5,
        playbackRate: -1.0,
      };
      const res = validateAudioTrackConfig(config);
      assert.strictEqual(res.isValid, false);
      assert.strictEqual(res.errors.length, 2);
      assert.match(res.errors[0], /volume cannot be negative/i);
      assert.match(res.errors[1], /playbackRate must be strictly positive/i);
    });

    it('catches negative fade frames and warns when fade sum exceeds duration', () => {
      const config: AudioTrackConfig = {
        src: 'sfx.mp3',
        durationInFrames: 30,
        fadeInFrames: 25,
        fadeOutFrames: 25, // 25 + 25 = 50 > 30
      };
      const res = validateAudioTrackConfig(config);
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.warnings.length, 1);
      assert.match(res.warnings[0], /fade-in.*and fade-out.*sum exceeds/i);
    });
  });

  describe('calculateAudioVolume & calculateAudioVolumeMetrics', () => {
    it('returns 0 before startAtFrame and after endFrame', () => {
      const config: AudioTrackConfig = {
        src: 'bed.mp3',
        startAtFrame: 30,
        durationInFrames: 60, // [30 .. 90]
        volume: 0.8,
      };

      assert.strictEqual(calculateAudioVolume(config, 10, 150), 0);
      assert.strictEqual(calculateAudioVolume(config, 29, 150), 0);
      assert.strictEqual(calculateAudioVolume(config, 90, 150), 0);
      assert.strictEqual(calculateAudioVolume(config, 100, 150), 0);
    });

    it('returns 0 when muted or disabled', () => {
      const mutedConfig: AudioTrackConfig = {
        src: 'bed.mp3',
        startAtFrame: 0,
        durationInFrames: 90,
        volume: 0.8,
        muted: true,
      };
      assert.strictEqual(calculateAudioVolume(mutedConfig, 45, 150), 0);

      const disabledConfig: AudioTrackConfig = {
        src: 'bed.mp3',
        startAtFrame: 0,
        durationInFrames: 90,
        volume: 0.8,
        disabled: true,
      };
      assert.strictEqual(calculateAudioVolume(disabledConfig, 45, 150), 0);
    });

    it('calculates linear fade-in from 0 to full target volume', () => {
      const config: AudioTrackConfig = {
        src: 'ambient.mp3',
        startAtFrame: 0,
        durationInFrames: 100,
        volume: 1.0,
        fadeInFrames: 20,
      };

      assert.strictEqual(calculateAudioVolume(config, 0, 100), 0);
      assert.strictEqual(calculateAudioVolume(config, 10, 100), 0.5);
      assert.strictEqual(calculateAudioVolume(config, 20, 100), 1.0);
      assert.strictEqual(calculateAudioVolume(config, 40, 100), 1.0);
    });

    it('calculates linear fade-out at end of track', () => {
      const config: AudioTrackConfig = {
        src: 'ambient.mp3',
        startAtFrame: 0,
        durationInFrames: 100, // end: 100
        volume: 1.0,
        fadeOutFrames: 20, // fade out from frame 80 to 100
      };

      assert.strictEqual(calculateAudioVolume(config, 70, 100), 1.0);
      assert.strictEqual(calculateAudioVolume(config, 80, 100), 1.0);
      assert.strictEqual(calculateAudioVolume(config, 90, 100), 0.5);
      assert.strictEqual(calculateAudioVolume(config, 100, 100), 0);
    });

    it('supports dynamic volume functions', () => {
      const config: AudioTrackConfig = {
        src: 'test.mp3',
        startAtFrame: 0,
        durationInFrames: 100,
        volume: (frame) => (frame >= 50 ? 0.8 : 0.4),
      };

      assert.strictEqual(calculateAudioVolume(config, 25, 100), 0.4);
      assert.strictEqual(calculateAudioVolume(config, 75, 100), 0.8);
    });

    it('applies masterVolume multiplier', () => {
      const config: AudioTrackConfig = {
        src: 'test.mp3',
        startAtFrame: 0,
        durationInFrames: 100,
        volume: 0.8,
      };

      assert.strictEqual(calculateAudioVolume(config, 50, 100, 0.5), 0.4);
    });

    it('returns rich metrics with phase and flags', () => {
      const config: AudioTrackConfig = {
        src: 'test.mp3',
        startAtFrame: 20,
        durationInFrames: 80, // [20 .. 100]
        fadeInFrames: 20,
        fadeOutFrames: 20,
        volume: 0.8,
      };

      const pending = calculateAudioVolumeMetrics(config, { globalFrame: 10 });
      assert.strictEqual(pending.phase, 'pending');
      assert.strictEqual(pending.finalVolume, 0);

      const fadeIn = calculateAudioVolumeMetrics(config, { globalFrame: 30 }); // 10 frames into fade
      assert.strictEqual(fadeIn.phase, 'fadeIn');
      assert.strictEqual(fadeIn.isFadingIn, true);
      assert.strictEqual(fadeIn.finalVolume, 0.4);

      const hold = calculateAudioVolumeMetrics(config, { globalFrame: 60 });
      assert.strictEqual(hold.phase, 'hold');
      assert.strictEqual(hold.finalVolume, 0.8);

      const fadeOut = calculateAudioVolumeMetrics(config, { globalFrame: 90 }); // 10 frames from end
      assert.strictEqual(fadeOut.phase, 'fadeOut');
      assert.strictEqual(fadeOut.isFadingOut, true);
      assert.strictEqual(fadeOut.finalVolume, 0.4);

      const complete = calculateAudioVolumeMetrics(config, { globalFrame: 105 });
      assert.strictEqual(complete.phase, 'complete');
      assert.strictEqual(complete.finalVolume, 0);
    });
  });

  describe('calculateDuckedVolume', () => {
    it('returns original volume when voice is inactive', () => {
      const vol = calculateDuckedVolume({
        musicVolume: 0.8,
        isVoiceActive: false,
        duckedVolume: 0.2,
      });
      assert.strictEqual(vol, 0.8);
    });

    it('reduces volume to ducked level when voice is active', () => {
      const vol = calculateDuckedVolume({
        musicVolume: 0.8,
        isVoiceActive: true,
        duckedVolume: 0.25,
        duckProgress: 1, // full ducking
      });
      assert.strictEqual(vol, 0.2); // 0.8 * 0.25
    });

    it('interpolates ramp multiplier smoothly', () => {
      const vol = calculateDuckedVolume({
        musicVolume: 1.0,
        isVoiceActive: true,
        duckedVolume: 0.2,
        duckProgress: 0.5, // halfway
      });
      assert.strictEqual(vol, 0.6); // 1.0 - (0.8 * 0.5) = 0.6
    });
  });

  describe('SILENT_AUDIO_DATA_URI', () => {
    it('is a valid base64 data URI string', () => {
      assert.ok(SILENT_AUDIO_DATA_URI.startsWith('data:audio/wav;base64,'));
      assert.ok(SILENT_AUDIO_DATA_URI.length > 30);
    });
  });
});
