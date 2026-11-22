import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateAudioVolume,
  calculateSceneSchedule,
  getActiveSceneAtFrame,
  resolveAdvertisementLayout,
  validateAdvertisementConfig,
} from '../src/compositions/advertisements/advertisementCompositionStyle.ts';

describe('AdvertisementComposition Unit Tests', () => {
  describe('validateAdvertisementConfig', () => {
    it('returns isValid true for standard valid config', () => {
      const res = validateAdvertisementConfig({
        width: 1920,
        height: 1080,
        fps: 30,
        durationInFrames: 150,
        scenes: [
          { id: 'scene-1', durationInFrames: 60, component: null },
          { id: 'scene-2', durationInFrames: 90, component: null },
        ],
      });

      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.errors.length, 0);
      assert.strictEqual(res.warnings.length, 0);
    });

    it('catches non-positive dimensional values', () => {
      const res = validateAdvertisementConfig({
        width: -1920,
        height: 0,
        fps: -30,
        durationInFrames: 0,
      });

      assert.strictEqual(res.isValid, false);
      assert.ok(res.errors.some((e) => e.includes('Width must be a positive number')));
      assert.ok(res.errors.some((e) => e.includes('Height must be a positive number')));
      assert.ok(res.errors.some((e) => e.includes('FPS must be a positive number')));
      assert.ok(res.errors.some((e) => e.includes('durationInFrames must be a positive number')));
    });

    it('warns when total scene duration exceeds composition duration', () => {
      const res = validateAdvertisementConfig({
        durationInFrames: 100,
        scenes: [
          { id: 'scene-1', durationInFrames: 60, component: null },
          { id: 'scene-2', durationInFrames: 60, component: null },
        ],
      });

      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.warnings.length, 1);
      assert.ok(res.warnings[0].includes('exceeds specified composition duration'));
    });

    it('catches duplicate scene IDs and missing scene IDs', () => {
      const res = validateAdvertisementConfig({
        scenes: [
          { id: '', durationInFrames: 30, component: null },
          { id: 'hero', durationInFrames: 30, component: null },
          { id: 'hero', durationInFrames: 30, component: null },
        ],
      });

      assert.strictEqual(res.isValid, false);
      assert.ok(res.errors.some((e) => e.includes("missing a required unique 'id'")));
      assert.ok(res.warnings.some((w) => w.includes("Duplicate scene id detected: 'hero'")));
    });

    it('validates audio track configs', () => {
      const res = validateAdvertisementConfig({
        audio: [
          { src: '', volume: 0.8 },
          { src: 'track.mp3', fadeInFrames: -10 },
          { src: 'track2.mp3', volume: 1.5 },
        ],
      });

      assert.strictEqual(res.isValid, false);
      assert.ok(res.errors.some((e) => e.includes("missing a required 'src'")));
      assert.ok(res.errors.some((e) => e.includes('negative fadeInFrames')));
      assert.ok(res.warnings.some((w) => w.includes('outside normal 0.0 - 1.0 range')));
    });
  });

  describe('calculateSceneSchedule', () => {
    it('schedules scenes sequentially when startFrame is omitted', () => {
      const schedule = calculateSceneSchedule([
        { id: 'intro', durationInFrames: 45, component: null },
        { id: 'features', durationInFrames: 60, component: null },
        { id: 'cta', durationInFrames: 45, component: null },
      ]);

      assert.strictEqual(schedule.length, 3);
      assert.strictEqual(schedule[0].computedStartFrame, 0);
      assert.strictEqual(schedule[0].computedEndFrame, 45);

      assert.strictEqual(schedule[1].computedStartFrame, 45);
      assert.strictEqual(schedule[1].computedEndFrame, 105);

      assert.strictEqual(schedule[2].computedStartFrame, 105);
      assert.strictEqual(schedule[2].computedEndFrame, 150);
    });

    it('respects manual startFrame overrides', () => {
      const schedule = calculateSceneSchedule([
        { id: 'intro', durationInFrames: 30, component: null },
        { id: 'overlay', durationInFrames: 40, startFrame: 20, component: null },
      ]);

      assert.strictEqual(schedule[0].computedStartFrame, 0);
      assert.strictEqual(schedule[1].computedStartFrame, 20);
      assert.strictEqual(schedule[1].computedEndFrame, 60);
    });
  });

  describe('getActiveSceneAtFrame', () => {
    it('returns the active scene for any frame in range', () => {
      const schedule = calculateSceneSchedule([
        { id: 'scene-a', durationInFrames: 30, component: null },
        { id: 'scene-b', durationInFrames: 30, component: null },
      ]);

      const active0 = getActiveSceneAtFrame(schedule, 0);
      const active29 = getActiveSceneAtFrame(schedule, 29);
      const active30 = getActiveSceneAtFrame(schedule, 30);
      const active100 = getActiveSceneAtFrame(schedule, 100);

      assert.strictEqual(active0?.id, 'scene-a');
      assert.strictEqual(active29?.id, 'scene-a');
      assert.strictEqual(active30?.id, 'scene-b');
      assert.strictEqual(active100, null);
    });
  });

  describe('calculateAudioVolume', () => {
    it('returns 0 before startAtFrame', () => {
      const vol = calculateAudioVolume({ src: 'bg.mp3', startAtFrame: 20 }, 10, 150);
      assert.strictEqual(vol, 0);
    });

    it('interpolates linear fade in from 0 to 1', () => {
      const track = { src: 'bg.mp3', startAtFrame: 0, fadeInFrames: 20, volume: 1.0 };
      const vol0 = calculateAudioVolume(track, 0, 100);
      const vol10 = calculateAudioVolume(track, 10, 100);
      const vol20 = calculateAudioVolume(track, 20, 100);

      assert.strictEqual(vol0, 0);
      assert.strictEqual(vol10, 0.5);
      assert.strictEqual(vol20, 1.0);
    });

    it('interpolates linear fade out at end of composition', () => {
      const track = { src: 'bg.mp3', fadeOutFrames: 20, volume: 1.0 };
      const volMid = calculateAudioVolume(track, 50, 100);
      const vol80 = calculateAudioVolume(track, 80, 100);
      const vol90 = calculateAudioVolume(track, 90, 100);
      const vol100 = calculateAudioVolume(track, 100, 100);

      assert.strictEqual(volMid, 1.0);
      assert.strictEqual(vol80, 1.0);
      assert.strictEqual(vol90, 0.5);
      assert.strictEqual(vol100, 0);
    });

    it('supports dynamic volume function', () => {
      const track = { src: 'bg.mp3', volume: (f: number) => (f < 50 ? 0.3 : 0.8) };
      assert.strictEqual(calculateAudioVolume(track, 10, 100), 0.3);
      assert.strictEqual(calculateAudioVolume(track, 60, 100), 0.8);
    });
  });

  describe('resolveAdvertisementLayout', () => {
    it('applies default 60px broadcast safe area margin', () => {
      const l = resolveAdvertisementLayout(1920, 1080, true);
      assert.strictEqual(l.safeAreaMargin, 60);
      assert.strictEqual(l.contentStyle.padding, 60);
    });

    it('disables safe area when false', () => {
      const l = resolveAdvertisementLayout(1920, 1080, false);
      assert.strictEqual(l.safeAreaMargin, 0);
      assert.strictEqual(l.contentStyle.padding, 0);
    });

    it('accepts custom numeric safe area margin', () => {
      const l = resolveAdvertisementLayout(1920, 1080, 80);
      assert.strictEqual(l.safeAreaMargin, 80);
      assert.strictEqual(l.contentStyle.padding, 80);
    });
  });
});
