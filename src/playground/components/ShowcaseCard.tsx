/**
 * ShowcaseCard Component
 * Structured preview container for showcasing individual component specifications.
 */

import React from 'react';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { ComponentCategory } from '../../components/types';

export interface ShowcaseCardProps {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  variants?: string[];
  status?: 'planned' | 'in-development' | 'ready';
  children?: React.ReactNode;
}

export const ShowcaseCard: React.FC<ShowcaseCardProps> = ({
  id,
  name,
  category,
  description,
  variants = ['Default'],
  status = 'planned',
  children,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'ready':
        return Colors.accent.emerald;
      case 'in-development':
        return Colors.accent.amber;
      case 'planned':
      default:
        return Colors.text.tertiary;
    }
  };

  return (
    <div
      data-showcase-id={id}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: Colors.dark.surface1,
        border: `1px solid ${Colors.border.default}`,
        borderRadius: Spacing.radius.md,
        overflow: 'hidden',
      }}
    >
      {/* Card Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${Spacing.scale.sm}px ${Spacing.scale.md}px`,
          borderBottom: `1px solid ${Colors.border.subtle}`,
          backgroundColor: Colors.dark.surface2,
        }}
      >
        <div>
          <span
            style={{
              fontFamily: Typography.fontFamily.mono,
              fontSize: 10,
              textTransform: 'uppercase',
              color: Colors.accent.brand,
              letterSpacing: '0.08em',
              marginRight: Spacing.scale.xs,
            }}
          >
            {category}
          </span>
          <span
            style={{
              fontFamily: Typography.fontFamily.sans,
              fontSize: 13,
              fontWeight: 600,
              color: Colors.text.primary,
            }}
          >
            {name}
          </span>
        </div>

        <span
          style={{
            fontSize: 10,
            fontFamily: Typography.fontFamily.mono,
            padding: '2px 8px',
            borderRadius: Spacing.radius.full,
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            color: getStatusColor(),
            border: `1px solid ${getStatusColor()}40`,
            textTransform: 'uppercase',
          }}
        >
          {status}
        </span>
      </div>

      {/* Preview Area */}
      <div
        style={{
          minHeight: 180,
          backgroundColor: Colors.dark.bgPrimary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: Spacing.scale.md,
        }}
      >
        {children}
      </div>

      {/* Card Footer: Metadata & Variants */}
      <div
        style={{
          padding: `${Spacing.scale.xs}px ${Spacing.scale.md}px`,
          borderTop: `1px solid ${Colors.border.subtle}`,
          backgroundColor: Colors.dark.surface1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: Colors.text.secondary,
        }}
      >
        <span style={{ maxWidth: '65%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {description}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {variants.map((v) => (
            <span
              key={v}
              style={{
                fontSize: 10,
                padding: '1px 6px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: Colors.dark.surface3,
                color: Colors.text.tertiary,
              }}
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
