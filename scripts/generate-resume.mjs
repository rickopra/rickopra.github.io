import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.PORTFOLIO_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto(`${baseUrl}/?resume`, { waitUntil: 'networkidle' });
  await page.locator('.resume-page').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await mkdir('public', { recursive: true });
  await page.pdf({
    path: 'public/ricko-prayudha-cv.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', right: '16mm', bottom: '17mm', left: '16mm' },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="font-size:8px;color:#6b7280;width:100%;text-align:center;font-family:Arial">Ricko Prayudha | rickopra.github.io | <span class="pageNumber"></span> / <span class="totalPages"></span></div>',
  });
  console.log('Generated public/ricko-prayudha-cv.pdf');
} finally {
  await browser.close();
}
