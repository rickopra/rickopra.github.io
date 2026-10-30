import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('original opening reveals the owner, stays silent, and completes once per tab session', async ({ page }) => {
  await page.addInitScript(() => {
    const Native = window.AudioContext;
    const state = window as typeof window & { introAudioContexts: number };
    state.introAudioContexts = 0;
    window.AudioContext = class extends Native {
      constructor(options?: AudioContextOptions) { super(options); state.introAudioContexts++; }
    };
  });
  await page.goto('/');
  const intro = page.getByRole('dialog', { name: 'Ricko Prayudha, portfolio opening' });
  await expect(intro).toBeVisible();
  await expect(page.getByRole('button', { name: 'Skip intro' })).toBeFocused();
  await expect(page.locator('.portfolio-surface')).toHaveAttribute('inert', '');
  await expect(page.getByRole('navigation', { name: 'Main menu' })).toHaveCount(0);
  await expect(intro.locator('.intro-name')).toHaveText('RICKOPRAYUDHA');
  await expect(intro.locator('.intro-specialty')).toHaveText('L2 SUPPORT / CYBERARK PAM');
  await expect(intro).not.toContainText(/\b20\d{2}\b|loading|demo|edition|vol\./i);
  await expect(intro.locator('img')).toHaveCount(2);
  await expect(intro).toHaveCount(0, { timeout: 5000 });
  await expect(page.getByRole('navigation', { name: 'Main menu' })).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem('portfolio-intro-seen'))).toBe('1');
  expect(await page.evaluate(() => (window as typeof window & { introAudioContexts: number }).introAudioContexts)).toBe(0);
  await page.reload();
  await expect(page.getByRole('navigation', { name: 'Main menu' })).toBeVisible();
  await expect(page.locator('.portfolio-intro')).toHaveCount(0);
});

test('skip, Escape, focus containment, and direct links keep the portfolio reachable', async ({ page }) => {
  await page.goto('/');
  const skip = page.getByRole('button', { name: 'Skip intro' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(skip).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page).not.toHaveURL(/#work$/);
  await page.keyboard.press('Escape');
  await expect(page.locator('.portfolio-intro')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'PROFILE', exact: true })).toBeFocused();
  await page.evaluate(() => sessionStorage.removeItem('portfolio-intro-seen'));
  await page.reload();
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await expect(page.locator('.portfolio-intro')).toHaveCount(0);
  for (const route of ['/#experience', '/#contact', '/?classic']) {
    await page.evaluate(() => sessionStorage.removeItem('portfolio-intro-seen'));
    await page.goto(route);
    await expect(page.locator('.portfolio-intro')).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Download CV/ }).first()).toBeVisible();
  }
});

test('reduced motion and saved pause bypass the opening; changing motion dismisses it', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.portfolio-intro')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Main menu' })).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => localStorage.setItem('portfolio-motion', 'off'));
  await page.reload();
  await expect(page.locator('.portfolio-intro')).toHaveCount(0);
  await page.evaluate(() => localStorage.removeItem('portfolio-motion'));
  await page.reload();
  await expect(page.locator('.portfolio-intro')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.portfolio-intro')).toHaveCount(0);
  await expect(page.locator('.portfolio-surface')).not.toHaveAttribute('inert');
});

test('storage failure and missing animation events cannot leave an intro gate behind', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw Error('Storage unavailable'); };
    Storage.prototype.setItem = () => { throw Error('Storage unavailable'); };
  });
  await page.goto('/');
  await expect(page.locator('.portfolio-intro')).toBeVisible();
  await page.addStyleTag({ content: '.portfolio-intro,.portfolio-intro *{animation:none!important}' });
  await expect(page.locator('.portfolio-intro')).toHaveCount(0, { timeout: 5000 });
  await expect(page.getByRole('navigation', { name: 'Main menu' })).toBeVisible();
});

test('intro composition has real portrait pixels, legible type, and movement on phone and desktop', async ({ page }, testInfo) => {
  await page.clock.install();
  await page.goto('/');
  await expect(page.locator('.portfolio-intro')).toBeVisible();
  await page.clock.pauseAt(new Date(Date.now() + 100));
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.querySelectorAll<HTMLImageElement>('.portfolio-intro img')].map(image => image.decode()));
  });
  const seek = async (time: number) => page.locator('.portfolio-intro').evaluate((element, time) => {
    element.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time; });
  }, time);
  await seek(600);
  const first = await page.screenshot({ scale: 'css' });
  await seek(2300);
  const second = await page.screenshot({ path: `.local/screenshots/${testInfo.project.name}-intro-identity.png`, scale: 'css' });
  expect(first.equals(second)).toBe(false);
  const pixels = await page.evaluate(async data => {
    const image = new Image();
    image.src = `data:image/png;base64,${data}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width; canvas.height = image.height;
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0);
    const { data: pixels } = context.getImageData(0, 0, canvas.width, canvas.height);
    let blue = 0; let white = 0;
    const colors = new Set<string>();
    for (let index = 0; index < pixels.length; index += 16) {
      const [r, g, b] = pixels.slice(index, index + 3);
      if (b > 120 && b > r + 40) blue++;
      if (r > 220 && g > 220 && b > 220) white++;
      colors.add(`${r >> 4},${g >> 4},${b >> 4}`);
    }
    return { blue, white, colors: colors.size, samples: pixels.length / 16 };
  }, second.toString('base64'));
  expect(pixels.blue / pixels.samples).toBeGreaterThan(0.12);
  expect(pixels.white).toBeGreaterThan(300);
  expect(pixels.colors).toBeGreaterThan(45);
  for (const width of [320, page.viewportSize()!.width, 844, 1920]) {
    await page.setViewportSize({ width, height: width === 844 ? 390 : 900 });
    const geometry = await page.locator('.intro-name,.intro-specialty,.intro-skip,.intro-signature,.intro-location').evaluateAll(elements => elements.map(element => {
      const box = element.getBoundingClientRect();
      return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, fits: element.scrollWidth <= element.clientWidth + 1 };
    }));
    for (const box of geometry) {
      expect(box.left).toBeGreaterThanOrEqual(0);
      expect(box.right).toBeLessThanOrEqual(width);
      expect(box.top).toBeGreaterThanOrEqual(0);
      expect(box.bottom).toBeLessThanOrEqual(width === 844 ? 390 : 900);
      expect(box.fits).toBeTruthy();
    }
  }
  await page.clock.resume();
  const result = await new AxeBuilder({ page }).include('.portfolio-intro').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
});
