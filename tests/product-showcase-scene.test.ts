import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateProductShowcaseKinematics,
  resolveProductShowcaseLayout,
  resolveDetailBadgePosition,
} from '../src/components/scenes/productShowcaseSceneStyle.ts';

describe('ProductShowcaseScene Unit Tests', () => {
  describe('calculateProductShowcaseKinematics', () => {
    it('calculates product entrance scale smoothly from 0.8 to 1.0', () => {
      const start = calculateProductShowcaseKinematics({
        frame: 0,
        delay: 0,
        animation: { productEntrance: 'scale', productDuration: 20 },
      });
      assert.strictEqual(start.product.scale, 0.8);
      assert.strictEqual(start.product.opacity, 0);

      const end = calculateProductShowcaseKinematics({
        frame: 25,
        delay: 0,
        animation: { productEntrance: 'scale', productDuration: 20 },
      });
      assert.strictEqual(end.product.scale, 1.0);
      assert.strictEqual(end.product.opacity, 1);
      assert.strictEqual(end.product.isSettled, true);
    });

    it('computes continuous floating hover motion deterministically', () => {
      const f10 = calculateProductShowcaseKinematics({ frame: 10, animation: { productFloating: true } }).floatY;
      const f20 = calculateProductShowcaseKinematics({ frame: 20, animation: { productFloating: true } }).floatY;
      const f10Repeat = calculateProductShowcaseKinematics({ frame: 10, animation: { productFloating: true } }).floatY;

      assert.strictEqual(f10, f10Repeat);
      assert.notStrictEqual(f10, f20);
    });

    it('computes continuous tilt rotation when productRotation is enabled', () => {
      const tiltDisabled = calculateProductShowcaseKinematics({ frame: 15, animation: { productRotation: false } }).tiltAngle;
      const tiltEnabled = calculateProductShowcaseKinematics({ frame: 15, animation: { productRotation: true } }).tiltAngle;

      assert.strictEqual(tiltDisabled, 0);
      assert.notStrictEqual(tiltEnabled, 0);
    });

    it('staggers typography sequence correctly', () => {
      const m0 = calculateProductShowcaseKinematics({ frame: 0, delay: 0 });
      assert.strictEqual(m0.title.opacity, 0);
      assert.strictEqual(m0.subtitle.opacity, 0);

      const m20 = calculateProductShowcaseKinematics({ frame: 20, delay: 0 });
      assert.ok(m20.title.opacity > 0);
    });

    it('staggers floating detail badges', () => {
      const m = calculateProductShowcaseKinematics({
        frame: 15,
        delay: 0,
        detailCount: 3,
        animation: { detailsDelay: 5, staggerDelay: 5 },
      });
      assert.strictEqual(m.details.length, 3);
      assert.ok(m.details[0].opacity > m.details[2].opacity);
    });
  });

  describe('resolveProductShowcaseLayout', () => {
    it('returns flex row for product-left', () => {
      const l = resolveProductShowcaseLayout('product-left');
      assert.strictEqual(l.containerStyle.display, 'flex');
      assert.strictEqual(l.containerStyle.flexDirection, 'row');
    });

    it('returns flex row-reverse for product-right', () => {
      const l = resolveProductShowcaseLayout('product-right');
      assert.strictEqual(l.containerStyle.display, 'flex');
      assert.strictEqual(l.containerStyle.flexDirection, 'row-reverse');
    });

    it('returns full-screen glassmorphism overlay for full-screen', () => {
      const l = resolveProductShowcaseLayout('full-screen');
      assert.strictEqual(l.visualColStyle.position, 'absolute');
      assert.ok(l.textColStyle.backdropFilter !== undefined);
    });

    it('returns flex column for center-product', () => {
      const l = resolveProductShowcaseLayout('center-product');
      assert.strictEqual(l.containerStyle.flexDirection, 'column');
      assert.strictEqual(l.containerStyle.textAlign, 'center');
    });
  });

  describe('resolveDetailBadgePosition', () => {
    it('resolves explicit percentage coordinates', () => {
      const pos = resolveDetailBadgePosition({ label: 'Camera', value: '48MP', x: 25, y: 35 });
      assert.strictEqual(pos.left, '25%');
      assert.strictEqual(pos.top, '35%');
    });

    it('resolves preset corner positions', () => {
      const tl = resolveDetailBadgePosition({ label: 'A', value: '1', position: 'top-left' });
      const br = resolveDetailBadgePosition({ label: 'B', value: '2', position: 'bottom-right' });
      assert.strictEqual(tl.top, '10%');
      assert.strictEqual(tl.left, '0%');
      assert.strictEqual(br.bottom, '10%');
      assert.strictEqual(br.right, '0%');
    });
  });
});
