import test from 'node:test';
import assert from 'node:assert/strict';

import {
  segmentText,
  calculateWordRevealTiming,
  calculateWordRevealStyle,
} from '../src/components/typography/wordRevealStyle.ts';

test('WordReveal: Text Segmentation & Spacing Preservation', async (t) => {
  await t.test('empty text returns empty array', () => {
    assert.deepEqual(segmentText(''), []);
    // @ts-expect-error null handling check
    assert.deepEqual(segmentText(null), []);
  });

  await t.test('whitespace only text contains no words', () => {
    const tokens = segmentText('    ');
    const words = tokens.filter((t) => t.isWord);
    assert.equal(words.length, 0);
    assert.equal(tokens.length, 1);
    assert.equal(tokens[0].text, '    ');
    assert.equal(tokens[0].isWord, false);
  });

  await t.test('one-word sentence produces exactly one word token', () => {
    const tokens = segmentText('Uber');
    assert.equal(tokens.length, 1);
    assert.equal(tokens[0].isWord, true);
    assert.equal(tokens[0].wordIndex, 0);
    assert.equal(tokens[0].text, 'Uber');
  });

  await t.test('multiple-word sentence preserves words and spaces', () => {
    const text = 'Move faster with better experiences';
    const tokens = segmentText(text);
    const words = tokens.filter((t) => t.isWord);
    const spaces = tokens.filter((t) => !t.isWord);

    assert.equal(words.length, 5);
    assert.equal(spaces.length, 4);
    assert.equal(words[0].text, 'Move');
    assert.equal(words[1].text, 'faster');
    assert.equal(words[2].text, 'with');
    assert.equal(words[3].text, 'better');
    assert.equal(words[4].text, 'experiences');

    // Reconstruction matches original text perfectly
    const reconstructed = tokens.map((t) => t.text).join('');
    assert.equal(reconstructed, text);
  });

  await t.test('punctuation remains attached to words', () => {
    const text = 'Hello, world! (Ready?)';
    const tokens = segmentText(text);
    const words = tokens.filter((t) => t.isWord);

    assert.equal(words.length, 3);
    assert.equal(words[0].text, 'Hello,');
    assert.equal(words[1].text, 'world!');
    assert.equal(words[2].text, '(Ready?)');
  });

  await t.test('multiple consecutive spaces are preserved', () => {
    const text = 'Move    faster   now';
    const tokens = segmentText(text);
    const words = tokens.filter((t) => t.isWord);

    assert.equal(words.length, 3);
    assert.equal(tokens[1].text, '    ');
    assert.equal(tokens[3].text, '   ');

    const reconstructed = tokens.map((t) => t.text).join('');
    assert.equal(reconstructed, text);
  });

  await t.test('multi-line text preserves newlines', () => {
    const text = 'Line 1\nLine 2\n\nLine 3';
    const tokens = segmentText(text);
    const words = tokens.filter((t) => t.isWord);

    assert.equal(words.length, 6);
    assert.ok(tokens.some((t) => t.text.includes('\n')));

    const reconstructed = tokens.map((t) => t.text).join('');
    assert.equal(reconstructed, text);
  });

  await t.test('custom string separator splits and preserves separators', () => {
    const text = 'apple,banana,cherry';
    const tokens = segmentText(text, ',');
    const words = tokens.filter((t) => t.isWord);

    assert.equal(words.length, 3);
    assert.equal(words[0].text, 'apple');
    assert.equal(words[1].text, 'banana');
    assert.equal(words[2].text, 'cherry');

    const reconstructed = tokens.map((t) => t.text).join('');
    assert.equal(reconstructed, text);
  });
});

test('WordReveal: Timing Calculations & Stagger Order', async (t) => {
  await t.test('calculates correct start and end frames for first and last word', () => {
    const timing = calculateWordRevealTiming(5, {
      startFrame: 10,
      staggerDelay: 4,
      wordDuration: 20,
    });

    assert.equal(timing.totalWords, 5);
    assert.equal(timing.totalDurationInFrames, 36); // (5 - 1) * 4 + 20 = 36

    // First word (index 0)
    const firstWord = timing.getWordTiming(0);
    assert.equal(firstWord.wordStartFrame, 10);
    assert.equal(firstWord.wordEndFrame, 30);

    // Mid word (index 2)
    const midWord = timing.getWordTiming(2);
    assert.equal(midWord.wordStartFrame, 18);
    assert.equal(midWord.wordEndFrame, 38);

    // Last word (index 4)
    const lastWord = timing.getWordTiming(4);
    assert.equal(lastWord.wordStartFrame, 26);
    assert.equal(lastWord.wordEndFrame, 46);
  });

  await t.test('reverse order reveals last word first', () => {
    const timing = calculateWordRevealTiming(5, {
      startFrame: 0,
      staggerDelay: 4,
      wordDuration: 18,
      reverse: true,
    });

    // Word 4 (last) starts at frame 0
    const word4 = timing.getWordTiming(4);
    assert.equal(word4.wordStartFrame, 0);

    // Word 3 starts at frame 4
    const word3 = timing.getWordTiming(3);
    assert.equal(word3.wordStartFrame, 4);

    // Word 0 (first word) starts last at frame 16
    const word0 = timing.getWordTiming(0);
    assert.equal(word0.wordStartFrame, 16);
  });

  await t.test('respects base delay parameter', () => {
    const timing = calculateWordRevealTiming(3, {
      startFrame: 5,
      delay: 15,
      staggerDelay: 5,
      wordDuration: 20,
    });

    const firstWord = timing.getWordTiming(0);
    assert.equal(firstWord.wordStartFrame, 20); // 5 + 15 = 20
  });
});

test('WordReveal: Lifecycle Boundaries & State Transitions', async (t) => {
  await t.test('word is hidden before its specific staggered start frame', () => {
    // 3 words, stagger 5, wordDuration 15
    // Word 0 starts at 0, Word 1 starts at 5, Word 2 starts at 10
    const word1Before = calculateWordRevealStyle({
      currentFrame: 3,
      fps: 30,
      totalWords: 3,
      wordIndex: 1,
      startFrame: 0,
      staggerDelay: 5,
      wordDuration: 15,
    });

    assert.equal(word1Before.opacity, 0);
    assert.equal(word1Before.visibility, 'hidden');
  });

  await t.test('word is animating during its active window while others are settled or pending', () => {
    // At frame 7:
    // Word 0 (0..15): active
    // Word 1 (5..20): active
    // Word 2 (10..25): pending (hidden)
    const word0 = calculateWordRevealStyle({
      currentFrame: 7,
      fps: 30,
      totalWords: 3,
      wordIndex: 0,
      startFrame: 0,
      staggerDelay: 5,
      wordDuration: 15,
      variant: 'slide-up',
      distance: 30,
    });
    const word2 = calculateWordRevealStyle({
      currentFrame: 7,
      fps: 30,
      totalWords: 3,
      wordIndex: 2,
      startFrame: 0,
      staggerDelay: 5,
      wordDuration: 15,
      variant: 'slide-up',
    });

    assert.ok(word0.opacity > 0);
    assert.equal(word0.visibility, 'visible');
    assert.equal(word2.opacity, 0);
    assert.equal(word2.visibility, 'hidden');
  });

  await t.test('word is fully settled after its duration completes', () => {
    const word0Settled = calculateWordRevealStyle({
      currentFrame: 20,
      fps: 30,
      totalWords: 3,
      wordIndex: 0,
      startFrame: 0,
      staggerDelay: 5,
      wordDuration: 15,
      variant: 'slide-up',
      distance: 30,
    });

    assert.equal(word0Settled.opacity, 1);
    assert.equal(word0Settled.visibility, 'visible');
    assert.equal(word0Settled.transform, 'translateY(0.00px)');
  });

  await t.test('exit animation progresses and hides after completion', () => {
    // 2 words, exitFrame: 40, exitStaggerDelay: 5, exitDuration: 10
    // Word 0 exit: 40..50
    // Word 1 exit: 45..55
    const word0MidExit = calculateWordRevealStyle({
      currentFrame: 45,
      fps: 30,
      totalWords: 2,
      wordIndex: 0,
      startFrame: 0,
      wordDuration: 15,
      exitFrame: 40,
      exitDurationInFrames: 10,
    });
    assert.ok(word0MidExit.opacity > 0 && word0MidExit.opacity < 1);

    const word0AfterExit = calculateWordRevealStyle({
      currentFrame: 52,
      fps: 30,
      totalWords: 2,
      wordIndex: 0,
      startFrame: 0,
      wordDuration: 15,
      exitFrame: 40,
      exitDurationInFrames: 10,
    });
    assert.equal(word0AfterExit.opacity, 0);
    assert.equal(word0AfterExit.visibility, 'hidden');
  });

  await t.test('handles different framerates (24, 30, 60 fps) consistently', () => {
    for (const testFps of [24, 30, 60]) {
      const style = calculateWordRevealStyle({
        currentFrame: 15,
        fps: testFps,
        totalWords: 3,
        wordIndex: 0,
        startFrame: 0,
        wordDuration: 15,
      });
      assert.equal(style.opacity, 1);
      assert.equal(style.visibility, 'visible');
    }
  });
});

test('WordReveal: All 10 Animation Variants', async (t) => {
  const baseOpts = {
    currentFrame: 5,
    fps: 30,
    totalWords: 1,
    wordIndex: 0,
    startFrame: 0,
    wordDuration: 20,
    distance: 40,
  };

  await t.test('variant: fade', () => {
    const style = calculateWordRevealStyle({ ...baseOpts, variant: 'fade' });
    assert.ok(style.opacity > 0 && style.opacity < 1);
    assert.equal(style.transform, undefined);
  });

  await t.test('variant: slide-up', () => {
    const style = calculateWordRevealStyle({ ...baseOpts, variant: 'slide-up' });
    assert.ok(style.transform?.includes('translateY('));
    assert.ok(!style.transform?.includes('-'));
  });

  await t.test('variant: slide-down', () => {
    const style = calculateWordRevealStyle({ ...baseOpts, variant: 'slide-down' });
    assert.ok(style.transform?.includes('translateY(-'));
  });

  await t.test('variant: slide-left', () => {
    const style = calculateWordRevealStyle({ ...baseOpts, variant: 'slide-left' });
    assert.ok(style.transform?.includes('translateX('));
    assert.ok(!style.transform?.includes('-'));
  });

  await t.test('variant: slide-right', () => {
    const style = calculateWordRevealStyle({ ...baseOpts, variant: 'slide-right' });
    assert.ok(style.transform?.includes('translateX(-'));
  });

  await t.test('variant: scale', () => {
    const style = calculateWordRevealStyle({ ...baseOpts, variant: 'scale', initialScale: 0.5 });
    assert.ok(style.transform?.includes('scale('));
  });

  await t.test('variant: pop (spring)', () => {
    const style = calculateWordRevealStyle({ ...baseOpts, variant: 'pop', springPreset: 'snappy' });
    assert.ok(style.transform?.includes('scale('));
    assert.ok(style.opacity > 0);
  });

  await t.test('variant: blur', () => {
    const style = calculateWordRevealStyle({ ...baseOpts, variant: 'blur', initialBlur: 12 });
    assert.ok(style.filter?.includes('blur('));
  });

  await t.test('variant: rotate', () => {
    const style = calculateWordRevealStyle({ ...baseOpts, variant: 'rotate', initialRotation: -15 });
    assert.ok(style.transform?.includes('rotate('));
  });

  await t.test('variant: fade-slide-up', () => {
    const style = calculateWordRevealStyle({ ...baseOpts, variant: 'fade-slide-up' });
    assert.ok(style.opacity > 0 && style.opacity < 1);
    assert.ok(style.transform?.includes('translateY('));
  });
});
