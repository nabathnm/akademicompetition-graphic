import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getGraphemes,
  segmentCharacters,
  calculateCharacterRevealTiming,
  calculateCharacterRevealStyle,
} from '../src/components/typography/characterRevealStyle.ts';

test('CharacterReveal: Grapheme Segmentation & Unicode Integrity', async (t) => {
  await t.test('empty text returns zero tokens and word groups', () => {
    const res = segmentCharacters('');
    assert.equal(res.tokens.length, 0);
    assert.equal(res.wordGroups.length, 0);
    assert.equal(res.totalAnimatableChars, 0);
  });

  await t.test('single character produces one character token and one word group', () => {
    const res = segmentCharacters('A');
    assert.equal(res.totalAnimatableChars, 1);
    assert.equal(res.tokens.length, 1);
    assert.equal(res.tokens[0].char, 'A');
    assert.equal(res.tokens[0].charIndex, 0);
    assert.equal(res.wordGroups.length, 1);
    assert.equal(res.wordGroups[0].wordText, 'A');
  });

  await t.test('short word produces correct sequence of characters', () => {
    const res = segmentCharacters('Uber');
    assert.equal(res.totalAnimatableChars, 4);
    assert.deepEqual(
      res.tokens.map((t) => t.char),
      ['U', 'b', 'e', 'r']
    );
    assert.equal(res.wordGroups[0].wordText, 'Uber');
  });

  await t.test('whitespace only text contains zero animatable characters', () => {
    const res = segmentCharacters('   \t\n  ');
    assert.equal(res.totalAnimatableChars, 0);
    assert.equal(res.tokens.length, 0);
  });

  await t.test('punctuation remains attached to corresponding word tokens', () => {
    const res = segmentCharacters('Hi! (Yes?)');
    assert.equal(res.totalAnimatableChars, 9);
    assert.equal(res.wordGroups[0].wordText, 'Hi!');
    assert.equal(res.wordGroups[1].wordText, '(Yes?)');
  });

  await t.test('multiple consecutive spaces are preserved in trailingSpace', () => {
    const res = segmentCharacters('A    B');
    assert.equal(res.totalAnimatableChars, 2);
    assert.equal(res.wordGroups.length, 2);
    assert.equal(res.wordGroups[0].trailingSpace, '    ');

    // Reconstruction matches original text
    const reconstructed = res.wordGroups
      .map((g) => g.characters.map((c) => c.char).join('') + (g.trailingSpace || ''))
      .join('');
    assert.equal(reconstructed, 'A    B');
  });

  await t.test('multi-line text preserves newlines in word groups', () => {
    const text = 'Line 1\nLine 2';
    const res = segmentCharacters(text);
    assert.equal(res.totalAnimatableChars, 10);
    assert.ok(res.wordGroups.some((g) => g.trailingSpace?.includes('\n')));

    const reconstructed = res.wordGroups
      .map((g) => g.characters.map((c) => c.char).join('') + (g.trailingSpace || ''))
      .join('');
    assert.equal(reconstructed, text);
  });

  await t.test('emoji clusters and skin tone modifiers are treated as single graphemes', () => {
    const graphemes = getGraphemes('🚀 👍🏽 👨‍👩‍👧‍👦');
    assert.equal(graphemes[0], '🚀');
    assert.equal(graphemes[2], '👍🏽');
    assert.equal(graphemes[4], '👨‍👩‍👧‍👦');

    const res = segmentCharacters('🚀 👍🏽');
    assert.equal(res.totalAnimatableChars, 2);
    assert.equal(res.tokens[0].char, '🚀');
    assert.equal(res.tokens[1].char, '👍🏽');
  });

  await t.test('combining diacritical marks and accented characters stay atomic', () => {
    const res = segmentCharacters('Café');
    assert.equal(res.totalAnimatableChars, 4);
    assert.equal(res.tokens[3].char, 'é');

    const combining = segmentCharacters('e\u0301');
    assert.equal(combining.totalAnimatableChars, 1);
  });

  await t.test('multilingual text (Japanese, Arabic, Cyrillic) segments accurately', () => {
    const jp = segmentCharacters('東京');
    assert.equal(jp.totalAnimatableChars, 2);
    assert.equal(jp.tokens[0].char, '東');
    assert.equal(jp.tokens[1].char, '京');

    const ar = segmentCharacters('مرحبا');
    assert.equal(ar.totalAnimatableChars, 5);
  });
});

test('CharacterReveal: Timing Calculations & Stagger Order', async (t) => {
  await t.test('calculates correct start frames for first, mid, and last characters', () => {
    // 5 characters, stagger: 2f, duration: 14f, startFrame: 5
    const timing = calculateCharacterRevealTiming(5, {
      startFrame: 5,
      staggerDelay: 2,
      characterDuration: 14,
    });

    assert.equal(timing.totalChars, 5);
    assert.equal(timing.totalDurationInFrames, 22); // (5 - 1) * 2 + 14 = 22

    // First char (0)
    const char0 = timing.getCharTiming(0);
    assert.equal(char0.charStartFrame, 5);
    assert.equal(char0.charEndFrame, 19);

    // Mid char (2)
    const char2 = timing.getCharTiming(2);
    assert.equal(char2.charStartFrame, 9);
    assert.equal(char2.charEndFrame, 23);

    // Last char (4)
    const char4 = timing.getCharTiming(4);
    assert.equal(char4.charStartFrame, 13);
    assert.equal(char4.charEndFrame, 27);
  });

  await t.test('reverse order reveals last character first', () => {
    const timing = calculateCharacterRevealTiming(5, {
      startFrame: 0,
      staggerDelay: 2,
      characterDuration: 14,
      reverse: true,
    });

    // Last char (4) starts at frame 0
    const char4 = timing.getCharTiming(4);
    assert.equal(char4.charStartFrame, 0);

    // First char (0) starts last at frame 8
    const char0 = timing.getCharTiming(0);
    assert.equal(char0.charStartFrame, 8);
  });

  await t.test('respects base delay parameter', () => {
    const timing = calculateCharacterRevealTiming(3, {
      startFrame: 0,
      delay: 10,
      staggerDelay: 2,
    });

    const char0 = timing.getCharTiming(0);
    assert.equal(char0.charStartFrame, 10);
  });
});

test('CharacterReveal: Lifecycle Boundaries & State Transitions', async (t) => {
  await t.test('character is hidden before its specific staggered start frame', () => {
    // 3 chars, stagger 3, duration 12
    // Char 0: 0..12, Char 1: 3..15, Char 2: 6..18
    const char1Before = calculateCharacterRevealStyle({
      currentFrame: 2,
      fps: 30,
      totalChars: 3,
      charIndex: 1,
      startFrame: 0,
      staggerDelay: 3,
      characterDuration: 12,
    });

    assert.equal(char1Before.opacity, 0);
    assert.equal(char1Before.visibility, 'hidden');
  });

  await t.test('character is active and visible during its window', () => {
    const char0Active = calculateCharacterRevealStyle({
      currentFrame: 5,
      fps: 30,
      totalChars: 3,
      charIndex: 0,
      startFrame: 0,
      staggerDelay: 3,
      characterDuration: 12,
      variant: 'slide-up',
    });

    assert.ok(char0Active.opacity > 0);
    assert.equal(char0Active.visibility, 'visible');
  });

  await t.test('character is settled after duration completes', () => {
    const char0Settled = calculateCharacterRevealStyle({
      currentFrame: 15,
      fps: 30,
      totalChars: 3,
      charIndex: 0,
      startFrame: 0,
      staggerDelay: 3,
      characterDuration: 12,
      variant: 'slide-up',
    });

    assert.equal(char0Settled.opacity, 1);
    assert.equal(char0Settled.visibility, 'visible');
    assert.equal(char0Settled.transform, 'translateY(0.00px)');
  });

  await t.test('exit animation progresses and hides after completion', () => {
    const char0MidExit = calculateCharacterRevealStyle({
      currentFrame: 25,
      fps: 30,
      totalChars: 2,
      charIndex: 0,
      startFrame: 0,
      characterDuration: 10,
      exitFrame: 20,
      exitDurationInFrames: 10,
    });
    assert.ok(char0MidExit.opacity > 0 && char0MidExit.opacity < 1);

    const char0AfterExit = calculateCharacterRevealStyle({
      currentFrame: 32,
      fps: 30,
      totalChars: 2,
      charIndex: 0,
      startFrame: 0,
      characterDuration: 10,
      exitFrame: 20,
      exitDurationInFrames: 10,
    });
    assert.equal(char0AfterExit.opacity, 0);
    assert.equal(char0AfterExit.visibility, 'hidden');
  });

  await t.test('handles different framerates (24, 30, 60 fps) consistently', () => {
    for (const testFps of [24, 30, 60]) {
      const style = calculateCharacterRevealStyle({
        currentFrame: 15,
        fps: testFps,
        totalChars: 1,
        charIndex: 0,
        startFrame: 0,
        characterDuration: 15,
      });
      assert.equal(style.opacity, 1);
      assert.equal(style.visibility, 'visible');
    }
  });
});

test('CharacterReveal: All 12 Animation Variants', async (t) => {
  const baseOpts = {
    currentFrame: 6,
    fps: 30,
    totalChars: 1,
    charIndex: 0,
    startFrame: 0,
    characterDuration: 18,
    distance: 24,
  };

  await t.test('variant: fade', () => {
    const style = calculateCharacterRevealStyle({ ...baseOpts, variant: 'fade' });
    assert.ok(style.opacity > 0 && style.opacity < 1);
    assert.equal(style.transform, undefined);
  });

  await t.test('variant: slide-up', () => {
    const style = calculateCharacterRevealStyle({ ...baseOpts, variant: 'slide-up' });
    assert.ok(style.transform?.includes('translateY('));
    assert.ok(!style.transform?.includes('-'));
  });

  await t.test('variant: slide-down', () => {
    const style = calculateCharacterRevealStyle({ ...baseOpts, variant: 'slide-down' });
    assert.ok(style.transform?.includes('translateY(-'));
  });

  await t.test('variant: slide-left', () => {
    const style = calculateCharacterRevealStyle({ ...baseOpts, variant: 'slide-left' });
    assert.ok(style.transform?.includes('translateX('));
    assert.ok(!style.transform?.includes('-'));
  });

  await t.test('variant: slide-right', () => {
    const style = calculateCharacterRevealStyle({ ...baseOpts, variant: 'slide-right' });
    assert.ok(style.transform?.includes('translateX(-'));
  });

  await t.test('variant: scale', () => {
    const style = calculateCharacterRevealStyle({ ...baseOpts, variant: 'scale', initialScale: 0.5 });
    assert.ok(style.transform?.includes('scale('));
  });

  await t.test('variant: pop (spring)', () => {
    const style = calculateCharacterRevealStyle({ ...baseOpts, variant: 'pop', springPreset: 'snappy' });
    assert.ok(style.transform?.includes('scale('));
    assert.ok(style.opacity > 0);
  });

  await t.test('variant: blur', () => {
    const style = calculateCharacterRevealStyle({ ...baseOpts, variant: 'blur', initialBlur: 10 });
    assert.ok(style.filter?.includes('blur('));
  });

  await t.test('variant: rotate', () => {
    const style = calculateCharacterRevealStyle({ ...baseOpts, variant: 'rotate', initialRotation: -20 });
    assert.ok(style.transform?.includes('rotate('));
  });

  await t.test('variant: fade-slide-up', () => {
    const style = calculateCharacterRevealStyle({ ...baseOpts, variant: 'fade-slide-up' });
    assert.ok(style.opacity > 0 && style.opacity < 1);
    assert.ok(style.transform?.includes('translateY('));
  });

  await t.test('variant: elastic', () => {
    const style = calculateCharacterRevealStyle({ ...baseOpts, variant: 'elastic' });
    assert.ok(style.transform?.includes('translateY('));
    assert.ok(style.transform?.includes('scale('));
  });

  await t.test('variant: wave (sinusoidal crest trajectory)', () => {
    const style = calculateCharacterRevealStyle({
      ...baseOpts,
      variant: 'wave',
      waveAmplitude: 24,
    });
    assert.ok(style.transform?.includes('translateY('));
  });
});
