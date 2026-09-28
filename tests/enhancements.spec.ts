import { test, expect } from '@playwright/test';

test('route reveals are directional, nonblocking, and settle completely', async ({ page }, testInfo) => {
  await page.goto('/');
  for (const [screen, variant] of [['profile', 'portrait'], ['work', 'dossier'], ['experience', 'dossier'], ['contact', 'signal'], ['menu', 'return']]) {
    await page.evaluate(screen => { location.hash = screen; }, screen);
    const transition = page.locator('.screen-transition');
    await expect(transition).toHaveAttribute('data-variant', variant);
    await expect(transition).toHaveCSS('pointer-events', 'none');
    await expect(transition.locator('i')).toHaveCount(3);
    const timings = await transition.locator('i').evaluateAll(elements => elements.map(element => ({
      name: getComputedStyle(element).animationName,
      duration: getComputedStyle(element).animationDuration,
    })));
    expect(timings.every(timing => timing.name === `${variant}-reveal` && timing.duration === '0.44s')).toBeTruthy();
    await page.waitForTimeout(600);
    const intersects = await transition.locator('i').evaluateAll(elements => elements.map(element => {
      const box = element.getBoundingClientRect();
      return box.right > 0 && box.left < innerWidth && box.bottom > 0 && box.top < innerHeight;
    }));
    expect(intersects).toEqual([false, false, false]);
    await expect(page.locator('body')).toHaveJSProperty('scrollWidth', page.viewportSize()!.width);
  }
  await page.evaluate(() => { location.hash = 'experience'; });
  await expect(page.locator('.screen-transition')).toHaveAttribute('data-variant', 'dossier');
  await page.locator('.screen-transition').evaluate(element => {
    element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 200; });
  });
  await page.screenshot({ path: `.local/screenshots/${testInfo.project.name}-dossier-transition.png` });
  await page.locator('.screen-transition').evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
  await page.getByRole('button', { name: 'Back to menu', exact: true }).click();
  await page.getByRole('link', { name: 'CONTACT', exact: true }).click();
  await expect(page.locator('.contact-email')).toBeVisible();
  await expect(page.locator('.file-heading h1')).toBeFocused();
});

test('reduced motion removes reveals; rapid history changes preserve the destination', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.screen-transition')).toBeHidden();
  await expect(page.locator('.persona-option').first()).toHaveCSS('animation-name', 'none');
  for (const screen of ['work', 'profile', 'menu', 'experience', 'contact']) {
    await page.evaluate(screen => { location.hash = screen; }, screen);
  }
  await expect(page.locator('.persona-app')).toHaveAttribute('data-screen', 'contact');
  await expect(page.locator('.file-heading h1')).toBeFocused();
  await expect(page.locator('.screen-transition')).toBeHidden();
  await expect(page.getByRole('heading', { name: "LET'S TALK." })).toBeVisible();
  await page.goBack();
  await expect(page.locator('.persona-app')).toHaveAttribute('data-screen', 'experience');
  await expect(page.locator('.file-heading h1')).toBeFocused();
});

test('soundtrack selection persists silently; both tracks produce audio and a real meter', async ({ page }) => {
  await page.addInitScript(() => {
    const Native = window.AudioContext;
    const state = window as typeof window & { probe: AnalyserNode; contexts: number };
    state.contexts = 0;
    window.AudioContext = class extends Native {
      constructor(options?: AudioContextOptions) { super(options); state.contexts++; }
      createDynamicsCompressor() {
        const compressor = super.createDynamicsCompressor();
        state.probe = this.createAnalyser();
        compressor.connect(state.probe);
        return compressor;
      }
    };
  });
  const amplitude = () => page.evaluate(() => {
    const analyser = (window as typeof window & { probe: AnalyserNode }).probe;
    const values = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(values);
    return Math.max(...values.map(Math.abs));
  });
  const meter = () => page.locator('.equalizer i').evaluateAll(bars => bars.map(bar => new DOMMatrix(getComputedStyle(bar).transform).m22));
  await page.goto('/');
  const track = page.getByRole('combobox', { name: 'Soundtrack', exact: true });
  await track.selectOption('blue-current');
  await expect(page.locator('.sound-deck')).toHaveAttribute('data-audio', 'off');
  expect(await page.evaluate(() => (window as typeof window & { contexts: number }).contexts)).toBe(0);
  await page.reload();
  await expect(track).toHaveValue('blue-current');
  expect(await page.evaluate(() => (window as typeof window & { contexts: number }).contexts)).toBe(0);
  await page.getByRole('button', { name: 'Play soundtrack', exact: true }).click();
  await expect.poll(amplitude).toBeGreaterThan(0.005);
  await expect.poll(async () => Math.max(...await meter())).toBeGreaterThan(0.3);
  await page.getByRole('button', { name: 'Next soundtrack', exact: true }).click();
  await expect(track).toHaveValue('after-hours');
  await expect.poll(amplitude).toBeGreaterThan(0.005);
  for (const value of ['blue-current', 'after-hours', 'blue-current']) await track.selectOption(value);
  await expect.poll(amplitude).toBeGreaterThan(0.005);
  expect(await page.evaluate(() => (window as typeof window & { contexts: number }).contexts)).toBe(1);
  await page.getByRole('slider', { name: 'Soundtrack volume' }).fill('0');
  await expect.poll(amplitude).toBeLessThan(0.001);
  await expect.poll(meter).toEqual([0.16, 0.16, 0.16, 0.16]);
  await page.getByRole('slider', { name: 'Soundtrack volume' }).fill('30');
  await expect.poll(amplitude).toBeGreaterThan(0.005);
  await page.getByRole('button', { name: 'Pause animation' }).click();
  await expect.poll(meter).toEqual([0.16, 0.16, 0.16, 0.16]);
  await expect.poll(amplitude).toBeGreaterThan(0.005);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(amplitude).toBeLessThan(0.001);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(amplitude).toBeGreaterThan(0.005);
  await page.getByRole('button', { name: 'Mute soundtrack', exact: true }).click();
  await expect.poll(amplitude).toBeLessThan(0.001);
  await page.reload();
  await expect(track).toHaveValue('blue-current');
  await expect(page.locator('.sound-deck')).toHaveAttribute('data-audio', 'off');
});

test('audio refusal remains retryable; selecting a track never starts playback', async ({ page }) => {
  await page.addInitScript(() => {
    const resume = AudioContext.prototype.resume;
    let attempts = 0;
    AudioContext.prototype.resume = function () {
      attempts++;
      if (attempts === 1) return Promise.reject(new Error('Playback denied'));
      return resume.call(this);
    };
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Play soundtrack', exact: true }).click();
  await expect(page.getByText('Audio unavailable. Try again.')).toBeVisible();
  await page.getByRole('button', { name: 'Next soundtrack', exact: true }).click();
  await expect(page.locator('.sound-deck')).toHaveAttribute('data-audio', 'off');
  await page.getByRole('button', { name: 'Play soundtrack', exact: true }).click();
  await expect(page.locator('.sound-deck')).toHaveAttribute('data-audio', 'playing');
  await expect(page.locator('.audio-error')).toBeEmpty();
});

test('a second press cancels pending audio consent without a late restart', async ({ page }) => {
  await page.addInitScript(() => {
    const resume = AudioContext.prototype.resume;
    AudioContext.prototype.resume = function () {
      return new Promise<void>((resolve, reject) => {
        window.setTimeout(() => { void resume.call(this).then(resolve, reject); }, 500);
      });
    };
  });
  await page.goto('/');
  const play = page.getByRole('button', { name: 'Play soundtrack', exact: true });
  await play.click();
  await play.click();
  await page.waitForTimeout(750);
  await expect(page.locator('.sound-deck')).toHaveAttribute('data-audio', 'off');
  await expect(page.locator('.audio-error')).toBeEmpty();
  await play.click();
  await expect(page.locator('.sound-deck')).toHaveAttribute('data-audio', 'playing');
});

test('pending playback survives a hidden tab without displaying a false playing state', async ({ page }) => {
  await page.addInitScript(() => {
    const Native = window.AudioContext;
    window.AudioContext = class extends Native {
      createDynamicsCompressor() {
        const compressor = super.createDynamicsCompressor();
        const state = window as typeof window & { pendingProbe: AnalyserNode };
        state.pendingProbe = this.createAnalyser();
        compressor.connect(state.pendingProbe);
        return compressor;
      }
      async resume() {
        await new Promise(resolve => window.setTimeout(resolve, 350));
        return super.resume();
      }
    };
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Play soundtrack', exact: true }).click();
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(500);
  await expect(page.locator('.sound-deck')).toHaveAttribute('data-audio', 'off');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('.sound-deck')).toHaveAttribute('data-audio', 'playing');
  await expect.poll(() => page.evaluate(() => {
    const analyser = (window as typeof window & { pendingProbe: AnalyserNode }).pendingProbe;
    const values = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(values);
    return Math.max(...values.map(Math.abs));
  })).toBeGreaterThan(0.005);
});

test('sound controls and continuous detail surfaces fit at 320px in both languages', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/#experience');
  for (const language of ['EN', 'ID']) {
    await page.getByRole('button', { name: language, exact: true }).click();
    await page.getByRole('combobox').selectOption('blue-current');
    await page.waitForTimeout(600);
    const positions = await page.locator('.sound-deck button, .track-name, .sound-deck input, .footer-contact').evaluateAll(elements => elements.map(element => {
      const { left, right, width } = element.getBoundingClientRect();
      return { left, right, width };
    }));
    for (const [index, box] of positions.entries()) {
      expect(box.width).toBeGreaterThan(0);
      expect(box.left).toBeGreaterThanOrEqual(0);
      expect(box.right).toBeLessThanOrEqual(320);
      if (index) expect(box.left).toBeGreaterThanOrEqual(positions[index - 1].right);
    }
    await expect(page.locator('.file-content')).toHaveCSS('box-shadow', 'none');
    const surface = await page.locator('.file-content').boundingBox();
    expect(surface!.x).toBe(0);
    expect(surface!.width).toBe(320);
    await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 320);
  }
});
