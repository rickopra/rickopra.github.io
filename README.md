# Ricko Prayudha | Professional Portfolio

Portfolio profesional berbasis menu dengan referensi visual Persona 3 Reload. Identitas dan pengalaman Ricko tetap menjadi isi utama: IT operations, infrastruktur, jaringan, sistem internal, dan governance.

- Website: https://rickopra.github.io/
- Repositori: https://github.com/rickopra/rickopra.github.io
- CV publik: https://rickopra.github.io/ricko-prayudha-cv.pdf
- Versi klasik: https://rickopra.github.io/?classic

## Pengalaman Website

Menu layar penuh, tipografi diagonal, portrait, highlight pilihan, transisi berlapis sesuai layar, animasi refleksi Three.js, dan dua musik instrumental orisinal: **After Hours** serta **Blue Current**. Enam menu membuka profil, studi kasus, pengalaman, kapabilitas, kontak, dan kredit. Bahasa EN/ID, CV PDF, filter proyek, serta modal studi kasus tersedia.

Musik dimulai hanya setelah tombol speaker ditekan. Pilihan lagu dan volume tersimpan; status putar tidak tersimpan. Meter membaca sinyal audio nyata. Animasi mengikuti preferensi reduced motion sistem dan dapat dijeda. Navigasi menerima mouse, sentuhan, keyboard, dan gamepad standar yang dideteksi browser.

Ini adaptasi independen, **bukan salinan persis game atau situs referensi**, bukan produk ATLUS/SEGA. Tidak ada source, video, karakter, atau rekaman OST yang diekstrak dari karya tersebut. Acuan web yang diberikan pemilik: [listing karya](https://karya.smkn1bawang.sch.id/karya/persona-3-1776145951), [demo langsung](https://persona3.fayq.my.id/).

## Dokumentasi

| Dokumen | Isi |
| --- | --- |
| [FLOW.md](docs/FLOW.md) | Diagram pengunjung, navigasi, state, audio, CV, dan rilis. |
| [IMPLEMENTATION.md](docs/IMPLEMENTATION.md) | Arsitektur, setup, perubahan konten, aset, rute, pengujian. |
| [PERSONA-3-RELOAD.md](docs/PERSONA-3-RELOAD.md) | Riset referensi, pemetaan desain, implementasi, batas kesetiaan. |
| [DESIGN-REVIEW.md](docs/DESIGN-REVIEW.md) | Riset repo blairxu13, kritik anti-slop, keputusan perubahan, invariants, alur baru. |
| [AUDIO.md](docs/AUDIO.md) | Komposisi, Web Audio, lifecycle, volume, dan hak penggunaan. |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | GitHub Pages, publikasi, verifikasi, pemulihan. |
| [RESEARCH.md](docs/RESEARCH.md) | Sumber riset, fakta profesional, batas publikasi. |
| [EVIDENCE.md](docs/EVIDENCE.md) | Pemetaan arsip lama, bukti proyek, kurasi, dan pembaruan konten. |
| [LOGO.md](docs/LOGO.md) | Filosofi identitas RP, warna, master vektor, ekspor favicon, aturan pemakaian. |
| [STATUS.md](docs/STATUS.md) | Hasil tes, catatan rilis, keterbatasan, checklist pemilik. |

## Menjalankan Lokal

Node.js 24 dan npm, dari root repositori:

```powershell
npm ci
npx playwright install chromium
npm run dev
```

Buka URL Vite, biasanya `http://127.0.0.1:5173/`. Jika port dipakai aplikasi lain, gunakan `npm run dev -- --port 5174`. Di Windows, gunakan `npm.cmd`/`npx.cmd` apabila execution policy memblokir shim PowerShell.

```powershell
npm test
npm run build
npm audit --omit=dev
```

Build menghasilkan `dist/` dan menyalin `public/ricko-prayudha-cv.pdf` tanpa mengubah isinya. CV ini salinan byte-persis dari dokumen utama pemilik `D:\CV Ricko Prayudha.pdf`; jangan sunting atau buat ulang isinya. Prosedur penggantian: [IMPLEMENTATION.md](docs/IMPLEMENTATION.md).

## Publikasi

Push `main` memicu `.github/workflows/deploy.yml`. Sumber GitHub Pages wajib **GitHub Actions**, artifact **`dist/`**. Workflow menjalankan install/build/deploy; tes dan audit dilakukan sebelum rilis. Jangan menyatakan deployment selesai hanya berdasarkan HTTP 200: periksa aplikasi dan hash PDF live.

## Teknologi dan Privasi

React 19, TypeScript, Vite 7, Three.js, Web Audio, Lucide, Fontsource, Playwright, axe-core. Tidak ada backend, analytics, atau formulir pengiriman data. Font, foto, diagram, dan PDF di-host lokal. Sembilan studi kasus mencakup tujuh foto bukti dari arsip pemilik; diagram tetap diberi label ilustratif. Enam posisi dijelaskan per bidang tanggung jawab, terhubung ke studi kasus terkait. **CV asli yang diminta pemilik untuk dipublikasikan memuat nomor telepon**; arsip privat lain, kredensial, dan konfigurasi jaringan mentah tetap tidak dipublikasikan.
