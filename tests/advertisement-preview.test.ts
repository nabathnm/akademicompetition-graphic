/**
 * AdvertisementPreview Unit Test Suite
 * Tests configuration validation, duration calculations, default transition injection,
 * and audio layer detection.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolvePreviewScenes,
  validateAdvertisementPreviewConfig,
} from '../src/compositions/advertisements/advertisementPreviewStyle.ts';
import type { SceneSequenceItemConfig } from '../src/components/scenes/types.ts';

describe('AdvertisementPreview - Configuration Validation', () => {
  it('validates a standard valid multi-scene preview configuration', () => {
    const scenes: SceneSequenceItemConfig[] = [
      { id: 'hero-scene', durationInFrames: 45 },
      { id: 'feature-scene', durationInFrames: 45 },
      { id: 'cta-scene', durationInFrames: 30 },
    ];

    const result = validateAdvertisementPreviewConfig({
      width: 1920,
      height: 1080,
      fps: 30,
      scenes,
    });

    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.errors.length, 0);
    assert.strictEqual(result.sceneCount, 3);
    assert.strictEqual(result.computedTotalDuration, 120);
  });

  it('catches non-positive dimensional values', () => {
    const result = validateAdvertisementPreviewConfig({
      width: -1920,
      height: 0,
      fps: -30,
      durationInFrames: -100,
    });

    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.length >= 4);
  });

  it('catches missing scene IDs and non-positive scene durations', () => {
    const scenes = [
      { id: '', durationInFrames: 30 },
      { id: 'scene-2', durationInFrames: 0 },
    ] as SceneSequenceItemConfig[];

    const result = validateAdvertisementPreviewConfig({ scenes });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some((e) => e.includes("missing a required unique 'id'")));
    assert.ok(result.errors.some((e) => e.includes('non-positive durationInFrames')));
  });

  it('warns when both scenes and children are omitted', () => {
    const result = validateAdvertisementPreviewConfig({});
    assert.ok(result.warnings.some((w) => w.includes('No scenes or children provided')));
  });

  it('warns when scenes end frame exceeds specified durationInFrames', () => {
    const scenes: SceneSequenceItemConfig[] = [
      { id: 'scene-1', durationInFrames: 60 },
      { id: 'scene-2', durationInFrames: 60 },
    ];

    const result = validateAdvertisementPreviewConfig({
      durationInFrames: 90, // 60 + 60 = 120 > 90
      scenes,
    });

    assert.ok(result.warnings.some((w) => w.includes('exceeds specified durationInFrames')));
  });

  it('detects audio presence from backgroundMusic, soundEffects, or audio array', () => {
    const withBgm = validateAdvertisementPreviewConfig({
      backgroundMusic: { volume: 0.8 },
    });
    assert.strictEqual(withBgm.hasAudio, true);

    const withSfx = validateAdvertisementPreviewConfig({
      soundEffects: [{ triggerFrame: 15, preset: 'whoosh' }],
    });
    assert.strictEqual(withSfx.hasAudio, true);

    const noAudio = validateAdvertisementPreviewConfig({});
    assert.strictEqual(noAudio.hasAudio, false);
  });

  it('validates global animation config and passes through errors', () => {
    const result = validateAdvertisementPreviewConfig({
      animation: { speedMultiplier: -1.0 },
    });
    assert.strictEqual(result.isValid, false);
    assert.ok(result.errors.some((e) => e.includes('[AnimationConfig]')));
  });
});

describe('AdvertisementPreview - Transition Injection & Scene Normalization', () => {
  it('returns empty array when scenes array is undefined or empty', () => {
    assert.deepStrictEqual(resolvePreviewScenes(undefined), []);
    assert.deepStrictEqual(resolvePreviewScenes([]), []);
  });

  it('injects default transition settings into scenes without explicit transitions', () => {
    const rawScenes: SceneSequenceItemConfig[] = [
      { id: 'scene-1', durationInFrames: 40 },
      { id: 'scene-2', durationInFrames: 40 },
      { id: 'scene-3', durationInFrames: 40 },
    ];

    const resolved = resolvePreviewScenes(rawScenes, {
      defaultType: 'wipe',
      defaultDurationInFrames: 18,
    });

    // Scene 1 and Scene 2 get default transition
    assert.strictEqual(resolved[0].transition?.type, 'wipe');
    assert.strictEqual(resolved[0].transition?.durationInFrames, 18);
    assert.strictEqual(resolved[1].transition?.type, 'wipe');
    assert.strictEqual(resolved[1].transition?.durationInFrames, 18);

    // Last scene does not get transition
    assert.strictEqual(resolved[2].transition, undefined);
  });

  it('preserves explicit scene transitions without overwriting them', () => {
    const rawScenes: SceneSequenceItemConfig[] = [
      {
        id: 'scene-1',
        durationInFrames: 40,
        transition: { type: 'zoom', durationInFrames: 25 },
      },
      { id: 'scene-2', durationInFrames: 40 },
    ];

    const resolved = resolvePreviewScenes(rawScenes, {
      defaultType: 'fade',
      defaultDurationInFrames: 12,
    });

    // Explicit transition is untouched
    assert.strictEqual(resolved[0].transition?.type, 'zoom');
    assert.strictEqual(resolved[0].transition?.durationInFrames, 25);
  });
});

describe('AdvertisementPreview - Duration Calculations', () => {
  it('uses explicit durationInFrames when provided', () => {
    const result = validateAdvertisementPreviewConfig({
      durationInFrames: 200,
      scenes: [{ id: 's1', durationInFrames: 50 }],
    });
    assert.strictEqual(result.computedTotalDuration, 200);
  });

  it('calculates duration automatically from sequential scenes and delays', () => {
    const scenes: SceneSequenceItemConfig[] = [
      { id: 's1', durationInFrames: 40, delayAfter: 10 },
      { id: 's2', durationInFrames: 50, delayBefore: 5 },
    ];

    // s1 starts at 0, ends at 40, delayAfter 10 -> currentOffset = 50
    // s2 delayBefore 5 -> starts at 55, ends at 105
    const result = validateAdvertisementPreviewConfig({ scenes });
    assert.strictEqual(result.computedTotalDuration, 105);
  });
});
