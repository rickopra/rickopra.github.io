# Persona 3 Reload: Arah Revisi Desain

Status: **rencana, belum diimplementasikan**. Pemilik meminta review versi live terlebih dahulu. Dokumen ini tidak menyatakan desain yang sekarang sudah identik dengan game.

## 1. Brief

Permintaan pemilik bukan sekadar biru, font miring, dan animasi dekoratif. Sasaran revisi adalah menerjemahkan keseluruhan pengalaman menu Persona 3 Reload: komposisi, dominasi portrait, tata letak navigasi, hierarki tipografi, keadaan pilihan, gerak perpindahan, dan kedalaman visual.

Portofolio tetap harus memberi HR akses cepat ke identitas, pengalaman, karya, CV, dan kontak. Tidak boleh memalsukan skor kemampuan, sertifikasi, statistik, atau posisi kerja untuk menyerupai sistem game.

## 2. Rujukan dan Tingkat Kepastian

- [Wawancara UI Persona 3 Reload, Persona Central, 29 November 2023](https://personacentral.com/p3r-interview-menu-ui/), terjemahan [Famitsu](https://www.famitsu.com/news/202311/29325647.html).
- [Gambar menu yang diterbitkan bersama wawancara](https://personacentral.com/wp-content/uploads/2023/11/P3R-Menu.jpg).
- [Gambar menu kedua yang diterbitkan bersama wawancara](https://personacentral.com/wp-content/uploads/2023/11/P3R-Menu-2.webp).
- [Wawancara pengembangan, 16 Juni 2023](https://personacentral.com/persona-3-reload-development-interview/).

Art director Tomohiro Kumagai menjelaskan inspirasi air/laut, pantulan, kilau seperti kaca, serta menu sebagai ekspresi batin protagonis. Ia membedakannya dari energi pop-punk agresif Persona 5.

Wawancara juga memuat concept UI sebelum rilis. Jangan menganggap semua gambar konsep sama dengan UI final dalam game. Belum ada pengukuran frame-by-frame, font proprietary, durasi transisi final, atau audit kesamaan pixel terhadap game pada proyek ini. Angka durasi yang diusulkan di bawah adalah target implementasi web, bukan spesifikasi ATLUS.

Untuk klaim "sama persis", diperlukan set referensi yang disepakati: layar final yang dituju, resolusi, bahasa game, keadaan pilihan, dan urutan transisinya. Sampai itu diverifikasi, gunakan istilah implementasi berbasis referensi, bukan klaim identik.

## 3. Kesenjangan Versi Sekarang

| Aspek | Implementasi live saat ini | Arah revisi setelah review |
| --- | --- | --- |
| Struktur | Website scrolling dengan header horizontal | Navigasi utama yang menjadi bagian komposisi menu, bukan header generik. |
| Portrait | Foto formal dengan background dihapus | Foto tetap autentik, komposisi portrait lebih menyatu dengan ruang menu. |
| Typography | Nama besar condensed italic | Hierarki berbeda untuk judul layar, opsi aktif, metadata, dan isi. |
| Pilihan menu | Underline header, tombol filter | Keadaan idle/hover/focus/selected yang jelas, pergeseran dan penekanan konsisten. |
| Transisi | Entrance sederhana dan scroll anchor | Transisi antarbagiannya dirancang sebagai satu sistem, termasuk masuk/kembali. |
| Kedalaman | Tujuh gate wireframe jaringan | Lapisan perspektif, pantulan, dan gerak mengalir sesuai referensi yang dipilih. |
| Karya | Grid editorial dan dialog | Pola daftar-detail selaras dengan bahasa menu, tanpa menyulitkan pembacaan. |
| Pengalaman | Timeline disclosure standar | Presentasi riwayat seperti daftar rekam kerja dengan detail yang terstruktur. |
| Ponsel | Penyusunan ulang halaman desktop | Komposisi portrait, menu, dan isi khusus ponsel; bukan desktop yang diperkecil. |

Foto profesional, metrik karier, studi kasus, dan CV tetap menjadi objek utama. Elemen visual harus memperjelas identitas dan pengalaman, bukan mengubah halaman menjadi fan page game.

## 4. Pemetaan Menu ke Isi Portfolio

Tabel berikut merupakan usulan, bukan label UI yang sudah terpasang.

| Fungsi portfolio | Perlakuan visual yang diusulkan | Isi tetap faktual |
| --- | --- | --- |
| Profile | Layar identitas/portrait utama | Nama, disiplin, lokasi, ringkasan profesional. |
| Selected work | Daftar pilihan dengan detail proyek | Infrastruktur, ATLAS, SHIFT/CHECKLIST, governance. |
| Experience | Rekam perjalanan dengan pilihan peran | Perusahaan, jabatan, tanggal, lingkup kontribusi. |
| Capabilities | Kelompok kemampuan yang dapat dipindai | Teknologi dan konteks pemakaian, tanpa skill bar fiktif. |
| Contact | Aksi langsung dalam hierarki yang jelas | Email, LinkedIn, GitHub, PDF. |

Jangan memakai label game yang membuat perekrut harus menebak isi. CV dan kontak harus dapat diakses tanpa menuntaskan animasi atau mengunjungi semua layar.

## 5. Kontrak Interaksi yang Diusulkan

- Mouse: hover memberikan penekanan; klik memilih. Hover tidak membuka layar tanpa persetujuan klik.
- Keyboard: Tab dan Enter bekerja; fokus selalu terlihat. Navigasi panah dapat ditambahkan pada widget yang sesuai, tanpa menangkap shortcut browser secara global.
- Touch: tidak bergantung pada hover; target tetap cukup besar dan tidak bergerak saat disentuh.
- Back: menutup detail atau kembali ke daftar, dengan fokus kembali ke pemicu. Tombol browser harus masuk dalam pengujian bila navigasi berubah menjadi routing.
- Transisi: usulan durasi 180-450 ms sesuai konteks; tidak mengunci informasi penting. Tidak ada strobe, autoplay audio, atau loading palsu.
- Reduced motion: perpindahan langsung, tanpa parallax kontinu. Fungsi tetap sama.
- Responsif: teks dan kontrol tetap terbaca pada lebar 320 px, ponsel lanskap, desktop pendek, desktop lebar, dan zoom 200%.

Sistem layout game 16:9 tidak dapat dipindahkan mentah-mentah ke seluruh viewport web. Kesetiaan pada referensi harus disertai keputusan reflow dan aksesibilitas yang terdokumentasi.

## 6. Urutan Implementasi Berikutnya

1. Kumpulkan feedback versi live dan tentukan layar menu final game yang menjadi acuan.
2. Catat struktur tiap layar: posisi portrait, menu, judul, metadata, serta idle/selected/detail/back.
3. Buat prototipe komposisi dan transisi pada branch terpisah, tanpa mengganti production selama review.
4. Hubungkan komponen menu ke data profesional yang sudah diverifikasi; jangan menduplikasi konten.
5. Pertahankan jalur CV, tautan kontak, EN/ID, prefers-reduced-motion, dan fallback non-WebGL.
6. Uji viewport, pointer, keyboard, touch, fokus modal, serta history bila routing ditambahkan.
7. Bandingkan screenshot dan rekaman transisi terhadap referensi yang disepakati; dokumentasikan perbedaan yang disengaja.
8. Perbarui docs, PDF jika terpengaruh, tes, lalu deploy setelah review desain.

## 7. Kriteria Selesai

- Bukan hanya penggantian palet: komposisi, menu, typography, keadaan pilihan, transisi, dan kedalaman semuanya memiliki implementasi yang dapat ditinjau.
- Nama, bidang, karya, CV, dan kontak tetap jelas tanpa penjelasan cara menggunakan UI.
- Tidak ada teks/portrait/kontrol yang saling menutup; tidak ada CTA terpotong pada viewport pendek.
- Semua navigasi bekerja dengan keyboard dan touch; reduced motion tidak mengurangi akses ke informasi.
- Foto dan canvas terbukti tampil melalui screenshot dan pemeriksaan pixel; animasi bergerak, berhenti, serta tidak membuang resource setelah unmount.
- Konten karier, batas peran governance, dan status pendidikan tetap akurat.
- Seluruh tes kritis lulus; pengecualian yang tersisa dicatat secara eksplisit.
- Pemilik sudah meninjau kesetiaan desain terhadap referensi. Jangan menyatakan "sama persis" hanya berdasarkan penilaian implementer.

## 8. Aset dan Atribusi

Implementasi memakai kode sendiri, foto pemilik, font berlisensi, dan aset asli proyek. Tidak ada karakter, logo, musik, atau texture hasil ekstraksi game yang ikut dipublikasikan. Persona 3 Reload adalah karya ATLUS/SEGA; portfolio ini bukan situs resmi atau produk yang berafiliasi.

Tautan referensi untuk riset tidak memberikan izin untuk mengemas ulang aset game. Bila kelak menambahkan aset pihak ketiga, periksa hak penggunaan serta atribusi sebelum commit.
