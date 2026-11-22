import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateSceneProgress,
  calculateSequenceSchedule,
  getActiveScenesAtFrame,
  getPrimaryActiveSceneAtFrame,
  resolveSceneTransitions,
  validateSceneSequence,
} from '../src/components/scenes/sceneSequenceStyle.ts';
import type { SceneSequenceItemConfig } from '../src/components/scenes/types.ts';

describe('SceneSequence Unit Tests', () => {
  describe('validateSceneSequence', () => {
    it('returns isValid: true for standard valid scene configuration', () => {
      const scenes: SceneSequenceItemConfig[] = [
        { id: 'scene-1', durationInFrames: 60, component: 'Scene 1 Content' },
        { id: 'scene-2', durationInFrames: 90, component: 'Scene 2 Content' },
      ];

      const res = validateSceneSequence(scenes);
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.errors.length, 0);
      assert.strictEqual(res.warnings.length, 0);
      assert.strictEqual(res.totalCalculatedDuration, 150);
    });

    it('catches missing scene IDs', () => {
      const scenes: SceneSequenceItemConfig[] = [
        { id: '', durationInFrames: 60, component: 'Content' },
      ];

      const res = validateSceneSequence(scenes);
      assert.strictEqual(res.isValid, false);
      assert.ok(res.errors.some((e) => e.includes("missing a required unique 'id'")));
    });

    it('catches duplicate scene IDs', () => {
      const scenes: SceneSequenceItemConfig[] = [
        { id: 'dup-id', durationInFrames: 60, component: 'Content 1' },
        { id: 'dup-id', durationInFrames: 60, component: 'Content 2' },
      ];

      const res = validateSceneSequence(scenes);
      assert.strictEqual(res.isValid, false);
      assert.ok(res.errors.some((e) => e.includes('Duplicate scene ID detected')));
    });

    it('catches non-positive or NaN durations', () => {
      const scenes: SceneSequenceItemConfig[] = [
        { id: 'scene-1', durationInFrames: 0, component: 'Content' },
        { id: 'scene-2', durationInFrames: -15, component: 'Content' },
      ];

      const res = validateSceneSequence(scenes);
      assert.strictEqual(res.isValid, false);
      assert.strictEqual(res.errors.length, 2);
      assert.ok(res.errors[0].includes('invalid durationInFrames'));
    });

    it('catches missing component', () => {
      const scenes = [
        { id: 'scene-1', durationInFrames: 60, component: null as unknown as string },
      ];

      const res = validateSceneSequence(scenes);
      assert.strictEqual(res.isValid, false);
      assert.ok(res.errors.some((e) => e.includes('missing a \'component\'')));
    });

    it('catches negative delays', () => {
      const scenes: SceneSequenceItemConfig[] = [
        { id: 'scene-1', durationInFrames: 60, delayBefore: -10, component: 'Content' },
      ];

      const res = validateSceneSequence(scenes);
      assert.strictEqual(res.isValid, false);
      assert.ok(res.errors.some((e) => e.includes('negative or non-numeric delayBefore')));
    });

    it('warns about overlap collision when allowOverlap is false', () => {
      const scenes: SceneSequenceItemConfig[] = [
        { id: 'scene-1', durationInFrames: 60, component: 'Content' },
        { id: 'scene-2', durationInFrames: 60, startFrame: 30, component: 'Content' },
      ];

      const res = validateSceneSequence(scenes, { allowOverlap: false });
      assert.ok(res.warnings.some((w) => w.includes('Overlap is prevented')));
    });
  });

  describe('calculateSequenceSchedule', () => {
    it('schedules scenes sequentially when startFrame is omitted', () => {
      const scenes: SceneSequenceItemConfig[] = [
        { id: 'hero', durationInFrames: 60, component: null },
        { id: 'product', durationInFrames: 90, component: null },
        { id: 'outro', durationInFrames: 45, component: null },
      ];

      const schedule = calculateSequenceSchedule(scenes);

      assert.strictEqual(schedule.length, 3);
      // Hero: 0 to 60
      assert.strictEqual(schedule[0].computedStartFrame, 0);
      assert.strictEqual(schedule[0].computedEndFrame, 60);
      assert.strictEqual(schedule[0].sequenceIndex, 0);

      // Product: 60 to 150
      assert.strictEqual(schedule[1].computedStartFrame, 60);
      assert.strictEqual(schedule[1].computedEndFrame, 150);
      assert.strictEqual(schedule[1].sequenceIndex, 1);

      // Outro: 150 to 195
      assert.strictEqual(schedule[2].computedStartFrame, 150);
      assert.strictEqual(schedule[2].computedEndFrame, 195);
      assert.strictEqual(schedule[2].sequenceIndex, 2);
    });

    it('integrates delayBefore and delayAfter between scenes', () => {
      const scenes: SceneSequenceItemConfig[] = [
        { id: 'scene-1', durationInFrames: 50, delayAfter: 10, component: null },
        { id: 'scene-2', durationInFrames: 40, delayBefore: 15, component: null },
      ];

      const schedule = calculateSequenceSchedule(scenes);

      // Scene 1: 0 to 50 (+ delayAfter 10 => cursor = 60)
      assert.strictEqual(schedule[0].computedStartFrame, 0);
      assert.strictEqual(schedule[0].computedEndFrame, 50);

      // Scene 2: cursor (60) + delayBefore (15) = 75 to 115
      assert.strictEqual(schedule[1].computedStartFrame, 75);
      assert.strictEqual(schedule[1].computedEndFrame, 115);
    });

    it('applies defaultDelay when scene has no explicit delayBefore', () => {
      const scenes: SceneSequenceItemConfig[] = [
        { id: 'scene-1', durationInFrames: 40, component: null },
        { id: 'scene-2', durationInFrames: 40, component: null },
      ];

      const schedule = calculateSequenceSchedule(scenes, { defaultDelay: 20 });

      // Scene 1: starts at 0 (or defaultDelay? index 0 starts at 0 + defaultDelay: 20)
      // defaultDelay applies to all delayBefore when omitted
      assert.strictEqual(schedule[0].computedStartFrame, 20);
      assert.strictEqual(schedule[0].computedEndFrame, 60);

      // Scene 2: 60 + defaultDelay (20) = 80
      assert.strictEqual(schedule[1].computedStartFrame, 80);
      assert.strictEqual(schedule[1].computedEndFrame, 120);
    });

    it('respects manual startFrame overrides when valid', () => {
      const scenes: SceneSequenceItemConfig[] = [
        { id: 'scene-1', durationInFrames: 50, component: null },
        { id: 'scene-2', durationInFrames: 50, startFrame: 80, component: null },
      ];

      const schedule = calculateSequenceSchedule(scenes);

      assert.strictEqual(schedule[0].computedStartFrame, 0);
      assert.strictEqual(schedule[0].computedEndFrame, 50);

      // Scene 2 starts at explicit 80
      assert.strictEqual(schedule[1].computedStartFrame, 80);
      assert.strictEqual(schedule[1].computedEndFrame, 130);
    });

    it('prevents overlap by default when startFrame < prevEndFrame', () => {
      const scenes: SceneSequenceItemConfig[] = [
        { id: 'scene-1', durationInFrames: 60, component: null },
        { id: 'scene-2', durationInFrames: 60, startFrame: 30, component: null },
      ];

      // Default: allowOverlap = false
      const schedule = calculateSequenceSchedule(scenes, { allowOverlap: false });

      assert.strictEqual(schedule[0].computedStartFrame, 0);
      assert.strictEqual(schedule[0].computedEndFrame, 60);

      // Scene 2 was attempted at 30, but previous ends at 60 -> clamped to 60!
      assert.strictEqual(schedule[1].computedStartFrame, 60);
      assert.strictEqual(schedule[1].computedEndFrame, 120);
    });

    it('permits overlap when allowOverlap is explicitly enabled', () => {
      const scenes: SceneSequenceItemConfig[] = [
        { id: 'scene-1', durationInFrames: 60, component: null },
        { id: 'scene-2', durationInFrames: 60, startFrame: 30, allowOverlap: true, component: null },
      ];

      const schedule = calculateSequenceSchedule(scenes, { allowOverlap: false });

      assert.strictEqual(schedule[0].computedStartFrame, 0);
      assert.strictEqual(schedule[0].computedEndFrame, 60);

      // Overlap permitted via scene flag
      assert.strictEqual(schedule[1].computedStartFrame, 30);
      assert.strictEqual(schedule[1].computedEndFrame, 90);
    });
  });

  describe('getActiveScenesAtFrame & getPrimaryActiveSceneAtFrame', () => {
    const scenes: SceneSequenceItemConfig[] = [
      { id: 's1', durationInFrames: 50, component: null },
      { id: 's2', durationInFrames: 50, delayBefore: 20, component: null }, // 70 to 120
    ];
    const schedule = calculateSequenceSchedule(scenes);

    it('identifies single active scene during its active interval', () => {
      const active = getActiveScenesAtFrame(schedule, 25);
      assert.strictEqual(active.length, 1);
      assert.strictEqual(active[0].id, 's1');

      const primary = getPrimaryActiveSceneAtFrame(schedule, 25);
      assert.strictEqual(primary?.id, 's1');
    });

    it('returns empty array during timeline gap / delay interval', () => {
      // Gap is frame 50 to 70
      const active = getActiveScenesAtFrame(schedule, 60);
      assert.strictEqual(active.length, 0);

      const primary = getPrimaryActiveSceneAtFrame(schedule, 60);
      assert.strictEqual(primary, null);
    });

    it('identifies multiple active scenes during deliberate overlap', () => {
      const overlappingScenes: SceneSequenceItemConfig[] = [
        { id: 'a', durationInFrames: 60, component: null },
        { id: 'b', durationInFrames: 60, startFrame: 40, allowOverlap: true, component: null },
      ];
      const overlapSchedule = calculateSequenceSchedule(overlappingScenes, { allowOverlap: true });

      // At frame 50: both 'a' (0..60) and 'b' (40..100) are active
      const active = getActiveScenesAtFrame(overlapSchedule, 50);
      assert.strictEqual(active.length, 2);
      assert.strictEqual(active[0].id, 'a');
      assert.strictEqual(active[1].id, 'b');

      // Primary active scene should be the latest entered ('b')
      const primary = getPrimaryActiveSceneAtFrame(overlapSchedule, 50);
      assert.strictEqual(primary?.id, 'b');
    });
  });

  describe('calculateSceneProgress', () => {
    const scenes: SceneSequenceItemConfig[] = [
      { id: 's1', durationInFrames: 100, component: null },
    ];
    const item = calculateSequenceSchedule(scenes)[0];

    it('returns 0 before start', () => {
      assert.strictEqual(calculateSceneProgress(item, -10), 0);
    });

    it('returns 0.5 at exact midpoint', () => {
      assert.strictEqual(calculateSceneProgress(item, 50), 0.5);
    });

    it('returns 1 at or after end frame', () => {
      assert.strictEqual(calculateSceneProgress(item, 100), 1);
      assert.strictEqual(calculateSceneProgress(item, 150), 1);
    });
  });

  describe('resolveSceneTransitions', () => {
    it('inherits defaultTransition if scene has no explicit transition', () => {
      const scene: SceneSequenceItemConfig = {
        id: 's1',
        durationInFrames: 60,
        component: null,
      };

      const resolved = resolveSceneTransitions(scene, {
        type: 'slide',
        durationInFrames: 20,
        direction: 'right',
      });

      assert.strictEqual(resolved.entrance.type, 'slide');
      assert.strictEqual(resolved.entrance.durationInFrames, 20);
      assert.strictEqual(resolved.entrance.direction, 'right');
      assert.strictEqual(resolved.exit.type, 'slide');
    });

    it('allows distinct entrance and exit transition overrides', () => {
      const scene: SceneSequenceItemConfig = {
        id: 's1',
        durationInFrames: 60,
        component: null,
        entranceTransition: { type: 'zoom', durationInFrames: 12 },
        exitTransition: { type: 'fade', durationInFrames: 18 },
      };

      const resolved = resolveSceneTransitions(scene);

      assert.strictEqual(resolved.entrance.type, 'zoom');
      assert.strictEqual(resolved.entrance.durationInFrames, 12);
      assert.strictEqual(resolved.exit.type, 'fade');
      assert.strictEqual(resolved.exit.durationInFrames, 18);
    });
  });
});
