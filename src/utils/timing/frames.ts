/**
 * Timing & Frame Utility Functions
 * Safe conversions between seconds and frames, delay calculation, and scene progress.
 */

/**
 * Converts seconds to exact integer frames at the given FPS.
 */
export const secondsToFrames = (seconds: number, fps: number): number => {
  return Math.round(seconds * fps);
};

/**
 * Converts frames to seconds at the given FPS.
 */
export const framesToSeconds = (frames: number, fps: number): number => {
  return Number((frames / fps).toFixed(2));
};

/**
 * Formats a frame number into standard SMPTE timecode (MM:SS:FF)
 */
export const formatTimecode = (frame: number, fps: number): string => {
  const totalSeconds = Math.floor(frame / fps);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const remFrames = frame % fps;

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  const ff = String(remFrames).padStart(2, '0');

  return `${mm}:${ss}:${ff}`;
};

/**
 * Calculates staggered delay for the nth element in a sequence.
 */
export const calculateStagger = (index: number, intervalFrames: number, baseDelay: number = 0): number => {
  return baseDelay + index * intervalFrames;
};
