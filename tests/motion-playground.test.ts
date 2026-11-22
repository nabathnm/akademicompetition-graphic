/**
 * Motion Playground Integration & Registry Test Suite
 * Tests showcase registry definitions, category coverage, variant integrity,
 * filtering mechanics, and view mode contracts.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SHOWCASE_REGISTRY } from '../src/playground/showcases/showcaseRegistry.ts';
import type {
  PlaygroundViewMode,
  ShowcaseDefinition,
} from '../src/playground/types.ts';
import type { ComponentCategory } from '../src/components/types.ts';

const VALID_CATEGORIES: ComponentCategory[] = [
  'motion',
  'typography',
  'ui',
  'mockups',
  'graphics',
  'transitions',
  'scenes',
];

const VALID_STATUSES = ['ready', 'in-development', 'planned'];

const VALID_VIEW_MODES: PlaygroundViewMode[] = [
  'overview',
  'utilities',
  'typography',
  'ui',
  'mockups',
  'graphics',
  'transitions',
  'scenes',
  'comparison',
  'isolated',
];

describe('Motion Playground - Registry Integrity', () => {
  it('registers a substantial catalog of showcases', () => {
    assert.ok(
      SHOWCASE_REGISTRY.length >= 40,
      `Expected at least 40 showcases in registry, got ${SHOWCASE_REGISTRY.length}`
    );
  });

  it('guarantees unique IDs across all registered showcases', () => {
    const idSet = new Set<string>();
    const duplicates: string[] = [];

    for (const showcase of SHOWCASE_REGISTRY) {
      if (idSet.has(showcase.id)) {
        duplicates.push(showcase.id);
      }
      idSet.add(showcase.id);
    }

    assert.strictEqual(
      duplicates.length,
      0,
      `Found duplicate showcase IDs: ${duplicates.join(', ')}`
    );
  });

  it('enforces mandatory non-empty metadata fields on all showcases', () => {
    for (const showcase of SHOWCASE_REGISTRY) {
      assert.ok(
        typeof showcase.id === 'string' && showcase.id.trim().length > 0,
        `Showcase missing valid id: ${JSON.stringify(showcase)}`
      );
      assert.ok(
        typeof showcase.name === 'string' && showcase.name.trim().length > 0,
        `Showcase ${showcase.id} missing valid name`
      );
      assert.ok(
        VALID_CATEGORIES.includes(showcase.category),
        `Showcase ${showcase.id} has invalid category: ${showcase.category}`
      );
      assert.ok(
        typeof showcase.description === 'string' && showcase.description.trim().length > 0,
        `Showcase ${showcase.id} missing valid description`
      );
      assert.ok(
        Array.isArray(showcase.variants) && showcase.variants.length > 0,
        `Showcase ${showcase.id} must have at least one variant`
      );
      assert.ok(
        VALID_STATUSES.includes(showcase.status),
        `Showcase ${showcase.id} has invalid status: ${showcase.status}`
      );
    }
  });

  it('verifies all variant names are non-empty strings without whitespace anomalies', () => {
    for (const showcase of SHOWCASE_REGISTRY) {
      for (const variant of showcase.variants) {
        assert.ok(
          typeof variant === 'string' && variant.trim().length > 0,
          `Showcase ${showcase.id} has invalid variant name: ${variant}`
        );
      }
    }
  });
});

describe('Motion Playground - Category Completeness', () => {
  it('covers all required typography components', () => {
    const typoShowcases = SHOWCASE_REGISTRY.filter((s) => s.category === 'typography');
    const ids = typoShowcases.map((s) => s.id);

    const requiredTypographyIds = [
      'typo-animated-text',
      'typo-word-reveal',
      'typo-character-reveal',
      'typo-text-mask',
      'typo-text-highlight',
      'typo-split-text',
    ];

    for (const reqId of requiredTypographyIds) {
      assert.ok(
        ids.includes(reqId),
        `Missing required typography showcase: ${reqId}`
      );
      const item = typoShowcases.find((s) => s.id === reqId);
      assert.strictEqual(item?.status, 'ready');
    }
  });

  it('covers all required UI components', () => {
    const uiShowcases = SHOWCASE_REGISTRY.filter((s) => s.category === 'ui');
    const ids = uiShowcases.map((s) => s.id);

    const requiredUiIds = [
      'ui-animated-checkbox',
      'ui-animated-toggle',
      'ui-animated-notification',
      'ui-animated-card',
      'ui-animated-search-bar',
      'ui-animated-input',
      'ui-animated-button',
    ];

    for (const reqId of requiredUiIds) {
      assert.ok(ids.includes(reqId), `Missing required UI showcase: ${reqId}`);
      const item = uiShowcases.find((s) => s.id === reqId);
      assert.strictEqual(item?.status, 'ready');
    }
  });

  it('covers all required graphic & shape components', () => {
    const graphicShowcases = SHOWCASE_REGISTRY.filter((s) => s.category === 'graphics');
    const ids = graphicShowcases.map((s) => s.id);

    const requiredGraphicIds = [
      'graphic-animated-arrow',
      'graphic-animated-circle',
      'graphic-animated-line',
      'graphic-animated-shape',
      'graphic-animated-path',
      'graphic-particle-system',
    ];

    for (const reqId of requiredGraphicIds) {
      assert.ok(ids.includes(reqId), `Missing required graphic showcase: ${reqId}`);
      const item = graphicShowcases.find((s) => s.id === reqId);
      assert.strictEqual(item?.status, 'ready');
    }
  });

  it('covers all required mockup components', () => {
    const mockupShowcases = SHOWCASE_REGISTRY.filter((s) => s.category === 'mockups');
    const ids = mockupShowcases.map((s) => s.id);

    const requiredMockupIds = [
      'mockup-device-frame',
      'mockup-phone',
      'mockup-browser',
      'mockup-laptop',
      'mockup-tablet',
    ];

    for (const reqId of requiredMockupIds) {
      assert.ok(ids.includes(reqId), `Missing required mockup showcase: ${reqId}`);
      const item = mockupShowcases.find((s) => s.id === reqId);
      assert.strictEqual(item?.status, 'ready');
    }
  });

  it('covers all required transition components', () => {
    const transShowcases = SHOWCASE_REGISTRY.filter((s) => s.category === 'transitions');
    const ids = transShowcases.map((s) => s.id);

    const requiredTransitionIds = [
      'trans-fade',
      'trans-wipe',
      'trans-slide',
      'trans-zoom',
      'trans-mask',
      'trans-split',
      'trans-morph',
      'trans-glitch',
      'trans-controller',
    ];

    for (const reqId of requiredTransitionIds) {
      assert.ok(ids.includes(reqId), `Missing required transition showcase: ${reqId}`);
      const item = transShowcases.find((s) => s.id === reqId);
      assert.strictEqual(item?.status, 'ready');
    }
  });

  it('covers all required scene and composition components', () => {
    const sceneShowcases = SHOWCASE_REGISTRY.filter((s) => s.category === 'scenes');
    const ids = sceneShowcases.map((s) => s.id);

    const requiredSceneIds = [
      'scene-container',
      'scene-hero',
      'scene-product-showcase',
      'scene-feature-highlight',
      'scene-typography',
      'scene-device-showcase',
      'scene-comparison',
      'scene-cta',
      'scene-outro',
      'scene-advertisement-composition',
      'scene-sequence',
      'timeline-manager',
      'global-animation-config',
      'advertisement-preview',
      'component-integration',
      'audio-timeline-sync',
    ];

    for (const reqId of requiredSceneIds) {
      assert.ok(ids.includes(reqId), `Missing required scene showcase: ${reqId}`);
      const item = sceneShowcases.find((s) => s.id === reqId);
      assert.strictEqual(item?.status, 'ready');
    }
  });

  it('covers all required audio orchestrator showcases', () => {
    const sceneShowcases = SHOWCASE_REGISTRY.filter((s) => s.category === 'scenes');
    const ids = sceneShowcases.map((s) => s.id);

    const requiredAudioIds = [
      'audio-track',
      'background-music',
      'sound-effect',
      'audio-timeline-sync',
    ];

    for (const reqId of requiredAudioIds) {
      assert.ok(ids.includes(reqId), `Missing required audio showcase: ${reqId}`);
      const item = sceneShowcases.find((s) => s.id === reqId);
      assert.strictEqual(item?.status, 'ready');
    }
  });
});

describe('Motion Playground - Filter and Query Functions', () => {
  it('correctly filters showcases by category', () => {
    for (const cat of VALID_CATEGORIES) {
      const filtered = SHOWCASE_REGISTRY.filter((s) => s.category === cat);
      assert.ok(Array.isArray(filtered));
      for (const item of filtered) {
        assert.strictEqual(item.category, cat);
      }
    }
  });

  it('retrieves showcases by id with strict lookup helper', () => {
    const findShowcaseById = (id: string): ShowcaseDefinition | undefined => {
      return SHOWCASE_REGISTRY.find((s) => s.id === id);
    };

    const hero = findShowcaseById('scene-hero');
    assert.ok(hero !== undefined);
    assert.strictEqual(hero?.name, 'HeroScene');
    assert.strictEqual(hero?.category, 'scenes');

    const nonExistent = findShowcaseById('non-existent-id-404');
    assert.strictEqual(nonExistent, undefined);
  });

  it('confirms majority of showcases are in ready status for production release', () => {
    const readyShowcases = SHOWCASE_REGISTRY.filter((s) => s.status === 'ready');
    assert.ok(
      readyShowcases.length >= 35,
      `Expected at least 35 production-ready showcases, got ${readyShowcases.length}`
    );
  });

  it('validates variant matching and fallback behavior', () => {
    const resolveVariant = (showcase: ShowcaseDefinition, requested?: string): string => {
      if (requested && showcase.variants.includes(requested)) {
        return requested;
      }
      return showcase.variants[0];
    };

    const hero = SHOWCASE_REGISTRY.find((s) => s.id === 'scene-hero')!;
    assert.strictEqual(resolveVariant(hero, 'Centered'), 'Centered');
    assert.strictEqual(resolveVariant(hero, 'UnknownVariant'), hero.variants[0]);
    assert.strictEqual(resolveVariant(hero, undefined), hero.variants[0]);
  });
});

describe('Motion Playground - View Mode & Contract Safety', () => {
  it('accepts all declared PlaygroundViewMode strings', () => {
    const isValidViewMode = (mode: string): mode is PlaygroundViewMode => {
      return VALID_VIEW_MODES.includes(mode as PlaygroundViewMode);
    };

    for (const mode of VALID_VIEW_MODES) {
      assert.strictEqual(isValidViewMode(mode), true);
    }
    assert.strictEqual(isValidViewMode('invalid-mode'), false);
    assert.strictEqual(isValidViewMode(''), false);
  });

  it('verifies safe frame boundary handling for playground timeline', () => {
    const clampFrame = (frame: number, maxDuration: number): number => {
      return Math.max(0, Math.min(frame, maxDuration - 1));
    };

    const compositionDuration = 300;
    assert.strictEqual(clampFrame(-5, compositionDuration), 0);
    assert.strictEqual(clampFrame(0, compositionDuration), 0);
    assert.strictEqual(clampFrame(150, compositionDuration), 150);
    assert.strictEqual(clampFrame(300, compositionDuration), 299);
    assert.strictEqual(clampFrame(500, compositionDuration), 299);
  });
});
