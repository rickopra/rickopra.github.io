# Identitas RP

Monogram **RP** adalah identitas personal Ricko Prayudha, bukan logo Persona 3 Reload. Rujukan permainan hanya pada energi biru situs; bentuk huruf, proporsi, dan filosofi logo ini orisinal. Logo dapat dipakai terpisah dari website.

## Gagasan Bentuk

- **R** dan **P** berdiri tegak, terbaca dari kiri ke kanan. Keduanya memakai modul batang 14 unit dan ruang dalam yang terbuka, sehingga bentuk tetap jelas ketika diperkecil sebagai favicon.
- **Batang vertikal** mewakili fondasi: keandalan, tanggung jawab, dan konsistensi dalam pekerjaan infrastruktur serta operasi IT.
- **Kaki diagonal R** diberi aksen biru muda: keputusan, gerak maju, dan kemampuan menjembatani masalah teknis dengan hasil yang nyata. Ini bukan petir, panah tempelan, atau simbol merek lain.
- **P** tetap utuh dan tenang sebagai penyeimbang gerak R. Identitas harus mudah dipercaya juga ketika dibaca di CV, bukan hanya menarik di tab browser.
- Bidang biru memakai dua nada, tanpa efek 3D. Sudut 18/128 melembutkan favicon; karakter huruf tetap tegas. Tidak ada aset, font, atau logo game yang disalin.

## Warna dan Versi

| Warna | Kode | Fungsi |
| --- | --- | --- |
| Biru utama | `#0748C9` | Bidang dasar logo dan identitas digital. |
| Biru terang | `#1466EF` | Bidang diagonal halus pada latar. |
| Putih | `#FFFFFF` | Huruf pada latar biru. |
| Sian | `#75EAFF` | Aksen gerak pada kaki R. |
| Biru gelap | `#062B80` | Huruf versi transparan untuk latar terang. |
| Biru sekunder | `#0754D9` | Aksen R pada versi transparan. |

**Master:** [`public/assets/rp-logo.svg`](../public/assets/rp-logo.svg) untuk latar berwarna solid; [`public/assets/rp-monogram.svg`](../public/assets/rp-monogram.svg) transparan untuk dokumen berlatar terang. [`public/assets/rp-logo.png`](../public/assets/rp-logo.png) adalah ekspor 512 px. Master vektor dapat diskalakan tanpa pecah.

**Favicon:** `favicon-16.png`, `favicon-32.png`, `favicon.png` (64 px) dihasilkan dari master SVG. **Layar beranda ponsel:** `apple-touch-icon.png` (180 px). SVG juga ditautkan sebagai favicon pada browser yang mendukungnya.

## Pemakaian

- Pertahankan proporsi dan bentuk RP, serta jarak kosong minimal setara lebar batang huruf di sekeliling logo ketika ditempatkan di layout lain.
- Pada latar terang gunakan `rp-monogram.svg`; pada latar gelap gunakan versi berlatar biru `rp-logo.svg`. Jangan membalik warna, mengubah huruf menjadi miring, atau menambah efek/slogan di dalam ikon.
- Ukuran minimum: 16 x 16 px untuk favicon berwarna; untuk cetak atau ikon di UI gunakan paling tidak 24 x 24 px. Jangan pakai versi transparan gelap pada latar gelap.
- Logo merujuk identitas personal, bukan sertifikasi perusahaan, game, atau komunitas. Gunakan foto, pengalaman, dan isi CV apa adanya.

## Memperbarui

Ubah hanya master `public/assets/rp-logo.svg`, lalu jalankan `npm run logo` untuk menghasilkan ulang seluruh PNG dari satu sumber. Periksa hasil pada 16/32 px dan 180 px sebelum publikasi. `scripts/prepare-assets.py` tidak boleh menghasilkan atau menimpa favicon. Jika bentuk atau warna berubah, sesuaikan versi transparan dan pedoman ini; uji `npm test` dan `npm run build` sebelum push.
