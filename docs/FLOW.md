# Alur Portfolio

Alur berikut menggambarkan implementasi menu baru. Struktur kode: [IMPLEMENTATION.md](IMPLEMENTATION.md). Detail musik: [AUDIO.md](AUDIO.md).

## 1. Pengunjung

```mermaid
flowchart TD
    Open["Buka website atau tautan hash"] --> Load["Muat aplikasi, font, foto lokal"]
    Load --> Preferences["Bahasa, volume, preferensi animasi"]
    Preferences --> Route{"Hash dikenal?"}
    Route -->|Tidak atau menu| Menu["Menu utama + portrait + animasi"]
    Route -->|Ya| File["Layar tujuan"]
    Menu --> Profile["Profil dan pendidikan"]
    Menu --> Work["Karya pilihan"]
    Menu --> Career["Daftar pengalaman + detail"]
    Menu --> Skills["Kapabilitas + proyek pembelajaran"]
    Menu --> Contact["Email, LinkedIn, GitHub"]
    Menu --> Credits["Referensi, aset, musik"]
    Work --> Filter["Semua / Infrastruktur / Sistem / Governance"]
    Filter --> Dialog["Studi kasus: konteks, kontribusi, hasil"]
    Dialog --> Source["Repositori publik bila tersedia"]
    Dialog --> Evidence["Galeri foto arsip + caption + sumber"]
    Evidence --> Full["Buka gambar penuh di tab baru"]
    Dialog -->|Tutup atau Escape| Filter
    Profile --> CV["Unduh CV PDF"]
    Career --> CV
    Career --> Responsibilities["Kelompok tanggung jawab + teknologi"]
    Responsibilities --> Related["Studi kasus terkait jabatan"]
    Related --> Dialog
    Contact --> CV
    File -->|Kembali atau Escape| Menu
```

CV selalu tersedia dari header. Studi kasus menggunakan dialog HTML dengan fokus terkelola. Tombol berikutnya berpindah antarbagian; tombol kembali membuka menu. Browser Back/Forward mengikuti riwayat hash. Tidak ada login atau halaman pembuka yang menghalangi akses HR.

Dialog dapat dibuka dari karya maupun pengalaman. Escape mengembalikan fokus ke pemicu tanpa keluar dari layar asal. Galeri kembali ke foto pertama ketika proyek dibuka ulang; thumbnail dan tombol panah mengubah foto tanpa mengubah URL.

## 2. Rute dan State

| URL | Tampilan |
| --- | --- |
| `/` atau `/#menu` | Menu utama. Hash tidak dikenal juga menampilkan menu. |
| `/#profile` | Profil. |
| `/#work` | Studi kasus. |
| `/#experience` | Pengalaman. |
| `/#skills` | Kapabilitas. |
| `/#contact` | Kontak. |
| `/#credits` | Referensi dan atribusi. |
| `/?classic` | Portfolio scrolling versi awal. |
| `/?resume` | Tautan lama; langsung membuka PDF CV asli. |

Hash bukan path server: refresh langsung pada `/#work` tetap meminta `/` kepada GitHub Pages, sehingga tidak memerlukan rewrite SPA.

| State | Sumber | Persistensi |
| --- | --- | --- |
| Layar | Hash URL | Bookmark dan history. |
| Menu terpilih | Pointer, fokus, keyboard, gamepad | Selama sesi React. |
| Bahasa | `portfolio-language` | localStorage, default EN. |
| Animasi | `portfolio-motion` atau preferensi OS | Pilihan manual tersimpan; tanpa pilihan manual mengikuti OS. |
| Volume | `portfolio-volume` | localStorage, default 30%. |
| Musik aktif | Klik speaker | Tidak disimpan; reload selalu senyap. |
| Filter, studi kasus, pengalaman | Interaksi komponen | Tidak disimpan dalam URL/storage. |
| Status salin email | Clipboard API | Hilang setelah 3,5 detik. |

Kegagalan localStorage tidak menghalangi aplikasi. Pergantian hash menutup dialog. Pergantian layar mengembalikan scroll ke atas dan memindahkan fokus ke judul; kembali ke menu memulihkan fokus pilihan. Skip link memindahkan fokus tanpa mengubah hash. Di ponsel/tablet, memilih pengalaman memfokuskan detail supaya perubahan langsung terlihat.

## 3. Input

```mermaid
flowchart LR
    Pointer["Mouse / sentuhan"] --> Select["Pilih menu"]
    Keyboard["Panah atas / bawah"] --> Select
    Gamepad["D-pad / sumbu vertikal"] --> Select
    Select --> Confirm["Klik / Enter / tombol utama gamepad"]
    Confirm --> Screen["Ubah hash + transisi + fokus"]
    Screen --> Back["Tombol kembali / Escape / tombol kedua gamepad"]
    Back --> Menu["Menu terakhir"]
```

Keyboard panah hanya ditangani saat fokus berada pada menu atau body; kontrol volume tidak direbut. Escape pada dialog menutup dialog dahulu, tidak sekaligus keluar dari layar karya. Gamepad pada layar detail menelusuri tombol/tautan; dukungan bergantung pemetaan controller browser.

## 4. Audio dan Animasi

```mermaid
stateDiagram-v2
    [*] --> Silent
    Silent --> Playing: Klik speaker, AudioContext berhasil
    Silent --> Silent: Audio tidak tersedia, tampilkan status
    Playing --> Silent: Klik mute
    Playing --> Hidden: Tab disembunyikan
    Hidden --> Playing: Tab kembali, pilihan putar masih aktif
    Hidden --> Silent: Mute atau unmount
    Playing --> Silent: Reload
```

Volume mengendalikan musik dan suara UI. Musik tidak menentukan navigasi: seluruh konten tetap tersedia ketika audio gagal. Menonaktifkan animasi menghentikan shader, portrait, equalizer, dan transisi, tanpa mematikan musik. Three.js menggunakan fallback CSS ketika WebGL tidak tersedia. RAF dan jadwal audio berhenti ketika tab disembunyikan; sumber daya dibersihkan saat unmount.

## 5. Konten dan CV

```mermaid
flowchart LR
    Evidence["Bukti profesional terverifikasi"] --> Data["src/content.ts, EN/ID"]
    Data --> Portfolio["Menu, profil, proyek, pengalaman"]
    Original["D:\CV Ricko Prayudha.pdf, dokumen utama pemilik"] --> Copy["Salin byte-persis, tanpa edit"]
    Copy --> PDF["public/ricko-prayudha-cv.pdf"]
    PDF --> Verify["Cocokkan SHA-256 sumber dan salinan"]
    Verify --> Build["npm run build dan uji PDF live"]
    PDF --> Links["Semua tombol CV dan /?resume"]
```

Konten website di `src/content.ts` terpisah dari CV asli. Mengubah konten website tidak mengubah PDF. Hanya ganti salinan publik jika pemilik menyediakan versi baru dokumen utama; jangan memodifikasi isi CV melalui kode atau generator.

```mermaid
flowchart LR
    Archive["Portfolio lama dan arsip privat lainnya"] --> Local["Ekstraksi lokal dalam .local"]
    Local --> Review["Pilih bukti, periksa data sensitif"]
    Review --> Photos["Foto terpilih, redaksi, hapus metadata"]
    Review --> Diagram["Konfigurasi privat diganti diagram proses"]
    Photos --> Public["public/assets + ProjectImage EN/ID"]
    Diagram --> Public
    Public --> Gallery["Studi kasus dan galeri"]
```

Pengecualian: CV utama yang diminta pemilik untuk dipublikasikan disalin ke `public/`, termasuk informasi kontak di dalamnya. PDF arsip lain dan hasil OCR privat tetap di luar repo. Panduan rinci: [EVIDENCE.md](EVIDENCE.md).

## 6. Rilis

```mermaid
flowchart TD
    Edit["Edit kode, fakta, atau aset"] --> Local["Review desktop/mobile, EN/ID"]
    Local --> Test["Playwright + build + audit"]
    Test --> Inspect["Tinjau diff dan batas publikasi"]
    Inspect --> Commit["Commit + push main"]
    Commit --> Actions["GitHub Actions: install + build"]
    Actions --> Artifact["Upload dist/"]
    Artifact --> Pages["Deploy GitHub Pages, source workflow"]
    Pages --> Live["Verifikasi browser live, audio, canvas, CV"]
    Live --> Record["Catat run, commit, hasil verifikasi"]
```

Detail pemulihan dan rollback: [DEPLOYMENT.md](DEPLOYMENT.md). Lulus pengujian otomatis tidak berarti desain identik dengan game atau semua perangkat telah diuji.
