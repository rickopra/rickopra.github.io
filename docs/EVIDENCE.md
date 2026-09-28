# Sumber dan Kurasi Bukti Proyek

Pembaruan: 28 September 2026. Data profesional di `src/content.ts` bersumber dari CV terbaru dan portfolio lama milik Ricko. Dokumen sumber tetap lokal; repositori hanya berisi ringkasan profesional, aset turunan terpilih, dan CV publik yang dibuat ulang.

## 1. Sumber dan Prioritas

| Sumber | Penggunaan | Batas |
| --- | --- | --- |
| CV terbaru, 4 halaman | Jabatan, periode, tanggung jawab, teknologi | Periode terbaru mengalahkan tulisan `Present` pada arsip lama. |
| Portfolio lama, 63 halaman | Lingkup LAN, NOC, FTTH, wireless, fiber, foto lapangan | Mendukung riwayat pekerjaan, bukan verifikasi independen atas hasil atau metrik. |
| Materi governance milik pemilik | PCI DSS SAQ 2024/2025, pemilik risiko, audit internal | Bukan klaim auditor sertifikasi eksternal atau anggota komite pengarah ISMS. |
| Repositori ATLAS publik | Konteks implementasi sistem aset | Tidak memublikasikan database atau data operasional. |

ATI Supervisor berakhir Agustus 2026. Pendidikan tetap dinyatakan belum selesai. ISO 27001 pada pekerjaan server-room Mandiangin tidak disamakan dengan keanggotaan ISMS. Tidak ditambahkan angka uptime, penghematan, atau jumlah pelanggan yang tidak didukung sumber.

## 2. Peta Arsip Lama

Nomor halaman berikut memakai urutan PDF mulai dari 1, bukan nomor internal slide. Nomor gambar adalah urutan gambar embedded yang diekstrak script.

| Proyek / ID | Halaman | Bukti publik |
| --- | --- | --- |
| LAN reconstruction / `lan` | 5-17 | `lan-equipment-1.webp`, `lan-equipment-2.webp`: halaman 6, gambar 1 dan 2. |
| NOC automation / `noc` | 18-24 | Diagram proses rekonstruksi; screenshot router dan script asli tetap privat. |
| FTTH planning / `ftth` | 25-35 | Diagram alur rekonstruksi; peta, rute geografis, koordinat tetap privat. |
| Wireless links / `wireless` | 36-52 | `wireless-field-1.webp`: halaman 47; `wireless-field-2.webp`: halaman 48; masing-masing gambar 1. |
| Fiber-optic delivery / `fiber` | 53-63 | `fiber-field-1/2/3.webp`: halaman 55/57/61, masing-masing gambar 1. |

Tujuh foto berada di `public/assets/evidence/`. NOC dan FTTH memakai `public/assets/noc.webp` dan `ftth.webp`. Diagram diberi caption **ilustratif**, bukan screenshot produksi atau topologi jaringan aktif.

Empat studi kasus sebelumnya tetap tersedia: enterprise infrastructure, ATLAS, SHIFT/CHECKLIST, dan governance. Total sembilan kasus. Enam jabatan terhubung melalui `projectIds`; jabatan tanpa bukti proyek tersendiri tidak diberi tautan yang mengada-ada.

## 3. Batas Publikasi

- Jangan commit PDF sumber, file konfigurasi, kredensial, screenshot dashboard operasional, alamat internal, daftar pelanggan, koordinat, nomor telepon pribadi, atau identitas rekan kerja.
- Foto kandidat dipilih dari dokumentasi perangkat dan pekerjaan lapangan. Script menutup teks yang terdeteksi OCR dan wajah yang terdeteksi OpenCV, lalu membuang EXIF/XMP.
- Redaksi berupa bidang solid, bukan blur yang menyisakan keterbacaan. Laporan berisi teks asli hasil OCR, sehingga **laporan juga privat**.
- OCR dan deteksi wajah dapat melewatkan teks, wajah miring, logo, atau detail sensitif lain. Pemeriksaan otomatis **bukan persetujuan privasi manual**.
- Review visual pemilik atas tujuh foto turunan masih diperlukan. Bila ada bagian yang tidak boleh dipublikasikan, hapus foto dari data dan aset publik atau buat redaksi tambahan sebelum membagikan tautan lebih luas.

`.local/` diabaikan Git dan watcher Vite. Ini bukan enkripsi atau kontrol akses; jangan menaruh direktori tersebut pada file sharing publik. Semua yang ada dalam `public/` akan ikut build meskipun tidak dirujuk UI.

## 4. Regenerasi Lokal

Aset siap pakai sudah di-commit. Python hanya diperlukan untuk kurasi ulang, bukan build website. Script menggunakan PyMuPDF dan Pillow; tahap redaksi memerlukan NumPy, RapidOCR ONNX Runtime, serta OpenCV 4.12.0.88. OpenCV 5 pada lingkungan ini tidak menyediakan `CascadeClassifier` yang diperlukan.

1. Simpan sumber di luar repositori. Pasang dependensi kurasi secara lokal, jangan masukkan direktori dependensi ke Git.
2. Buat contact sheet dengan `--preview`. Hasil masuk `.local/archive-review/`.
3. Gunakan `--extract` untuk mengekstrak kandidat. Periksa urutan gambar jika PDF sumber berubah.
4. Tinjau pilihan pada mapping `selected` di script sebelum ekspor.
5. Jalankan `--publish` untuk redaksi otomatis dan penulisan WebP ke `public/assets/evidence/`. Flag ini **tidak melakukan push atau deployment**.
6. Periksa setiap gambar hasil, caption, sumber, metadata, dan laporan redaksi secara manual. Hapus kandidat yang tidak aman.
7. Perbarui `cover`/`evidence` beserta dimensi dan teks EN/ID di `src/content.ts`; uji galeri, lalu ikuti [DEPLOYMENT.md](DEPLOYMENT.md).

Contoh, ganti placeholder dengan sumber lokal yang benar:

```powershell
py scripts/curate-archive.py "C:\private\portfolio.pdf" --preview
py scripts/curate-archive.py "C:\private\portfolio.pdf" --extract
py scripts/curate-archive.py "C:\private\portfolio.pdf" --publish
py scripts/prepare-legacy-diagrams.py
```

Script dapat menimpa aset turunan. Mengganti sumber memerlukan peninjauan mapping halaman/gambar; jangan menjalankan ekspor buta pada PDF berbeda. Contact sheet, ekstraksi, dan `redaction-review.json` tidak boleh di-stage.

## 5. Model Data dan Pembaruan

`ProjectImage` menyimpan `src`, `width`, `height`, `alt`, `caption`, `source`, dan `kind`. `projectCover()` memilih foto atau diagram default. `EvidenceGallery` membaca array `evidence`; tombol panah dan thumbnail mengganti gambar, tautan membuka ukuran penuh.

Tanggung jawab jabatan ditulis dalam `careerRecords.sections`. Array `experiences.points` diturunkan otomatis untuk kompatibilitas tampilan klasik. PDF membaca kelompok tanggung jawab yang sama; setelah perubahan fakta, regenerasi PDF dengan `npm run resume` dan periksa pagination sebelum build.

Checklist setiap bukti baru: sumber jelas, lingkup kontribusi tepat, izin penggunaan memadai, informasi sensitif tersamarkan, caption tidak melebihkan bukti, kedua bahasa tersedia, gambar dapat dimuat di desktop/ponsel.
