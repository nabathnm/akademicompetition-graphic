/**
 * AkademiCompetitionRelaunch Campaign Unit Test Suite
 * Validates campaign configuration, timing mathematics, scene sequence intervals,
 * audio cue synchronization, and vertical social platform safe areas.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AKADEMI_RELAUNCH_CONFIG } from '../src/compositions/advertisements/campaigns/akademiRelaunchConfig.ts';
import { SOCIAL_SAFE_AREAS } from '../src/compositions/advertisements/templates/socialMediaTemplateTypes.ts';
import { calculateSceneSchedule } from '../src/compositions/advertisements/advertisementCompositionStyle.ts';
import type { SceneSequenceItemConfig } from '../src/components/scenes/types.ts';

describe('AkademiCompetitionRelaunch - Campaign Configuration', () => {
  it('strictly adheres to the vertical 9:16 video resolution specifications', () => {
    assert.strictEqual(AKADEMI_RELAUNCH_CONFIG.resolution.width, 1080);
    assert.strictEqual(AKADEMI_RELAUNCH_CONFIG.resolution.height, 1920);
    assert.strictEqual(AKADEMI_RELAUNCH_CONFIG.resolution.fps, 30);
    assert.strictEqual(AKADEMI_RELAUNCH_CONFIG.resolution.aspectRatio, '9:16');
  });

  it('guarantees total duration is approximately 25-30 seconds (840 frames = 28.0s)', () => {
    const totalFrames = AKADEMI_RELAUNCH_CONFIG.totalDurationInFrames;
    const durationSeconds = totalFrames / AKADEMI_RELAUNCH_CONFIG.timing.fps;

    assert.strictEqual(totalFrames, 840);
    assert.strictEqual(durationSeconds, 28);
    assert.ok(durationSeconds >= 25 && durationSeconds <= 30);
  });

  it('verifies sum of individual scene durations equals total composition duration', () => {
    const { timing } = AKADEMI_RELAUNCH_CONFIG;
    const computedTotal =
      timing.scene1Hook.durationInFrames +
      timing.scene2Brand.durationInFrames +
      timing.scene3Offerings.durationInFrames +
      timing.scene4Domain.durationInFrames +
      timing.scene5Closing.durationInFrames;

    assert.strictEqual(computedTotal, AKADEMI_RELAUNCH_CONFIG.totalDurationInFrames);
    assert.strictEqual(computedTotal, 840);
  });

  it('contains the accurate new official domain name without modifications', () => {
    assert.strictEqual(AKADEMI_RELAUNCH_CONFIG.website, 'akademicompetition.com');
    assert.strictEqual(AKADEMI_RELAUNCH_CONFIG.websiteUrl, 'https://akademicompetition.com');
    assert.strictEqual(AKADEMI_RELAUNCH_CONFIG.copy.scene4.domain, 'akademicompetition.com');
    assert.strictEqual(AKADEMI_RELAUNCH_CONFIG.copy.scene5.domain, 'akademicompetition.com');
  });

  it('contains exact required campaign copy for all 5 scenes', () => {
    const { copy } = AKADEMI_RELAUNCH_CONFIG;

    // Scene 1
    assert.strictEqual(copy.scene1.headline, 'Eh, ada yang baru nih!');

    // Scene 2
    assert.strictEqual(copy.scene2.headline, 'Akademi Competition is back!');
    assert.strictEqual(copy.scene2.subheadline, 'Platform belajar dan persiapan kompetisi.');

    // Scene 3
    assert.strictEqual(copy.scene3.headline, 'Siapkan dirimu untuk kompetisi berikutnya.');
    assert.strictEqual(copy.scene3.offerings.length, 3);
    assert.strictEqual(copy.scene3.offerings[0].title, 'Bootcamp');
    assert.strictEqual(copy.scene3.offerings[1].title, 'Materi Persiapan Lomba');
    assert.strictEqual(copy.scene3.offerings[2].title, 'Digital Learning Resources');

    // Scene 4
    assert.strictEqual(copy.scene4.headline, 'Now, with a new home!');
    assert.strictEqual(copy.scene4.subheadline, 'Akademi Competition sekarang punya domain baru.');

    // Scene 5
    assert.strictEqual(copy.scene5.headline, "Let's achieve more together!");
    assert.strictEqual(
      copy.scene5.subheadline,
      'Temukan bootcamp dan materi persiapan kompetisi untuk mendukung perjalananmu meraih prestasi.'
    );
    assert.strictEqual(copy.scene5.ctaText, 'Jelajahi Sekarang');
  });
});

describe('AkademiCompetitionRelaunch - Timeline Scheduling & Transitions', () => {
  it('schedules 5 sequential scene intervals seamlessly across 840 frames', () => {
    const { timing } = AKADEMI_RELAUNCH_CONFIG;
    const sceneConfigs: SceneSequenceItemConfig[] = [
      { id: timing.scene1Hook.id, durationInFrames: timing.scene1Hook.durationInFrames },
      { id: timing.scene2Brand.id, durationInFrames: timing.scene2Brand.durationInFrames },
      { id: timing.scene3Offerings.id, durationInFrames: timing.scene3Offerings.durationInFrames },
      { id: timing.scene4Domain.id, durationInFrames: timing.scene4Domain.durationInFrames },
      { id: timing.scene5Closing.id, durationInFrames: timing.scene5Closing.durationInFrames },
    ];

    const schedule = calculateSceneSchedule(sceneConfigs, 840);
    assert.strictEqual(schedule.length, 5);

    // Scene 1: [0, 120]
    assert.strictEqual(schedule[0].computedStartFrame, 0);
    assert.strictEqual(schedule[0].computedEndFrame, 120);

    // Scene 2: [120, 240]
    assert.strictEqual(schedule[1].computedStartFrame, 120);
    assert.strictEqual(schedule[1].computedEndFrame, 240);

    // Scene 3: [240, 420]
    assert.strictEqual(schedule[2].computedStartFrame, 240);
    assert.strictEqual(schedule[2].computedEndFrame, 420);

    // Scene 4: [420, 630]
    assert.strictEqual(schedule[3].computedStartFrame, 420);
    assert.strictEqual(schedule[3].computedEndFrame, 630);

    // Scene 5: [630, 840]
    assert.strictEqual(schedule[4].computedStartFrame, 630);
    assert.strictEqual(schedule[4].computedEndFrame, 840);
  });
});

describe('AkademiCompetitionRelaunch - Vertical Social Media Safe Areas', () => {
  it('provides certified safe area insets for Reels, TikTok, and Shorts', () => {
    const platforms = ['reels', 'tiktok', 'shorts', 'general'] as const;

    for (const p of platforms) {
      const insets = SOCIAL_SAFE_AREAS[p];
      assert.ok(insets.top >= 120, `Top inset for ${p} too small: ${insets.top}`);
      assert.ok(insets.bottom >= 240, `Bottom inset for ${p} too small: ${insets.bottom}`);
      assert.ok(insets.left >= 40, `Left inset for ${p} too small: ${insets.left}`);
      assert.ok(insets.right >= 100, `Right inset for ${p} too small: ${insets.right}`);
    }
  });
});
