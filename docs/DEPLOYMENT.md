# Deployment dan Pemulihan

Target production: https://rickopra.github.io/  
Repo: `rickopra/rickopra.github.io`  
Branch production: `main`  
Workflow: `.github/workflows/deploy.yml` (`Deploy portfolio`)

## 1. Konfigurasi Wajib

GitHub Pages harus menggunakan **GitHub Actions** sebagai sumber. Pada Settings > Pages > Build and deployment > Source, pilih **GitHub Actions**.

Jangan gunakan **Deploy from a branch** untuk source repository ini. Browser tidak bisa menjalankan `src/main.tsx` langsung. Website harus menerima hasil build Vite dari `dist/`.

Konfigurasi terverifikasi pada 28 September 2026: `build_type = workflow`.

Jika menggunakan GitHub CLI yang telah terpasang:

```powershell
gh auth status
gh api repos/rickopra/rickopra.github.io/pages --jq '{build_type: .build_type, url: .html_url}'
```

Jika belum login, jalankan `gh auth login --hostname github.com --git-protocol https --web`, kemudian selesaikan otorisasi di browser. Jangan menempelkan access token ke chat, dokumentasi, source, atau remote Git.

Untuk mengoreksi konfigurasi site yang sudah ada:

```powershell
gh api --method PUT repos/rickopra/rickopra.github.io/pages -f build_type=workflow
```

`POST /pages` digunakan hanya jika site belum ada. Mengulang POST pada site yang aktif menghasilkan `409 GitHub Pages is already enabled.`; itu bukan kegagalan build aplikasi.

## 2. Alur Workflow Saat Ini

1. Push ke `main` atau jalankan `workflow_dispatch`.
2. Job `build`: checkout, Node.js 24, `npm ci`, `npm run build`.
3. `actions/configure-pages` menyiapkan konteks Pages.
4. `actions/upload-pages-artifact` mengunggah **hanya `dist/`**.
5. Job `deploy`, setelah build berhasil, menjalankan `actions/deploy-pages` pada environment `github-pages`.

Izin workflow: `contents: read`, `pages: write`, `id-token: write`. Workflow memakai token GitHub Actions bawaan; tidak perlu menyimpan personal access token dalam repo.

`concurrency.group = pages` menserialkan publikasi. `cancel-in-progress: false` berarti deployment yang sedang berjalan tidak otomatis dibatalkan oleh push berikutnya.

Workflow saat ini belum menjalankan Playwright atau audit dependensi. Langkah tersebut dilakukan lokal sebelum publikasi. CV asli disalin oleh Vite dari `public/` ke `dist/`; tidak ada regenerasi PDF. Menambahkan quality gate ke CI adalah pekerjaan lanjutan, bukan fitur yang sudah aktif.

## 3. Prosedur Rilis

1. Jalankan aplikasi lokal dan periksa perubahan pada desktop serta ponsel, kedua bahasa.
2. Jika pemilik memberikan versi baru CV utama, salin tanpa edit ke `public/ricko-prayudha-cv.pdf`; cocokkan SHA-256 sumber dan salinan. Jangan ubah CV karena perubahan konten website.
3. Jalankan `npm test`, `npm run build`, dan `npm audit --omit=dev`.
4. Jika ada tes gagal, perbaiki atau dokumentasikan pengecualian yang disepakati. Jangan menyatakan seluruh tes lulus.
5. Periksa berkas yang akan dipublikasikan menggunakan `git status --short` dan `git diff`. Kecuali CV utama yang pemilik minta publikasi, jangan menambahkan arsip privat.
6. Stage hanya file yang dimaksud, buat commit, lalu `git push origin main`.
7. Pantau workflow dan verifikasi website sesuai bagian berikut.

Tidak perlu commit `dist/`, `node_modules/`, `.local/`, screenshot hasil tes, atau kredensial. PDF publik dan aset yang dirujuk halaman memang disimpan di Git.

Menjalankan ulang deployment tanpa perubahan source:

```powershell
gh workflow run deploy.yml --repo rickopra/rickopra.github.io --ref main
gh run list --repo rickopra/rickopra.github.io --workflow deploy.yml --limit 5
```

Untuk detail satu run, ganti `RUN_ID` dengan ID dari daftar:

```powershell
gh run view RUN_ID --repo rickopra/rickopra.github.io
gh run view RUN_ID --repo rickopra/rickopra.github.io --log-failed
```

## 4. Verifikasi Production

**HTTP 200 dan workflow hijau tidak cukup.** Verifikasi bahwa browser benar-benar mendapat aplikasi yang dibundel.

Pemeriksaan awal dari PowerShell:

```powershell
$response = Invoke-WebRequest 'https://rickopra.github.io/' -UseBasicParsing
if ($response.StatusCode -ne 200) { throw 'Website tidak merespons HTTP 200' }
if ($response.Content.Contains('/src/main.tsx')) { throw 'Source TSX dipublikasikan, bukan hasil build' }
if ($response.Content -notmatch '/assets/[^"\s]+\.js') { throw 'Referensi JavaScript hasil build tidak ditemukan' }
```

Lanjutkan di browser:

- Nama dan foto Ricko tampil; tidak berhenti pada layar kosong.
- Network panel: JavaScript, CSS, font, foto, dan diagram berstatus berhasil.
- Animasi tampil; pause menghentikannya. Pada perangkat tanpa WebGL, informasi tetap terbaca.
- Filter proyek dan dialog ATLAS bekerja; Escape menutup dialog.
- EN/ID bekerja dan pilihan bertahan setelah refresh jika localStorage diizinkan.
- CV dapat diunduh; SHA-256 PDF live sama dengan CV utama pemilik, salinan publik, dan `dist/`.
- Link email, LinkedIn, dan GitHub benar.
- Tidak ada error JavaScript; tidak ada overflow/overlap pada ukuran yang ditinjau.

Jika browser masih menampilkan versi lama, lakukan hard refresh atau buka jendela privat. Jangan menganggap cache penyebabnya sebelum memeriksa source Pages dan artifact.

## 5. Insiden 28 September 2026

Gejala: dua workflow sebelumnya sukses, URL merespons 200, tetapi HTML live masih mengandung:

```html
<script type="module" src="/src/main.tsx"></script>
```

Penyebab terverifikasi: Pages masih `build_type: legacy`. Ada deployment branch (`pages-build-deployment`) dan workflow custom (`Deploy portfolio`). Konten yang dilayani merupakan source, bukan output Vite.

Pemulihan yang sudah dilakukan:

1. Ubah Pages dari `legacy` ke `workflow`.
2. Jalankan ulang `deploy.yml` dari `main`.
3. Pastikan HTML live merujuk `/assets/index-*.js` dan `/assets/index-*.css`, bukan `/src/main.tsx`.
4. Uji langsung dengan Chromium pada desktop dan ponsel: halaman, canvas, dialog, bahasa, dan PDF.

[Run pemulihan 36338090845](https://github.com/rickopra/rickopra.github.io/actions/runs/36338090845) selesai sukses. Source aplikasi saat pemulihan: commit `636f264`. Perbaikan ini mengubah konfigurasi hosting, bukan desain.

## 6. Troubleshooting

| Gejala | Periksa | Tindakan |
| --- | --- | --- |
| Layar kosong, HTTP 200 | Referensi `/src/main.tsx`, `build_type` | Gunakan `workflow`, deploy artifact `dist/`. |
| Asset 404 | Path, kapitalisasi filename, isi `dist/` | Sesuaikan path; Linux case-sensitive. |
| CV lama | Hash PDF pada `public/`, `dist/`, dan situs live | Salin CV utama yang baru tanpa edit ke `public/`, build, commit, deploy; periksa cache jika hash live masih lama. |
| `npm ci` gagal | Versi Node, sinkronisasi manifest/lockfile | Pakai Node 24, perbarui lockfile secara sengaja. |
| Deployment ditolak | Settings Pages, environment `github-pages`, permissions | Periksa izin yang tercantum dan aturan environment. |
| Perubahan branch tidak terbit | Workflow hanya mendengar `main` | Review branch, gabungkan ke `main` ketika siap. |
| Desain berbeda pada perangkat | Font, viewport, reduced motion, bahasa tersimpan | Uji ulang dalam konteks browser baru. |
| `gh` tidak ditemukan | Instalasi dan PATH lokal | Pasang GitHub CLI atau gunakan UI GitHub. |

## 7. Rollback Tanpa Menghapus Riwayat

Untuk rilis yang bermasalah, gunakan revert commit setelah mengidentifikasi perubahan yang tepat. Jangan force-push atau reset branch publik.

1. Jalankan `git status`; simpan pekerjaan lokal sebelum rollback.
2. Tinjau `git log` dan `git show COMMIT_ID` untuk memastikan commit yang akan dibatalkan.
3. Untuk commit biasa, jalankan `git revert COMMIT_ID`. Commit merge membutuhkan pemilihan parent yang tepat, jadi jangan menyalin perintah tersebut secara buta.
4. Jalankan pengujian dan build, lalu push commit revert.
5. Pantau deployment dan ulangi verifikasi production.

Jika masalah hanya konfigurasi Pages seperti insiden di atas, perbaiki konfigurasi dan deploy ulang. Tidak perlu membatalkan source yang benar.

## 8. Perubahan Domain atau Repo

Repo user site saat ini berjalan di root domain. Migrasi ke custom domain atau project subpath memerlukan pemeriksaan path aset, `base` Vite, canonical/Open Graph, sitemap, robots, tautan CV, serta link dokumentasi. Jangan hanya mengganti nama repo lalu menganggap seluruh URL otomatis benar.
