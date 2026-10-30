# Pembuka Portfolio

## Referensi dan Batas Riset

Riset dilakukan 30 Oktober 2026. Tanggal ini catatan pengembangan, bukan branding website.

- [Opening resmi Persona 3 Reload, Official ATLUS West](https://www.youtube.com/watch?v=746zeHM5EA8): judul, kanal, dan durasi 2:06 terverifikasi. Pemutar meminta login usia; video penuh tidak berhasil ditinjau frame demi frame pada sesi ini.
- [Persona Central: pengumuman opening](https://personacentral.com/persona-3-reload-opening-movie-released/): menghubungkan video resmi dan menyebut lagu "Full Moon Full Life". Artikel berhasil dibaca melalui representasi teks; akses langsung sempat mengembalikan 403/CAPTCHA.
- [Persona Central: wawancara desain UI](https://personacentral.com/p3r-interview-menu-ui/), terjemahan [Famitsu](https://www.famitsu.com/news/202311/29325647.html): Tomohiro Kumagai menjelaskan air, biru laut, refleksi seperti kaca, serta portrait protagonis sebagai bagian identitas menu. Kutipan ini mendasari gerak mengalir dan hubungan portrait-menu, bukan klaim analisis seluruh opening.

Animasi website adalah title sequence orisinal. Tidak menyalin adegan, karakter, logo ATLUS, rekaman musik, atau frame video game. Tidak mengklaim identik dengan opening resmi. Tidak ada embed YouTube, media pihak ketiga, paket baru, atau video yang perlu diunduh pengunjung.

## Storyboard

| Waktu | Komposisi | Tujuan |
| --- | --- | --- |
| 0.00-0.90 detik | Garis diagonal membuka slit; monogram RP terungkap. | Kenalkan identitas sebelum teks utama. |
| 0.45-1.05 detik | Bidang biru/cyan dan portrait monokrom bergerak masuk. | Sambungkan bahasa visual menu Persona dengan wajah pemilik. |
| 1.05-1.90 detik | Nama disusun dalam dua baris; spesialisasi L2 Support / CyberArk PAM menyusul. | Nama dan bidang profesional terbaca, tanpa slogan atau angka rekaan. |
| 1.90-3.00 detik | Identitas ditahan; portrait melambat. | Beri waktu baca, bukan rangkaian efek tanpa jeda. |
| 3.00-3.60 detik | Diagonal wipe membuka dashboard yang dimuat di belakang. | Transisi langsung ke menu yang sudah disetujui. |

Durasi disesuaikan untuk portfolio rekrutmen, bukan meniru opening game 2 menit. Bidang gelap di belakang tulisan menjaga kontras selama pergerakan. Tidak ada flash berulang, glitch, tahun/edisi, progress palsu, atau tombol "start" wajib.

## Alur dan Akses

1. `App` memeriksa URL, reduced motion, pilihan jeda animasi, serta `sessionStorage`.
2. Hanya `/` dan `/#menu` pada kunjungan pertama dalam sesi tab yang menampilkan intro. Hash lain, `?classic`, `?resume`, dan PDF langsung melewatinya.
3. Menu dimuat bersamaan dalam `.portfolio-surface`, sementara `inert` dan `aria-hidden` menjaga fokus/interaksi di intro. Keyboard dan gamepad menu tidak aktif selama intro.
4. Tombol `Skip intro` / `Lewati intro`, Enter, atau Escape menyelesaikan intro. Tab tetap pada tombol. Setelah dilewati, komponen menu memulihkan fokus ketika siap, termasuk bila chunk lambat dimuat.
5. Akhir animasi menyelesaikan intro otomatis; timer cadangan 4 detik mencegah gate tertinggal ketika event CSS tidak datang. Perubahan preferensi reduced motion atau hash juga menutupnya.
6. `portfolio-intro-seen=1` disimpan di `sessionStorage`, bukan `localStorage`. Reload pada sesi tab yang sama tidak mengulang. Tab/sesi baru dapat menampilkan intro lagi sesuai perilaku penyimpanan browser. Storage gagal tidak menghalangi menu.

Audio tetap senyap sampai pengunjung menekan kontrol musik. Memuat animasi tidak membuat `AudioContext`. Portrait dashboard setengah wajah, iris biru dashboard, Profile utuh, CV, pengalaman, dan musik yang sudah ada tidak diubah.

## Implementasi

- `src/PortfolioIntro.tsx`: kebijakan tampil, dialog, fokus, skip, event selesai, timer cadangan.
- `src/intro.css`: komposisi responsive dan timeline CSS. Gunakan keyframe/clip-path yang ada; tidak perlu library timeline untuk urutan linear ini.
- `src/App.tsx`: host intro di luar lazy chunk menu, permukaan inert, fallback monogram menggantikan teks nama saja.
- `src/PersonaPortfolio.tsx`: blok input menu selama intro dan pulihkan fokus setelah skip.
- `tests/intro.spec.ts`: lifecycle, sesi, bypass, input, reduced motion, storage/CSS gagal, audio senyap, geometri, screenshot, variasi pixel, dan axe.

Memeriksa intro ulang: buka sesi privat/tab baru. Untuk pengembangan dalam tab yang sama, hapus `portfolio-intro-seen` di Session Storage melalui DevTools lalu reload root. Jangan mengubah hash pengalaman atau PDF demi memaksakan intro.

## Verifikasi

Jalankan `npm test -- tests/intro.spec.ts`, seluruh `npm test`, lalu `npm run build`. Screenshot lokal di `.local/screenshots/*-intro-identity.png`; pengujian membandingkan dua waktu animasi, memeriksa warna/pixel dan gambar terdekode, serta teks pada 320 px hingga 1920 px. Hasil rilis dicatat di [STATUS.md](STATUS.md).

Alat penampil gambar pada sesi ini mengembalikan hasil kosong. Screenshot dan pemeriksaan pixel/geometri tidak diperlakukan sebagai review estetika manual atau jaminan impresi perekrut. Review pemilik tetap diperlukan.
