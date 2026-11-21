/**
 * useTyping Hook
 * Computes deterministic typewriter text progression and blinking cursor states frame-by-frame.
 */

import { useCurrentFrame } from 'remotion';

export interface CursorConfig {
  /** Frames per cursor blink cycle (default: 16) */
  blinkSpeedFrames?: number;
  /** Cursor symbol character (default: '│') */
  cursorChar?: string;
}

export interface UseTypingOptions {
  /** Full text string to type out */
  text: string;
  /** Starting frame for typing (default: 0) */
  startFrame?: number;
  /** Additional delay in frames before typing begins (default: 0) */
  delay?: number;
  /** Number of frames required per character typed (default: 2) */
  framesPerCharacter?: number;
  /** Number of characters revealed per step (default: 1) */
  charactersPerStep?: number;
  /** Type backwards/erase text (default: false) */
  reverse?: boolean;
  /** Blinking cursor configuration or boolean toggle (default: true) */
  cursor?: boolean | CursorConfig;
}

export interface UseTypingResult {
  /** The text string revealed up to the current frame */
  displayedText: string;
  /** Number of currently visible characters */
  visibleCharCount: number;
  /** Total length of the full text */
  totalCharCount: number;
  /** True while the text is actively in the process of typing */
  isTyping: boolean;
  /** True when all characters have been typed out */
  isComplete: boolean;
  /** True when the blinking cursor is currently on/visible in this frame */
  cursorVisible: boolean;
  /** Text combined with cursor character if visible */
  fullTextWithCursor: string;
  /** Total frames required to complete typing */
  totalDurationInFrames: number;
}

export const useTyping = ({
  text,
  startFrame = 0,
  delay = 0,
  framesPerCharacter = 2,
  charactersPerStep = 1,
  reverse = false,
  cursor = true,
}: UseTypingOptions): UseTypingResult => {
  const currentFrame = useCurrentFrame();

  const totalCharCount = text.length;
  const safeFramesPerChar = Math.max(1, framesPerCharacter);
  const safeCharsPerStep = Math.max(1, charactersPerStep);

  const effectiveStart = startFrame + delay;
  const totalSteps = Math.ceil(totalCharCount / safeCharsPerStep);
  const totalDurationInFrames = totalSteps * safeFramesPerChar;
  const effectiveEnd = effectiveStart + totalDurationInFrames;

  // Calculate visible characters deterministically
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

  // Cursor blinking calculation
  let cursorVisible = false;
  let cursorChar = '│';

  if (cursor) {
    const blinkSpeed = typeof cursor === 'object' && cursor.blinkSpeedFrames
      ? cursor.blinkSpeedFrames
      : 16;
    if (typeof cursor === 'object' && cursor.cursorChar) {
      cursorChar = cursor.cursorChar;
    }
    // Alternate visibility half-cycle
    cursorVisible = Math.floor(currentFrame / (blinkSpeed / 2)) % 2 === 0;
  }

  const fullTextWithCursor = cursorVisible ? `${displayedText}${cursorChar}` : displayedText;

  return {
    displayedText,
    visibleCharCount,
    totalCharCount,
    isTyping,
    isComplete,
    cursorVisible,
    fullTextWithCursor,
    totalDurationInFrames,
  };
};
