/**
 * Custom Hook: useMotionTimeline
 * Computes deterministic relative progress (0..1) and status for a local animation window.
 */

import { useCurrentFrame } from 'remotion';

export interface MotionTimelineOptions {
  startFrame: number;
  durationInFrames: number;
}

export interface MotionTimelineState {
  currentFrame: number;
  relativeFrame: number;
  progress: number;
  isStarted: boolean;
  isFinished: boolean;
  isActive: boolean;
}

export const useMotionTimeline = ({
  startFrame,
  durationInFrames,
}: MotionTimelineOptions): MotionTimelineState => {
  const currentFrame = useCurrentFrame();
  const relativeFrame = currentFrame - startFrame;

  const rawProgress = durationInFrames > 0 ? relativeFrame / durationInFrames : 1;
  const progress = Math.max(0, Math.min(1, rawProgress));

  const isStarted = currentFrame >= startFrame;
  const isFinished = currentFrame >= startFrame + durationInFrames;
  const isActive = isStarted && !isFinished;

  return {
    currentFrame,
    relativeFrame,
    progress,
    isStarted,
    isFinished,
    isActive,
  };
};
