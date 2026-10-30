# Pembaruan Karier: Solugenix / CyberArk PAM

Tanggal sumber dan implementasi: 30 Oktober 2026, Asia/Bangkok. Pemilik mengonfirmasi peran saat ini sebagai L2 Support Engineer di Solugenix untuk produk CyberArk PAM. Dokumen dibaca langsung; tidak memakai deskripsi pekerjaan umum sebagai bukti pengalaman.

## Sumber

| Dokumen lokal | Halaman relevan | Penggunaan |
| --- | --- | --- |
| `CV Ricko Prayudha.pdf`, 4 halaman | 1-2 | CV utama: posisi, periode, lima tanggung jawab, ringkasan. Disalin byte-persis ke PDF publik. |
| `Ricko Prayudha CV.pdf`, 2 halaman | 1 | Konfirmasi silang periode, produk, penanda lab. Tidak dipublikasikan terpisah. |
| `Ricko Prayudha Portfolio.pdf`, 13 halaman | 1-4, 13 | Spesialisasi terbaru; skala enterprise berasal dari peran ATI sebelumnya. Screenshot dan PDF sumber tetap lokal. |

SHA-256 sumber:

- CV utama: `5fcd0c494745c4bca9f7aa551568102af0487f4888144411493e6ac17aff1123`.
- CV ringkas: `39d8cf18e47f91f9e632625bc562159d84a5f032026eed91e7f4e21c689b435a`.
- Portfolio: `00efb8b76ee50d02f52ed201a6aaf4d8b9137f06a6c7157622c8b7c5f27bb880`.

## Fakta dan Bahasa

| Fakta | Penyajian publik |
| --- | --- |
| Solugenix Corporation, Jakarta, Agustus 2026 - sekarang | Entri pertama Experience; dipilih saat membuka layar. |
| Fokus dukungan L2 | PSM, HTML5 Gateway, Remote Access, Privilege Cloud. |
| Diagnostik | Konektivitas sesi privileged, autentikasi, konfigurasi, analisis log. |
| Kasus teknis | Pengumpulan data diagnostik, dokumentasi temuan, koordinasi eskalasi, panduan dan pembaruan kasus, tindak lanjut. |
| Pengalaman konfigurasi lab | Digital Vault, PVWA, CPM, PSM, PSMP, connector; selalu menyebut lingkungan lab. |
| Pengalaman ATI | Maret 2024 - Agustus 2026; 500+ pengguna, 7 lokasi BGP, 24/7 tetap sebagai riwayat terdahulu. |

Ringkasan EN: "L2 Support Engineer at Solugenix, focused on CyberArk PAM."

Ringkasan ID: "L2 Support Engineer di Solugenix, fokus pada CyberArk PAM."

Branding memakai tindakan dan produk yang dapat ditelusuri ke sumber. Tidak menambah sertifikasi, status karyawan CyberArk, pengalaman deployment produksi PAM, jumlah kasus/pelanggan, tingkat keberhasilan, atau penghematan. Tidak menampilkan tiket, log pelanggan, topologi lab, endpoint, akun, atau screenshot internal. Tidak membuat studi kasus CyberArk tanpa bukti proyek yang layak dipublikasikan. Rolebook tetap dihapus.

## Alur Implementasi

1. Baca ketiga dokumen dan cocokkan jabatan, periode, komponen, serta batas lab.
2. Tambahkan `careerRecords[0]` dengan lima butir konkret dalam tiga kelompok; `experiences.points` tetap diturunkan untuk mode klasik.
3. Perbarui Profile dan label dashboard; gunakan `cyberArkTools` bersama pada Experience dan Capabilities agar penanda lab konsisten.
4. Perbarui metadata/no-script; pertahankan portrait, crop, iris biru, musik, animasi, logo, dan semua sembilan studi kasus lama.
5. Salin CV utama terbaru ke `public/ricko-prayudha-cv.pdf` tanpa mengubah isi. PDF sumber lain tidak ikut di-stage.
6. Uji EN/ID, kedua mode, layar sempit/lebar, urutan jabatan, batas lab, CV, dan regresi; build, push, pantau Pages, periksa URL publik dan hash CV.

## Verifikasi dan Pemeliharaan

`tests/career-update.spec.ts` memeriksa posisi/produk/batas lab, pengalaman ATI, kedua bahasa, mode klasik, metadata, serta geometri teks hingga 320 px. `tests/portfolio.spec.ts` memeriksa tujuh jabatan, lima kelompok capabilities, bukti lama, dan hash CV terbaru. Suite portrait tetap mengunci hash foto asli serta aksen iris dashboard.

Hasil tes dan deployment dicatat di [STATUS.md](STATUS.md). Perubahan berikutnya harus memakai fakta baru dari pemilik. Jangan menaikkan label `(lab)` menjadi klaim produksi hanya karena waktu kerja bertambah. Pergantian PDF publik harus berasal dari dokumen utama baru, bukan hasil penyuntingan otomatis.
