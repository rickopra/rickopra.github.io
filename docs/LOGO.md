# Identitas RP

Logotype personal **RP** untuk Ricko Prayudha. Arah visualnya diambil dari contoh logo P3 yang dikirim pemilik: huruf lebar, geometri digital bersudut, counter kotak, sambungan huruf terpotong, dan detail sian. Ini gambar huruf R dan P baru, bukan font atau logo Persona 3 Reload. Tidak ada font, file, atau aset permainan yang disertakan. Bentuk ini untuk identitas independen, bukan untuk mengaku sebagai produk ATLUS/SEGA.

## Riset Singkat

- Screenshot rujukan dari pemilik memperlihatkan logo P3 Reload berbentuk **custom lettering**, berbeda dari huruf UI/dialog yang dapat dicari sebagai font. Yang relevan untuk RP ialah bentuk huruf, proporsi, ruang negatif, dan potongan, bukan mengganti tulisan ke font menu.
- [DaFont: pencarian Persona 3 Reload](https://www.dafont.com/search.php?q=persona+3+reload) tidak mengembalikan font dengan nama itu pada saat pemeriksaan. Ini bukan bukti bahwa font resmi tak ada; hanya alasan untuk tidak mengambil unduhan berlisensi tak jelas.
- Referensi bahasa visual game ada di [PERSONA-3-RELOAD.md](PERSONA-3-RELOAD.md). Logo tidak memakai materi game langsung. Kedekatan karakter grafis tidak berarti kemiripan persis setiap bentuk dari P3.

## Bentuk dan Filosofi

- **R/P digambar per bentuk**, tanpa ketergantungan font. Dua lubang persegi membuat masing-masing huruf terbaca bahkan ketika kecil. R punya kaki diagonal panjang; P punya batang lurus. Pada 16 px, dua siluet harus tetap berbeda.
- **Batang stabil** = sistem yang dapat diandalkan; **kaki R maju** = inisiatif dan kemampuan menyelesaikan pekerjaan. **P tetap tegak** = ketelitian, tanggung jawab, konsistensi.
- **Potongan kecil** pada bagian atas dan kaki R menggambarkan proses: perubahan dilakukan dengan presisi, bukan dekorasi acak. **Pita sian horizontal** memberi arah dan penanda visual tersendiri saat ikon dipakai tanpa nama lengkap.
- Sudut dibuat tegas. Tidak ada bingkai membulat, efek metalik, atau gradasi. Huruf di atas biru elektrik mencerminkan situs tetapi masih bisa dipakai sebagai monogram dokumen lewat versi transparan.

## Warna dan Berkas

| Warna | Kode | Fungsi |
| --- | --- | --- |
| Biru elektrik | `#0755D9` | Latar ikon. |
| Biru malam | `#082866` | Garis dasar; huruf pada versi transparan. |
| Putih | `#FFFFFF` | Siluet huruf pada ikon. |
| Sian | `#44D8F5` | Potongan dan aksen dasar. |

- Master ikon: [`public/assets/rp-logo.svg`](../public/assets/rp-logo.svg); versi transparan berlatar terang: [`public/assets/rp-monogram.svg`](../public/assets/rp-monogram.svg).
- Ekspor: `rp-logo.png` (512 px), `apple-touch-icon.png` (180 px), `favicon-16.png`, `favicon-32.png`, `favicon.png` (64 px). PNG dihasilkan dari master dengan `npm run logo`.
- Pertahankan proporsi 128 x 128 dan area kosong di sekeliling huruf. Jangan memiringkan, menambahkan glow, atau mengubah hanya satu versi SVG.
- Pakai master berwarna untuk latar gelap/terang dan versi transparan hanya pada latar terang. Ukuran 16 px untuk favicon; untuk kebutuhan identitas di halaman/dokumen, gunakan SVG atau PNG 512 px.

## Pemeliharaan

Jika desain master berubah, sesuaikan `rp-monogram.svg`, jalankan `npm run logo`, uji keterbacaan pada 16/32 px, kemudian naikkan parameter versi `?v=` pada ikon dalam `index.html` dan tes. Parameter itu membantu browser mengambil favicon baru saat desain diganti. `scripts/prepare-assets.py` tidak boleh menimpa favicon.
