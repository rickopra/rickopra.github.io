# Panduan Implementasi

Untuk melanjutkan pengembangan tanpa menebak struktur, mulai dari [FLOW.md](FLOW.md), lalu panduan ini. Status aktual dan pekerjaan tertunda ada di [STATUS.md](STATUS.md).

## 1. Arsitektur

Website statis berbasis React dan TypeScript, dibundel oleh Vite. GitHub Pages tidak menjalankan Node.js, database, atau API aplikasi. Node.js hanya digunakan saat pengembangan dan build.

| Lokasi | Tanggung jawab |
| --- | --- |
| `index.html` | Root React, judul, SEO, Open Graph, favicon, fallback `noscript`. |
| `src/main.tsx` | Mount React, Strict Mode, import font lokal dan CSS. |
| `src/content.ts` | Identitas, teks EN/ID, proyek, pengalaman, kapabilitas. |
| `src/App.tsx` | Portfolio, state interaksi, navigasi, `ProjectDialog`, dan `Resume`. |
| `src/NetworkScene.tsx` | Scene dekoratif Three.js, pointer, resize, visibilitas, cleanup. |
| `src/styles.css` | Layout, token warna/font, breakpoint, animasi, reduced motion, print. |
| `public/assets/` | Foto, diagram ilustratif, social preview, favicon. |
| `public/ricko-prayudha-cv.pdf` | CV publik yang diunduh, bukan PDF source pribadi. |
| `public/robots.txt`, `public/sitemap.xml` | Metadata crawler untuk domain saat ini. |
| `scripts/generate-resume.mjs` | Cetak `/?resume` menjadi PDF menggunakan Chromium. |
| `scripts/prepare-assets.py` | Pengolahan foto dan pembuatan diagram raster deterministik. |
| `tests/portfolio.spec.ts` | Tes fungsional, responsive, WebGL, preferensi, dan axe-core. |
| `playwright.config.ts` | Browser Chromium, desktop/mobile, server lokal, trace. |
| `.github/workflows/deploy.yml` | Build dan publikasi artifact `dist/` ke Pages. |

`App()` memilih `Resume()` ketika query memiliki `resume`; selain itu menampilkan `Portfolio()`. Navigasi menggunakan anchor satu halaman, bukan router. Karena itu refresh `/#work` dan `/?resume` tetap dilayani root GitHub Pages.

## 2. Setup Pertama

1. Pasang Node.js 24, npm, Git. GitHub CLI (`gh`) diperlukan hanya untuk langkah pengelolaan GitHub lewat terminal.
2. Clone repositori dan masuk ke direktori hasil clone.
3. Pasang dependensi sesuai lockfile, kemudian Chromium.

```powershell
git clone https://github.com/rickopra/rickopra.github.io.git
cd rickopra.github.io
npm ci
npx playwright install chromium
```

4. Jalankan `npm run dev`. Buka URL yang ditampilkan terminal.
5. Jalankan pengujian dari terminal kedua dengan `npm test`.

Di Windows, ganti `npm`/`npx` menjadi `npm.cmd`/`npx.cmd` jika shim PowerShell diblokir execution policy. Tidak perlu melemahkan execution policy komputer.

`npm ci` memakai `package-lock.json`; jangan menghapus lockfile untuk mengatasi error versi. Untuk upgrade paket, ubah secara sengaja, tinjau diff lockfile, lalu jalankan pengujian ulang.

## 3. Perubahan Konten

### Identitas dan Bahasa

- `identity`: nama, email profesional, LinkedIn, GitHub, lokasi.
- `text(en, id)`: pasangan terjemahan bertipe `Localized`.
- `copy`: teks UI dan ringkasan umum.
- `experiences`: periode, jabatan, perusahaan, lokasi, ringkasan, poin kontribusi.
- `capabilities`: kategori kemampuan dan daftar teknologi.

Contoh pola yang sudah dipakai:

```ts
text('View case study', 'Buka studi kasus')
```

Bahasa awal adalah Inggris, kecuali pengunjung pernah memilih Indonesia. CV saat ini hanya bahasa Inggris. Nama teknologi, jabatan, dan beberapa label editorial memang tetap Inggris; versi Indonesia bukan terjemahan seluruh string di aplikasi.

Jangan mengubah riwayat menjadi `Present` tanpa fakta baru. Pendidikan tidak dinyatakan selesai. CyberArk L2 Rolebook tetap proyek pembelajaran mandiri, bukan bukti jabatan atau sertifikasi.

### Menambah Proyek

1. Tambahkan entri `Project` dalam `projects` di `src/content.ts`; isi kedua bahasa.
2. Gunakan `id` unik dan kategori yang tersedia: `infrastructure`, `systems`, atau `governance`.
3. Simpan diagram/foto yang layak publik di `public/assets/<id>.webp`; rasio saat ini `1100:650`.
4. Periksa aksesibilitas gambar, judul, konteks, tantangan, kontribusi, hasil, dan teknologi.
5. Jika ada `link`, gunakan tujuan publik yang benar. Tombol saat ini diberi label source/GitHub; tautan selain repositori memerlukan penyesuaian label dan ikon.
6. Perbarui jumlah filter di `App.tsx`, karena `04`, `02`, dan `01` masih hardcoded.
7. Perbarui tes jumlah proyek dan CV bila relevan.

Jangan memakai screenshot produksi yang berisi IP internal, akun, daftar karyawan, tiket, atau data pelanggan. Diagram yang sekarang dipakai diberi alt text sebagai ilustrasi.

### Menambah Pengalaman

1. Tambahkan atau perbarui entri `experiences`, terbaru di atas.
2. Periksa fakta periode dan batas kewenangan terhadap bukti profesional.
3. Tinjau `Resume()` di `App.tsx`. Ringkasan profil dan selected work masih memiliki paragraf tersendiri.
4. Regenerasi PDF, periksa seluruh halaman.
5. Sesuaikan pemisahan halaman cetak jika urutan berubah: `index === 2` saat ini memulai halaman kedua.

### Data yang Belum Sepenuhnya Terpusat

Angka `500+`, `07`, `24/7`, periode editorial `2021 - 2026`, tahun footer, sejumlah label, metadata SEO, dan teks pada bitmap masih terpisah dari `identity`. Perubahan nama, domain, angka, atau tahun perlu pencarian lintas berkas, bukan hanya edit `content.ts`.

## 4. Aset dan Font

Browser mengambil gambar dan font dari situs sendiri. Tidak ada ketergantungan CDN font atau hotlink gambar.

Script aset bersifat opsional; aset siap pakai sudah di-commit. Untuk regenerasi pada Windows:

```powershell
python -m pip install Pillow
python scripts/prepare-assets.py --portrait "C:\path\to\professional-photo.jpeg"
```

Script menghapus background biru yang terhubung tepi, melakukan crop tetap `(68, 34, 422, height)`, lalu menghasilkan foto WebP, empat diagram, social preview, dan favicon. Ini dibuat khusus untuk foto sumber sebelumnya, bukan penghapus background universal.

**Script menimpa aset yang dihasilkan.** Sebelum menjalankannya, commit aset yang ingin dipertahankan dan pastikan file foto benar. Untuk foto baru, tinjau ukuran, crop, dan kriteria background terlebih dahulu.

Script memakai Arial di `C:/Windows/Fonts`; untuk OS lain perlu penyesuaian sumber font. Node build dan deployment tidak memerlukan Python atau foto pribadi sumber.

Font web berasal dari package Fontsource: Barlow Condensed, DM Sans, IBM Plex Mono. Ikon berasal dari Lucide. Pertahankan lisensi upstream saat mengganti atau mendistribusikan aset.

## 5. Memperbarui PDF

1. Jalankan server dev pada terminal pertama.
2. Pada terminal kedua, jalankan `npm run resume`.
3. Buka `public/ricko-prayudha-cv.pdf`; periksa isi, pemisahan halaman, dan kontak.
4. Jalankan `npm run build` setelah PDF selesai, agar `dist/` berisi PDF baru.
5. Commit PDF bersama perubahan sumbernya.

Jika server memakai port lain:

```powershell
$env:PORTFOLIO_URL = 'http://127.0.0.1:5174'
npm run resume
Remove-Item Env:PORTFOLIO_URL
```

Generator menunggu font selesai dimuat, mencetak A4 dengan margin, dan memberi nomor halaman. Layout cetak dikendalikan `@media print`. PDF saat ini dua halaman. Mengubah CSS atau konten dapat mengubah pagination, jadi jumlah halaman bukan jaminan permanen.

## 6. Interaksi dan Aksesibilitas

- Gunakan elemen semantik untuk navigasi dan tombol. Ikon interaktif memiliki accessible name dan tooltip `title`.
- Native `<dialog>` menangani modal; jangan mengganti dengan overlay visual tanpa fokus, Escape, dan pemulihan fokus.
- Preferensi bahasa/animasi dibungkus `try/catch` agar localStorage yang diblokir tidak merusak halaman.
- `NetworkScene` dimuat terpisah; Three.js berada pada chunk sendiri.
- WebGL gagal dibuat: hero tetap memiliki foto dan bidang CSS. Halaman tidak harus menunggu canvas.
- Loop animasi dihentikan saat tidak diperlukan; cleanup membatalkan frame, observer, listener, dan resource GPU.
- `preserveDrawingBuffer` dipakai untuk pemeriksaan pixel; pertimbangkan dampak performa sebelum memperbesar scene.
- CSS dan Three.js sama-sama harus menghormati pengaturan motion. Jangan hanya menghentikan satu lapisan.

## 7. Pengujian Sebelum Rilis

```powershell
npm test
npm run build
npm audit --omit=dev
```

Playwright memakai dua konfigurasi Chromium: desktop `1440 x 900` dan emulasi iPhone 13. Emulasi perangkat bukan bukti pengujian Safari/iOS asli. Baca ukuran viewport pada laporan, jangan berasumsi ukuran layar perangkat sama dengan viewport browser.

Output lokal tidak di-commit: `.local/screenshots/`, `test-results/`, `playwright-report/`. Saat gagal, screenshot dan trace disimpan sesuai konfigurasi.

Jika port 5173 dipakai layanan yang bukan portfolio, jangan hentikan proses sembarang. Sesuaikan `playwright.config.ts` secara sengaja atau hentikan hanya server portfolio yang dikenal.

`PORTFOLIO_URL` mengubah target tes. Konfigurasi saat ini masih menyiapkan server lokal port 5173 meskipun target URL production; ini keterbatasan setup, bukan syarat GitHub Pages.

Pemeriksaan manual wajib: desktop pendek/lebar, ponsel kecil, kedua bahasa, tab keyboard, Escape modal, CV, email, filter, dan hasil render tanpa overlap. Axe tanpa temuan tidak membuktikan seluruh WCAG terpenuhi.

## 8. Batasan Hosting

Path aset menggunakan `/assets/...` dan `/ricko-prayudha-cv.pdf`. Konfigurasi ini tepat untuk repo user site `rickopra.github.io` pada root domain. Memindahkan ke repo project dengan subpath memerlukan perubahan `base` Vite dan seluruh path absolut terkait.

Jangan menyimpan secret di `.env` yang dibundel, `VITE_*`, source, atau `public/`. Semua hasil build dapat dibaca pengunjung. Website ini tidak memerlukan API key.

Untuk perubahan desain besar, buat branch terpisah, periksa build lokal, dokumentasikan hasil review, baru gabungkan ke `main`. GitHub Pages production tetap memakai `main`; push branch fitur tidak otomatis menjadi preview publik.
