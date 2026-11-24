/**
 * AkademiCompetitionRelaunchShowcase Component
 * Motion Playground showcase wrapper for the 28-second Akademi Competition Relaunch advertisement.
 * Layer 1 testing & preview environment.
 */

import React, { useState } from 'react';
import { AkademiCompetitionRelaunch } from '../../compositions/advertisements/AkademiCompetitionRelaunch.tsx';
import type { SocialPlatformType } from '../../compositions/advertisements/templates/socialMediaTemplateTypes.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Sparkles, Layers, Shield } from 'lucide-react';

export const AkademiCompetitionRelaunchShowcase: React.FC = () => {
  const [platform, setPlatform] = useState<SocialPlatformType>('reels');
  const [debugHud, setDebugHud] = useState<boolean>(false);
  const [showParticles, setShowParticles] = useState<boolean>(true);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#02050e',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Controls Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '12px 24px',
          background: 'rgba(5, 10, 24, 0.92)',
          borderBottom: '1px solid rgba(0, 240, 255, 0.15)',
          zIndex: 100,
        }}
      >
        {/* Left: Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(59, 130, 246, 0.2))',
              border: '1px solid #00f0ff',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Sparkles size={16} color="#00f0ff" />
            <span
              style={{
                fontFamily: Typography.fontFamily.mono,
                fontSize: 12,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '0.08em',
              }}
            >
              AKADEMI RELAUNCH (28s • 840f • 9:16)
            </span>
          </div>

          <div
            style={{
              fontFamily: Typography.fontFamily.sans,
              fontSize: 13,
              color: Colors.text.secondary,
            }}
          >
            Official New Domain: <strong style={{ color: '#00f0ff' }}>akademicompetition.com</strong>
          </div>
        </div>

        {/* Right: Interactive Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Platform Selector */}
          {(['reels', 'tiktok', 'shorts'] as SocialPlatformType[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontFamily: Typography.fontFamily.sans,
                fontWeight: 700,
                border: platform === p ? '1px solid #00f0ff' : '1px solid #1f293d',
                background: platform === p ? 'rgba(0, 240, 255, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                color: platform === p ? '#00f0ff' : '#94a3b8',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              {p}
            </button>
          ))}

          {/* Safe Area Debug Toggle */}
          <button
            onClick={() => setDebugHud((prev) => !prev)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontFamily: Typography.fontFamily.sans,
              fontWeight: 700,
              border: debugHud ? '1px solid #f59e0b' : '1px solid #1f293d',
              background: debugHud ? 'rgba(245, 158, 11, 0.2)' : 'rgba(15, 23, 42, 0.6)',
              color: debugHud ? '#f59e0b' : '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Shield size={14} />
            <span>Safe Areas: {debugHud ? 'ON' : 'OFF'}</span>
          </button>

          {/* Particles Toggle */}
          <button
            onClick={() => setShowParticles((prev) => !prev)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontFamily: Typography.fontFamily.sans,
              fontWeight: 700,
              border: showParticles ? '1px solid #38bdf8' : '1px solid #1f293d',
              background: showParticles ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
              color: showParticles ? '#38bdf8' : '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Layers size={14} />
            <span>Particles: {showParticles ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Preview Stage Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          overflow: 'hidden',
        }}
      >
        {/* Aspect Ratio Scaled Frame (9:16) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 540,
            height: '100%',
            maxHeight: 960,
            aspectRatio: '9/16',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 240, 255, 0.15)',
            border: '2px solid rgba(0, 240, 255, 0.25)',
          }}
        >
          <AkademiCompetitionRelaunch
            debug={debugHud}
            showBackgroundParticles={showParticles}
          />
        </div>
      </div>
    </div>
  );
};
