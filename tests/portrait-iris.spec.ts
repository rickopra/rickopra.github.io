import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';

test('iris accent leaves original portraits, pupil, eyelids, and glasses untouched', async ({ page, request }) => {
  for (const [file, hash] of [
    ['ricko-portrait-menu.webp', '33966a7156fdd8dfa97dd35b43fabace8427a56706cc7ff505b4f24816e93977'],
    ['ricko-portrait.webp', 'bd5c182f2a1cdc65a8995b092f1a2012ccada96e61c01c3de95d82da5a4dca7d'],
  ]) {
    const response = await request.get(`/assets/${file}`);
    expect(response.ok()).toBeTruthy();
    expect(createHash('sha256').update(await response.body()).digest('hex'), file).toBe(hash);
  }
  await page.goto('/');
  const accent = await page.evaluate(async () => {
    const image = new Image();
    image.src = '/assets/ricko-iris-menu.png';
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0);
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let visible = 0;
    let outside = 0;
    let blue = 0;
    for (let index = 0; index < data.length; index += 4) {
      if (!data[index + 3]) continue;
      const x = index / 4 % canvas.width;
      const y = Math.floor(index / 4 / canvas.width);
      visible++;
      if (x < 290 || x >= 314 || y < 468 || y >= 482) outside++;
      if (data[index + 2] > data[index + 1] && data[index + 1] > data[index] + 70) blue++;
    }
    return {
      width: canvas.width, height: canvas.height, visible, outside, blue,
      pupilAlpha: data[(472 * canvas.width + 303) * 4 + 3],
    };
  });
  expect(accent).toMatchObject({ width: 354, height: 1246, outside: 0, pupilAlpha: 0 });
  expect(accent.visible).toBeGreaterThan(150);
  expect(accent.visible).toBeLessThan(250);
  expect(accent.blue).toBe(accent.visible);
});

test('iris stays aligned at every portrait breakpoint, respects motion, and appears only on dashboard', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.portrait-stage>img')).toBeVisible();
  for (const [width, height] of [[320, 568], [390, 844], [768, 1024], [844, 390], [1440, 720], [1440, 900], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    const alignment = await page.locator('.portrait-stage').evaluate(stage => {
      const image = stage.querySelector('img')!;
      const base = getComputedStyle(image);
      const accent = getComputedStyle(stage, '::after');
      const animations = stage.getAnimations({ subtree: true }).filter(animation =>
        animation instanceof CSSAnimation && animation.animationName === 'portrait-float');
      return {
        width: Math.abs(parseFloat(base.width) - parseFloat(accent.width)),
        height: Math.abs(parseFloat(base.height) - parseFloat(accent.height)),
        left: Math.abs(image.offsetLeft - parseFloat(accent.left)),
        top: Math.abs(image.offsetTop - parseFloat(accent.top)),
        translate: base.translate === accent.translate,
        clocks: animations.map(animation => animation.currentTime),
        visibility: accent.visibility, filter: accent.filter, blend: accent.mixBlendMode,
      };
    });
    expect(alignment.width).toBeLessThan(0.1);
    expect(alignment.height).toBeLessThan(0.1);
    expect(alignment.left).toBeLessThanOrEqual(0.5);
    expect(alignment.top).toBeLessThanOrEqual(0.5);
    expect(alignment).toMatchObject({ translate: true, visibility: 'visible', filter: 'none', blend: 'normal' });
    expect(alignment.clocks).toHaveLength(2);
    expect(alignment.clocks[0]).toBe(alignment.clocks[1]);
  }
  await page.getByRole('button', { name: 'Pause animation', exact: true }).click();
  expect(await page.locator('.portrait-stage').evaluate(stage => getComputedStyle(stage, '::after').animationName)).toBe('none');
  await page.getByRole('link', { name: 'PROFILE', exact: true }).click();
  await expect(page.locator('.profile-photo img')).toHaveAttribute('src', '/assets/ricko-portrait.webp');
  expect(await page.locator('.portrait-stage').evaluate(stage => getComputedStyle(stage, '::after').visibility)).toBe('hidden');
  await page.keyboard.press('Escape');
  await expect(page.locator('.persona-app')).toHaveAttribute('data-screen', 'menu');
  await page.getByRole('button', { name: 'Enable animation', exact: true }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.locator('.portrait-stage').evaluate(stage => {
    const accent = getComputedStyle(stage, '::after');
    return { duration: accent.animationDuration, iterations: accent.animationIterationCount };
  })).toEqual({ duration: '1e-05s', iterations: '1' });
  await page.goto('/?classic');
  await expect(page.locator('.portrait-stage')).toHaveCount(0);
});

test('rendered blue accent changes only the small iris region', async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.setItem('portfolio-motion', 'off'));
  await page.goto('/');
  await expect(page.locator('.portrait-stage>img')).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => image.decode()));
    const accent = new Image();
    accent.src = '/assets/ricko-iris-menu.png';
    await accent.decode();
  });
  await page.waitForTimeout(500);
  const after = await page.screenshot({ path: `.local/screenshots/${testInfo.project.name}-blue-iris.png`, scale: 'css' });
  const hidden = await page.addStyleTag({ content: '.portrait-stage::after{visibility:hidden!important}' });
  const before = await page.screenshot({ scale: 'css' });
  await hidden.evaluate(element => element.parentNode?.removeChild(element));
  const difference = await page.evaluate(async ({ before, after }) => {
    const pixels = async (data: string) => {
      const image = new Image();
      image.src = `data:image/png;base64,${data}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d')!;
      context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, image.width, image.height);
    };
    const [base, colored] = await Promise.all([pixels(before), pixels(after)]);
    let count = 0;
    let blue = 0;
    let left = base.width;
    let top = base.height;
    let right = 0;
    let bottom = 0;
    for (let index = 0; index < base.data.length; index += 4) {
      if ([0, 1, 2].every(channel => Math.abs(base.data[index + channel] - colored.data[index + channel]) < 4)) continue;
      count++;
      const x = index / 4 % base.width;
      const y = Math.floor(index / 4 / base.width);
      left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, y); bottom = Math.max(bottom, y);
      if (colored.data[index + 2] > colored.data[index] + 25 && colored.data[index + 1] > colored.data[index] + 15) blue++;
    }
    return { count, blue, left, top, width: right - left + 1, height: bottom - top + 1 };
  }, { before: before.toString('base64'), after: after.toString('base64') });
  expect(difference.count).toBeGreaterThan(8);
  expect(difference.count).toBeLessThan(220);
  expect(difference.blue / difference.count).toBeGreaterThan(0.9);
  expect(difference.width).toBeLessThan(20);
  expect(difference.height).toBeLessThan(14);
  expect(difference.left).toBeGreaterThan(page.viewportSize()!.width * 0.5);
  expect(difference.top).toBeGreaterThan(100);
});
