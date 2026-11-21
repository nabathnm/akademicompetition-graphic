/**
 * PlaceholderAd Component
 * Minimal placeholder composition demonstrating Layer 4 assembly structure.
 * Note: Actual multi-scene advertisements will be implemented in subsequent phases.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { PlaceholderAdProps } from '../types';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { formatTimecode } from '../../utils/timing/frames';

export const PlaceholderAd: React.FC<PlaceholderAdProps> = ({
  campaignName = 'COMMERCIAL AD CAMPAIGN',
  tagline = 'Layer 4: Assembly Pipeline Architecture',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: Colors.dark.bgPrimary,
        color: Colors.text.primary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: Typography.fontFamily.sans,
        overflow: 'hidden',
      }}
    >
      {/* Background ambient spotlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: Colors.overlay.spotlight,
          opacity: 0.6,
        }}
      />

      {/* Frame Container */}
      <div
        style={{
          zIndex: Spacing.zIndex.content,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 900,
          padding: Spacing.scale.xl,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.lg,
          backgroundColor: Colors.dark.surface1,
        }}
      >
        <span
          style={{
            ...Typography.caption.eyebrow,
            color: Colors.accent.brand,
            marginBottom: Spacing.scale.sm,
            letterSpacing: '0.16em',
          }}
        >
          {campaignName}
        </span>

        <h1
          style={{
            ...Typography.headline.h2,
            color: Colors.text.primary,
            marginBottom: Spacing.scale.md,
          }}
        >
          {tagline}
        </h1>

        <p
          style={{
            ...Typography.body.small,
            color: Colors.text.secondary,
            lineHeight: 1.6,
            marginBottom: Spacing.scale.lg,
          }}
        >
          This placeholder composition validates the final rendering pipeline for Layer 4.
          Individual scene templates and audio cues will be sequenced here during Phase 6.
        </p>

        {/* Telemetry info */}
        <div
          style={{
            display: 'flex',
            gap: Spacing.scale.lg,
            padding: `${Spacing.scale.xs}px ${Spacing.scale.md}px`,
            backgroundColor: Colors.dark.surface2,
            borderRadius: Spacing.radius.sm,
            fontSize: Typography.caption.caption.fontSize,
            fontFamily: Typography.fontFamily.mono,
            color: Colors.text.secondary,
          }}
        >
          <span>DIMENSIONS: {width}x{height}</span>
          <span>FPS: {fps}</span>
          <span>FRAME: {frame}/{durationInFrames}</span>
          <span>TIME: {formatTimecode(frame, fps)}</span>
        </div>
      </div>
    </div>
  );
};
