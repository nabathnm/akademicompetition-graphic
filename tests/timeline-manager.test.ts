import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  buildTimelineComposition,
  calculateAudioTimeline,
  calculateSceneTimeline,
  formatTimecode,
  framesToSeconds,
  inspectTimelineAtFrame,
  secondsToFrames,
  TimelineManager,
  validateTimelineConfig,
} from '../src/utils/timing/TimelineManager.ts';
import { createTimelineManagerFromSequence } from '../src/components/scenes/sceneSequenceStyle.ts';
import type { TimelineInputConfig, TimelineSceneInput } from '../src/utils/timing/timelineTypes.ts';

describe('TimelineManager Unit Tests', () => {
  describe('Time & Frame Conversions', () => {
    it('converts seconds to integer frames at given FPS', () => {
      assert.strictEqual(secondsToFrames(1.0, 30), 30);
      assert.strictEqual(secondsToFrames(2.5, 30), 75);
      assert.strictEqual(secondsToFrames(0.5, 60), 30);
      assert.strictEqual(secondsToFrames(0, 30), 0);
      assert.strictEqual(secondsToFrames(-5, 30), 0);
    });

    it('converts frames to fractional seconds at given FPS', () => {
      assert.strictEqual(framesToSeconds(30, 30), 1.0);
      assert.strictEqual(framesToSeconds(75, 30), 2.5);
      assert.strictEqual(framesToSeconds(0, 30), 0);
      assert.strictEqual(framesToSeconds(-10, 30), 0);
      assert.strictEqual(framesToSeconds(30, 0), 0);
    });

    it('formats frame numbers into SMPTE timecode (MM:SS:FF)', () => {
      assert.strictEqual(formatTimecode(0, 30), '00:00:00');
      assert.strictEqual(formatTimecode(15, 30), '00:00:15');
      assert.strictEqual(formatTimecode(30, 30), '00:01:00');
      assert.strictEqual(formatTimecode(75, 30), '00:02:15');
      assert.strictEqual(formatTimecode(1800, 30), '01:00:00'); // 1 minute
      assert.strictEqual(formatTimecode(1815, 30), '01:00:15');
    });
  });

  describe('validateTimelineConfig', () => {
    it('returns isValid: true for standard valid configuration', () => {
      const config: TimelineInputConfig = {
        fps: 30,
        scenes: [
          { id: 'scene-1', durationInFrames: 60 },
          { id: 'scene-2', durationInFrames: 90 },
        ],
        audio: { src: 'audio.mp3', fadeInFrames: 10, fadeOutFrames: 10 },
      };

      const res = validateTimelineConfig(config);
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.errors.length, 0);
      assert.strictEqual(res.warnings.length, 0);
      assert.strictEqual(res.totalCalculatedDuration, 150);
    });

    it('catches invalid or non-positive FPS', () => {
      const res = validateTimelineConfig({ fps: 0 });
      assert.strictEqual(res.isValid, false);
      assert.ok(res.errors.some((e) => e.includes('FPS must be a positive number')));
    });

    it('catches missing or duplicate scene IDs', () => {
      const res = validateTimelineConfig({
        scenes: [
          { id: '', durationInFrames: 30 },
          { id: 'hero', durationInFrames: 30 },
          { id: 'hero', durationInFrames: 30 },
        ],
      });

      assert.strictEqual(res.isValid, false);
      assert.ok(res.errors.some((e) => e.includes("missing a required unique 'id'")));
      assert.ok(res.errors.some((e) => e.includes('Duplicate scene ID detected')));
    });

    it('catches non-positive scene durations', () => {
      const res = validateTimelineConfig({
        scenes: [{ id: 'scene-1', durationInFrames: -10 }],
      });

      assert.strictEqual(res.isValid, false);
      assert.ok(res.errors.some((e) => e.includes('invalid durationInFrames')));
    });

    it('catches negative delays and transition durations', () => {
      const res = validateTimelineConfig({
        scenes: [
          {
            id: 'scene-1',
            durationInFrames: 60,
            delayBefore: -5,
            entranceTransition: { durationInFrames: -15 },
          },
        ],
      });

      assert.strictEqual(res.isValid, false);
      assert.ok(res.errors.some((e) => e.includes('negative delayBefore')));
      assert.ok(res.errors.some((e) => e.includes('negative entrance transition duration')));
    });

    it('warns when entrance + exit transition durations exceed scene duration', () => {
      const res = validateTimelineConfig({
        scenes: [
          {
            id: 'scene-1',
            durationInFrames: 30,
            entranceTransition: { durationInFrames: 20 },
            exitTransition: { durationInFrames: 20 },
          },
        ],
      });

      assert.ok(res.warnings.some((w) => w.includes('transition duration sum (40f) exceeds scene lifespan')));
    });

    it('warns about scene collision when allowOverlap is false', () => {
      const res = validateTimelineConfig({
        allowOverlap: false,
        scenes: [
          { id: 'scene-1', durationInFrames: 60 },
          { id: 'scene-2', durationInFrames: 60, startFrame: 40 },
        ],
      });

      assert.ok(res.warnings.some((w) => w.includes('overlaps with previous scene end')));
    });
  });

  describe('calculateSceneTimeline', () => {
    it('schedules sequential scenes with computed spans and time conversions', () => {
      const scenes: TimelineSceneInput[] = [
        { id: 'hero', durationInFrames: 60 },
        { id: 'product', durationInFrames: 90 },
      ];

      const { scenes: tracks } = calculateSceneTimeline(scenes, { fps: 30 });

      assert.strictEqual(tracks.length, 2);

      // Hero: 0..60, 0s..2s
      assert.strictEqual(tracks[0].startFrame, 0);
      assert.strictEqual(tracks[0].endFrame, 60);
      assert.strictEqual(tracks[0].durationInFrames, 60);
      assert.strictEqual(tracks[0].startTimeInSeconds, 0);
      assert.strictEqual(tracks[0].endTimeInSeconds, 2.0);
      assert.strictEqual(tracks[0].sequenceIndex, 0);

      // Product: 60..150, 2s..5s
      assert.strictEqual(tracks[1].startFrame, 60);
      assert.strictEqual(tracks[1].endFrame, 150);
      assert.strictEqual(tracks[1].durationInFrames, 90);
      assert.strictEqual(tracks[1].startTimeInSeconds, 2.0);
      assert.strictEqual(tracks[1].endTimeInSeconds, 5.0);
      assert.strictEqual(tracks[1].sequenceIndex, 1);
    });

    it('integrates delayBefore, delayAfter, and defaultDelay', () => {
      const scenes: TimelineSceneInput[] = [
        { id: 's1', durationInFrames: 40, delayAfter: 10 },
        { id: 's2', durationInFrames: 40, delayBefore: 20 },
      ];

      const { scenes: tracks } = calculateSceneTimeline(scenes, { fps: 30 });

      // s1: 0..40 (+10 delayAfter -> cursor 50)
      assert.strictEqual(tracks[0].startFrame, 0);
      assert.strictEqual(tracks[0].endFrame, 40);

      // s2: cursor (50) + delayBefore (20) = 70..110
      assert.strictEqual(tracks[1].startFrame, 70);
      assert.strictEqual(tracks[1].endFrame, 110);
    });

    it('prevents accidental collision when allowOverlap is false', () => {
      const scenes: TimelineSceneInput[] = [
        { id: 's1', durationInFrames: 60 },
        { id: 's2', durationInFrames: 60, startFrame: 30 }, // collision!
      ];

      const { scenes: tracks } = calculateSceneTimeline(scenes, { fps: 30, allowOverlap: false });

      assert.strictEqual(tracks[0].startFrame, 0);
      assert.strictEqual(tracks[0].endFrame, 60);

      // Clamped to previous endFrame (60)
      assert.strictEqual(tracks[1].startFrame, 60);
      assert.strictEqual(tracks[1].endFrame, 120);
    });

    it('permits collision when allowOverlap is true', () => {
      const scenes: TimelineSceneInput[] = [
        { id: 's1', durationInFrames: 60 },
        { id: 's2', durationInFrames: 60, startFrame: 30, allowOverlap: true },
      ];

      const { scenes: tracks } = calculateSceneTimeline(scenes, { fps: 30, allowOverlap: false });

      assert.strictEqual(tracks[1].startFrame, 30);
      assert.strictEqual(tracks[1].endFrame, 90);
    });

    it('generates entrance and exit transition tracks attached to parent scene', () => {
      const scenes: TimelineSceneInput[] = [
        {
          id: 'hero',
          durationInFrames: 60,
          entranceTransition: { type: 'fade', durationInFrames: 15 },
          exitTransition: { type: 'slide', direction: 'left', durationInFrames: 10 },
        },
      ];

      const { transitions } = calculateSceneTimeline(scenes, { fps: 30 });

      assert.strictEqual(transitions.length, 2);

      // Entrance: 0..15
      assert.strictEqual(transitions[0].id, 'trans-enter-hero');
      assert.strictEqual(transitions[0].type, 'fade');
      assert.strictEqual(transitions[0].directionType, 'entrance');
      assert.strictEqual(transitions[0].startFrame, 0);
      assert.strictEqual(transitions[0].endFrame, 15);
      assert.strictEqual(transitions[0].durationInFrames, 15);

      // Exit: 50..60
      assert.strictEqual(transitions[1].id, 'trans-exit-hero');
      assert.strictEqual(transitions[1].type, 'slide');
      assert.strictEqual(transitions[1].directionType, 'exit');
      assert.strictEqual(transitions[1].startFrame, 50);
      assert.strictEqual(transitions[1].endFrame, 60);
      assert.strictEqual(transitions[1].durationInFrames, 10);
    });
  });

  describe('calculateAudioTimeline', () => {
    it('creates audio tracks spanning composition or custom durations', () => {
      const tracks = calculateAudioTimeline(
        [
          { src: 'bgm.mp3', startAtFrame: 0, fadeInFrames: 15, fadeOutFrames: 15 },
          { src: 'sfx.mp3', startAtFrame: 60, durationInFrames: 30 },
        ],
        150,
        30,
      );

      assert.strictEqual(tracks.length, 2);

      // BGM: 0..150
      assert.strictEqual(tracks[0].startFrame, 0);
      assert.strictEqual(tracks[0].endFrame, 150);
      assert.strictEqual(tracks[0].fadeInFrames, 15);
      assert.strictEqual(tracks[0].fadeOutFrames, 15);

      // SFX: 60..90
      assert.strictEqual(tracks[1].startFrame, 60);
      assert.strictEqual(tracks[1].endFrame, 90);
      assert.strictEqual(tracks[1].durationInFrames, 30);
    });
  });

  describe('buildTimelineComposition & inspectTimelineAtFrame', () => {
    const composition = buildTimelineComposition({
      fps: 30,
      scenes: [
        {
          id: 'intro',
          durationInFrames: 60,
          entranceTransition: { type: 'fade', durationInFrames: 15 },
          exitTransition: { type: 'fade', durationInFrames: 15 },
        },
        {
          id: 'cta',
          durationInFrames: 60,
          delayBefore: 10, // 70 to 130
        },
      ],
      audio: { src: 'music.mp3', startAtFrame: 0, durationInFrames: 130 },
    });

    it('calculates total duration across scenes and audio tracks', () => {
      assert.strictEqual(composition.totalDurationInFrames, 130);
      assert.strictEqual(composition.totalDurationInSeconds, 4.333);
    });

    it('inspects frame during entrance transition of first scene', () => {
      const ins = inspectTimelineAtFrame(composition, 5);

      assert.strictEqual(ins.frame, 5);
      assert.strictEqual(ins.timecode, '00:00:05');
      assert.strictEqual(ins.activeScenes.length, 1);
      assert.strictEqual(ins.primaryActiveScene?.id, 'intro');
      assert.strictEqual(ins.activeTransitions.length, 1);
      assert.strictEqual(ins.activeTransitions[0].id, 'trans-enter-intro');
      assert.strictEqual(ins.activeAudio.length, 1);
      assert.strictEqual(ins.isWithinBounds, true);
    });

    it('inspects frame during delay gap between scenes', () => {
      // Gap is frame 60 to 70
      const ins = inspectTimelineAtFrame(composition, 65);

      assert.strictEqual(ins.activeScenes.length, 0);
      assert.strictEqual(ins.primaryActiveScene, null);
      assert.strictEqual(ins.activeTransitions.length, 0);
      // Audio is still active
      assert.strictEqual(ins.activeAudio.length, 1);
    });

    it('inspects frame boundary conditions', () => {
      // Frame 0: active
      const f0 = inspectTimelineAtFrame(composition, 0);
      assert.strictEqual(f0.activeScenes[0].id, 'intro');

      // Frame 59: last frame of intro
      const f59 = inspectTimelineAtFrame(composition, 59);
      assert.strictEqual(f59.activeScenes[0].id, 'intro');

      // Frame 60: intro ended, gap started
      const f60 = inspectTimelineAtFrame(composition, 60);
      assert.strictEqual(f60.activeScenes.length, 0);

      // Frame 70: cta started
      const f70 = inspectTimelineAtFrame(composition, 70);
      assert.strictEqual(f70.activeScenes[0].id, 'cta');
    });
  });

  describe('TimelineManager Class Interface', () => {
    it('provides fluent inspection, conversion, and lookup methods', () => {
      const manager = new TimelineManager({
        fps: 30,
        scenes: [
          { id: 'hero', durationInFrames: 60 },
          { id: 'cta', durationInFrames: 60 },
        ],
      });

      assert.strictEqual(manager.getFps(), 30);
      assert.strictEqual(manager.getDurationInFrames(), 120);
      assert.strictEqual(manager.getDurationInSeconds(), 4.0);
      assert.strictEqual(manager.toSeconds(60), 2.0);
      assert.strictEqual(manager.toFrames(2.0), 60);
      assert.strictEqual(manager.format(75), '00:02:15');

      const hero = manager.getSceneById('hero');
      assert.strictEqual(hero?.id, 'hero');
      assert.strictEqual(hero?.durationInFrames, 60);

      const active = manager.getActiveScenesAt(30);
      assert.strictEqual(active.length, 1);
      assert.strictEqual(active[0].id, 'hero');

      const primary = manager.getPrimaryActiveSceneAt(90);
      assert.strictEqual(primary?.id, 'cta');
    });

    it('updates configuration dynamically via updateConfig', () => {
      const manager = new TimelineManager({
        fps: 30,
        scenes: [{ id: 's1', durationInFrames: 30 }],
      });
      assert.strictEqual(manager.getDurationInFrames(), 30);

      manager.updateConfig({
        scenes: [
          { id: 's1', durationInFrames: 30 },
          { id: 's2', durationInFrames: 50 },
        ],
      });
      assert.strictEqual(manager.getDurationInFrames(), 80);
    });
  });

  describe('Integration with SceneSequence', () => {
    it('creates a TimelineManager directly from SceneSequence items', () => {
      const manager = createTimelineManagerFromSequence(
        [
          { id: 's1', durationInFrames: 45, component: null },
          { id: 's2', durationInFrames: 45, delayBefore: 10, component: null },
        ],
        { fps: 30 },
      );

      assert.strictEqual(manager.getScenes().length, 2);
      assert.strictEqual(manager.getDurationInFrames(), 100);
      assert.strictEqual(manager.getSceneById('s2')?.startFrame, 55);
    });
  });
});
