import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateDeviceShowcaseKinematics,
  resolveDeviceAnnotationPosition,
  resolveDeviceShowcaseLayout,
} from '../src/components/scenes/deviceShowcaseSceneStyle.ts';

describe('DeviceShowcaseScene Unit Tests', () => {
  describe('calculateDeviceShowcaseKinematics', () => {
    it('staggers multi-device entrances deterministically', () => {
      const m = calculateDeviceShowcaseKinematics({
        frame: 12,
        delay: 0,
        staggerDelay: 6,
        devices: [
          { type: 'laptop', id: 'lap-1' },
          { type: 'smartphone', id: 'phone-1' },
        ],
      });

      assert.strictEqual(m.devices.length, 2);
      // Device 0 starts earlier than Device 1
      assert.ok(m.devices[0].progress > m.devices[1].progress);
      assert.ok(m.devices[0].opacity > m.devices[1].opacity);
    });

    it('computes continuous floating hover motion across devices', () => {
      const f10 = calculateDeviceShowcaseKinematics({
        frame: 10,
        devices: [{ type: 'smartphone' }],
      }).devices[0].floatingY;

      const f20 = calculateDeviceShowcaseKinematics({
        frame: 20,
        devices: [{ type: 'smartphone' }],
      }).devices[0].floatingY;

      const f10Repeat = calculateDeviceShowcaseKinematics({
        frame: 10,
        devices: [{ type: 'smartphone' }],
      }).devices[0].floatingY;

      assert.strictEqual(f10, f10Repeat);
      assert.notStrictEqual(f10, f20);
    });

    it('staggers annotation callout entrances', () => {
      const m = calculateDeviceShowcaseKinematics({
        frame: 30,
        delay: 0,
        staggerDelay: 6,
        annotationCount: 2,
        animation: { annotationsDelay: 15 },
      });

      assert.strictEqual(m.annotations.length, 2);
      assert.ok(m.annotations[0].opacity > m.annotations[1].opacity);
    });
  });

  describe('resolveDeviceShowcaseLayout', () => {
    it('returns flex column for single-centered layout', () => {
      const l = resolveDeviceShowcaseLayout('single-centered');
      assert.strictEqual(l.containerStyle.flexDirection, 'column');
      assert.strictEqual(l.containerStyle.alignItems, 'center');
    });

    it('returns flex row for device-left layout', () => {
      const l = resolveDeviceShowcaseLayout('device-left');
      assert.strictEqual(l.containerStyle.flexDirection, 'row');
      assert.strictEqual(l.textColStyle.textAlign, 'left');
    });

    it('returns flex row for text-left layout', () => {
      const l = resolveDeviceShowcaseLayout('text-left');
      assert.strictEqual(l.containerStyle.flexDirection, 'row');
      assert.strictEqual(l.textColStyle.textAlign, 'left');
    });

    it('positions overlapping devices with z-index in device-overlap layout', () => {
      const l = resolveDeviceShowcaseLayout('device-overlap');
      const s0 = l.deviceWrapperStyle(0, 2, { type: 'laptop' });
      const s1 = l.deviceWrapperStyle(1, 2, { type: 'smartphone' });

      assert.strictEqual(s0.zIndex, 1);
      assert.strictEqual(s1.position, 'absolute');
      assert.strictEqual(s1.zIndex, 5);
    });
  });

  describe('resolveDeviceAnnotationPosition', () => {
    it('resolves explicit coordinate percentages', () => {
      const pos = resolveDeviceAnnotationPosition({ title: 'Dynamic Island', x: 50, y: 15 });
      assert.strictEqual(pos.left, '50%');
      assert.strictEqual(pos.top, '15%');
    });

    it('resolves preset positions', () => {
      const top = resolveDeviceAnnotationPosition({ title: 'Top notch', position: 'top' });
      const left = resolveDeviceAnnotationPosition({ title: 'Left edge', position: 'left' });
      assert.strictEqual(top.top, '4%');
      assert.strictEqual(left.left, '2%');
    });
  });
});
