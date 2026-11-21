/**
 * Clamp and Range Utilities
 * Pure math and range boundary normalization functions.
 */

/**
 * Restricts a number between a minimum and maximum boundary.
 */
export const clamp = (value: number, min: number, max: number): number => {
  if (min > max) {
    [min, max] = [max, min];
  }
  return Math.min(Math.max(value, min), max);
};

/**
 * Normalizes a number within [min, max] to a 0..1 floating point range.
 * Edge cases: If min === max, returns 0 if value < min, else 1.
 */
export const normalizeRange = (value: number, min: number, max: number): number => {
  if (min === max) {
    return value >= min ? 1 : 0;
  }
  return clamp((value - min) / (max - min), 0, 1);
};

/**
 * Linearly maps a value from an input range [inMin, inMax] to an output range [outMin, outMax].
 * If clamped is true (default), the result is constrained between outMin and outMax.
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  clamped: boolean = true
): number => {
  if (inMin === inMax) {
    return outMin;
  }
  const ratio = (value - inMin) / (inMax - inMin);
  const result = outMin + ratio * (outMax - outMin);

  if (clamped) {
    const lower = Math.min(outMin, outMax);
    const upper = Math.max(outMin, outMax);
    return clamp(result, lower, upper);
  }

  return result;
};

/**
 * Calculates normalized 0..1 progression given a current value, start, and duration.
 * Safely handles zero or negative durations.
 */
export const getProgress = (current: number, start: number, duration: number): number => {
  if (duration <= 0) {
    return current >= start ? 1 : 0;
  }
  return normalizeRange(current, start, start + duration);
};

/**
 * Inverts a normalized progress value (e.g. for fade out or reverse animations).
 */
export const reverseProgress = (progress: number): number => {
  return clamp(1 - progress, 0, 1);
};
