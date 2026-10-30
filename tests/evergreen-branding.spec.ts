import { test, expect } from '@playwright/test';

const temporaryBranding = /\b(?:19|20)\d{2}\b|\b(?:demo|prototype|preview|draft|edition|edisi|prototipe)\b|\bvol\./i;

test('Persona branding stays year-free across every screen in both languages', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('portfolio-motion', 'off'));
  for (const language of ['EN', 'ID']) {
    await page.goto('/');
    await page.getByRole('button', { name: language, exact: true }).click();
    await expect(page.locator('.menu-kicker')).toHaveText('PORTFOLIO');
    await expect(page.locator('.footer-edition')).toHaveText('RICKO PRAYUDHA');
    for (const screen of ['menu', 'profile', 'work', 'experience', 'skills', 'contact', 'credits']) {
      await page.goto(`/#${screen}`);
      await expect(page.locator('.persona-app')).toHaveAttribute('data-screen', screen);
      await expect(page.locator('.p-header')).not.toContainText(temporaryBranding);
      await expect(page.locator('.p-footer')).not.toContainText(temporaryBranding);
      if (screen === 'experience') {
        await expect(page.locator('.career-detail')).toContainText(language === 'EN' ? 'AUG 2026 - PRESENT' : 'AGU 2026 - SEKARANG');
      }
    }
  }
});

test('classic branding has no edition or year range while career dates remain intact', async ({ page }) => {
  await page.goto('/?classic');
  for (const language of ['EN', 'ID']) {
    await page.getByRole('button', { name: language, exact: true }).click();
    await expect(page.locator('.hero-index')).toHaveText('PERSONAL PORTFOLIO');
    await expect(page.locator('.footer-name')).toHaveText('RICKO PRAYUDHA');
    for (const element of await page.locator('.hero-index,.section-kicker,.site-footer').all()) {
      await expect(element).not.toContainText(temporaryBranding);
    }
    await expect(page.locator('.timeline details').first()).toContainText(language === 'EN' ? 'AUG 2026 - PRESENT' : 'AGU 2026 - SEKARANG');
  }
});
