/**
 * Advertisement Composition Layer Types
 * Core contracts for commercial ad compositions, multi-scene timelines, and audio tracks.
 */

import { VideoResolution } from '../config/video';

export interface SceneSequenceItem {
  sceneId: string;
  durationInFrames: number;
  transitionType?: string;
  transitionDurationFrames?: number;
}

export interface AudioTrackConfig {
  src: string;
  volume?: number;
  startAtFrame?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
}

export interface CommercialAdConfig {
  id: string;
  title: string;
  client?: string;
  resolution: VideoResolution;
  totalDurationInFrames: number;
  scenes: SceneSequenceItem[];
  audio?: AudioTrackConfig;
}

export interface PlaceholderAdProps {
  campaignName?: string;
  tagline?: string;
}
