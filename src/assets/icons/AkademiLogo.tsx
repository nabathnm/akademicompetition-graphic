/**
 * Akademi Competition Brand Logo Component
 * High-precision vector emblem and typography lockup for Akademi Competition.
 *
 * Visual elements:
 * - Geometric academic cap + victory star emblem with dual-tone gradient
 * - Crisp modern geometric typography ("AKADEMI" + "COMPETITION")
 * - Supports 'stacked', 'horizontal', and 'icon-only' lockups
 */

import React from 'react';
import { Typography } from '../../styles/typography.ts';

export interface AkademiLogoProps {
  /** Display variant: stacked vertical lockup, horizontal banner, or icon only */
  variant?: 'stacked' | 'horizontal' | 'icon-only';
  /** Base scale multiplier or pixel height for the icon */
  size?: number;
  /** Primary emblem accent color */
  accentColor?: string;
  /** Secondary highlight color */
  secondaryColor?: string;
  /** Custom inline style overrides */
  style?: React.CSSProperties;
  /** Optional class name */
  className?: string;
}

export const AkademiLogo: React.FC<AkademiLogoProps> = ({
  variant = 'stacked',
  size = 64,
  accentColor = '#00f0ff', // Electric cyan
  secondaryColor = '#f59e0b', // Competition gold/amber
  style,
  className,
}) => {
  const iconSize = size;
  const gradientId = `akademi-grad-${Math.round(iconSize)}`;

  // SVG Emblem: Academic Diamond Cap with Victory Star Crest
  const emblem = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accentColor} />
          <stop offset="60%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
        <linearGradient id={`${gradientId}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
        <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Hexagonal Shield Backdrop */}
      <polygon
        points="32,4 58,18 58,46 32,60 6,46 6,18"
        fill="#0b1329"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Graduation Cap Diamond / Mortarboard */}
      <polygon
        points="32,14 52,24 32,34 12,24"
        fill={`url(#${gradientId})`}
        opacity="0.95"
      />

      {/* Cap Underside / Base Arc */}
      <path
        d="M20,29 L20,38 C20,43 44,43 44,38 L44,29"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Golden Victory Star / Compass Centerpiece */}
      <path
        d="M32,20 L34,25 L39,26 L35,29 L36,34 L32,31 L28,34 L29,29 L25,26 L30,25 Z"
        fill={`url(#${gradientId}-gold)`}
        filter="url(#glow-filter)"
      />

      {/* Academic Tassel */}
      <path
        d="M48,26 L51,36 M51,36 L49,42 M51,36 L53,42"
        stroke={secondaryColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === 'icon-only') {
    return <div style={{ display: 'inline-flex', ...style }} className={className}>{emblem}</div>;
  }

  if (variant === 'horizontal') {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: Math.max(12, Math.round(iconSize * 0.25)),
          ...style,
        }}
        className={className}
      >
        {emblem}
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <span
            style={{
              fontFamily: Typography.fontFamily.sans,
              fontWeight: 900,
              fontSize: Math.round(iconSize * 0.44),
              letterSpacing: '-0.02em',
              color: '#ffffff',
              lineHeight: 1.05,
            }}
          >
            AKADEMI
          </span>
          <span
            style={{
              fontFamily: Typography.fontFamily.mono,
              fontWeight: 700,
              fontSize: Math.round(iconSize * 0.2),
              letterSpacing: '0.28em',
              color: accentColor,
              lineHeight: 1.2,
              marginTop: 2,
            }}
          >
            COMPETITION
          </span>
        </div>
      </div>
    );
  }

  // Stacked Lockup (Default for vertical video)
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: Math.max(8, Math.round(iconSize * 0.18)),
        ...style,
      }}
      className={className}
    >
      {emblem}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: Typography.fontFamily.sans,
            fontWeight: 900,
            fontSize: Math.round(iconSize * 0.44),
            letterSpacing: '-0.02em',
            color: '#ffffff',
            lineHeight: 1.05,
          }}
        >
          AKADEMI
        </span>
        <span
          style={{
            fontFamily: Typography.fontFamily.mono,
            fontWeight: 700,
            fontSize: Math.round(iconSize * 0.22),
            letterSpacing: '0.3em',
            color: accentColor,
            lineHeight: 1.2,
            marginTop: 4,
          }}
        >
          COMPETITION
        </span>
      </div>
    </div>
  );
};
