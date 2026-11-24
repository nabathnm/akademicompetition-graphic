/**
 * Akademi Competition Relaunch Campaign Configuration
 * Pure data and timing contracts separated from visual scene rendering.
 *
 * Campaign: "A New Chapter Begins"
 * Announcement: Akademi Competition is back with a new domain (akademicompetition.com)
 */

import { VideoPresets } from '../../../config/video.ts';

export const AKADEMI_RELAUNCH_CONFIG = {
  id: 'AkademiCompetitionRelaunch',
  title: 'Akademi Competition Relaunch Campaign',
  brandName: 'Akademi Competition',
  website: 'akademicompetition.com',
  websiteUrl: 'https://akademicompetition.com',
  resolution: VideoPresets.VERTICAL_1080P, // 1080 × 1920, 30 FPS
  totalDurationInFrames: 840, // 28.0 seconds at 30 FPS

  // Brand Color Palette (Education + Competition + Achievement)
  theme: {
    bgDark: '#030712',
    bgSurface: '#0b1120',
    bgCard: '#111827',
    border: '#1f2937',
    borderGlow: 'rgba(0, 240, 255, 0.3)',
    accentCyan: '#00f0ff',
    accentGold: '#f59e0b',
    accentBlue: '#3b82f6',
    textPrimary: '#ffffff',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
  },

  // Scene Schedule & Durations
  timing: {
    fps: 30,
    scene1Hook: {
      id: 'scene-1-hook',
      durationInFrames: 120, // 4.0s (0.0s - 4.0s)
      transitionDuration: 15,
    },
    scene2Brand: {
      id: 'scene-2-brand',
      durationInFrames: 120, // 4.0s (4.0s - 8.0s)
      transitionDuration: 15,
    },
    scene3Offerings: {
      id: 'scene-3-offerings',
      durationInFrames: 180, // 6.0s (8.0s - 14.0s)
      transitionDuration: 15,
    },
    scene4Domain: {
      id: 'scene-4-domain',
      durationInFrames: 210, // 7.0s (14.0s - 21.0s)
      transitionDuration: 15,
    },
    scene5Closing: {
      id: 'scene-5-closing',
      durationInFrames: 210, // 7.0s (21.0s - 28.0s)
      transitionDuration: 15,
    },
  },

  // Narrative Copy (strictly based on user brief)
  copy: {
    scene1: {
      eyebrow: 'PENGUMUMAN PENTING',
      headline: 'Eh, ada yang baru nih!',
      subheadline: 'Kabar gembira untuk pejuang kompetisi!',
    },
    scene2: {
      eyebrow: 'KAMI KEMBALI',
      headline: 'Akademi Competition is back!',
      subheadline: 'Platform belajar dan persiapan kompetisi.',
    },
    scene3: {
      eyebrow: 'PERSIAPKAN DIRIMU',
      headline: 'Siapkan dirimu untuk kompetisi berikutnya.',
      offerings: [
        {
          id: 'bootcamp',
          title: 'Bootcamp',
          description: 'Program intensif persiapan kompetisi bersama mentor berpengalaman.',
          icon: 'Rocket',
          accent: '#00f0ff',
        },
        {
          id: 'materi',
          title: 'Materi Persiapan Lomba',
          description: 'Bank materi komprehensif, latihan terarah, dan strategi juara.',
          icon: 'BookOpen',
          accent: '#f59e0b',
        },
        {
          id: 'resources',
          title: 'Digital Learning Resources',
          description: 'Akses modul dan sumber belajar digital fleksibel kapan saja.',
          icon: 'Laptop',
          accent: '#38bdf8',
        },
      ],
    },
    scene4: {
      eyebrow: 'PENGUMUMAN DOMAIN BARU',
      headline: 'Now, with a new home!',
      subheadline: 'Akademi Competition sekarang punya domain baru.',
      domain: 'akademicompetition.com',
      domainBadge: 'OFFICIAL NEW DOMAIN',
    },
    scene5: {
      headline: "Let's achieve more together!",
      subheadline: 'Temukan bootcamp dan materi persiapan kompetisi untuk mendukung perjalananmu meraih prestasi.',
      ctaText: 'Jelajahi Sekarang',
      domain: 'akademicompetition.com',
      tagline: 'Platform Belajar & Persiapan Kompetisi',
    },
  },
} as const;
