import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseTextSegments,
  calculateTextHighlightStyle,
} from '../src/components/typography/textHighlightStyle.ts';
import type { TextHighlightVariant } from '../src/components/typography/types.ts';

test('TextHighlight: parseTextSegments Parsing & Extraction', async (t) => {
  await t.test('returns empty array if text is empty or missing', () => {
    assert.deepEqual(parseTextSegments(''), []);
    assert.deepEqual(parseTextSegments(undefined), []);
  });

  await t.test('highlights entire text if no highlight target is specified', () => {
    const result = parseTextSegments('Move faster with better experiences');
    assert.equal(result.length, 1);
    assert.equal(result[0].text, 'Move faster with better experiences');
    assert.equal(result[0].highlighted, true);
  });

  await t.test('respects explicit segments override', () => {
    const customSegments = [
      { text: 'Custom ', highlighted: false },
      { text: 'Segment', highlighted: true },
    ];
    const result = parseTextSegments('Ignored text', 'Ignored', customSegments);
    assert.deepEqual(result, customSegments);
  });

  await t.test('extracts single targeted string keyword with surrounding text', () => {
    const text = 'Make every moment count.';
    const result = parseTextSegments(text, 'moment');
    assert.equal(result.length, 3);
    assert.equal(result[0].text, 'Make every ');
    assert.equal(result[0].highlighted, false);
    assert.equal(result[1].text, 'moment');
    assert.equal(result[1].highlighted, true);
    assert.equal(result[2].text, ' count.');
    assert.equal(result[2].highlighted, false);
  });

  await t.test('performs case-insensitive keyword extraction', () => {
    const text = 'The Ultimate Performance Machine';
    const result = parseTextSegments(text, 'ultimate');
    assert.equal(result.length, 3);
    assert.equal(result[0].text, 'The ');
    assert.equal(result[1].text, 'Ultimate');
    assert.equal(result[1].highlighted, true);
    assert.equal(result[2].text, ' Performance Machine');
  });

  await t.test('extracts multiple targeted keywords in an array', () => {
    const text = 'Build scalable, reliable, and delightful products.';
    const result = parseTextSegments(text, ['scalable', 'delightful']);
    const highlightedWords = result.filter((s) => s.highlighted).map((s) => s.text);
    assert.deepEqual(highlightedWords, ['scalable', 'delightful']);
  });

  await t.test('supports regular expression targeting', () => {
    const text = 'Engineering future mobility solutions today.';
    const result = parseTextSegments(text, /\b\w+ing\b/);
    const highlightedWords = result.filter((s) => s.highlighted).map((s) => s.text);
    assert.deepEqual(highlightedWords, ['Engineering']);
  });

  await t.test('targets multiple repeated occurrences of a keyword', () => {
    const text = 'Faster, better, stronger, faster.';
    const result = parseTextSegments(text, 'faster');
    const highlighted = result.filter((s) => s.highlighted);
    assert.equal(highlighted.length, 2);
    assert.equal(highlighted[0].text, 'Faster');
    assert.equal(highlighted[1].text, 'faster');
  });

  await t.test('returns unhighlighted text if keyword is not found', () => {
    const text = 'Clean typography without emphasis';
    const result = parseTextSegments(text, 'missing');
    assert.equal(result.length, 1);
    assert.equal(result[0].text, text);
    assert.equal(result[0].highlighted, false);
  });
});

test('TextHighlight: Lifecycle Boundaries & Timings', async (t) => {
  await t.test('before startFrame is hidden and has opacity 0', () => {
    const style = calculateTextHighlightStyle({
      currentFrame: 5,
      fps: 30,
      startFrame: 15,
      durationInFrames: 20,
    });
    assert.equal(style.opacity, 0);
    assert.equal(style.visibility, 'hidden');
    assert.equal(style.progress, 0);
  });

  await t.test('at completion is fully visible and opacity is 1', () => {
    const style = calculateTextHighlightStyle({
      currentFrame: 35,
      fps: 30,
      startFrame: 15,
      durationInFrames: 20,
      variant: 'background',
    });
    assert.equal(style.opacity, 1);
    assert.equal(style.visibility, 'visible');
    assert.equal(style.progress, 1);
    assert.equal(style.clipPath, 'inset(0% 0.00% 0% 0.00%)');
  });

  await t.test('zero duration entrance is immediately settled at startFrame', () => {
    const style = calculateTextHighlightStyle({
      currentFrame: 10,
      fps: 30,
      startFrame: 10,
      durationInFrames: 0,
      variant: 'underline',
    });
    assert.equal(style.opacity, 1);
    assert.equal(style.visibility, 'visible');
    assert.equal(style.progress, 1);
    assert.equal(style.clipPath, 'inset(0% 0.00% 0% 0.00%)');
  });

  await t.test('exit animation reduces opacity and hides at exit completion', () => {
    const midExit = calculateTextHighlightStyle({
      currentFrame: 45,
      fps: 30,
      startFrame: 0,
      durationInFrames: 20,
      exitFrame: 40,
      exitDurationInFrames: 10,
      variant: 'background',
    });
    assert.equal(midExit.visibility, 'visible');
    assert.ok(midExit.opacity < 1 && midExit.opacity > 0);

    const postExit = calculateTextHighlightStyle({
      currentFrame: 50,
      fps: 30,
      startFrame: 0,
      durationInFrames: 20,
      exitFrame: 40,
      exitDurationInFrames: 10,
      variant: 'background',
    });
    assert.equal(postExit.visibility, 'hidden');
    assert.equal(postExit.opacity, 0);
  });
});

test('TextHighlight: All 10 Supported Variants Calculations', async (t) => {
  const variants: TextHighlightVariant[] = [
    'background',
    'underline',
    'marker',
    'box',
    'circle',
    'strike',
    'gradient',
    'glow',
    'border-bottom',
    'bracket',
  ];

  for (const variant of variants) {
    await t.test(`variant "${variant}" calculates valid properties at midpoint`, () => {
      const style = calculateTextHighlightStyle({
        currentFrame: 10,
        fps: 30,
        startFrame: 0,
        durationInFrames: 20,
        variant,
      });

      assert.equal(style.visibility, 'visible');
      assert.ok(style.progress > 0 && style.progress < 1);

      if (['background', 'underline', 'marker', 'strike', 'gradient', 'border-bottom'].includes(variant)) {
        assert.ok(style.clipPath?.startsWith('inset('), `${variant} should produce an inset clipPath`);
      } else if (['box', 'circle'].includes(variant)) {
        assert.ok(typeof style.strokeDashoffset === 'number', `${variant} should calculate strokeDashoffset`);
        assert.ok(style.strokeDashoffset > 0 && style.strokeDashoffset < 100);
      } else if (variant === 'glow') {
        assert.ok(style.transform?.startsWith('scale('), 'glow should produce scale transform');
      } else if (variant === 'bracket') {
        assert.ok(style.transform?.startsWith('translateX('), 'bracket should produce translateX transform');
      }
    });
  }
});

test('TextHighlight: Directional Expansion and Reverse Options', async (t) => {
  await t.test('left-to-right expands rightward by reducing right inset', () => {
    const style = calculateTextHighlightStyle({
      currentFrame: 10,
      fps: 30,
      startFrame: 0,
      durationInFrames: 20,
      variant: 'background',
      direction: 'left-to-right',
    });
    // inset(0% rightInset 0% leftInset)
    assert.ok(style.clipPath?.includes('0% 0.00%)'));
  });

  await t.test('right-to-left expands leftward by reducing left inset', () => {
    const style = calculateTextHighlightStyle({
      currentFrame: 10,
      fps: 30,
      startFrame: 0,
      durationInFrames: 20,
      variant: 'background',
      direction: 'right-to-left',
    });
    assert.ok(style.clipPath?.includes('inset(0% 0.00% 0%'));
  });

  await t.test('center expands horizontally from center outward', () => {
    const style = calculateTextHighlightStyle({
      currentFrame: 10,
      fps: 30,
      startFrame: 0,
      durationInFrames: 20,
      variant: 'background',
      direction: 'center',
    });
    // Inset symmetric on left and right
    const match = style.clipPath?.match(/inset\(0% ([\d.]+)% 0% ([\d.]+)%\)/);
    assert.ok(match, 'clipPath must match symmetric inset format');
    assert.equal(match[1], match[2]);
  });

  await t.test('reverse flag inverts progress calculation', () => {
    const normal = calculateTextHighlightStyle({
      currentFrame: 5,
      fps: 30,
      startFrame: 0,
      durationInFrames: 20,
      reverse: false,
    });
    const reversed = calculateTextHighlightStyle({
      currentFrame: 5,
      fps: 30,
      startFrame: 0,
      durationInFrames: 20,
      reverse: true,
    });
    assert.ok(Math.abs(normal.progress - (1 - reversed.progress)) < 0.001);
  });
});
