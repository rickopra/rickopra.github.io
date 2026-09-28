# Panduan Implementasi

Untuk melanjutkan pengembangan tanpa menebak struktur, mulai dari [FLOW.md](FLOW.md), lalu panduan ini. Status aktual dan pekerjaan tertunda ada di [STATUS.md](STATUS.md).

## 1. Arsitektur

Website statis berbasis React dan TypeScript, dibundel oleh Vite. GitHub Pages tidak menjalankan Node.js, database, atau API aplikasi. Node.js hanya digunakan saat pengembangan dan build.

| Lokasi | Tanggung jawab |
| --- | --- |
| `index.html` | Root React, judul, SEO, Open Graph, favicon, fallback `noscript`. |
| `src/main.tsx` | Alihkan `?resume` ke PDF asli; selain itu mount React, Strict Mode, import font lokal dan CSS. |
| `src/content.ts` | Identitas, teks EN/ID, proyek, pengalaman, kapabilitas. |
| `src/App.tsx` | Pemilih mode aplikasi, versi klasik, `ProjectDialog`, dan `EvidenceGallery`. |
| `src/PersonaPortfolio.tsx` | Pengalaman utama: menu, layar hash, state, input, integrasi audio. |
| `src/SocialLinks.tsx` | Tautan Instagram, Facebook, dan X yang digunakan bersama oleh Contact Persona dan versi klasik. |
| `src/TideScene.tsx`, `src/persona.css` | Refleksi Three.js dan komposisi menu/detail bergaya Persona. |
| `src/audio.ts` | Musik sintetis orisinal dan cue interaksi melalui Web Audio. |
| `src/SoundDeck.tsx` | Pilihan lagu, next, volume, mute, meter analyser, penghentian RAF saat tersembunyi. |
| `src/ScreenTransition.tsx` | Pemetaan rute ke empat reveal; tanpa antrean atau penundaan navigasi. |
| `src/NetworkScene.tsx` | Scene dekoratif Three.js, pointer, resize, visibilitas, cleanup. |
| `src/styles.css` | Layout, token warna/font, breakpoint, animasi, reduced motion, print. |
| `public/assets/` | Foto, diagram ilustratif, social preview, favicon. |
| `public/ricko-prayudha-cv.pdf` | Salinan byte-persis CV utama pemilik; semua tautan unduh memakai berkas ini. |
| `public/robots.txt`, `public/sitemap.xml` | Metadata crawler untuk domain saat ini. |
| `scripts/prepare-assets.py` | Pengolahan foto dan pembuatan diagram raster deterministik. |
| `scripts/curate-archive.py` | Preview/ekstraksi arsip privat ke `.local`, ekspor foto pilihan dengan redaksi. |
| `scripts/prepare-legacy-diagrams.py` | Diagram proses NOC dan FTTH tanpa konfigurasi jaringan asli. |
| `tests/portfolio.spec.ts` | Tes fungsional, responsive, WebGL, preferensi, dan axe-core. |
| `tests/enhancements.spec.ts` | Transisi nonblocking, reduced motion, dua lagu, meter nyata, audio ditolak/pending, footer 320 px. |
| `tests/social-links.spec.ts` | Tujuan sosial, EN/ID, tab baru tanpa opener, geometri 320 px/tablet/desktop, axe pada kedua tampilan. |
| `playwright.config.ts` | Browser Chromium, desktop/mobile, server lokal, trace. |
| `.github/workflows/deploy.yml` | Build dan publikasi artifact `dist/` ke Pages. |

`src/main.tsx` mengalihkan `?resume` ke `/ricko-prayudha-cv.pdf`. `App()` memilih portfolio klasik untuk `?classic`, selain itu `PersonaPortfolio`. Versi utama menggunakan layar berdasarkan hash, bukan scroll anchor. Refresh `/#work` dan `/?resume` tetap dilayani root GitHub Pages. Folder `.local` diabaikan Git dan watcher Vite karena berisi bahan privat serta alat kurasi lokal.

Keputusan penyempurnaan Persona/anti-slop tercatat di [DESIGN-REVIEW.md](DESIGN-REVIEW.md). Tidak ada tambahan paket animasi atau audio; reveal memakai CSS, musik tetap Web Audio. Detail memakai bidang baca penuh, bukan panel bershadow bertingkat.

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

- `identity`: nama, email profesional, LinkedIn, GitHub, Instagram, X, profil Facebook, lokasi.
- `text(en, id)`: pasangan terjemahan bertipe `Localized`.
- `copy`: teks UI dan ringkasan umum.
- `careerRecords`: periode, jabatan, perusahaan, lokasi, ringkasan, kelompok `sections`, `tools`, dan `projectIds`.
- `experiences`: hasil pemetaan `careerRecords`; `points` diturunkan dari `sections` untuk tampilan klasik, tidak diedit terpisah.
- `capabilities`: kategori kemampuan dan daftar teknologi.

Contoh pola yang sudah dipakai:

```ts
text('View case study', 'Buka studi kasus')
```

Bahasa awal adalah Inggris, kecuali pengunjung pernah memilih Indonesia. CV saat ini hanya bahasa Inggris. Nama teknologi, jabatan, dan beberapa label editorial memang tetap Inggris; versi Indonesia bukan terjemahan seluruh string di aplikasi.

Jangan mengubah riwayat menjadi `Present` tanpa fakta baru. Pendidikan tidak dinyatakan selesai. Jangan menampilkan teknologi sebagai kemampuan atau pengalaman profesional tanpa konfirmasi pemilik dan bukti yang sesuai.

### Kontak Sosial

Instagram `@rickoprayudha`, X `@rickopra`, serta URL Facebook `https://web.facebook.com/ricko.prayudha` diberikan pemilik. `SocialLinks.tsx` dipakai oleh Contact Persona dan klasik: tampilkan satu label platform tanpa subteks. Tujuan profil disimpan di `identity` (`instagram`, `x`, `facebook`), bukan pencarian nama. Semua tautan eksternal membuka profil langsung di tab baru dengan `noopener noreferrer`; tidak ada embed atau pelacak media sosial. Tes `tests/social-links.spec.ts` memeriksa label, ketiadaan subteks, URL, serta navigasi tab baru untuk ketiganya. CV asli tidak diubah oleh pembaruan kontak website.

### Menambah Proyek

1. Tambahkan entri `Project` dalam `projects` di `src/content.ts`; isi kedua bahasa.
2. Gunakan `id` unik dan kategori yang tersedia: `infrastructure`, `systems`, atau `governance`.
3. Diagram default memakai `public/assets/<id>.webp` berukuran `1100 x 650`. Foto memakai `cover: ProjectImage` dengan ukuran asli, caption, alt EN/ID, jenis, dan provenance. `projectCover()` menyamakan akses kedua bentuk tersebut.
4. Periksa aksesibilitas gambar, judul, konteks, tantangan, kontribusi, hasil, dan teknologi.
5. Jika ada `link`, gunakan tujuan publik yang benar. Tombol saat ini diberi label source/GitHub; tautan selain repositori memerlukan penyesuaian label dan ikon.
6. Isi `evidence: ProjectImage[]` untuk galeri foto. Jumlah filter kedua mode dihitung dari data; tidak perlu mengedit angka UI.
7. Perbarui tes jumlah proyek bila relevan; CV asli tidak berubah saat proyek berubah.

Jangan memakai screenshot produksi yang berisi IP internal, akun, daftar karyawan, tiket, atau data pelanggan. Diagram memiliki caption rekonstruksi; foto memiliki caption arsip dan nomor halaman sumber. Galeri menyediakan thumbnail, sebelum/berikutnya, serta tautan gambar penuh. Detail kurasi: [EVIDENCE.md](EVIDENCE.md).

### Menambah Pengalaman

1. Tambahkan atau perbarui `careerRecords`, terbaru di atas. Gunakan kelompok tanggung jawab di `sections`, bukan satu paragraf panjang.
2. Periksa fakta periode dan batas kewenangan terhadap bukti profesional.
3. Periksa kedua tampilan website, EN/ID, dan tautan pengalaman terkait. CV utama adalah dokumen pemilik yang terpisah; jangan mengubah isi atau mengganti PDF tanpa versi baru dari pemilik.

### Data yang Belum Sepenuhnya Terpusat

Angka `500+`, `07`, `24/7`, periode editorial `2021 - 2026`, tahun footer, sejumlah label, metadata SEO, dan teks pada bitmap masih terpisah dari `identity`. Perubahan nama, domain, angka, atau tahun perlu pencarian lintas berkas, bukan hanya edit `content.ts`.

## 4. Aset dan Font

Browser mengambil gambar dan font dari situs sendiri. Tidak ada ketergantungan CDN font atau hotlink gambar.

Portrait dashboard dan Profile sengaja memakai aset terpisah:

- `public/assets/ricko-portrait-menu.webp` (354 x 1246): crop wajah sebagian dari desain awal yang disetujui, dipulihkan persis dari commit `119ddf1`. Dipakai dashboard dan mask `.portrait-echo`. Pertahankan crop, posisi, ukuran tampilan, serta animasi dashboard saat mengubah Profile.
- `public/assets/ricko-portrait.webp` (853 x 1280): foto utuh untuk Profile dan versi klasik. Script `prepare-assets.py` hanya meregenerasi portrait ini; tidak menulis aset dashboard.

### Aksen Iris Dashboard

`public/assets/ricko-iris-menu.png` adalah lapisan transparan 354 x 1246; hanya 200 pixel iris memiliki alpha. Batas berwarna adalah x=290..313, y=468..481 pada koordinat aset dashboard. Mask mengikuti bagian iris yang terlihat, menyisakan pupil gelap, tidak mewarnai putih mata, kelopak, atau kacamata. Tekstur warna berasal dari luminance foto, bukan regenerasi wajah.

Flow render: portrait asli + filter monokrom, lalu aksen iris tanpa filter melalui `.portrait-stage::after`. Pseudo-element hanya terlihat dalam `.at-menu`; halaman Profile, layar detail lain, dan mode klasik tidak mendapat aksen. `--portrait-height` menyamakan ukuran gambar dan lapisan di seluruh breakpoint; posisi flex serta `portrait-float` memakai koordinat dan waktu animasi yang sama. Pause/reduced motion berlaku pada keduanya. Jangan memindahkan lapisan ke dalam filter grayscale atau `mix-blend-mode:luminosity`, karena warna biru akan hilang.

Regenerasi opsional: `python scripts/prepare-menu-iris.py` dengan Pillow. Script hanya menimpa PNG aksen, tidak mengubah kedua portrait asli. Hash sumber diperiksa sebelum mask dipakai; bila portrait dashboard diganti, script sengaja berhenti sampai koordinat mask dikalibrasi ulang. Jangan hanya mengganti hash tanpa memeriksa posisi mata. Python tidak diperlukan saat build/deploy.

Tes khusus: `npm test -- tests/portrait-iris.spec.ts`. Cakupan: hash kedua foto asli, transparansi di luar iris/pupil, keselarasan tujuh viewport, waktu animasi, pause/reduced motion, batas dashboard, serta selisih screenshot yang hanya berada pada area mata. Screenshot tersedia di `.local/screenshots/*-blue-iris.png`. Tetap periksa estetika dan posisi mask secara visual sebelum mengubah koordinat.

Logo RP memakai master `public/assets/rp-logo.svg` (ikon biru) dan `public/assets/rp-monogram.svg` (transparan untuk latar terang). `npm run logo` mengekspor favicon PNG 16/32/64 px, ikon layar beranda 180 px, dan versi 512 px. Sumber, filosofi, palet, dan aturan penggunaan ada di [LOGO.md](LOGO.md). Tidak ada perubahan tampilan header/menu dashboard karena monogram awalnya diminta untuk favicon.

Script aset bersifat opsional; aset siap pakai sudah di-commit. Untuk regenerasi pada Windows:

```powershell
python -m pip install Pillow
python scripts/prepare-assets.py --portrait "C:\path\to\professional-photo.jpeg" --portrait-only
```

Script menerapkan orientasi EXIF, menghapus background biru yang terhubung tepi, serta mempertahankan seluruh ukuran foto. Crop hardcoded dihapus karena memotong wajah pada sumber 853 x 1280. `--portrait-only` hanya menulis portrait. Tanpa flag tersebut, script juga menghasilkan empat diagram dan social preview. Favicon hanya dihasilkan lewat `npm run logo`. Ini bukan penghapus background universal: periksa hasil sebelum rilis.

**Script menimpa aset yang dihasilkan.** Sebelum menjalankannya, commit aset yang ingin dipertahankan dan pastikan file foto benar. Untuk foto baru, tinjau ukuran, crop, dan kriteria background terlebih dahulu.

Script memakai Arial di `C:/Windows/Fonts`; untuk OS lain perlu penyesuaian sumber font. Node build dan deployment tidak memerlukan Python atau foto pribadi sumber.

Font web berasal dari package Fontsource: Anton, Barlow Condensed, DM Sans, IBM Plex Mono. Ikon berasal dari Lucide. Pertahankan lisensi upstream saat mengganti atau mendistribusikan aset.

## 5. Memperbarui PDF

CV utama saat ini `D:\CV Ricko Prayudha.pdf` (4 halaman); salinan publik harus identik byte-per-byte. Jangan menyunting PDF, membuatnya ulang dari `content.ts`, atau menggunakan generator HTML. Saat pemilik menyediakan CV utama baru:

1. Pastikan pemilik bermaksud memublikasikan seluruh isi dokumen, termasuk informasi kontaknya.
2. Salin dokumen baru byte-persis ke `public/ricko-prayudha-cv.pdf` tanpa transformasi.
3. Cocokkan hash sumber, salinan, dan hasil build. Periksa jumlah halaman serta semua tautan unduh.
4. Jalankan tes, build, audit; commit PDF baru; push; cocokkan hash PDF live.

Contoh verifikasi pada Windows:

```powershell
Get-FileHash -Algorithm SHA256 'D:\CV Ricko Prayudha.pdf'
Get-FileHash -Algorithm SHA256 'public/ricko-prayudha-cv.pdf'
npm run build
Get-FileHash -Algorithm SHA256 'dist/ricko-prayudha-cv.pdf'
```

Ketiga hash harus cocok. SHA-256 CV saat ini: `55adb186dd0f648b029d313da3438dd31f8772ebf95b5038fa7263e956602347`. Jika CV utama berubah, perbarui hash tetap pada tes dan dokumentasi. `/?resume` membuka PDF tersebut, bukan halaman cetak.

## 6. Interaksi dan Aksesibilitas

- Gunakan elemen semantik untuk navigasi dan tombol. Ikon interaktif memiliki accessible name dan tooltip `title`.
- Native `<dialog>` menangani modal; jangan mengganti dengan overlay visual tanpa fokus, Escape, dan pemulihan fokus.
- Preferensi bahasa/animasi dibungkus `try/catch` agar localStorage yang diblokir tidak merusak halaman.
- `TideScene` dimuat terpisah pada versi utama; `NetworkScene` hanya untuk klasik. Three.js berada pada chunk sendiri.
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
