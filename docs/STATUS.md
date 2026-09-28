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
| CV | Salinan byte-persis CV utama pemilik, 4 halaman; verifikasi live rilis ini menyusul deployment. |
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
- Verifikasi workflow dan hash PDF production dicatat setelah deployment.

## 6. Batas Verifikasi

- Screenshot telah dibuat, tetapi inspeksi visual manual belum dapat dikonfirmasi pada sesi ini karena alat penampil gambar tidak menampilkan hasil. Tes geometri/pixel bukan pengganti review tampilan.
- Belum diuji Safari/Firefox, perangkat ponsel fisik, controller fisik, screen reader manual, zoom 200%, jaringan buruk, atau Lighthouse.
- Emulasi iPhone memakai Chromium, bukan Safari. Axe tanpa temuan bukan sertifikasi aksesibilitas.
- Audio diuji melalui sampel sinyal, bukan review kualitas musik dengan mendengarkan langsung.
- Tujuh foto arsip telah melalui pemilihan sumber, OCR redaction, deteksi wajah, dan penghapusan metadata EXIF/XMP. Deteksi otomatis tidak menjamin semua detail privat tertutup; review visual pemilik masih diperlukan. Lihat [EVIDENCE.md](EVIDENCE.md).
- Implementasi menerapkan menu, komposisi, motion, dan audio, tetapi **tidak dinyatakan identik dengan Persona 3 Reload**. Kesetiaan desain memerlukan perbandingan referensi dan review pemilik.

## 7. Pemeliharaan Berikutnya

- CI belum menjalankan Playwright/audit; masih menjadi langkah lokal sebelum push.
- Sebagian metrik dan label website masih berada dalam komponen selain `content.ts`; CV asli terpisah sepenuhnya dari komponen.
- Script diagram bergantung font Windows; script portrait hanya cocok untuk karakteristik background sumber saat ini.
- Filter/proyek aktif belum memiliki URL sendiri. History tersedia untuk layar utama.
- Kegagalan unduh chunk Three.js belum memiliki error boundary khusus; fallback renderer hanya menangani WebGL yang tidak tersedia.
- Layout scrolling `?classic` adalah mode kompatibilitas, bukan target utama penyempurnaan menu. Tes hero pendek versi klasik dari rilis awal tidak menjadi bukti masalah atau perbaikan pada menu baru.

## 8. Checklist Pemilik

- [ ] Foto profil tampil utuh dan sesuai preferensi komposisi.
- [ ] Nama, kontak, periode kerja, dan tanggung jawab seluruh jabatan benar.
- [ ] Lingkup 500+ pengguna, 7 lokasi BGP, dan koordinasi 24/7 tepat.
- [ ] Bukti foto aman dipublikasikan; tidak ada wajah rekan atau informasi organisasi yang perlu disamarkan lagi.
- [ ] Narasi proyek sesuai kontribusi, tidak mengesankan hasil/metrik yang belum terukur.
- [ ] Desain, gerakan, dan musik nyaman di perangkat sehari-hari.
- [ ] CV asli empat halaman terbaca dengan baik; informasi kontak di dalamnya memang boleh publik.

Prosedur publikasi dan pemulihan ada di [DEPLOYMENT.md](DEPLOYMENT.md). Insiden konfigurasi Pages awal tetap dicatat di sana, terpisah dari revisi konten ini.
