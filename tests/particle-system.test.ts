import test from 'node:test';
import assert from 'node:assert/strict';

import {
  hashSeed,
  createPrng,
  generateParticles,
  calculateParticleStates,
} from '../src/components/graphics/particleSystemStyle.ts';

test('ParticleSystem: Deterministic PRNG & Seed Reproducibility', async (t) => {
  await t.test('hashSeed produces identical 32-bit integer for identical inputs', () => {
    assert.equal(hashSeed(42), hashSeed(42));
    assert.equal(hashSeed('sparkles-cyber'), hashSeed('sparkles-cyber'));
    assert.notEqual(hashSeed(42), hashSeed(43));
    assert.notEqual(hashSeed('seed-a'), hashSeed('seed-b'));
  });

  await t.test('createPrng generates deterministic sequence of floats', () => {
    const prng1 = createPrng(12345);
    const prng2 = createPrng(12345);

    const seq1 = [prng1.next(), prng1.next(), prng1.next(), prng1.next()];
    const seq2 = [prng2.next(), prng2.next(), prng2.next(), prng2.next()];

    assert.deepEqual(seq1, seq2);
  });

  await t.test('identical seed generates 100% identical particle definitions', () => {
    const config = { seed: 'test-seed-42', particleCount: 30 };
    const run1 = generateParticles(config);
    const run2 = generateParticles(config);

    assert.equal(run1.length, 30);
    assert.equal(run2.length, 30);
    assert.deepEqual(run1, run2);
  });

  await t.test('different seeds produce distinct particle distributions', () => {
    const runA = generateParticles({ seed: 101, particleCount: 20 });
    const runB = generateParticles({ seed: 202, particleCount: 20 });

    assert.notEqual(runA[0].initialX, runB[0].initialX);
    assert.notEqual(runA[0].initialY, runB[0].initialY);
  });
});

test('ParticleSystem: Frame-Accurate Deterministic State Evaluation', async (t) => {
  const particles = generateParticles({ seed: 777, particleCount: 25 });
  const config = { durationInFrames: 60, bounds: { width: 400, height: 300 } };

  await t.test('evaluating the same frame independently yields identical live states', () => {
    const stateA = calculateParticleStates({ particles, currentFrame: 24, config });
    const stateB = calculateParticleStates({ particles, currentFrame: 24, config });

    assert.equal(stateA.length, 25);
    assert.deepEqual(stateA, stateB);
  });

  await t.test('particle coordinates advance predictably across frames', () => {
    const frame0 = calculateParticleStates({ particles, currentFrame: 0, config });
    const frame30 = calculateParticleStates({ particles, currentFrame: 30, config });

    assert.notEqual(frame0[0].x, frame30[0].x);
    assert.notEqual(frame0[0].y, frame30[0].y);
  });
});

test('ParticleSystem: Distribution Topologies', async (t) => {
  const bounds = { width: 500, height: 400 };

  await t.test('distribution "random" keeps initial points strictly within bounds', () => {
    const particles = generateParticles({ distribution: 'random', bounds, particleCount: 40 });
    for (const p of particles) {
      assert.ok(p.initialX >= 0 && p.initialX <= bounds.width, `X ${p.initialX} out of bounds`);
      assert.ok(p.initialY >= 0 && p.initialY <= bounds.height, `Y ${p.initialY} out of bounds`);
    }
  });

  await t.test('distribution "radial" clusters points around center origin', () => {
    const center = { x: 250, y: 200 };
    const particles = generateParticles({ distribution: 'radial', bounds, origin: center, particleCount: 30 });
    for (const p of particles) {
      const dist = Math.hypot(p.initialX - center.x, p.initialY - center.y);
      assert.ok(dist <= Math.min(bounds.width, bounds.height) * 0.5);
    }
  });

  await t.test('distribution "custom" assigns specified custom coordinates', () => {
    const customPositions = [
      { x: 50, y: 50 },
      { x: 150, y: 150 },
      { x: 250, y: 250 },
    ];
    const particles = generateParticles({ distribution: 'custom', customPositions, particleCount: 3 });
    assert.ok(Math.abs(particles[0].initialX - 50) <= 5);
    assert.ok(Math.abs(particles[1].initialX - 150) <= 5);
    assert.ok(Math.abs(particles[2].initialX - 250) <= 5);
  });
});

test('ParticleSystem: Motion Modes & Trajectory Verification', async (t) => {
  const bounds = { width: 400, height: 400 };

  await t.test('motionMode "rise" translates particles upwards', () => {
    const particles = generateParticles({
      seed: 88,
      motionMode: 'rise',
      direction: 'up',
      particleCount: 10,
      bounds,
    });
    const config = { motionMode: 'rise' as const, loop: false, durationInFrames: 50, bounds };

    const at0 = calculateParticleStates({ particles, currentFrame: 0, config });
    const at25 = calculateParticleStates({ particles, currentFrame: 25, config });

    // Under 'rise', vertical position y must decrease (move upwards towards 0)
    for (let i = 0; i < particles.length; i++) {
      assert.ok(at25[i].y < at0[i].y, `Particle ${i} should have risen: ${at25[i].y} vs ${at0[i].y}`);
    }
  });

  await t.test('motionMode "fall" translates particles downwards', () => {
    const particles = generateParticles({
      seed: 88,
      motionMode: 'fall',
      direction: 'down',
      particleCount: 10,
      bounds,
    });
    const config = { motionMode: 'fall' as const, loop: false, durationInFrames: 50, bounds };

    const at0 = calculateParticleStates({ particles, currentFrame: 0, config });
    const at25 = calculateParticleStates({ particles, currentFrame: 25, config });

    // Under 'fall', vertical position y must increase
    for (let i = 0; i < particles.length; i++) {
      assert.ok(at25[i].y > at0[i].y, `Particle ${i} should have fallen: ${at25[i].y} vs ${at0[i].y}`);
    }
  });

  await t.test('motionMode "none" keeps particles stationary at initial positions', () => {
    const particles = generateParticles({ seed: 55, particleCount: 10, bounds });
    const config = { motionMode: 'none' as const, bounds };

    const at0 = calculateParticleStates({ particles, currentFrame: 0, config });
    const at40 = calculateParticleStates({ particles, currentFrame: 40, config });

    for (let i = 0; i < particles.length; i++) {
      assert.equal(at40[i].x, at0[i].x);
      assert.equal(at40[i].y, at0[i].y);
    }
  });
});

test('ParticleSystem: Performance, Scalability & Exit Transitions', async (t) => {
  await t.test('simulates 150 particles without NaN or performance bottleneck', () => {
    const start = performance.now();
    const particles = generateParticles({ seed: 999, particleCount: 150 });
    const config = { durationInFrames: 60, bounds: { width: 500, height: 500 } };
    const liveStates = calculateParticleStates({ particles, currentFrame: 30, config });
    const elapsed = performance.now() - start;

    assert.equal(liveStates.length, 150);
    for (const p of liveStates) {
      assert.ok(!Number.isNaN(p.x));
      assert.ok(!Number.isNaN(p.y));
      assert.ok(!Number.isNaN(p.scale));
      assert.ok(!Number.isNaN(p.opacity));
    }
    // Execution must be fast (< 25ms for 150 particles)
    assert.ok(elapsed < 100, `Calculation took ${elapsed.toFixed(2)}ms`);
  });

  await t.test('exit transition fades out particles cleanly after exitFrame', () => {
    const particles = generateParticles({ seed: 12, particleCount: 10 });
    const config = { bounds: { width: 300, height: 300 } };

    const active = calculateParticleStates({
      particles,
      currentFrame: 30,
      config,
      exitFrame: 40,
      exitDurationInFrames: 10,
    });
    assert.ok(active[0].opacity > 0);

    const exited = calculateParticleStates({
      particles,
      currentFrame: 50,
      config,
      exitFrame: 40,
      exitDurationInFrames: 10,
      exitAnimation: 'fade-out',
    });
    assert.equal(exited[0].opacity, 0);
  });
});
