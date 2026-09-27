import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('profile, images, CV, and responsive composition', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /RICKO\s*PRAYUDHA/ })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `.local/screenshots/${testInfo.project.name}-hero.png` });
  const statsTop = await page.locator('.stats-band').evaluate(element => element.getBoundingClientRect().top);
  expect(statsTop).toBeLessThan(page.viewportSize()!.height);
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', page.viewportSize()!.width);
  const cv = await page.request.get('/ricko-prayudha-cv.pdf');
  expect(cv.ok()).toBeTruthy();
  expect((await cv.body()).subarray(0, 4).toString()).toBe('%PDF');
  await page.screenshot({ path: `.local/screenshots/${testInfo.project.name}-full.png`, fullPage: true });
  expect(errors).toEqual([]);
});

test('filters, case study, keyboard close, and focus restoration', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Internal systems/ }).click();
  await expect(page.locator('.project')).toHaveCount(2);
  const trigger = page.getByRole('button', { name: 'View case study: ATLAS' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'My contribution' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View source' })).toHaveAttribute('href', 'https://github.com/rickopra/ATLAS');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.getByRole('button', { name: /^Governance/ }).click();
  await expect(page.locator('.project')).toHaveCount(1);
  await page.getByRole('button', { name: /All work/ }).click();
  await expect(page.locator('.project')).toHaveCount(4);
});

test('language and motion preferences persist', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'ID', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  await expect(page.getByRole('heading', { name: 'KARYA NYATA. TANGGUNG JAWAB NYATA.' })).toBeVisible();
  await page.getByRole('button', { name: 'Jeda animasi' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await expect(page.getByRole('button', { name: 'Aktifkan animasi' })).toBeVisible();
  expect(await page.locator('body').evaluate(element => element.scrollWidth)).toBe(page.viewportSize()!.width);
});

test('reduced motion and local storage failure stay usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage unavailable'); };
    Storage.prototype.setItem = () => { throw new Error('Storage unavailable'); };
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await expect(page.getByRole('heading', { name: /RICKO\s*PRAYUDHA/ })).toBeVisible();
  await page.getByRole('button', { name: 'ID', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
});

test('WebGL is nonblank, animated, and pauses', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.network-scene')).toHaveAttribute('data-renderer', 'webgl');
  await expect(page.locator('.network-scene canvas')).toBeVisible();
  const firstFrame = await page.locator('.network-scene').getAttribute('data-frame');
  await page.waitForTimeout(500);
  expect(await page.locator('.network-scene').getAttribute('data-frame')).not.toBe(firstFrame);
  const pixels = await page.locator('canvas').evaluate(element => {
    const canvas = element as HTMLCanvasElement;
    const webgl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!webgl) return 0;
    const buffer = new Uint8Array(canvas.width * canvas.height * 4);
    webgl.readPixels(0, 0, canvas.width, canvas.height, webgl.RGBA, webgl.UNSIGNED_BYTE, buffer);
    let visible = 0;
    for (let index = 3; index < buffer.length; index += 4) if (buffer[index] > 0) visible += 1;
    return visible;
  });
  expect(pixels).toBeGreaterThan(500);
  await page.getByRole('button', { name: 'Pause animation' }).click();
  await page.waitForTimeout(100);
  const paused = await page.locator('.network-scene').getAttribute('data-frame');
  await page.waitForTimeout(400);
  expect(await page.locator('.network-scene').getAttribute('data-frame')).toBe(paused);
});

test('navigation, experience disclosure, and contact links', async ({ page }, testInfo) => {
  await page.goto('/');
  if (testInfo.project.name === 'mobile') await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'Experience' }).click();
  await expect(page).toHaveURL(/#experience$/);
  await page.getByText('Network Engineer & NOC', { exact: true }).click();
  await expect(page.getByText(/Built Telegram operational alerts/)).toBeVisible();
  await expect(page.locator('.contact-links').getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/ricko-prayudha/');
  await expect(page.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', 'mailto:ricko.prayudha9@gmail.com');
});

test('accessibility, including modal', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1200);
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(report.violations).toEqual([]);
  await page.getByRole('button', { name: 'View case study: ATLAS' }).click();
  const dialogReport = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(dialogReport.violations).toEqual([]);
});
