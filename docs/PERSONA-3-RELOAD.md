# Persona 3 Reload: Referensi dan Implementasi

Pembaruan: 28 September 2026. Sistem menu sudah diimplementasikan; status rilis ada di [STATUS.md](STATUS.md). Ini adaptasi portfolio independen, **bukan klaim salinan pixel-identik** game atau website referensi.

## 1. Sasaran

Permintaan pemilik mencakup komposisi layar, portrait dominan, navigasi, tipografi, highlight pilihan, transisi, animasi, dan soundtrack. Palet biru saja tidak cukup. Pengalaman Ricko tetap menjadi isi utama; HR tidak perlu memahami game untuk menemukan CV, proyek, atau kontak.

Tidak ada skor kemampuan fiktif, gelar tambahan, atau posisi kerja rekaan demi menyerupai sistem game.

## 2. Referensi

- [Contoh web yang diberikan pemilik](https://karya.smkn1bawang.sch.id/karya/persona-3-1776145951), dengan [demo Fawwaz / Vloits](https://persona3.fayq.my.id/).
- [Wawancara UI, Persona Central, 29 November 2023](https://personacentral.com/p3r-interview-menu-ui/), terjemahan [Famitsu](https://www.famitsu.com/news/202311/29325647.html).
- [Gambar menu dalam wawancara](https://personacentral.com/wp-content/uploads/2023/11/P3R-Menu.jpg) dan [gambar kedua](https://personacentral.com/wp-content/uploads/2023/11/P3R-Menu-2.webp).
- [Wawancara pengembangan, 16 Juni 2023](https://personacentral.com/persona-3-reload-development-interview/).

Wawancara menjelaskan inspirasi air/laut, pantulan, kilau kaca, dan menu sebagai ekspresi protagonis. Sumber tersebut juga memuat konsep sebelum rilis; gambar konsep tidak otomatis sama dengan UI final game. Tidak dilakukan audit frame-by-frame atau pengukuran kesamaan pixel. Durasi CSS dan shader adalah keputusan implementasi web, bukan spesifikasi ATLUS.

## 3. Pemetaan Desain

| Aspek | Implementasi sekarang |
| --- | --- |
| Komposisi | Menu utama layar penuh dengan portrait, nama besar, bidang diagonal, metadata karier; bukan header website generik. |
| Navigasi | Enam pilihan dengan idle, hover, focus, selected; klik/Enter membuka layar hash. |
| Tipografi | Anton dan Barlow Condensed untuk judul/pilihan; DM Sans dan IBM Plex Mono untuk isi/metadata. |
| Gerak | Refleksi Three.js, gerak portrait, highlight, transisi masuk layar; tersedia pause dan reduced motion. |
| Kedalaman | Shader full-bleed di belakang konten; fallback CSS jika WebGL tidak tersedia. |
| Audio | Loop sintetis orisinal After Hours, cue pilihan/konfirmasi/kembali, volume; tidak autoplay. |
| Profil | Foto profesional autentik, seluruh foto sumber dipertahankan; frame memakai `contain`. |
| Karya | Daftar sembilan studi kasus, filter, dialog, galeri bukti lapangan dengan sumber. |
| Pengalaman | Enam jabatan, kelompok tanggung jawab, teknologi, tautan studi kasus terkait. |
| Ponsel | Reflow tersendiri, portrait/menu disesuaikan, detail dapat di-scroll, kontrol tetap dapat disentuh. |

Mode utama ada di `PersonaPortfolio.tsx`, `persona.css`, `TideScene.tsx`, dan `audio.ts`. Versi scrolling awal tetap tersedia melalui `?classic`; bukan tampilan default. Semua mode memakai data profesional bersama.

## 4. Menu Profesional

| Menu | Isi |
| --- | --- |
| Profile | Identitas, foto, ringkasan, lokasi, pendidikan, bahasa, CV. |
| Selected Work | Infrastruktur, sistem internal, governance, serta proyek LAN/NOC/FTTH/wireless/fiber dari arsip. |
| Experience | Perusahaan, jabatan, periode, tanggung jawab, tools, bukti terkait. |
| Capabilities | Teknologi dan lingkup kemampuan; CyberArk Rolebook sebagai pembelajaran mandiri. |
| Contact | Email, LinkedIn, GitHub, CV. |
| Credits | Referensi visual, musik, foto, diagram, font, ikon, source. |

CV tersedia langsung dari header. Tidak ada login, loading palsu, atau syarat menyelesaikan animasi. Diagram ilustratif tidak disajikan sebagai screenshot produksi; foto arsip memiliki caption dan provenance.

## 5. Kontrak Interaksi

- Mouse dan touch memilih melalui klik; hover tidak berpindah layar sendiri.
- Keyboard memakai Tab/Enter, panah pada menu, Escape untuk kembali. Kontrol slider tidak direbut navigasi menu.
- Gamepad standar memakai D-pad/sumbu, tombol konfirmasi, tombol kembali; pemetaan nyata bergantung browser/controller.
- Hash mendukung bookmark, refresh, browser Back/Forward. Dialog belum memiliki deep link tersendiri.
- Menutup dialog memulihkan fokus ke pemicu, termasuk pemicu di layar pengalaman.
- Ponsel/tablet memfokuskan detail pengalaman setelah jabatan dipilih.
- Motion dan audio dikendalikan terpisah. Reload selalu senyap, meskipun volume tersimpan.

Diagram state dan alur implementasi tersedia di [FLOW.md](FLOW.md); lifecycle musik di [AUDIO.md](AUDIO.md).

## 6. Verifikasi dan Batas Kesetiaan

Tes mencakup navigasi, history, input keyboard/gamepad simulasi, fokus, seluruh layar, portrait utuh, gallery, aksesibilitas otomatis, audio samples, dan WebGL pixels/frame movement. Matrix menu mencakup 320 px, ponsel lanskap, tablet, desktop pendek, desktop lebar, EN/ID.

Tes tersebut memverifikasi perilaku dan geometri, **bukan kesamaan desain dengan game**. Screenshot disimpan lokal. Review visual pemilik tetap diperlukan untuk komposisi, kenyamanan gerak, kualitas musik, dan foto arsip. Belum ada verifikasi Safari/Firefox, ponsel fisik, screen reader manual, atau audit zoom 200%.

Perbedaan disengaja: foto pemilik menggantikan karakter, label profesional menggantikan menu RPG, teks dapat reflow, konten panjang dapat di-scroll, musik buatan sendiri menggantikan OST. Tidak digunakan font proprietary, karakter, logo, video, atau texture hasil ekstraksi game.

## 7. Pengembangan Berikutnya

1. Tentukan layar final game, resolusi, bahasa, keadaan pilihan, serta urutan transisi yang ingin dibandingkan.
2. Simpan referensi hanya untuk review; jangan memasukkan aset game ke bundle tanpa izin.
3. Implementasikan perubahan pada branch terpisah sambil mempertahankan CV, keyboard/touch, EN/ID, reduced motion, dan fallback.
4. Bandingkan screenshot serta gerakan, bukan hanya warna. Uji ponsel, viewport pendek, teks panjang, dan zoom.
5. Perbarui dokumentasi, jalankan tes/build, tinjau diff publik, lalu deploy sesuai [DEPLOYMENT.md](DEPLOYMENT.md).

Persona 3 Reload adalah karya ATLUS/SEGA. Portfolio ini tidak resmi dan tidak berafiliasi. Tautan referensi bukan izin redistribusi aset atau source pihak ketiga.
