import test from 'node:test';
import assert from 'node:assert/strict';

// Deterministic pure logic simulating useTyping frame calculation
const calculateTypingState = (options: {
  text: string;
  currentFrame: number;
  startFrame?: number;
  delay?: number;
  framesPerCharacter?: number;
  charactersPerStep?: number;
  reverse?: boolean;
}) => {
  const {
    text,
    currentFrame,
    startFrame = 0,
    delay = 0,
    framesPerCharacter = 2,
    charactersPerStep = 1,
    reverse = false,
  } = options;

  const totalCharCount = text.length;
  const safeFramesPerChar = Math.max(1, framesPerCharacter);
  const safeCharsPerStep = Math.max(1, charactersPerStep);

  const effectiveStart = startFrame + delay;
  const totalSteps = Math.ceil(totalCharCount / safeCharsPerStep);
  const totalDurationInFrames = totalSteps * safeFramesPerChar;
  const effectiveEnd = effectiveStart + totalDurationInFrames;

  let visibleCharCount = 0;

  if (totalCharCount === 0) {
    visibleCharCount = 0;
  } else if (currentFrame < effectiveStart) {
    visibleCharCount = reverse ? totalCharCount : 0;
  } else if (currentFrame >= effectiveEnd) {
    visibleCharCount = reverse ? 0 : totalCharCount;
  } else {
    const elapsedFrames = currentFrame - effectiveStart;
    const stepsElapsed = Math.floor(elapsedFrames / safeFramesPerChar);
    const count = Math.min(totalCharCount, stepsElapsed * safeCharsPerStep);
    visibleCharCount = reverse ? totalCharCount - count : count;
  }

  const displayedText = text.slice(0, visibleCharCount);
  const isTyping = currentFrame >= effectiveStart && currentFrame < effectiveEnd;
  const isComplete = currentFrame >= effectiveEnd;

  return {
    displayedText,
    visibleCharCount,
    totalCharCount,
    isTyping,
    isComplete,
    totalDurationInFrames,
  };
};

test('Typing Hook Logic', async (t) => {
  const text = 'REMOTION FRAMEWORK';

  await t.test('handles empty text cleanly', () => {
    const res = calculateTypingState({ text: '', currentFrame: 10 });
    assert.equal(res.displayedText, '');
    assert.equal(res.visibleCharCount, 0);
    assert.equal(res.isComplete, true);
  });

  await t.test('before typing starts', () => {
    const res = calculateTypingState({ text, currentFrame: 5, startFrame: 10 });
    assert.equal(res.displayedText, '');
    assert.equal(res.visibleCharCount, 0);
    assert.equal(res.isTyping, false);
    assert.equal(res.isComplete, false);
  });

  await t.test('first character and mid-typing', () => {
    // 2 frames per character, start at 10
    // at frame 10: 0 chars; at frame 12: 1 char; at frame 14: 2 chars
    const at12 = calculateTypingState({ text, currentFrame: 12, startFrame: 10, framesPerCharacter: 2 });
    assert.equal(at12.visibleCharCount, 1);
    assert.equal(at12.displayedText, 'R');
    assert.equal(at12.isTyping, true);

    const at26 = calculateTypingState({ text, currentFrame: 26, startFrame: 10, framesPerCharacter: 2 });
    // 16 frames elapsed = 8 chars
    assert.equal(at26.visibleCharCount, 8);
    assert.equal(at26.displayedText, 'REMOTION');
    assert.equal(at26.isTyping, true);
  });

  await t.test('at completion and beyond', () => {
    const duration = text.length * 2; // 18 * 2 = 36 frames
    const endFrame = 10 + duration; // 46
    const atComplete = calculateTypingState({ text, currentFrame: endFrame, startFrame: 10, framesPerCharacter: 2 });
    assert.equal(atComplete.visibleCharCount, text.length);
    assert.equal(atComplete.displayedText, text);
    assert.equal(atComplete.isComplete, true);
    assert.equal(atComplete.isTyping, false);

    const beyond = calculateTypingState({ text, currentFrame: 100, startFrame: 10, framesPerCharacter: 2 });
    assert.equal(beyond.displayedText, text);
    assert.equal(beyond.isComplete, true);
  });

  await t.test('reverse typing (erasing)', () => {
    const resBefore = calculateTypingState({ text, currentFrame: 5, startFrame: 10, reverse: true });
    assert.equal(resBefore.displayedText, text);

    const resMid = calculateTypingState({ text, currentFrame: 26, startFrame: 10, framesPerCharacter: 2, reverse: true });
    // 8 chars erased -> 10 chars remaining
    assert.equal(resMid.visibleCharCount, 10);
    assert.equal(resMid.displayedText, text.slice(0, 10));

    const resDone = calculateTypingState({ text, currentFrame: 100, startFrame: 10, framesPerCharacter: 2, reverse: true });
    assert.equal(resDone.displayedText, '');
    assert.equal(resDone.isComplete, true);
  });
});

test('Stagger Timing Calculation', async (t) => {
  await t.test('calculates correct per-item offsets and progress', () => {
    const itemCount = 5;
    const startFrame = 10;
    const staggerDelay = 5;
    const itemDuration = 20;

    // Item 0 starts at 10, ends at 30
    // Item 1 starts at 15, ends at 35
    // Item 4 starts at 30, ends at 50
    // Total duration: (5 - 1)*5 + 20 = 40 frames

    const totalDuration = (itemCount - 1) * staggerDelay + itemDuration;
    assert.equal(totalDuration, 40);

    const getProgressAt = (itemIndex: number, currentFrame: number) => {
      const itemStart = startFrame + itemIndex * staggerDelay;
      if (currentFrame < itemStart) return 0;
      if (currentFrame >= itemStart + itemDuration) return 1;
      return (currentFrame - itemStart) / itemDuration;
    };

    assert.equal(getProgressAt(0, 10), 0);
    assert.equal(getProgressAt(0, 20), 0.5);
    assert.equal(getProgressAt(0, 30), 1);

    assert.equal(getProgressAt(1, 10), 0);
    assert.equal(getProgressAt(1, 15), 0);
    assert.equal(getProgressAt(1, 25), 0.5);
    assert.equal(getProgressAt(1, 35), 1);

    assert.equal(getProgressAt(4, 25), 0);
    assert.equal(getProgressAt(4, 40), 0.5);
    assert.equal(getProgressAt(4, 50), 1);
  });
});
