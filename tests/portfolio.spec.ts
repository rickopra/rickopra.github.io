import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('menu, portrait, CV, and working screen routes', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /RICKO\s*PRAYUDHA/ })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main menu' }).getByRole('link')).toHaveCount(6);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  const portrait = page.locator('.portrait-stage img');
  await expect(portrait).toHaveAttribute('src', '/assets/ricko-portrait-menu.webp');
  await expect.poll(() => portrait.evaluate(element => {
    const image = element as HTMLImageElement;
    return [image.naturalWidth, image.naturalHeight];
  })).toEqual([354, 1246]);
  await expect(page.locator('.portrait-echo')).toHaveCSS('mask-image', /ricko-portrait-menu\.webp/);
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', page.viewportSize()!.width);
  await page.screenshot({ path: `.local/screenshots/${testInfo.project.name}-reload-menu.png` });
  const cv = await page.request.get('/ricko-prayudha-cv.pdf');
  expect(cv.ok()).toBeTruthy();
  expect((await cv.body()).subarray(0, 4).toString()).toBe('%PDF');
  for (const screen of ['profile', 'work', 'experience', 'skills', 'contact', 'credits']) {
    await page.goto(`/#${screen}`);
    await expect(page.locator('.persona-app')).toHaveAttribute('data-screen', screen);
    await expect(page.locator('.file-heading h1')).toBeVisible();
    await expect(page.locator('body')).toHaveJSProperty('scrollWidth', page.viewportSize()!.width);
    await page.screenshot({ path: `.local/screenshots/${testInfo.project.name}-reload-${screen}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});

test('keyboard selection, browser history, deep links, and focus restoration', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main menu' });
  await nav.getByRole('link', { name: 'PROFILE', exact: true }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(nav.getByRole('link', { name: 'SELECTED WORK' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator('.file-heading h1')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/#menu$/);
  await expect(nav.getByRole('link', { name: 'SELECTED WORK' })).toBeFocused();
  await page.goBack();
  await expect(page.locator('.persona-app')).toHaveAttribute('data-screen', 'work');
  await page.reload();
  await expect(page.locator('.case-file')).toHaveCount(9);
  await page.goto('/#unknown');
  await expect(nav).toBeVisible();
});

test('filters, case study, Escape, and modal focus', async ({ page }) => {
  await page.goto('/#work');
  await page.getByRole('button', { name: /Internal systems/ }).click();
  await expect(page.locator('.case-file')).toHaveCount(3);
  const trigger = page.getByRole('button', { name: 'View case study: ATLAS' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'My contribution' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View source' })).toHaveAttribute('href', 'https://github.com/rickopra/ATLAS');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page).toHaveURL(/#work$/);
  await expect(trigger).toBeFocused();
  await page.getByRole('button', { name: /^Governance/ }).click();
  await expect(page.locator('.case-file')).toHaveCount(1);
  await page.getByRole('button', { name: /All work/ }).click();
  await expect(page.locator('.case-file')).toHaveCount(9);
});

test('skip links focus content without changing the screen route', async ({ page }) => {
  await page.goto('/');
  await page.locator('.skip-link').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-menu')).toBeFocused();
  await expect(page.locator('.persona-app')).toHaveAttribute('data-screen', 'menu');
  await page.goto('/#work');
  await page.locator('.skip-link').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#file-content')).toBeFocused();
  await expect(page).toHaveURL(/#work$/);
});

test('gamepad selection, confirm, and back preserve the modal route', async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as typeof window & { mockPad: { buttons: { pressed: boolean }[]; axes: number[] } };
    state.mockPad = { buttons: Array.from({ length: 16 }, () => ({ pressed: false })), axes: [0, 0] };
    Object.defineProperty(navigator, 'getGamepads', { value: () => [state.mockPad], configurable: true });
  });
  await page.goto('/');
  await expect(page.locator('.persona-menu')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);
  const press = async (button: number) => {
    for (const pressed of [true, false]) {
      await page.evaluate(async ({ index, pressed }) => {
        (window as typeof window & { mockPad: { buttons: { pressed: boolean }[] } }).mockPad.buttons[index].pressed = pressed;
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      }, { index: button, pressed });
    }
  };
  await press(13);
  await expect(page.getByRole('link', { name: 'SELECTED WORK', exact: true })).toBeFocused();
  await press(0);
  await expect(page).toHaveURL(/#work$/);
  await page.getByRole('button', { name: 'View case study: ATLAS' }).click();
  await press(1);
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page).toHaveURL(/#work$/);
  await press(1);
  await expect(page).toHaveURL(/#menu$/);
});

test('language and motion preferences persist', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'ID', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  await expect(page.getByRole('link', { name: 'PENGALAMAN', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Jeda animasi' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  await expect(page.getByRole('button', { name: 'Aktifkan animasi' })).toBeVisible();
  await page.getByRole('link', { name: 'KARYA PILIHAN', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'KARYA PILIHAN' })).toBeVisible();
});

test('reduced motion and failed storage remain usable', async ({ page }) => {
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
  await page.getByRole('link', { name: 'PROFIL', exact: true }).click();
  await expect(page.getByText('Pendidikan belum diselesaikan.', { exact: false })).toBeVisible();
});

test('WebGL is nonblank, animated, pointer responsive, and pauses', async ({ page }) => {
  await page.goto('/');
  const scene = page.locator('.tide-scene');
  await expect(scene).toHaveAttribute('data-renderer', 'webgl');
  const firstFrame = await scene.getAttribute('data-frame');
  await page.mouse.move(40, 40);
  await page.waitForTimeout(400);
  expect(await scene.getAttribute('data-frame')).not.toBe(firstFrame);
  const pixels = await page.locator('canvas').evaluate(element => {
    const canvas = element as HTMLCanvasElement;
    const gl = canvas.getContext('webgl2')!;
    const buffer = new Uint8Array(canvas.width * canvas.height * 4);
    gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
    let visible = 0;
    const colors = new Set<string>();
    for (let i = 0; i < buffer.length; i += 400) { if (buffer[i + 3] > 0) visible++; colors.add(`${buffer[i]},${buffer[i + 1]},${buffer[i + 2]}`); }
    return { visible, colors: colors.size };
  });
  expect(pixels.visible).toBeGreaterThan(500);
  expect(pixels.colors).toBeGreaterThan(30);
  await page.getByRole('button', { name: 'Pause animation' }).click();
  await page.waitForTimeout(150);
  const paused = await scene.getAttribute('data-frame');
  await page.waitForTimeout(400);
  expect(await scene.getAttribute('data-frame')).toBe(paused);
});

test('missing WebGL does not block navigation', async ({ page }) => {
  await page.addInitScript(() => {
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, name: string, ...args: unknown[]) {
      if (name.startsWith('webgl')) return null;
      return Reflect.apply(get, this, [name, ...args]);
    } as typeof get;
  });
  await page.goto('/');
  await expect(page.locator('.tide-scene')).toHaveAttribute('data-renderer', 'fallback');
  await page.getByRole('link', { name: 'CONTACT', exact: true }).click();
  await expect(page.locator('.contact-destinations').getByRole('link', { name: 'Get in touch', exact: true })).toHaveAttribute('href', 'mailto:ricko.prayudha9@gmail.com');
});

test('soundtrack is silent before consent, produces samples, mutes, and persists volume', async ({ page }) => {
  await page.addInitScript(() => {
    const Native = window.AudioContext;
    const state = window as typeof window & { audioProbe?: AnalyserNode; audioContexts?: number };
    state.audioContexts = 0;
    window.AudioContext = class extends Native {
      constructor(options?: AudioContextOptions) {
        super(options);
        state.audioContexts!++;
      }
      createDynamicsCompressor() {
        const compressor = super.createDynamicsCompressor();
        const probe = this.createAnalyser();
        compressor.connect(probe);
        state.audioProbe = probe;
        return compressor;
      }
    };
  });
  await page.goto('/');
  await expect(page.locator('.sound-deck')).toHaveAttribute('data-audio', 'off');
  expect(await page.evaluate(() => (window as typeof window & { audioContexts: number }).audioContexts)).toBe(0);
  await page.getByRole('button', { name: 'Play soundtrack', exact: true }).click();
  await expect(page.locator('.sound-deck')).toHaveAttribute('data-audio', 'playing');
  const amplitude = () => page.evaluate(() => {
    const probe = (window as typeof window & { audioProbe: AnalyserNode }).audioProbe;
    const samples = new Float32Array(probe.fftSize);
    probe.getFloatTimeDomainData(samples);
    return Math.max(...samples.map(Math.abs));
  });
  await expect.poll(amplitude).toBeGreaterThan(0.005);
  await page.getByRole('slider', { name: 'Soundtrack volume' }).fill('44');
  await page.getByRole('button', { name: 'Mute soundtrack', exact: true }).click();
  await expect(page.locator('.sound-deck')).toHaveAttribute('data-audio', 'off');
  await expect.poll(amplitude).toBeLessThan(0.001);
  await page.reload();
  await expect(page.getByRole('slider', { name: 'Soundtrack volume' })).toHaveValue('44');
  await expect(page.locator('.sound-deck')).toHaveAttribute('data-audio', 'off');
});

test('career detail, contact destinations, and clipboard failure', async ({ page }) => {
  await page.goto('/#experience');
  await page.getByRole('button', { name: /Network Engineer & NOC/ }).click();
  await expect(page.getByText(/Built Telegram operational alerts/)).toBeVisible();
  if (page.viewportSize()!.width <= 900) await expect(page.locator('.career-detail')).toBeFocused();
  await page.goto('/#contact');
  await expect(page.getByRole('link', { name: 'LinkedIn', exact: true })).toHaveAttribute('href', 'https://www.linkedin.com/in/ricko-prayudha/');
  await page.evaluate(() => { Object.defineProperty(navigator.clipboard, 'writeText', { value: async () => { throw new Error('Unavailable'); }, configurable: true }); });
  await page.getByRole('button', { name: 'Copy email address' }).click();
  await expect(page.getByText('Copy unavailable. Use the email link.')).toBeVisible();
});

test('accessibility across all screens and the project modal', async ({ page }) => {
  for (const screen of ['menu', 'profile', 'work', 'experience', 'skills', 'contact', 'credits']) {
    await page.goto(`/#${screen}`);
    await page.waitForTimeout(1100);
    const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(report.violations, screen).toEqual([]);
  }
  await page.goto('/#work');
  await page.getByRole('button', { name: 'View case study: ATLAS' }).click();
  const modal = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(modal.violations).toEqual([]);
});

test('menu text and controls fit small, short, tablet, and wide viewports', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Viewport matrix runs once.');
  for (const [width, height] of [[320, 568], [390, 664], [390, 844], [844, 390], [768, 1024], [1440, 720], [1920, 1080]]) {
    for (const language of ['EN', 'ID']) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.getByRole('button', { name: language, exact: true }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(700);
    await expect(page.locator('body')).toHaveJSProperty('scrollWidth', width);
    const boxes = await page.locator('.option-label').evaluateAll(elements => elements.map(element => {
      const { left, right, top, bottom } = element.getBoundingClientRect();
      return { left, right, top, bottom };
    }));
    for (const box of boxes) { expect(box.left).toBeGreaterThanOrEqual(0); expect(box.right).toBeLessThanOrEqual(width); }
    for (let i = 1; i < boxes.length; i++) expect(boxes[i].top).toBeGreaterThan(boxes[i - 1].top);
    const lastMenu = boxes.at(-1)!;
    const metrics = await page.locator('.menu-metrics').boundingBox();
    expect(lastMenu.bottom).toBeLessThan(metrics!.y);
    await page.screenshot({ path: `.local/screenshots/reload-${width}x${height}-${language}.png`, fullPage: true });
    }
  }
});

test('printable CV and classic view remain available', async ({ page }) => {
  await page.goto('/?resume');
  await expect(page.getByRole('heading', { name: 'Ricko Prayudha', exact: true })).toBeVisible();
  await expect(page.getByText('Degree not completed.', { exact: false })).toBeVisible();
  await page.goto('/?classic');
  await expect(page.getByRole('heading', { name: /RICKO\s*PRAYUDHA/ })).toBeVisible();
  await expect(page.locator('.project')).toHaveCount(9);
});

test('profile preserves the full portrait within its frame', async ({ page }) => {
  await page.goto('/#profile');
  const portrait = page.locator('.profile-photo img');
  await expect(portrait).toBeVisible();
  await expect(portrait).toHaveAttribute('src', '/assets/ricko-portrait.webp');
  await expect.poll(() => portrait.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(853);
  await page.evaluate(() => document.fonts.ready);
  const layout = await portrait.evaluate(element => {
    const image = element as HTMLImageElement;
    const box = image.getBoundingClientRect();
    const parent = image.parentElement!.getBoundingClientRect();
    return { naturalHeight: image.naturalHeight, ratio: box.width / box.height, left: box.left - parent.left, right: box.right - parent.right, bottom: box.bottom - parent.bottom, fit: getComputedStyle(image).objectFit };
  });
  expect(layout.naturalHeight).toBe(1280);
  expect(layout.ratio).toBeCloseTo(853 / 1280, 2);
  expect(layout.left).toBeGreaterThanOrEqual(-1);
  expect(layout.right).toBeLessThanOrEqual(1);
  expect(layout.bottom).toBeLessThanOrEqual(1);
  expect(layout.fit).toBe('contain');
  const geometry = await page.locator('.profile-file').evaluate(element => {
    const frame = element.querySelector('.profile-photo')!.getBoundingClientRect();
    const caption = element.querySelector('.profile-photo>span')!.getBoundingClientRect();
    const content = element.querySelector('.profile-copy')!.getBoundingClientRect();
    return { captionOverflow: caption.bottom - frame.bottom, contentGap: content.top - caption.bottom };
  });
  expect(geometry.captionOverflow).toBeLessThanOrEqual(1);
  if (page.viewportSize()!.width <= 600) expect(geometry.contentGap).toBeGreaterThanOrEqual(0);
});

test('profile and evidence fit narrow screens in both languages', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  for (const language of ['EN', 'ID']) {
    await page.goto('/#profile');
    await page.getByRole('button', { name: language, exact: true }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    const caption = await page.locator('.profile-photo>span').boundingBox();
    const content = await page.locator('.profile-copy').boundingBox();
    expect(content!.y).toBeGreaterThanOrEqual(caption!.y + caption!.height);
    await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 320);
    await page.goto('/#work');
    await page.locator('.case-trigger').nth(8).click();
    const gallery = page.locator('.evidence-gallery');
    await gallery.locator('.evidence-controls').scrollIntoViewIfNeeded();
    await expect.poll(() => gallery.locator('figure img').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const geometry = await page.locator('.case-dialog').evaluate(dialog => {
      const controls = dialog.querySelector('.evidence-controls')!.getBoundingClientRect();
      const frame = dialog.getBoundingClientRect();
      return { scroll: dialog.scrollWidth, client: dialog.clientWidth, left: controls.left - frame.left, right: controls.right - frame.right };
    });
    expect(geometry.scroll).toBe(geometry.client);
    expect(geometry.left).toBeGreaterThanOrEqual(0);
    expect(geometry.right).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `.local/screenshots/narrow-gallery-${language}-${test.info().project.name}.png` });
    await page.keyboard.press('Escape');
  }
});

test('six roles contain CV-level responsibilities and linked evidence', async ({ page }) => {
  await page.goto('/#experience');
  const roles = page.locator('.career-list button');
  await expect(roles).toHaveCount(6);
  for (const [index, count] of [14, 7, 6, 4, 9, 2].entries()) {
    await roles.nth(index).click();
    await expect(page.locator('.career-detail li')).toHaveCount(count);
    await expect(page.locator('.career-detail .skill-tags')).toBeVisible();
    await expect(page.locator('body')).toHaveJSProperty('scrollWidth', page.viewportSize()!.width);
  }
  await roles.nth(4).click();
  const trigger = page.getByRole('button', { name: 'View case study: Wireless links, end to end' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.evidence-gallery')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page).toHaveURL(/#experience$/);
  await page.getByRole('button', { name: 'ID', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Jaringan pelanggan & operasional ISP' })).toBeVisible();
});

test('archive galleries load, cycle, reset, and expose full images', async ({ page }, testInfo) => {
  const failures: string[] = [];
  page.on('response', response => { if (response.status() >= 400 && response.url().includes('/assets/')) failures.push(response.url()); });
  await page.goto('/#work');
  for (const title of ['LAN reconstruction', 'Wireless links, end to end', 'Fiber-optic field delivery']) {
    await page.getByRole('button', { name: `View case study: ${title}`, exact: true }).click();
    const gallery = page.locator('.evidence-gallery');
    await expect(gallery).toBeVisible();
    const main = gallery.locator('figure img');
    await expect.poll(() => main.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(500);
    const first = await main.getAttribute('src');
    await gallery.getByRole('button', { name: 'Next photograph', exact: true }).click();
    await expect(main).not.toHaveAttribute('src', first!);
    await expect(gallery.getByRole('link', { name: 'Open full photograph' })).toHaveAttribute('href', (await main.getAttribute('src'))!);
    await gallery.getByRole('button', { name: 'Previous photograph', exact: true }).click();
    await expect(main).toHaveAttribute('src', first!);
    const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(report.violations).toEqual([]);
    await page.screenshot({ path: `.local/screenshots/${testInfo.project.name}-archive-${title.split(' ')[0]}.png` });
    await page.keyboard.press('Escape');
  }
  expect(failures).toEqual([]);
});

test('every case image loads and reconstructions are labeled', async ({ page }) => {
  await page.goto('/#work');
  const triggers = page.locator('.case-trigger');
  for (let i = 0; i < 9; i++) {
    await triggers.nth(i).click();
    const image = page.locator('.case-dialog figure img').first();
    await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await page.keyboard.press('Escape');
  }
  await page.getByRole('button', { name: 'View case study: FTTH planning & mapping' }).click();
  await expect(page.getByText('Illustrative reconstruction of the project scope.')).toBeVisible();
  await expect(page.getByText('Not a production screenshot or a live network topology.')).toBeVisible();
});
