# Status, Pengujian, dan Review

Tanggal pemeriksaan: **28 September 2026, Asia/Bangkok**. Timestamp GitHub menggunakan UTC.

## 1. Status Rilis

| Bagian | Status |
| --- | --- |
| Website | https://rickopra.github.io/ |
| Source | https://github.com/rickopra/rickopra.github.io |
| Hosting | GitHub Pages, sumber `workflow`, artifact `dist/`. |
| Baseline menu yang sudah terbit | Commit `119ddf1`, [run 36341173792](https://github.com/rickopra/rickopra.github.io/actions/runs/36341173792), sukses. |
| Revisi foto/pengalaman/bukti | **Live**, commit `c01f4cd`, [run 36369570838](https://github.com/rickopra/rickopra.github.io/actions/runs/36369570838), build dan deploy sukses. |
| CV | **Live**: salinan byte-persis CV utama pemilik, 4 halaman; commit `20b48f4`, [run 36375878536](https://github.com/rickopra/rickopra.github.io/actions/runs/36375878536) sukses. |
| Penyempurnaan Persona / anti-slop | **Live**, commit `e41b195`, [run 36392243909](https://github.com/rickopra/rickopra.github.io/actions/runs/36392243909) sukses. Lokal dan production masing-masing **59 lulus, 1 dilewati, 0 gagal**. |
| Dokumentasi | Flow, implementasi, audio, sumber bukti, desain, riset, deployment, status. |

## 2. Perubahan Revisi

- Foto sumber 853 x 1280 dipertahankan penuh. Crop hardcoded yang memangkas wajah dihapus dari script; profil memakai `contain`, caption ikut tinggi frame.
- Enam jabatan diperinci menjadi kelompok tanggung jawab dan teknologi: 14, 7, 6, 4, 9, dan 2 butir sesuai urutan karier.
- Sembilan studi kasus, termasuk LAN, NOC automation, FTTH planning, wireless, dan fiber dari arsip lama.
- Tujuh foto turunan dengan galeri, sumber halaman, thumbnail, panah, dan tautan ukuran penuh. NOC/FTTH menggunakan diagram yang jelas berlabel ilustratif.
- Pengalaman terhubung langsung ke studi kasus; menutup dialog memulihkan fokus tanpa meninggalkan layar asal.
- CV buatan website diganti CV utama pemilik tanpa mengubah isinya. Jumlah filter dihitung dari data, bukan angka hardcoded.
- Menu Persona-inspired, soundtrack orisinal, animasi, EN/ID, keyboard/gamepad, dan versi klasik tetap tersedia.

## 3. Hasil Lokal Rilis Sebelumnya

Hasil di bawah tercatat sebelum penggantian CV. Verifikasi rilis CV asli dicatat pada bagian tersendiri setelah tes dan deployment selesai.

| Pemeriksaan | Hasil | Cakupan |
| --- | --- | --- |
| `npm test` | **37 lulus, 1 dilewati, 0 gagal** | 38 tes Chromium desktop dan emulasi iPhone 13. |
| Pengecualian tes | Sengaja | Matrix viewport dijalankan sekali pada proyek desktop, tidak diulang pada mobile. |
| `npm run build` | Berhasil | TypeScript dan bundle production Vite. |
| `npm audit --omit=dev` | 0 kerentanan terdeteksi | Dependensi produksi pada waktu pemeriksaan, bukan audit keamanan menyeluruh. |
| Axe | Tidak ada pelanggaran pada aturan yang diuji | Seluruh layar, dialog, dan galeri; WCAG 2 A/AA serta 2.1 AA. |
| Navigasi | Lulus | Hash, deep link layar, history, keyboard, gamepad simulasi, fokus, Escape, skip link. |
| Portrait / pengalaman / proyek | Lulus | Dimensi sumber utuh, caption, enam jabatan, sembilan kasus, filter, galeri, gambar dapat dimuat. |
| Responsif | Lulus pada matrix tes | Menu 320x568 sampai 1920x1080, termasuk lanskap dan tablet, EN/ID; profil/galeri juga 320 px. |
| Audio | Lulus | Senyap sebelum persetujuan, sampel nonzero setelah play, mute, volume tersimpan, reload senyap. |
| WebGL | Lulus | Canvas nonblank, variasi warna, frame bergerak, pause, fallback tanpa WebGL. |
| CV sebelumnya | 3 halaman dengan teks | Sudah diganti CV asli 4 halaman pada rilis ini. |
| Tautan `.md` | Valid | Tidak ada target dokumentasi lokal yang hilang. |

Tes geometri profil membaca elemen dalam frame browser yang sama agar animasi masuk tidak menyebabkan perbandingan koordinat antarframe. Batas assertion tidak dilonggarkan. Screenshot hasil tes disimpan lokal dalam `.local/screenshots/`, tidak di-commit.

## 4. Verifikasi Production Rilis Sebelumnya

Seluruh suite diulang dengan `PORTFOLIO_URL=https://rickopra.github.io`: **37 lulus, 1 dilewati, 0 gagal** pada Chromium desktop dan emulasi ponsel. Cakupan sama dengan suite lokal, termasuk audio, canvas, galeri, portrait, pengalaman, CV, EN/ID, serta aksesibilitas otomatis.

Pemeriksaan tambahan:

- Pages API mengonfirmasi `build_type: workflow`.
- HTML live merujuk bundle `/assets/index-*.js`, bukan `/src/main.tsx`.
- SHA-256 berkas live saat rilis sebelumnya sama dengan lokal untuk portrait, PDF lama, dan ketujuh foto bukti; hash CV asli perlu dicek kembali setelah deployment baru.
- Tidak ada `pageerror` pada skenario semua layar, tidak ada respons aset gagal pada skenario galeri.
- Run aplikasi: [36369570838](https://github.com/rickopra/rickopra.github.io/actions/runs/36369570838), commit `c01f4cd`. Commit dokumentasi sesudahnya tidak mengubah source atau aset aplikasi yang telah diuji.

GitHub memberi peringatan runtime action Node.js 20 yang dipaksa Node.js 24 serta rencana migrasi `ubuntu-latest`; deployment tetap berhasil. Pembaruan versi action perlu dilakukan terpisah dengan pengujian workflow, bukan dinyatakan sudah selesai.

## 5. Penggantian CV Utama

- Sumber `D:\CV Ricko Prayudha.pdf`, salinan `public/ricko-prayudha-cv.pdf`, dan hasil build `dist/ricko-prayudha-cv.pdf`: sama persis, masing-masing 4 halaman. SHA-256: `55adb186dd0f648b029d313da3438dd31f8772ebf95b5038fa7263e956602347`.
- Seluruh tombol CV pada menu, Profile, Experience, Contact, dan mode klasik menunjuk salinan asli. URL lama `/?resume` membuka PDF yang sama. Generator CV lama dihapus; konten CV tidak disunting.
- `npm test`: **45 lulus, 1 dilewati, 0 gagal** (Chromium desktop dan mobile); `npm run build`: berhasil; `npm audit --omit=dev`: 0 kerentanan terdeteksi.
- GitHub Pages [run 36375878536](https://github.com/rickopra/rickopra.github.io/actions/runs/36375878536): build dan deploy sukses untuk commit `20b48f4`.
- PDF live `https://rickopra.github.io/ricko-prayudha-cv.pdf` memberi HTTP 200, `application/pdf`, 113874 byte, SHA-256 cocok persis dengan sumber. Tes live tautan CV, redirect `?resume`, dan mode klasik: **6 lulus, 0 gagal** (Chromium desktop dan mobile).
- Commit dokumentasi setelah rilis tidak mengubah PDF, tautan, atau kode aplikasi.

## 6. Penyempurnaan Persona / Anti-Slop

Riset dan keputusan lengkap: [DESIGN-REVIEW.md](DESIGN-REVIEW.md). Referensi source `blairxu13/persona3-website`, Hallmark, dan Gesso dibaca tanpa mengambil source/aset atau memasang dependensi baru.

- Empat reveal berlapis sesuai layar, menu masuk bertahap, respons panah seleksi, arah kembali yang konsisten. Navigasi tidak menunggu animasi; reduced motion/pause tetap berlaku.
- Detail memakai bidang baca penuh, proyek berupa baris bergaris, pilihan pengalaman memakai potongan diagonal. Tidak ada tambahan kartu bertumpuk, angka rekaan, atau teks pemasaran.
- After Hours 104 BPM dan Blue Current 92 BPM, pilihan lagu tersimpan, tombol next, fade pergantian, empat band meter dari sinyal audio nyata. Tetap senyap sebelum persetujuan dan setelah reload.
- Dashboard setengah wajah, Profile foto utuh, logo RP, isi karier/proyek, serta penghapusan CyberArk dipertahankan. SHA-256 CV sumber, publik, dan build tetap identik: `55adb186dd0f648b029d313da3438dd31f8772ebf95b5038fa7263e956602347`.

| Pemeriksaan lokal revisi ini | Hasil |
| --- | --- |
| `npm test` | **59 lulus, 1 dilewati, 0 gagal**. Chromium desktop dan emulasi iPhone 13; matrix viewport sengaja tidak diulang pada proyek mobile. |
| Cakupan tambahan | Reveal selesai di luar viewport, klik/history cepat, reduced motion, kedua lagu/meter, pilihan tanpa autoplay, kegagalan audio/retry, pembatalan consent tertunda, perpindahan tab, kontrol footer 320 px EN/ID. |
| Regresi | Seluruh suite navigasi, fokus, gamepad simulasi, portrait, karier, studi kasus/galeri, CV asli, EN/ID, axe, dan canvas nonblank/bergerak/pause lulus. |
| `npm run build` | Berhasil. |
| `npm audit --omit=dev` | 0 kerentanan dependensi produksi terdeteksi saat pemeriksaan. |
| `git diff --check` | Tidak ada kesalahan whitespace. Peringatan konversi LF/CRLF berasal dari pengaturan Git Windows. |
| Tautan dokumentasi | 42 tautan lokal dalam 11 dokumen diperiksa; tidak ada target yang hilang. |
| Screenshot | Desktop/mobile dan frame tengah transisi dibuat di `.local/screenshots/`; penampil gambar belum mengembalikan hasil yang dapat ditinjau. |

Verifikasi production revisi ini:

- GitHub Pages [run 36392243909](https://github.com/rickopra/rickopra.github.io/actions/runs/36392243909), commit `e41b1957714db3360ec10fe37fa93af46efb6cb9`: job build dan deploy sukses. Deploy selesai `2026-09-28T07:33:43Z`.
- Seluruh suite dijalankan ulang dengan `PORTFOLIO_URL=https://rickopra.github.io`: **59 lulus, 1 dilewati, 0 gagal**, 1,9 menit. Pengecualian sama dengan tes lokal; bukan kegagalan yang dilewati.
- Browser live memuat `/assets/index-6i2IAEf6.js`, dua pilihan musik, serta reveal baru. SHA-256 bundle live sama dengan build lokal: `00cd98961318aa572e1af9087a2f2bfbea09aa734b90c6be20fe892c72ddd1db`.
- PDF live: HTTP 200, `application/pdf`, 113874 byte; SHA-256 tetap identik dengan CV utama. Kedua portrait live juga cocok dengan aset lokal; dashboard tetap crop menu, Profile tetap foto utuh.
- Hasil otomatis tidak menggantikan review estetika atau pendengaran manual. Commit dokumentasi sesudah rilis ini tidak mengubah source/aset aplikasi yang diuji.

## 7. Penambahan Kontak Sosial

- Contact Persona dan versi klasik memakai tautan Instagram `@rickoprayudha`, X `@rickopra`, serta Facebook "Ricko Prayudha". Email, LinkedIn, GitHub, dan unduhan CV tetap tersedia.
- Facebook sementara menuju pencarian orang, bukan URL profil yang sudah terverifikasi. Label "Find profile" / "Cari profil" membedakan tujuan ini; pemilik perlu memberi URL profil unik untuk menggantinya.
- `SocialLinks.tsx` menjaga label dan tujuan kedua tampilan konsisten. Semua tautan eksternal menggunakan tab baru dengan `noopener noreferrer`. Tidak ada embed atau pelacak sosial.
- Lokal: **4 tes kontak sosial lulus** pada Chromium desktop/mobile, EN/ID, viewport awal/tablet/320 px, tujuan tautan, fokus, tab baru tanpa opener, geometri teks, dan axe. **10 tes regresi terpilih lulus** untuk CV asli, rute/menu/portrait, kontak/clipboard, mode klasik, dan aksesibilitas semua layar/dialog. Ini bukan pengulangan seluruh suite.
- `npm run build` berhasil. Hash CV sumber, publik, dan build tetap sama seperti bagian CV utama. Screenshot kontak dibuat; batas inspeksi visual manual tetap berlaku.
- Deployment dan verifikasi live revisi kontak ini belum dicatat selesai.

## 8. Batas Verifikasi

- Screenshot telah dibuat, tetapi inspeksi visual manual belum dapat dikonfirmasi pada sesi ini karena alat penampil gambar tidak menampilkan hasil. Tes geometri/pixel bukan pengganti review tampilan.
- Belum diuji Safari/Firefox, perangkat ponsel fisik, controller fisik, screen reader manual, zoom 200%, jaringan buruk, atau Lighthouse.
- Emulasi iPhone memakai Chromium, bukan Safari. Axe tanpa temuan bukan sertifikasi aksesibilitas.
- Audio diuji melalui sampel sinyal, bukan review kualitas musik dengan mendengarkan langsung.
- Tujuh foto arsip telah melalui pemilihan sumber, OCR redaction, deteksi wajah, dan penghapusan metadata EXIF/XMP. Deteksi otomatis tidak menjamin semua detail privat tertutup; review visual pemilik masih diperlukan. Lihat [EVIDENCE.md](EVIDENCE.md).
- Implementasi menerapkan menu, komposisi, motion, dan audio, tetapi **tidak dinyatakan identik dengan Persona 3 Reload**. Kesetiaan desain memerlukan perbandingan referensi dan review pemilik.

## 9. Pemeliharaan Berikutnya

- CI belum menjalankan Playwright/audit; masih menjadi langkah lokal sebelum push.
- Sebagian metrik dan label website masih berada dalam komponen selain `content.ts`; CV asli terpisah sepenuhnya dari komponen.
- Script diagram bergantung font Windows; script portrait hanya cocok untuk karakteristik background sumber saat ini.
- Filter/proyek aktif belum memiliki URL sendiri. History tersedia untuk layar utama.
- Kegagalan unduh chunk Three.js belum memiliki error boundary khusus; fallback renderer hanya menangani WebGL yang tidak tersedia.
- Layout scrolling `?classic` adalah mode kompatibilitas, bukan target utama penyempurnaan menu. Tes hero pendek versi klasik dari rilis awal tidak menjadi bukti masalah atau perbaikan pada menu baru.

## 10. Checklist Pemilik

- [ ] Foto profil tampil utuh dan sesuai preferensi komposisi.
- [ ] Nama, kontak, periode kerja, dan tanggung jawab seluruh jabatan benar.
- [ ] Lingkup 500+ pengguna, 7 lokasi BGP, dan koordinasi 24/7 tepat.
- [ ] Bukti foto aman dipublikasikan; tidak ada wajah rekan atau informasi organisasi yang perlu disamarkan lagi.
- [ ] Narasi proyek sesuai kontribusi, tidak mengesankan hasil/metrik yang belum terukur.
- [ ] Desain, gerakan, dan musik nyaman di perangkat sehari-hari.
- [ ] CV asli empat halaman terbaca dengan baik; informasi kontak di dalamnya memang boleh publik.

Prosedur publikasi dan pemulihan ada di [DEPLOYMENT.md](DEPLOYMENT.md). Insiden konfigurasi Pages awal tetap dicatat di sana, terpisah dari revisi konten ini.
