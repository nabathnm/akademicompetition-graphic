/**
 * VariantComparator Component
 * Structure for side-by-side comparison of different motion parameters (e.g. snappy vs smooth spring).
 */

import React from 'react';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';

export interface VariantComparatorProps {
  title: string;
  variantAName: string;
  variantAPreview: React.ReactNode;
  variantAMeta?: Record<string, string | number>;
  variantBName: string;
  variantBPreview: React.ReactNode;
  variantBMeta?: Record<string, string | number>;
}

export const VariantComparator: React.FC<VariantComparatorProps> = ({
  title,
  variantAName,
  variantAPreview,
  variantAMeta,
  variantBName,
  variantBPreview,
  variantBMeta,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        backgroundColor: Colors.dark.surface1,
        borderRadius: Spacing.radius.lg,
        border: `1px solid ${Colors.border.default}`,
        overflow: 'hidden',
      }}
    >
      {/* Comparator Title Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${Spacing.scale.sm}px ${Spacing.scale.md}px`,
          backgroundColor: Colors.dark.surface2,
          borderBottom: `1px solid ${Colors.border.subtle}`,
        }}
      >
        <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
          A/B VARIANT COMPARISON
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text.primary }}>
          {title}
        </span>
      </div>

      {/* Side-by-Side Comparison Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        {/* Variant A Column */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: `1px solid ${Colors.border.default}` }}>
          <div
            style={{
              padding: `${Spacing.scale.xs}px ${Spacing.scale.md}px`,
              backgroundColor: Colors.dark.surface3,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 12,
              fontFamily: Typography.fontFamily.mono,
              color: Colors.accent.brand,
            }}
          >
            <span>VARIANT A</span>
            <span>{variantAName}</span>
          </div>

          <div
            style={{
              height: 240,
              backgroundColor: Colors.dark.bgPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: Spacing.scale.md,
            }}
          >
            {variantAPreview}
          </div>

          {variantAMeta && (
            <div
              style={{
                padding: `${Spacing.scale.xs}px ${Spacing.scale.md}px`,
                backgroundColor: Colors.dark.surface1,
                borderTop: `1px solid ${Colors.border.subtle}`,
                fontSize: 11,
                fontFamily: Typography.fontFamily.mono,
                color: Colors.text.secondary,
                display: 'flex',
                gap: Spacing.scale.md,
              }}
            >
              {Object.entries(variantAMeta).map(([k, v]) => (
                <span key={k}>
                  {k}: <strong style={{ color: Colors.text.primary }}>{v}</strong>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Variant B Column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              padding: `${Spacing.scale.xs}px ${Spacing.scale.md}px`,
              backgroundColor: Colors.dark.surface3,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 12,
              fontFamily: Typography.fontFamily.mono,
              color: Colors.accent.electricViolet,
            }}
          >
            <span>VARIANT B</span>
            <span>{variantBName}</span>
          </div>

          <div
            style={{
              height: 240,
              backgroundColor: Colors.dark.bgPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: Spacing.scale.md,
            }}
          >
            {variantBPreview}
          </div>

          {variantBMeta && (
            <div
              style={{
                padding: `${Spacing.scale.xs}px ${Spacing.scale.md}px`,
                backgroundColor: Colors.dark.surface1,
                borderTop: `1px solid ${Colors.border.subtle}`,
                fontSize: 11,
                fontFamily: Typography.fontFamily.mono,
                color: Colors.text.secondary,
                display: 'flex',
                gap: Spacing.scale.md,
              }}
            >
              {Object.entries(variantBMeta).map(([k, v]) => (
                <span key={k}>
                  {k}: <strong style={{ color: Colors.text.primary }}>{v}</strong>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
