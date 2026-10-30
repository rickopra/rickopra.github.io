import { test, expect } from '@playwright/test';

test('current role, product scope, lab boundary, and prior experience agree in both languages', async ({ page }, testInfo) => {
  await page.goto('/#experience');
  const current = page.locator('.career-list button').first();
  await expect(current).toHaveAttribute('aria-pressed', 'true');
  await expect(current).toContainText('L2 Support Engineer - CyberArk PAM');
  await expect(current).toContainText('Solugenix Corporation');
  await expect(current).toContainText('AUG 2026 - PRESENT');
  const detail = page.locator('.career-detail');
  await expect(detail.locator('li')).toHaveCount(5);
  for (const product of ['PSM', 'HTML5 Gateway', 'Remote Access', 'Privilege Cloud']) {
    await expect(detail).toContainText(product);
  }
  const lab = detail.locator('.career-section').filter({ has: page.getByRole('heading', { name: 'Lab configuration & troubleshooting', exact: true }) });
  await expect(lab.locator('li')).toHaveCount(1);
  await expect(lab).toContainText('Digital Vault, PVWA, CPM, PSM, PSMP, and connector infrastructure in technical lab environments.');
  await expect(detail).toContainText('log analysis');
  await expect(detail).toContainText('escalations');
  await expect(detail).toContainText('resolution follow-ups');
  await expect(detail).not.toContainText(/certified|production deployment|Rolebook|100%|SLA achievement/i);
  await expect(detail.locator('.career-projects')).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `.local/screenshots/${testInfo.project.name}-solugenix-experience.png`, fullPage: true });
  await page.getByRole('button', { name: 'ID', exact: true }).click();
  await expect(current).toContainText('AGU 2026 - SEKARANG');
  await expect(detail).toContainText('analisis log');
  await expect(detail).toContainText('di lingkungan lab teknis');
  await page.getByRole('button', { name: /IT Operations Supervisor/ }).click();
  await expect(detail).toContainText('MAR 2024 - AGU 2026');
  await expect(detail).toContainText('500+');
  await expect(detail.locator('li')).toHaveCount(14);

  await page.goto('/#profile');
  await expect(page.locator('.profile-copy')).toContainText('L2 Support Engineer di Solugenix');
  await expect(page.locator('.profile-copy')).toContainText('Sebelumnya');
  await expect(page.locator('.profile-copy')).toContainText('500+');
  await expect(page.locator('.profile-photo img')).toHaveAttribute('src', '/assets/ricko-portrait.webp');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.locator('.profile-copy')).toContainText('L2 Support Engineer at Solugenix');
  await expect(page.locator('.profile-copy')).toContainText('Previously');
  await page.goto('/?classic');
  const timeline = page.locator('.timeline details');
  await expect(timeline).toHaveCount(7);
  await expect(timeline.first()).toHaveAttribute('open', '');
  await expect(timeline.first()).toContainText('Solugenix Corporation');
  await expect(timeline.first()).toContainText('technical lab environments');
  await expect(page.locator('.hero-content')).toContainText('L2 Support Engineer at Solugenix');
});

test('new role labels and details fit narrow and wide screens without changing the Persona portrait', async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.setItem('portfolio-motion', 'off'));
  for (const width of [320, page.viewportSize()!.width]) {
    await page.setViewportSize({ width, height: 900 });
    for (const language of ['EN', 'ID']) {
      await page.goto('/');
      await page.getByRole('button', { name: language, exact: true }).click();
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('.owner-heading>.p-label')).toContainText('CYBERARK PAM');
      await expect(page.locator('.portrait-stage>img')).toHaveAttribute('src', '/assets/ricko-portrait-menu.webp');
      const label = await page.locator('.owner-heading>.p-label').boundingBox();
      expect(label!.x).toBeGreaterThanOrEqual(0);
      expect(label!.x + label!.width).toBeLessThanOrEqual(width);
      for (const screen of ['experience', 'skills', 'profile']) {
        await page.goto(`/#${screen}`);
        await expect(page.locator('.file-content')).toBeVisible();
        await expect(page.locator('body')).toHaveJSProperty('scrollWidth', width);
        const boxes = await page.locator('.career-list strong,.career-detail h2,.capability-list h2,.profile-copy p').evaluateAll(elements => elements.map(element => {
          const box = element.getBoundingClientRect();
          return { left: box.left, right: box.right, fits: element.scrollWidth <= element.clientWidth + 1 };
        }));
        for (const box of boxes) {
          expect(box.left).toBeGreaterThanOrEqual(0);
          expect(box.right).toBeLessThanOrEqual(width);
          expect(box.fits).toBeTruthy();
        }
      }
    }
  }
  await page.screenshot({ path: `.local/screenshots/${testInfo.project.name}-solugenix-profile.png`, fullPage: true });
});

test('search metadata and no-script profile describe the current specialization', async ({ page, request }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Ricko Prayudha | CyberArk PAM & L2 Support');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /L2 Support Engineer at Solugenix.*CyberArk PAM/);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /L2 Support Engineer at Solugenix/);
  const html = await (await request.get('/')).text();
  expect(html).toContain('technical lab environments');
  expect(html).toContain('August 2026 - Present');
});
