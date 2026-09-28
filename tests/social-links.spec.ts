import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const mode of [
  { name: 'persona', route: '/#contact', selector: '.contact-destinations' },
  { name: 'classic', route: '/?classic#contact', selector: '.contact-links' },
]) {
  test(`${mode.name} social links have correct destinations, labels, and safe new tabs`, async ({ page }, testInfo) => {
    await page.goto(mode.route);
    await page.evaluate(() => document.fonts.ready);
    const links = page.locator(mode.selector);
    const widths = [...new Set([page.viewportSize()!.width, 768, 320])];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const language of ['EN', 'ID']) {
        await page.getByRole('button', { name: language, exact: true }).click();
        const destinations = [
          { name: 'Instagram @rickoprayudha', href: 'https://www.instagram.com/rickoprayudha/' },
          { name: `Facebook Ricko Prayudha / ${language === 'ID' ? 'Cari profil' : 'Find profile'}`, href: 'https://www.facebook.com/search/people/?q=Ricko%20Prayudha' },
          { name: 'X / Twitter @rickopra', href: 'https://x.com/rickopra' },
        ];
        for (const destination of destinations) {
          const link = links.getByRole('link', { name: destination.name, exact: true });
          await link.scrollIntoViewIfNeeded();
          await expect(link).toBeVisible();
          await expect(link).toHaveAttribute('href', destination.href);
          await expect(link).toHaveAttribute('target', '_blank');
          await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
          await link.focus();
          await expect(link).toBeFocused();
          const geometry = await link.evaluate(element => {
            const anchor = element.getBoundingClientRect();
            const label = element.querySelector('span')!;
            const caption = label.querySelector('small')!;
            const children = Array.from(element.children).map(child => child.getBoundingClientRect());
            return {
              left: anchor.left, right: anchor.right, height: anchor.height,
              captionFits: caption.scrollWidth <= label.clientWidth,
              childrenFit: children.every(child => child.left >= anchor.left && child.right <= anchor.right),
              noOverlap: children.every((child, index) => index === 0 || child.left >= children[index - 1].right),
            };
          });
          expect(geometry.left).toBeGreaterThanOrEqual(0);
          expect(geometry.right).toBeLessThanOrEqual(width);
          expect(geometry.height).toBeGreaterThanOrEqual(44);
          expect(geometry.captionFits).toBeTruthy();
          expect(geometry.childrenFit).toBeTruthy();
          expect(geometry.noOverlap).toBeTruthy();
        }
        await expect(page.locator('body')).toHaveJSProperty('scrollWidth', width);
        const accessibility = await new AxeBuilder({ page }).include(mode.selector).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        expect(accessibility.violations).toEqual([]);
        if (width === 320) await links.screenshot({ path: `.local/screenshots/social-${mode.name}-${testInfo.project.name}-${language}.png` });
      }
    }
    const link = links.getByRole('link', { name: 'Instagram @rickoprayudha', exact: true });
    await page.context().route('https://www.instagram.com/**', route => route.fulfill({ contentType: 'text/html', body: 'External profile destination' }));
    const popupPromise = page.waitForEvent('popup');
    await link.click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    expect(popup.url()).toBe('https://www.instagram.com/rickoprayudha/');
    expect(await popup.evaluate(() => window.opener === null)).toBeTruthy();
    await popup.close();
  });
}
