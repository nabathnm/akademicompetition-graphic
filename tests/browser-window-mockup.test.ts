import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateBrowserChromeHeight,
  resolveBrowserDimensions,
  resolveBrowserThemeColors,
  calculateScrollMetrics,
  calculateChromeRevealState,
  calculateViewportRevealState,
  BROWSER_THEME_PALETTES,
} from '../src/components/mockups/browserWindowMockupStyle.ts';

test('BrowserWindowMockup: Chrome Heights & Viewport Dimensions', async (t) => {
  await t.test('calculates chrome height for full variant (tabs + toolbar = 78px)', () => {
    const height = calculateBrowserChromeHeight('full', true, true);
    assert.equal(height, 36 + 42); // 78
  });

  await t.test('calculates chrome height for minimal variant (single header = 40px)', () => {
    const height = calculateBrowserChromeHeight('minimal', true, false);
    assert.equal(height, 40);
  });

  await t.test('calculates chrome height for full variant without tabs (toolbar only = 42px)', () => {
    const height = calculateBrowserChromeHeight('full', true, false);
    assert.equal(height, 42);
  });

  await t.test('resolves default window geometry and viewport bounding box', () => {
    const dims = resolveBrowserDimensions();
    assert.equal(dims.width, 800);
    assert.equal(dims.height, 520);
    assert.equal(dims.borderWidth, 1);
    assert.equal(dims.borderRadius, 14);
    assert.equal(dims.chromeHeight, 78);
    // Viewport width = width - 2 * borderWidth = 800 - 2 = 798
    assert.equal(dims.viewportWidth, 798);
    // Viewport height = height - chromeHeight - 2 * borderWidth = 520 - 78 - 2 = 440
    assert.equal(dims.viewportHeight, 440);
  });

  await t.test('resolves minimal variant viewport dimensions', () => {
    const dims = resolveBrowserDimensions({
      variant: 'minimal',
      width: 600,
      height: 400,
      borderWidth: 2,
    });
    assert.equal(dims.chromeHeight, 40);
    assert.equal(dims.viewportWidth, 600 - 4);
    assert.equal(dims.viewportHeight, 400 - 40 - 4);
  });

  await t.test('clamps small dimensions to minimum usable boundaries', () => {
    const dims = resolveBrowserDimensions({
      width: 100, // clamps to 280
      height: 80, // clamps to 160
    });
    assert.equal(dims.width, 280);
    assert.equal(dims.height, 160);
  });
});

test('BrowserWindowMockup: Color Theme Palettes', async (t) => {
  await t.test('resolves dark theme defaults', () => {
    const colors = resolveBrowserThemeColors('dark');
    assert.equal(colors.windowBg, BROWSER_THEME_PALETTES.dark.windowBg);
    assert.equal(colors.toolbarBg, BROWSER_THEME_PALETTES.dark.toolbarBg);
    assert.equal(colors.viewportBg, BROWSER_THEME_PALETTES.dark.viewportBg);
  });

  await t.test('resolves light theme defaults', () => {
    const colors = resolveBrowserThemeColors('light');
    assert.equal(colors.windowBg, BROWSER_THEME_PALETTES.light.windowBg);
    assert.equal(colors.toolbarBg, BROWSER_THEME_PALETTES.light.toolbarBg);
    assert.equal(colors.viewportBg, BROWSER_THEME_PALETTES.light.viewportBg);
  });

  await t.test('merges custom theme color overrides properly', () => {
    const colors = resolveBrowserThemeColors('dark', {
      addressBarBg: '#2a0044',
      viewportBg: '#050505',
    });
    assert.equal(colors.addressBarBg, '#2a0044');
    assert.equal(colors.viewportBg, '#050505');
    // Unchanged colors remain intact
    assert.equal(colors.windowBg, BROWSER_THEME_PALETTES.dark.windowBg);
  });
});

test('BrowserWindowMockup: Deterministic Scroll Kinematics', async (t) => {
  await t.test('returns zero scroll when scrollProgress is unspecified', () => {
    const metrics = calculateScrollMetrics({
      currentFrame: 10,
      viewportHeight: 400,
      contentHeight: 1200,
    });
    assert.equal(metrics.progress, 0);
    assert.equal(metrics.scrollY, 0);
    assert.equal(metrics.thumbTop, 0);
    assert.equal(metrics.maxScroll, 800);
    assert.equal(metrics.isScrolling, false);
  });

  await t.test('calculates correct scroll offset from numeric decimal (0.5)', () => {
    const metrics = calculateScrollMetrics({
      currentFrame: 0,
      scrollProgress: 0.5,
      viewportHeight: 400,
      contentHeight: 1200,
    });
    assert.equal(metrics.progress, 0.5);
    // maxScroll = 1200 - 400 = 800. scrollY = -0.5 * 800 = -400
    assert.equal(metrics.scrollY, -400);
  });

  await t.test('calculates correct scroll offset from percentage number (75)', () => {
    const metrics = calculateScrollMetrics({
      currentFrame: 0,
      scrollProgress: 75,
      viewportHeight: 500,
      contentHeight: 1500,
    });
    assert.equal(metrics.progress, 0.75);
    // maxScroll = 1500 - 500 = 1000. scrollY = -0.75 * 1000 = -750
    assert.equal(metrics.scrollY, -750);
  });

  await t.test('animates deterministic scroll progress across frame window', () => {
    const config = {
      startFrame: 20,
      duration: 30,
      from: 0,
      to: 100,
      contentHeight: 1000,
    };
    const viewportHeight = 400;

    // Prior to startFrame
    const before = calculateScrollMetrics({ currentFrame: 10, scrollProgress: config, viewportHeight });
    assert.equal(before.progress, 0);
    assert.equal(before.scrollY, 0);
    assert.equal(before.isScrolling, false);

    // Midway through scroll
    const mid = calculateScrollMetrics({ currentFrame: 35, scrollProgress: config, viewportHeight });
    assert.ok(mid.progress > 0 && mid.progress < 1);
    assert.ok(mid.scrollY < 0);
    assert.equal(mid.isScrolling, true);

    // After completion
    const complete = calculateScrollMetrics({ currentFrame: 60, scrollProgress: config, viewportHeight });
    assert.equal(complete.progress, 1);
    assert.equal(complete.scrollY, -(1000 - 400));
    assert.equal(complete.isScrolling, false);
  });
});

test('BrowserWindowMockup: Chrome & Viewport Reveals', async (t) => {
  await t.test('defaults to fully visible chrome when chromeReveal is disabled', () => {
    const state = calculateChromeRevealState({ currentFrame: 0, config: false });
    assert.equal(state.opacity, 1);
    assert.equal(state.translateY, 0);
    assert.equal(state.isRevealing, false);
  });

  await t.test('hides chrome before reveal delay and eases into position', () => {
    const config = { delay: 10, duration: 15 };

    const before = calculateChromeRevealState({ currentFrame: 5, config });
    assert.equal(before.opacity, 0);
    assert.equal(before.translateY, -12);

    const complete = calculateChromeRevealState({ currentFrame: 30, config });
    assert.equal(complete.opacity, 1);
    assert.equal(complete.translateY, 0);
  });

  await t.test('viewport reveal transitions scale and opacity', () => {
    const config = { delay: 10, duration: 20, type: 'scale' as const };

    const before = calculateViewportRevealState({ currentFrame: 0, config });
    assert.equal(before.opacity, 0);
    assert.equal(before.scale, 0.96);

    const complete = calculateViewportRevealState({ currentFrame: 35, config });
    assert.equal(complete.opacity, 1);
    assert.equal(complete.scale, 1);
  });

  await t.test('viewport reveal wipe-up translates upward', () => {
    const config = { delay: 15, duration: 15, type: 'wipe-up' as const };

    const initial = calculateViewportRevealState({ currentFrame: 5, config });
    assert.equal(initial.translateY, 20);

    const complete = calculateViewportRevealState({ currentFrame: 35, config });
    assert.equal(complete.translateY, 0);
  });
});
