import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const source = new URL('../public/assets/rp-logo.svg', import.meta.url);
const svg = await readFile(source);
const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  const dataUrl = `data:image/svg+xml;base64,${svg.toString('base64')}`;
  for (const [file, size] of [
    ['favicon-16.png', 16],
    ['favicon-32.png', 32],
    ['favicon.png', 64],
    ['apple-touch-icon.png', 180],
    ['rp-logo.png', 512],
  ]) {
    const base64 = await page.evaluate(async ({ dataUrl, size }) => {
      const image = new Image();
      image.src = dataUrl;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      canvas.getContext('2d').drawImage(image, 0, 0, size, size);
      return canvas.toDataURL('image/png').split(',')[1];
    }, { dataUrl, size });
    await writeFile(new URL(`../public/assets/${file}`, import.meta.url), Buffer.from(base64, 'base64'));
    console.log(`${file}: ${size} x ${size}`);
  }
} finally {
  await browser.close();
}
