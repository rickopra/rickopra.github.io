# Status, Pengujian, dan Review

Tanggal pemeriksaan: **28 September 2026, Asia/Bangkok**. GitHub menampilkan sebagian timestamp sebagai 27 September karena menggunakan UTC.

## 1. Status Singkat

| Bagian | Status |
| --- | --- |
| Website | Live: https://rickopra.github.io/ |
| Source | https://github.com/rickopra/rickopra.github.io |
| Hosting | GitHub Pages, sumber `workflow`, hasil build `dist/`. |
| Desain | Versi awal tersedia untuk review; belum sama persis dengan Persona 3 Reload. |
| Revisi visual | Ditahan selama pemilik memeriksa versi live. |
| Dokumentasi | Alur, implementasi, deployment, riset, rencana desain, dan status tersedia. |
| CV | PDF publik dua halaman, dibuat terpisah dari dokumen sumber pribadi. |
| Tes lokal | 13 lulus, 1 gagal; bukan seluruhnya hijau. |

Perbaikan hosting tidak mengubah CSS, konten karier, atau layout aplikasi. Pembaruan dokumentasi juga tidak mengubah tampilan versi yang sedang direview.

## 2. Verifikasi yang Sudah Dilakukan

| Pemeriksaan | Hasil | Cakupan |
| --- | --- | --- |
| `npm run build` | Berhasil | TypeScript dan bundle Vite production. |
| `npm audit --omit=dev` | 0 kerentanan terdeteksi | Dependensi produksi pada waktu pemeriksaan, bukan jaminan keamanan menyeluruh. |
| `npm test` | 13/14 lulus | Chromium desktop dan emulasi ponsel. |
| Axe di halaman dan modal | Lulus pada kedua konfigurasi | Aturan WCAG 2 A/AA dan 2.1 AA yang diuji otomatis. |
| Filter, modal, Escape, pemulihan fokus | Lulus | Desktop dan ponsel. |
| Bahasa dan persistensi motion | Lulus | EN/ID, reload, preferensi lokal. |
| Reduced motion dan kegagalan storage | Lulus | Halaman tetap dapat digunakan tanpa storage. |
| WebGL, perubahan frame, pause | Lulus | Pixel canvas tidak kosong, animasi berjalan lalu berhenti. |
| Navigasi dan detail pengalaman | Lulus | Anchor, disclosure, target tautan kontak. |
| Uji langsung situs production | Berhasil | Halaman, WebGL, modal ATLAS, EN/ID, PDF; tanpa pageerror atau response HTTP gagal pada skenario yang diuji. |

Uji production memakai viewport desktop 1440 x 900 dan ponsel 390 x 664. Canvas menghasilkan pixel nontransparan pada keduanya; jumlah pixel bergantung frame dan viewport, bukan metrik visual yang harus dipertahankan.

HTML live kini merujuk asset JavaScript dan CSS hasil build. Tidak lagi merujuk `/src/main.tsx`. CV live berstatus HTTP 200 dan memiliki signature `%PDF`.

Run pemulihan hosting: [36338090845](https://github.com/rickopra/rickopra.github.io/actions/runs/36338090845), sukses. Commit source aplikasi saat pemulihan: `636f264`.

## 3. Masalah yang Masih Terbuka

### Hero pada Viewport Pendek

- Ponsel `390 x 664`: `.stats-band` mulai pada y=765, di bawah viewport. Ini penyebab satu tes Playwright gagal.
- Ponsel `320 x 568`: hasil pengukuran juga menunjukkan awal stats y=765. Pengunjung harus scroll lebih jauh sebelum melihat konten berikutnya.
- Desktop `1440 x 720`: batas hero y=646, sementara bagian bawah `.hero-actions` sekitar y=667. Dengan `overflow:hidden`, bagian CTA berisiko terpotong.
- Ponsel `390 x 844` dan desktop `1920 x 1080`: stats mulai sebelum akhir viewport dalam pemeriksaan yang sama.

Prioritas berikutnya: ubah komposisi/spacing pada viewport pendek, jangan sekadar menghapus assertion tes. Uji kedua bahasa dan zoom setelah perbaikan. Masalah ini sengaja belum diubah selama review visual pemilik.

### Kesetiaan Desain Persona 3 Reload

Versi sekarang baru menggunakan sebagian pengaruh visual, masih berupa layout portfolio scrolling. Sistem menu, komposisi layar, keadaan pilihan, dan transisi menyeluruh belum disamakan dengan referensi final game. Rencana dan kriteria penerimaan ada di [PERSONA-3-RELOAD.md](PERSONA-3-RELOAD.md).

### Pemeliharaan

- PDF belum otomatis diregenerasi oleh CI.
- Workflow deploy belum menjalankan Playwright atau audit.
- Jumlah filter, beberapa label/tahun, metrik, serta paragraf CV tertentu belum terpusat seluruhnya dalam data.
- Script aset bergantung pada font Windows dan crop khusus foto sumber.
- Belum ada URL untuk filter atau proyek yang dipilih.
- Kegagalan import chunk Three.js akibat jaringan belum memiliki error boundary khusus.

## 4. Batas Pengujian

Belum ada bukti tes browser Safari/Firefox, perangkat ponsel fisik, pembaca layar manual, kondisi jaringan buruk, atau audit performa Lighthouse. Emulasi iPhone menggunakan Chromium, bukan Safari. Pemeriksaan axe bukan sertifikasi aksesibilitas.

Fallback WebGL dan clipboard failure tersedia dalam kode, tetapi belum memiliki tes regresi khusus. Pengujian pixel membuktikan canvas terisi, bukan membuktikan kesamaan dengan game. Kesetiaan desain memerlukan review referensi dan gerakan oleh pemilik.

## 5. Checklist Review Pemilik

- [ ] Identitas, foto, email, LinkedIn, GitHub benar.
- [ ] Periode ATI berakhir Agustus 2026 sesuai CV terbaru.
- [ ] Metrik 500+ pengguna, 7 lokasi, dan koordinasi 24/7 sesuai lingkup kerja.
- [ ] Isi ATLAS, SHIFT/CHECKLIST, infrastruktur, dan governance akurat.
- [ ] Tidak ada informasi internal yang seharusnya privat.
- [ ] Isi CV unduhan dan status pendidikan benar.
- [ ] Pilihan bahasa memenuhi kebutuhan HR yang dituju.
- [ ] Bagian versi awal yang perlu dipertahankan sudah ditentukan.
- [ ] Layar final Persona 3 Reload yang menjadi acuan sudah ditetapkan.
- [ ] Feedback komposisi, menu, animasi, desktop, dan ponsel sudah terkumpul.

## 6. Prosedur Melanjutkan

1. Selesaikan review versi live sebelum mengganti desain production.
2. Catat feedback dan referensi yang disetujui pada dokumen desain.
3. Buat branch revisi; perbaiki masalah viewport bersama perubahan komposisi.
4. Perbarui konten/CV hanya bila ada fakta atau arahan baru.
5. Jalankan pengujian, tinjau screenshot dan gerakan, perbarui tabel hasil di dokumen ini.
6. Setelah review selesai, gabungkan perubahan dan deploy; verifikasi hasil live, bukan hanya workflow.

## 7. Riwayat Singkat

| Tanggal | Perubahan |
| --- | --- |
| 27-28 September 2026 | Riset sumber, kurasi fakta profesional, pembuatan versi awal, PDF publik, dan push repositori. |
| 28 September 2026 | Ditemukan Pages legacy menayangkan source walaupun workflow berhasil; diubah ke workflow lalu diverifikasi ulang. |
| 28 September 2026 | Desain dibekukan untuk review pemilik; dokumentasi operasional dan rencana revisi ditambahkan. |
