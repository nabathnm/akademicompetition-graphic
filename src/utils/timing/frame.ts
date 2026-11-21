/**
 * Frame Conversion & Formatting Utilities
 * Standard converters between time units (seconds, milliseconds) and integer frame counts.
 */

/**
 * Converts seconds to exact integer frames at the given FPS.
 */
export const secondsToFrames = (seconds: number, fps: number): number => {
  return Math.round(seconds * fps);
};

/**
 * Converts milliseconds to integer frames at the given FPS.
 */
export const millisecondsToFrames = (ms: number, fps: number): number => {
  return Math.round((ms / 1000) * fps);
};

/**
 * Converts frame count to fractional seconds at the given FPS.
 */
export const framesToSeconds = (frames: number, fps: number): number => {
  if (fps <= 0) return 0;
  return Number((frames / fps).toFixed(3));
};

/**
 * Converts frame count to milliseconds at the given FPS.
 */
export const framesToMilliseconds = (frames: number, fps: number): number => {
  if (fps <= 0) return 0;
  return Math.round((frames / fps) * 1000);
};

/**
 * Formats a frame number into standard SMPTE timecode (MM:SS:FF).
 */
export const formatTimecode = (frame: number, fps: number): string => {
  const safeFps = fps > 0 ? fps : 30;
  const totalSeconds = Math.floor(frame / safeFps);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const remFrames = Math.floor(frame % safeFps);

  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  const ff = String(remFrames).padStart(2, '0');

  return `${mm}:${ss}:${ff}`;
};
