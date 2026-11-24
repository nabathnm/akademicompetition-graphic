/**
 * Scene 4: New Domain Announcement
 * Highlights the new official domain (akademicompetition.com) as the hero visual
 * using a polished BrowserWindowMockup, glowing highlight badges, and strong typography.
 *
 * Duration: 210 frames (7.0 seconds at 30 FPS)
 * Copy: "Now, with a new home!" / "Akademi Competition sekarang punya domain baru."
 * Visual URL: akademicompetition.com
 */

import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Globe, ExternalLink, Sparkles } from 'lucide-react';
import { AKADEMI_RELAUNCH_CONFIG } from '../akademiRelaunchConfig.ts';
import { AkademiLogo } from '../../../../assets/icons/AkademiLogo.tsx';
import { BrowserWindowMockup } from '../../../../components/mockups/BrowserWindowMockup.tsx';
import { TextHighlight } from '../../../../components/typography/TextHighlight.tsx';
import { Typography } from '../../../../styles/typography.ts';

export const AkademiDomainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { copy, theme } = AKADEMI_RELAUNCH_CONFIG;

  // Header entrance spring
  const headerProgress = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 170 },
  });

  // Browser mockup entrance spring
  const browserProgress = spring({
    frame: frame - 18,
    fps,
    config: { damping: 13, mass: 0.7, stiffness: 150 },
  });

  // Domain callout badge scale spring
  const badgeProgress = spring({
    frame: frame - 40,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 190 },
  });

  // Continuous subtle float kinematics for the browser mockup
  const floatY = Math.sin(frame * 0.06) * 6;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 40px',
        textAlign: 'center',
      }}
    >
      {/* Top Section: Announcement Typography */}
      <div
        style={{
          transform: `translateY(${interpolate(headerProgress, [0, 1], [30, 0])}px)`,
          opacity: headerProgress,
          marginBottom: 28,
        }}
      >
        {/* Eyebrow Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 20px',
            borderRadius: 999,
            background: 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${theme.accentGold}`,
            marginBottom: 16,
          }}
        >
          <Sparkles size={16} color={theme.accentGold} />
          <span
            style={{
              fontFamily: Typography.fontFamily.mono,
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: '0.2em',
              color: theme.accentGold,
              textTransform: 'uppercase',
            }}
          >
            {copy.scene4.eyebrow}
          </span>
        </div>

        {/* Main Announcement Headline */}
        <h2
          style={{
            fontFamily: Typography.fontFamily.sans,
            fontSize: 56,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            margin: '0 0 10px 0',
            lineHeight: 1.15,
          }}
        >
          {copy.scene4.headline}
        </h2>

        {/* Subheadline */}
        <p
          style={{
            fontFamily: Typography.fontFamily.sans,
            fontSize: 24,
            fontWeight: 500,
            color: theme.textSecondary,
            margin: 0,
          }}
        >
          {copy.scene4.subheadline}
        </p>
      </div>

      {/* Centerpiece: BrowserWindowMockup displaying akademicompetition.com */}
      <div
        style={{
          transform: `translateY(${interpolate(browserProgress, [0, 1], [60, 0]) + floatY}px) scale(${interpolate(browserProgress, [0, 1], [0.92, 1])})`,
          opacity: browserProgress,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 32,
        }}
      >
        <BrowserWindowMockup
          width={880}
          height={680}
          title="Akademi Competition - Platform Belajar & Persiapan Kompetisi"
          url={copy.scene4.domain}
          variant="full"
          theme="dark"
          showTabs={false}
          showToolbar={true}
          showAddressBar={true}
          style={{
            borderRadius: 24,
            border: `2px solid rgba(0, 240, 255, 0.4)`,
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(0, 240, 255, 0.22)',
            overflow: 'hidden',
          }}
        >
          {/* Inner Web Page Preview */}
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at 50% 20%, #0f172a 0%, #020617 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 36,
              color: '#ffffff',
              textAlign: 'center',
            }}
          >
            {/* Website Header Brand */}
            <div style={{ marginBottom: 20 }}>
              <AkademiLogo variant="horizontal" size={54} />
            </div>

            {/* Simulated Hero Banner */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                borderRadius: 999,
                background: 'rgba(0, 240, 255, 0.12)',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                marginBottom: 16,
              }}
            >
              <Globe size={16} color={theme.accentCyan} />
              <span
                style={{
                  fontFamily: Typography.fontFamily.mono,
                  fontSize: 13,
                  fontWeight: 700,
                  color: theme.accentCyan,
                  letterSpacing: '0.12em',
                }}
              >
                DOMAIN RESMI TELAH AKTIF
              </span>
            </div>

            <h3
              style={{
                fontFamily: Typography.fontFamily.sans,
                fontSize: 32,
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: 12,
                lineHeight: 1.25,
              }}
            >
              Selamat Datang di Rumah Baru Kami
            </h3>

            <p
              style={{
                fontFamily: Typography.fontFamily.sans,
                fontSize: 16,
                color: '#94a3b8',
                maxWidth: 580,
                lineHeight: 1.5,
                marginBottom: 24,
              }}
            >
              Temukan bootcamp intensif, materi persiapan lomba, dan komunitas juara.
            </p>

            {/* Quick action button inside website */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 28px',
                borderRadius: 12,
                background: `linear-gradient(135deg, ${theme.accentCyan} 0%, #2563eb 100%)`,
                color: '#ffffff',
                fontFamily: Typography.fontFamily.sans,
                fontSize: 15,
                fontWeight: 700,
                boxShadow: '0 4px 18px rgba(0, 240, 255, 0.35)',
              }}
            >
              <span>Kunjungi Platform</span>
              <ExternalLink size={16} color="#ffffff" />
            </div>
          </div>
        </BrowserWindowMockup>
      </div>

      {/* Prominent Domain Hero Badge */}
      <div
        style={{
          transform: `scale(${badgeProgress})`,
          opacity: badgeProgress,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          padding: '18px 36px',
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(11, 17, 32, 0.95) 0%, rgba(3, 7, 18, 0.98) 100%)',
          border: `2px solid ${theme.accentCyan}`,
          boxShadow: '0 0 32px rgba(0, 240, 255, 0.35), 0 12px 24px rgba(0, 0, 0, 0.6)',
        }}
      >
        <Globe size={28} color={theme.accentCyan} />
        <TextHighlight
          variant="glow"
          color={theme.accentCyan}
          startFrame={45}
          durationInFrames={30}
        >
          <span
            style={{
              fontFamily: Typography.fontFamily.mono,
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: '0.04em',
              color: '#ffffff',
            }}
          >
            {copy.scene4.domain}
          </span>
        </TextHighlight>
      </div>
    </div>
  );
};
