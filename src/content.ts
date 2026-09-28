export type Language = 'en' | 'id';
export type Localized = Record<Language, string>;
export const text = (en: string, id: string): Localized => ({ en, id });

export const identity = {
  name: 'Ricko Prayudha',
  email: 'ricko.prayudha9@gmail.com',
  github: 'https://github.com/rickopra',
  linkedin: 'https://www.linkedin.com/in/ricko-prayudha/',
  location: 'Jakarta, Indonesia',
};

export const copy = {
  profile: text('Profile', 'Profil'),
  work: text('Selected work', 'Karya pilihan'),
  experience: text('Experience', 'Pengalaman'),
  contact: text('Contact', 'Kontak'),
  cv: text('Download CV', 'Unduh CV'),
  heroTag: text('IT OPERATIONS / INFRASTRUCTURE / GOVERNANCE', 'OPERASI IT / INFRASTRUKTUR / TATA KELOLA'),
  intro: text('I connect people, systems, and the processes that keep them moving.', 'Menghubungkan manusia, sistem, dan proses yang menjaga semuanya berjalan.'),
  introDetail: text('From hands-on network engineering to enterprise IT operations. Built on ownership. Backed by experience.', 'Dari rekayasa jaringan langsung di lapangan hingga operasi IT enterprise. Bertanggung jawab. Berlandaskan pengalaman.'),
  explore: text('Explore my work', 'Jelajahi karya'),
  based: text('BASED IN JAKARTA, INDONESIA', 'BERBASIS DI JAKARTA, INDONESIA'),
  users: text('Enterprise users supported', 'Pengguna enterprise didukung'),
  sites: text('Sites in BGP network delivery', 'Lokasi implementasi BGP'),
  operations: text('Operations coordination', 'Koordinasi operasional'),
  workTitle: text('REAL WORK. REAL OWNERSHIP.', 'KARYA NYATA. TANGGUNG JAWAB NYATA.'),
  workIntro: text('A selection of systems, infrastructure, and controls I have helped build and operate.', 'Pilihan sistem, infrastruktur, dan kontrol yang saya bangun dan operasikan.'),
  all: text('All work', 'Semua karya'),
  infrastructure: text('Infrastructure', 'Infrastruktur'),
  systems: text('Internal systems', 'Sistem internal'),
  governance: text('Governance', 'Tata kelola'),
  caseStudy: text('View case study', 'Buka studi kasus'),
  challenge: text('The challenge', 'Tantangan'),
  contribution: text('My contribution', 'Kontribusi saya'),
  outcome: text('Operational value', 'Nilai operasional'),
  scope: text('Scope & context', 'Lingkup & konteks'),
  tools: text('Tools & technologies', 'Teknologi'),
  close: text('Close case study', 'Tutup studi kasus'),
  source: text('View source', 'Lihat kode'),
  careerTitle: text('BUILT FROM THE GROUND UP.', 'BERKEMBANG DARI LAPANGAN.'),
  careerIntro: text('Field engineering taught me how systems connect. Enterprise operations taught me how to make them last.', 'Rekayasa lapangan mengajarkan cara sistem terhubung. Operasi enterprise mengajarkan cara menjaganya tetap andal.'),
  aboutTitle: text('TECHNICAL DEPTH.\nOPERATIONAL PERSPECTIVE.', 'KEDALAMAN TEKNIS.\nPERSPEKTIF OPERASIONAL.'),
  about: text('I work where infrastructure, people, and process meet. I am comfortable tracing a network issue, deploying a monitoring platform, coordinating a shift, or turning a control requirement into evidence that can actually be reviewed.', 'Saya bekerja di persimpangan infrastruktur, manusia, dan proses. Terbiasa menelusuri gangguan jaringan, membangun platform monitoring, mengoordinasikan shift, serta menerjemahkan kebutuhan kontrol menjadi bukti yang bisa ditinjau.'),
  approach: text('The common thread: make complex operations clearer, more reliable, and easier for the next person to own.', 'Benang merahnya: membuat operasi kompleks lebih jelas, andal, dan mudah dilanjutkan oleh tim.'),
  learning: text('Beyond the day job', 'Di luar pekerjaan'),
  rolebook: text('An independent CyberArk PAM L2 learning workspace: structured study, troubleshooting notes, and operational runbooks.', 'Ruang belajar mandiri CyberArk PAM L2: materi terstruktur, catatan troubleshooting, dan runbook operasional.'),
  openRolebook: text('Explore the rolebook', 'Buka rolebook'),
  education: text('Education', 'Pendidikan'),
  educationValue: text('Informatics Engineering, Sriwijaya University. Degree not completed.', 'Teknik Informatika, Universitas Sriwijaya. Pendidikan belum diselesaikan.'),
  languages: text('Languages', 'Bahasa'),
  languagesValue: text('Indonesian (native) / English (professional working proficiency)', 'Indonesia (bahasa ibu) / Inggris (kemampuan kerja profesional)'),
  contactTitle: text('LET\'S BUILD\nWHAT\'S NEXT.', 'MARI BANGUN\nLANGKAH BERIKUTNYA.'),
  contactIntro: text('Have a role or a challenge where reliable operations matter? Let\'s talk.', 'Punya peluang atau tantangan yang membutuhkan operasi IT andal? Mari berdiskusi.'),
  email: text('Get in touch', 'Hubungi saya'),
  copyEmail: text('Copy email address', 'Salin alamat email'),
  copied: text('Email copied', 'Email disalin'),
  copyFailed: text('Copy unavailable. Use the email link.', 'Salin tidak tersedia. Gunakan tautan email.'),
  pause: text('Pause animation', 'Jeda animasi'),
  play: text('Enable animation', 'Aktifkan animasi'),
  menu: text('Open navigation', 'Buka navigasi'),
  closeMenu: text('Close navigation', 'Tutup navigasi'),
  skip: text('Skip to content', 'Langsung ke konten'),
  back: text('Back to top', 'Kembali ke atas'),
  footer: text('Intentional systems. Meaningful work.', 'Sistem yang terarah. Karya yang bermakna.'),
};

export type ProjectCategory = 'infrastructure' | 'systems' | 'governance';
export type ProjectImage = {
  src: string;
  alt: Localized;
  caption: Localized;
  source: Localized;
  kind: 'photo' | 'diagram';
  width: number;
  height: number;
};
export type Project = {
  id: string;
  number: string;
  category: ProjectCategory;
  title: Localized;
  subtitle: Localized;
  context: Localized;
  challenge: Localized;
  contributions: Localized[];
  outcome: Localized;
  tools: string[];
  link?: string;
  cover?: ProjectImage;
  evidence?: ProjectImage[];
};

const archivePhoto = (name: string, page: number, caption: Localized, width: number, height: number): ProjectImage => ({
  src: `/assets/evidence/${name}.webp`, alt: caption, caption, width, height, kind: 'photo',
  source: text(`Owner's archived portfolio, p. ${page}. Public copy with privacy redactions.`, `Arsip portfolio pemilik, hal. ${page}. Salinan publik dengan penyamaran detail privat.`),
});
const lanPhotos = [
  archivePhoto('lan-equipment-1', 6, text('Network equipment from an enterprise LAN deployment.', 'Perangkat jaringan pada implementasi LAN enterprise.'), 570, 1011),
  archivePhoto('lan-equipment-2', 6, text('Additional equipment documentation from the same LAN project.', 'Dokumentasi perangkat tambahan dari proyek LAN yang sama.'), 667, 889),
];
const wirelessPhotos = [
  archivePhoto('wireless-field-1', 47, text('Field documentation from wireless installation and radio-alignment work.', 'Dokumentasi lapangan pekerjaan instalasi wireless dan pointing radio.'), 1280, 960),
  archivePhoto('wireless-field-2', 48, text('A second field record from the archived wireless deployment series.', 'Dokumentasi lapangan lain dari rangkaian implementasi wireless dalam arsip.'), 1280, 960),
];
const fiberPhotos = [
  archivePhoto('fiber-field-1', 55, text('Field documentation from fiber-optic wiring work.', 'Dokumentasi lapangan pekerjaan penarikan fiber optik.'), 1280, 960),
  archivePhoto('fiber-field-2', 57, text('Installation work from the archived fiber-optic project series.', 'Pekerjaan instalasi dari rangkaian proyek fiber optik dalam arsip.'), 1280, 960),
  archivePhoto('fiber-field-3', 61, text('Additional field evidence from fiber-optic network delivery.', 'Bukti lapangan tambahan dari implementasi jaringan fiber optik.'), 1280, 960),
];

export const projectCover = (project: Project): ProjectImage => project.cover ?? {
  src: `/assets/${project.id}.webp`, width: 1100, height: 650, kind: 'diagram',
  alt: text(`Illustrative diagram: ${project.subtitle.en}`, `Diagram ilustratif: ${project.subtitle.id}`),
  caption: text('Illustrative reconstruction of the project scope.', 'Rekonstruksi ilustratif lingkup proyek.'),
  source: text('Not a production screenshot or a live network topology.', 'Bukan screenshot produksi atau topologi jaringan aktif.'),
};

export const projects: Project[] = [
  {
    id: 'infrastructure', number: '01', category: 'infrastructure',
    title: text('Connected. Observable. Resilient.', 'Terhubung. Terpantau. Andal.'),
    subtitle: text('Enterprise infrastructure & multi-site networks', 'Infrastruktur enterprise & jaringan multi-lokasi'),
    context: text('PT ATI Business Group / IT Operations Supervisor / Mar 2024 - Aug 2026', 'PT ATI Business Group / IT Operations Supervisor / Mar 2024 - Agu 2026'),
    challenge: text('Keep infrastructure supportable across multiple business units, 500+ users, and a multi-site network while maintaining visibility and recovery readiness.', 'Menjaga infrastruktur bagi berbagai unit bisnis, 500+ pengguna, dan jaringan multi-lokasi tetap terkelola, terpantau, serta siap dipulihkan.'),
    contributions: [
      text('Delivered BGP routing across 7 sites, VLAN/DMZ segmentation, and firewall high-availability design across MikroTik, Sophos, and Ubiquiti environments.', 'Mengimplementasikan BGP di 7 lokasi, segmentasi VLAN/DMZ, serta desain high availability firewall pada lingkungan MikroTik, Sophos, dan Ubiquiti.'),
      text('Deployed Zabbix, Grafana, and Uptime Kuma on on-premise servers, including provisioning, hardening, tuning, and alerting.', 'Membangun Zabbix, Grafana, dan Uptime Kuma di server on-premise, termasuk provisioning, hardening, tuning, serta alerting.'),
      text('Implemented a Proxmox VE cluster and maintained Active Directory, Group Policy, WSUS, and departmental NAS backup operations.', 'Mengimplementasikan cluster Proxmox VE serta mengelola Active Directory, Group Policy, WSUS, dan operasional backup NAS.'),
    ],
    outcome: text('A more observable and supportable operating environment, with resilient routing, clearer security boundaries, and stronger recovery readiness. No unverified uptime or savings metrics are claimed.', 'Lingkungan operasional lebih terpantau dan terkelola, dengan routing resilien, batas keamanan jelas, serta kesiapan pemulihan. Tidak ada klaim uptime atau penghematan yang belum terverifikasi.'),
    tools: ['BGP', 'MikroTik', 'Sophos', 'Ubiquiti', 'Proxmox VE', 'Zabbix', 'Grafana', 'Active Directory'],
  },
  {
    id: 'atlas', number: '02', category: 'systems',
    title: text('ATLAS', 'ATLAS'),
    subtitle: text('Asset tracking & lifecycle administration', 'Pelacakan aset & administrasi siklus hidup'),
    context: text('Internal platform / IT asset management / Public source repository', 'Platform internal / Manajemen aset IT / Repositori kode publik'),
    challenge: text('Raw asset records do not tell the whole story. Teams need a clear view of ownership, assignments, procurement, and handover history.', 'Daftar aset saja belum cukup. Tim memerlukan gambaran jelas tentang kepemilikan, alokasi, pengadaan, dan riwayat serah terima.'),
    contributions: [
      text('Designed an operational workspace for asset allocation, owner references, catalog structure, and assignment governance.', 'Merancang ruang kerja untuk alokasi aset, referensi pemilik, struktur katalog, serta tata kelola penugasan aset.'),
      text('Developed lifecycle workflows covering inventory, procurement requests, employee assignments, and documented asset handovers.', 'Mengembangkan alur siklus hidup yang mencakup inventaris, permintaan pengadaan, alokasi karyawan, serta dokumentasi serah terima.'),
      text('Built a self-hosted application using Next.js, Fastify, PostgreSQL, and Docker, with operational documentation in the public repository.', 'Membangun aplikasi self-hosted menggunakan Next.js, Fastify, PostgreSQL, dan Docker, dengan dokumentasi operasional di repositori publik.'),
    ],
    outcome: text('Better traceability between an asset, its owner, and its lifecycle. Administrators gain a clearer operational view of allocation and governance.', 'Ketertelusuran lebih baik antara aset, pemilik, dan siklus hidupnya. Administrator mendapat gambaran alokasi serta tata kelola yang lebih jelas.'),
    tools: ['Next.js', 'TypeScript', 'Fastify', 'PostgreSQL', 'Prisma', 'Docker'],
    link: 'https://github.com/rickopra/ATLAS',
  },
  {
    id: 'operations', number: '03', category: 'systems',
    title: text('Less friction. Better handovers.', 'Serah terima lebih terstruktur.'),
    subtitle: text('SHIFT & CHECKLIST / Internal operations tools', 'SHIFT & CHECKLIST / Perangkat operasional internal'),
    context: text('PT ATI Business Group / Internal workflow design / Enterprise IT operations', 'PT ATI Business Group / Perancangan alur internal / Operasi IT enterprise'),
    challenge: text('Shift context and recurring controls can become fragmented across chats, spreadsheets, and individual memory.', 'Konteks antar-shift serta kontrol rutin mudah tersebar di percakapan, spreadsheet, dan ingatan masing-masing anggota tim.'),
    contributions: [
      text('Designed SHIFT around an active handover board, searchable work items, incoming acceptance, archives, and access administration.', 'Merancang SHIFT dengan papan serah terima aktif, pencarian pekerjaan, penerimaan shift, arsip, dan administrasi akses.'),
      text('Created CHECKLIST to bring daily, weekly, monthly, and ninety-day operational controls into one review surface.', 'Membuat CHECKLIST untuk menggabungkan kontrol harian, mingguan, bulanan, dan 90 hari dalam satu tempat peninjauan.'),
      text('Connected the tools to real supervisory needs: shift coordination, task ownership, completion visibility, and follow-up.', 'Menghubungkan alat dengan kebutuhan supervisi nyata: koordinasi shift, penanggung jawab, visibilitas penyelesaian, dan tindak lanjut.'),
    ],
    outcome: text('Clearer ownership between shifts and more consistent review of recurring work. Internal application data and production screens remain private.', 'Tanggung jawab antar-shift lebih jelas dan peninjauan pekerjaan rutin lebih konsisten. Data aplikasi internal serta layar produksi tetap privat.'),
    tools: ['Workflow design', 'Shift coordination', 'Recurring controls', 'IT operations', 'Documentation'],
  },
  {
    id: 'governance', number: '04', category: 'governance',
    title: text('Controls that stand up to review.', 'Kontrol yang siap ditinjau.'),
    subtitle: text('PCI DSS & ISO 27001 / Evidence-led operations', 'PCI DSS & ISO 27001 / Operasi berbasis bukti'),
    context: text('PT ATI Business Group / PCI DSS SAQ 2024 & 2025 / ISO/IEC 27001:2022 support', 'PT ATI Business Group / PCI DSS SAQ 2024 & 2025 / Dukungan ISO/IEC 27001:2022'),
    challenge: text('Compliance requirements must become working technical controls, controlled documents, and traceable evidence, not just completed checklists.', 'Persyaratan compliance perlu diwujudkan menjadi kontrol teknis aktif, dokumen terkendali, dan bukti tertelusur, bukan sekadar checklist selesai.'),
    contributions: [
      text('Coordinated PCI DSS SAQ activities across the 2024 and 2025 cycles: evidence mapping, technical walkthroughs, remediation follow-up, and re-validation.', 'Mengoordinasikan PCI DSS SAQ siklus 2024 dan 2025: pemetaan bukti, walkthrough teknis, tindak lanjut remediasi, serta validasi ulang.'),
      text('Maintained controlled documents, logging and retention evidence, endpoint protection, access governance, patch records, and network-security controls.', 'Mengelola dokumen terkendali, bukti logging dan retensi, proteksi endpoint, tata kelola akses, catatan patch, serta kontrol keamanan jaringan.'),
      text('Represented IT Operations as an operational risk owner and performed assigned cross-department internal audits with corrective-action and closure follow-up.', 'Mewakili IT Operations sebagai operational risk owner serta menjalankan audit internal lintas departemen yang ditugaskan, termasuk tindak lanjut perbaikan dan penutupan temuan.'),
    ],
    outcome: text('A connected chain from requirement to implementation and reviewable evidence. Scope: operational control owner and internal audit support, not external certification auditor or ISMS steering committee member.', 'Keterhubungan antara persyaratan, implementasi, dan bukti yang bisa ditinjau. Lingkup: pemilik kontrol operasional dan dukungan audit internal, bukan auditor sertifikasi eksternal atau anggota komite pengarah ISMS.'),
    tools: ['PCI DSS SAQ', 'ISO/IEC 27001:2022', 'Wazuh', 'ELK Stack', 'CrowdStrike', 'SOPs', 'Internal audit'],
  },
];

const legacyContext = text('PT Telemedia Prima Nusantara / Network Engineer & NOC / Mar 2021 - Feb 2022', 'PT Telemedia Prima Nusantara / Network Engineer & NOC / Mar 2021 - Feb 2022');

projects.push(
  {
    id: 'lan', number: '05', category: 'infrastructure',
    title: text('LAN reconstruction', 'Rekonstruksi LAN'),
    subtitle: text('Enterprise & public-sector network delivery', 'Implementasi jaringan enterprise & sektor publik'),
    context: legacyContext,
    challenge: text('Different client sites needed local networks with manageable user segments, internet access rules, and visibility into bandwidth use.', 'Beragam lokasi pelanggan membutuhkan jaringan lokal dengan segmen pengguna yang terkelola, aturan akses internet, dan visibilitas pemakaian bandwidth.'),
    contributions: [
      text('Rebuilt enterprise LAN infrastructure with MikroTik routing and multi-vendor switching, including D-Link and Cisco devices.', 'Membangun ulang infrastruktur LAN enterprise dengan routing MikroTik dan switching lintas vendor, termasuk perangkat D-Link serta Cisco.'),
      text('Implemented RB1100AH and CRS326 switching for a provincial healthcare office serving approximately 150 users, with VLAN segmentation and DHCP per room segment.', 'Mengimplementasikan RB1100AH dan switching CRS326 pada kantor dinas kesehatan provinsi dengan sekitar 150 pengguna, disertai segmentasi VLAN dan DHCP per segmen ruangan.'),
      text('Configured a training-center network using RB450G, two ISPs, failover, and L2TP connectivity.', 'Mengonfigurasi jaringan pusat pelatihan menggunakan RB450G, dua ISP, failover, serta konektivitas L2TP.'),
      text('Delivered court-office routing and access filtering with CCR1009 and RB3011, organizing VLAN/DHCP segments to make user traffic easier to trace.', 'Mengimplementasikan routing dan filter akses kantor pengadilan menggunakan CCR1009 serta RB3011, menata segmen VLAN/DHCP agar trafik pengguna lebih mudah ditelusuri.'),
    ],
    outcome: text('Clearer segmentation, traceable bandwidth usage, and documented equipment across multiple client environments. The archive supports the implementation scope, not a measured uptime claim.', 'Segmentasi lebih jelas, pemakaian bandwidth tertelusur, dan dokumentasi perangkat pada beberapa lingkungan pelanggan. Arsip mendukung lingkup implementasi, bukan klaim pengukuran uptime.'),
    tools: ['MikroTik', 'RB1100AH', 'CRS326', 'CCR1009', 'RB3011', 'VLAN', 'DHCP', 'L2TP', 'Dual ISP'],
    cover: lanPhotos[0], evidence: lanPhotos,
  },
  {
    id: 'noc', number: '06', category: 'systems',
    title: text('NOC alerts & tunnel automation', 'Notifikasi NOC & otomasi tunnel'),
    subtitle: text('Telegram notifications / Netwatch / L2TP', 'Notifikasi Telegram / Netwatch / L2TP'),
    context: legacyContext,
    challenge: text('NOC operators needed prompt visibility into link changes and a repeatable way to respond when a tunnel endpoint stopped responding.', 'Operator NOC membutuhkan visibilitas perubahan link dan respons berulang yang konsisten ketika endpoint tunnel tidak merespons.'),
    contributions: [
      text('Built Telegram notifications for connection up/down events and latency information, with monitoring intervals documented at 1-5 minutes.', 'Membangun notifikasi Telegram untuk status koneksi up/down serta informasi latensi, dengan interval monitoring yang terdokumentasi 1-5 menit.'),
      text('Used MikroTik Netwatch checks to drive L2TP endpoint switching, with scripted checks and delays around the transition.', 'Menggunakan pemeriksaan MikroTik Netwatch untuk pergantian endpoint L2TP, disertai pemeriksaan dan jeda pada script transisi.'),
      text('Documented the alert and tunnel-switching configuration in the old portfolio. Public diagrams summarize the logic without exposing scripts, bot credentials, or endpoint addresses.', 'Mendokumentasikan konfigurasi notifikasi dan pergantian tunnel dalam portfolio lama. Diagram publik merangkum logika tanpa membuka script, kredensial bot, atau alamat endpoint.'),
    ],
    outcome: text('Link events became visible through a shared notification channel; tunnel responses followed a defined automated sequence. No measured recovery-time improvement is claimed.', 'Perubahan link terlihat melalui kanal notifikasi bersama; respons tunnel mengikuti urutan otomatis yang terdefinisi. Tidak ada klaim angka peningkatan waktu pemulihan.'),
    tools: ['MikroTik RouterOS', 'Netwatch', 'L2TP', 'Telegram Bot API', 'RouterOS scripting'],
  },
  {
    id: 'ftth', number: '07', category: 'infrastructure',
    title: text('FTTH planning & mapping', 'Perencanaan & pemetaan FTTH'),
    subtitle: text('Residential coverage, survey, and distribution planning', 'Cakupan perumahan, survei, dan rencana distribusi'),
    context: legacyContext,
    challenge: text('Residential fiber deployments required route and distribution planning before cable installation, taking future coverage into account.', 'Implementasi fiber perumahan membutuhkan rencana rute dan distribusi sebelum penarikan kabel, dengan mempertimbangkan cakupan ke depan.'),
    contributions: [
      text('Participated in field and drone surveys for residential FTTH planning, including Green Center Park and Citra Indah coverage areas.', 'Terlibat dalam survei lapangan dan drone untuk perencanaan FTTH perumahan, termasuk area cakupan Green Center Park serta Citra Indah.'),
      text('Mapped cable routes in Google Earth Pro and planned junction-box, ODC, and ODP placement for the distribution network.', 'Memetakan rute kabel di Google Earth Pro serta merencanakan penempatan junction box, ODC, dan ODP untuk jaringan distribusi.'),
      text('Connected mapping work to implementation planning with the field team. The public visual is a process reconstruction; exact routes and infrastructure coordinates remain private.', 'Menghubungkan hasil pemetaan dengan perencanaan implementasi bersama tim lapangan. Visual publik berupa rekonstruksi proses; rute persis dan koordinat infrastruktur tetap privat.'),
    ],
    outcome: text('A documented planning basis for residential distribution and field execution. The archive records route planning, not a verified subscriber or coverage-growth metric.', 'Dasar perencanaan terdokumentasi untuk distribusi perumahan dan eksekusi lapangan. Arsip menunjukkan pekerjaan pemetaan, bukan angka pelanggan atau pertumbuhan cakupan terverifikasi.'),
    tools: ['Google Earth Pro', 'Drone survey', 'FTTH', 'Junction box', 'ODC', 'ODP'],
  },
  {
    id: 'wireless', number: '08', category: 'infrastructure',
    title: text('Wireless links, end to end', 'Implementasi link wireless'),
    subtitle: text('PTP / PTMP planning, installation, and radio alignment', 'Perencanaan PTP / PTMP, instalasi, dan pointing radio'),
    context: legacyContext,
    challenge: text('Client and POP locations across city and out-of-city sites needed wireless links planned around distance, elevation, radio capability, and local frequency conditions.', 'Lokasi pelanggan dan POP di dalam maupun luar kota memerlukan link wireless sesuai jarak, elevasi, kemampuan radio, dan kondisi frekuensi setempat.'),
    contributions: [
      text('Assessed link feasibility with Ubiquiti link planning, including location coordinates, distance, and antenna heights.', 'Menilai kelayakan link melalui perencanaan Ubiquiti, termasuk titik lokasi, jarak, dan ketinggian antena.'),
      text('Configured MikroTik wireless links, including WDS/PTMP scenarios, frequency surveys, and scan lists.', 'Mengonfigurasi link wireless MikroTik, termasuk skenario WDS/PTMP, survei frekuensi, serta scan list.'),
      text('Installed radios and carried out pointing/alignment with the field team; documented deployments and signal checks in the project archive.', 'Memasang radio dan melakukan pointing bersama tim lapangan; mendokumentasikan implementasi serta pemeriksaan sinyal dalam arsip proyek.'),
    ],
    outcome: text('Hands-on ownership from link planning to on-site radio setup and alignment, supported by original field photographs.', 'Tanggung jawab langsung dari perencanaan link hingga pemasangan dan pointing radio di lokasi, didukung foto lapangan asli.'),
    tools: ['MikroTik', 'Ubiquiti', 'PTP', 'PTMP', 'WDS', 'Frequency survey', 'Radio alignment'],
    cover: wirelessPhotos[0], evidence: wirelessPhotos,
  },
  {
    id: 'fiber', number: '09', category: 'infrastructure',
    title: text('Fiber-optic field delivery', 'Implementasi fiber optik'),
    subtitle: text('Wiring, maintenance, and access equipment', 'Penarikan kabel, pemeliharaan, dan perangkat akses'),
    context: legacyContext,
    challenge: text('Municipal, residential, and broadband client projects needed physical fiber delivery coordinated with network and subscriber-access configuration.', 'Proyek pemerintah kota, perumahan, serta pelanggan broadband membutuhkan implementasi fisik fiber yang selaras dengan konfigurasi jaringan dan akses pelanggan.'),
    contributions: [
      text('Executed fiber-optic wiring for public-sector and residential sites, including CCTV connectivity and broadband client installations.', 'Melaksanakan penarikan fiber optik pada lokasi sektor publik serta perumahan, termasuk konektivitas CCTV dan instalasi pelanggan broadband.'),
      text('Participated in fiber maintenance and field implementation with the network team, documented in the old portfolio photo series.', 'Terlibat dalam pemeliharaan fiber serta implementasi lapangan bersama tim jaringan, terdokumentasi pada rangkaian foto portfolio lama.'),
      text('Installed and configured OLT/ONT equipment; the archive includes CCR1016, PPPoE, and HSGQ-E04 OLT implementation records.', 'Memasang dan mengonfigurasi perangkat OLT/ONT; arsip mencakup catatan implementasi CCR1016, PPPoE, serta OLT HSGQ-E04.'),
    ],
    outcome: text('Practical experience spanning physical fiber installation and access-network setup. Public evidence is limited to selected field photos; subscriber and equipment configuration stays private.', 'Pengalaman langsung mencakup instalasi fisik fiber dan penyiapan jaringan akses. Bukti publik dibatasi pada foto lapangan terpilih; konfigurasi pelanggan serta perangkat tetap privat.'),
    tools: ['Fiber optic', 'FTTH', 'OLT', 'ONT', 'MikroTik CCR1016', 'PPPoE', 'HSGQ-E04', 'CCTV connectivity'],
    cover: fiberPhotos[0], evidence: fiberPhotos,
  },
);

const careerRecords = [
  {
    period: text('MAR 2024 - AUG 2026', 'MAR 2024 - AGU 2026'),
    role: 'IT Operations Supervisor', company: 'PT ATI Business Group', location: 'Jakarta',
    summary: text('Enterprise operations, with hands-on technical ownership.', 'Operasi enterprise dengan tanggung jawab teknis langsung.'),
    tools: ['Zabbix', 'Grafana', 'Uptime Kuma', 'Proxmox VE', 'Active Directory', 'WSUS', 'Wazuh', 'ELK', 'CrowdStrike', 'BGP', 'MikroTik', 'Sophos', 'Ubiquiti', 'iTop', 'GLPI', 'Snipe-IT', 'Thecus NAS'],
    projectIds: ['infrastructure', 'atlas', 'operations', 'governance'],
    sections: [
      { title: text('Operations & team coordination', 'Operasional & koordinasi tim'), points: [
        text('Oversaw day-to-day IT operations and infrastructure support for 500+ users across multiple business units, including workload allocation, 24/7 shift planning, and cross-functional coordination.', 'Mengawasi operasional IT dan dukungan infrastruktur untuk 500+ pengguna lintas unit bisnis, termasuk pembagian beban kerja, perencanaan shift 24/7, dan koordinasi lintas fungsi.'),
        text('Rolled out iTop, GLPI, and Snipe-IT to support SLA control, asset visibility, service workflows, and inventory administration.', 'Mengimplementasikan iTop, GLPI, dan Snipe-IT untuk mendukung kontrol SLA, visibilitas aset, alur layanan, dan administrasi inventaris.'),
        text('Designed and enhanced SHIFT, CHECKLIST, and ATLAS for shift handovers, recurring controls, task ownership, and semi-automated operational workflows.', 'Merancang dan mengembangkan SHIFT, CHECKLIST, serta ATLAS untuk serah terima shift, kontrol berkala, penanggung jawab tugas, dan alur operasional semi-otomatis.'),
      ] },
      { title: text('Systems, monitoring & security', 'Sistem, monitoring & keamanan'), points: [
        text('Architected and deployed Zabbix, Grafana, and Uptime Kuma on on-premise servers, covering OS provisioning, server hardening, performance tuning, and alerting.', 'Merancang dan membangun Zabbix, Grafana, serta Uptime Kuma di server on-premise, mencakup provisioning OS, hardening server, tuning performa, dan alerting.'),
        text('Implemented a Proxmox VE cluster for server consolidation, availability, and recovery readiness.', 'Mengimplementasikan cluster Proxmox VE untuk konsolidasi server, ketersediaan layanan, dan kesiapan pemulihan.'),
        text('Maintained Active Directory, authentication services, Group Policy, and WSUS patch governance.', 'Mengelola Active Directory, layanan autentikasi, Group Policy, dan tata kelola patch melalui WSUS.'),
        text('Integrated Wazuh, ELK Stack, and CrowdStrike for centralized logging, security visibility, and incident handling.', 'Mengintegrasikan Wazuh, ELK Stack, serta CrowdStrike untuk logging terpusat, visibilitas keamanan, dan penanganan insiden.'),
        text('Managed Thecus NAS for departmental backups, access control, and retention requirements.', 'Mengelola Thecus NAS untuk backup departemen, kontrol akses, dan kebutuhan retensi.'),
      ] },
      { title: text('Network delivery & resilience', 'Implementasi & ketahanan jaringan'), points: [
        text('Delivered BGP routing across 7 sites for failover and redundancy, with VLAN and DMZ segmentation for isolation and traffic control.', 'Mengimplementasikan routing BGP di 7 lokasi untuk failover dan redundansi, disertai segmentasi VLAN serta DMZ untuk isolasi dan kontrol trafik.'),
        text('Implemented LAN, WAN, and DMZ firewall zoning with HA design; integrated MikroTik, Sophos, and Ubiquiti for load balancing and failover.', 'Menerapkan zona firewall LAN, WAN, dan DMZ dengan desain HA; mengintegrasikan MikroTik, Sophos, serta Ubiquiti untuk load balancing dan failover.'),
        text('Deployed Wi-Fi mesh infrastructure across multiple sites to extend enterprise connectivity and coverage.', 'Membangun infrastruktur Wi-Fi mesh di beberapa lokasi untuk memperluas konektivitas dan cakupan enterprise.'),
      ] },
      { title: text('Governance & audit support', 'Tata kelola & dukungan audit'), points: [
        text('Produced SOPs, technical procedures, controlled documents, and audit-ready evidence supporting PCI DSS and ISO/IEC 27001:2022.', 'Menyusun SOP, prosedur teknis, dokumen terkendali, dan bukti siap audit untuk mendukung PCI DSS serta ISO/IEC 27001:2022.'),
        text('Coordinated PCI DSS SAQ activities in 2024 and 2025, including evidence mapping, technical walkthroughs, remediation follow-up, and re-validation.', 'Mengoordinasikan PCI DSS SAQ pada 2024 dan 2025, mencakup pemetaan bukti, walkthrough teknis, tindak lanjut remediasi, serta validasi ulang.'),
        text('Represented IT Operations as an operational risk owner and performed assigned cross-department internal audits, including corrective-action and closure follow-up. Scope did not include external certification auditing or ISMS steering-committee membership.', 'Mewakili IT Operations sebagai pemilik risiko operasional dan menjalankan audit internal lintas departemen yang ditugaskan, termasuk tindak lanjut perbaikan serta penutupan temuan. Lingkup tidak mencakup auditor sertifikasi eksternal atau anggota komite pengarah ISMS.'),
      ] },
    ],
  },
  {
    period: text('OCT 2022 - MAR 2024', 'OKT 2022 - MAR 2024'),
    role: 'IT Operations Staff', company: 'PT ATI Business Group', location: 'Jakarta',
    summary: text('The operational foundation: systems, networks, and users.', 'Fondasi operasional: sistem, jaringan, dan pengguna.'),
    tools: ['WSUS', 'Email administration', 'MikroTik', 'Sophos', 'Ubiquiti', 'CCTV', 'IT asset inventory'],
    projectIds: [],
    sections: [
      { title: text('Systems & end-user support', 'Sistem & dukungan pengguna'), points: [
        text('Served as system administrator for WSUS and company email domains.', 'Menjadi system administrator untuk WSUS dan domain email perusahaan.'),
        text('Troubleshot hardware, software, and connectivity issues for end users.', 'Menangani gangguan perangkat keras, perangkat lunak, dan konektivitas pengguna.'),
        text('Resolved enterprise-software implementation issues and supported internal system updates.', 'Menyelesaikan kendala implementasi perangkat lunak enterprise dan mendukung pembaruan sistem internal.'),
        text('Maintained and documented internal IT asset inventory with current ownership and device records.', 'Memelihara dan mendokumentasikan inventaris aset IT internal beserta catatan perangkat serta kepemilikannya.'),
      ] },
      { title: text('Network & infrastructure operations', 'Operasi jaringan & infrastruktur'), points: [
        text('Administered network infrastructure across MikroTik, Sophos, and Ubiquiti environments.', 'Mengadministrasikan infrastruktur jaringan MikroTik, Sophos, dan Ubiquiti.'),
        text('Monitored internal server performance and network traffic as the operational PIC for systems and networks.', 'Memantau performa server internal serta trafik jaringan sebagai PIC operasional sistem dan jaringan.'),
        text('Configured, monitored, and troubleshot internal CCTV systems.', 'Mengonfigurasi, memantau, dan menangani gangguan sistem CCTV internal.'),
      ] },
    ],
  },
  {
    period: text('APR 2022 - OCT 2022', 'APR 2022 - OKT 2022'),
    role: 'IT Support Specialist', company: 'PT Mandiangin Batubara', location: 'South Sumatra',
    summary: text('Site operations and practical infrastructure support.', 'Operasi lokasi dan dukungan infrastruktur langsung.'),
    tools: ['Motorola', 'AMTISS', 'SAM-IT', 'LAN', 'CCTV', 'Server operations'],
    projectIds: [],
    sections: [
      { title: text('Site communications & applications', 'Komunikasi lokasi & aplikasi'), points: [
        text('Set up and configured handheld and rig communication radios, primarily Motorola devices.', 'Menyiapkan dan mengonfigurasi radio komunikasi HT serta rig, terutama perangkat Motorola.'),
        text('Acted as PIC for AMTISS, SAM-IT, and the internal Thriveni cloud platform.', 'Menjadi PIC AMTISS, SAM-IT, serta platform cloud internal Thriveni.'),
        text('Performed end-user maintenance and troubleshooting while maintaining internal IT asset documentation.', 'Melakukan pemeliharaan dan troubleshooting perangkat pengguna serta menjaga dokumentasi aset IT internal.'),
      ] },
      { title: text('Local infrastructure & controls', 'Infrastruktur lokal & kontrol'), points: [
        text('Installed, configured, maintained, and troubleshot the local network and internal CCTV systems.', 'Memasang, mengonfigurasi, memelihara, dan menangani gangguan jaringan lokal serta CCTV internal.'),
        text('Monitored traffic and served as PIC for internal servers across both system and network operations.', 'Memantau trafik dan menjadi PIC server internal dalam lingkup operasional sistem serta jaringan.'),
        text('Supported ISO 27001 documentation and technical implementation within a server-room-only scope, not as a member of the ISMS team.', 'Mendukung dokumentasi dan implementasi teknis ISO 27001 khusus lingkup ruang server, bukan sebagai anggota tim ISMS.'),
      ] },
    ],
  },
  {
    period: text('FEB 2022 - APR 2022', 'FEB 2022 - APR 2022'),
    role: 'IT Support Plant', company: 'PT Hokkan Deltapack Industry', location: 'Banyuasin',
    summary: text('Reliable day-to-day technology on the plant floor.', 'Keandalan teknologi harian di lingkungan pabrik.'),
    tools: ['QNAP NAS', 'PC maintenance', 'Printers', 'Fingerprint devices', 'IoT planning'],
    projectIds: [],
    sections: [
      { title: text('Plant technology support', 'Dukungan teknologi pabrik'), points: [
        text('Maintained QNAP NAS infrastructure and plant end-user devices.', 'Memelihara infrastruktur QNAP NAS dan perangkat pengguna di pabrik.'),
        text('Connected and configured PCs, printers, and fingerprint attendance devices.', 'Menghubungkan dan mengonfigurasi PC, printer, serta perangkat absensi sidik jari.'),
        text('Supported IoT-related project planning and optimization of utility software.', 'Mendukung perencanaan proyek terkait IoT serta optimalisasi perangkat lunak utilitas.'),
        text('Provided user guidance for internal utility software used by plant personnel.', 'Memberikan panduan penggunaan perangkat lunak utilitas internal kepada pengguna di pabrik.'),
      ] },
    ],
  },
  {
    period: text('MAR 2021 - FEB 2022', 'MAR 2021 - FEB 2022'),
    role: 'Network Engineer & NOC', company: 'PT Telemedia Prima Nusantara', location: 'Palembang',
    summary: text('Where it started: field engineering and ISP operations.', 'Awal perjalanan: rekayasa lapangan dan operasi ISP.'),
    tools: ['MikroTik RouterOS', 'Ubiquiti', 'VLAN / DHCP', 'Netwatch', 'L2TP', 'Telegram', 'Google Earth Pro', 'PTP / PTMP', 'FTTH', 'OLT / ONT'],
    projectIds: ['lan', 'noc', 'ftth', 'wireless', 'fiber'],
    sections: [
      { title: text('Client networks & ISP operations', 'Jaringan pelanggan & operasional ISP'), points: [
        text('Reconstructed, deployed, and maintained local networks for government, healthcare, enterprise, and residential clients in South Sumatra.', 'Merekonstruksi, membangun, dan memelihara jaringan lokal pelanggan pemerintah, kesehatan, enterprise, serta perumahan di Sumatera Selatan.'),
        text('Delivered broadband and dedicated internet connectivity for hospitals, offices, and private-sector sites.', 'Mengimplementasikan konektivitas internet broadband dan dedicated untuk rumah sakit, kantor, serta pelanggan swasta.'),
        text('Configured MikroTik routing, VLAN/DHCP segmentation, bandwidth visibility, dual-ISP failover, and site-to-site connectivity; supported backbone and DNS optimization.', 'Mengonfigurasi routing MikroTik, segmentasi VLAN/DHCP, visibilitas bandwidth, failover dua ISP, dan konektivitas antar-lokasi; mendukung optimalisasi backbone serta DNS.'),
        text('Built Telegram operational alerts and MikroTik Netwatch/L2TP routing automation to improve incident visibility and tunnel continuity.', 'Membangun notifikasi operasional Telegram serta otomasi routing MikroTik Netwatch/L2TP untuk visibilitas insiden dan kontinuitas tunnel.'),
      ] },
      { title: text('Wireless & fiber field delivery', 'Implementasi wireless & fiber di lapangan'), points: [
        text('Planned PTP/PTMP wireless links, assessed distance and antenna heights, surveyed frequencies, and installed, configured, and aligned radios for client and POP deployments.', 'Merencanakan link wireless PTP/PTMP, menilai jarak serta ketinggian antena, melakukan survei frekuensi, dan memasang, mengonfigurasi, serta pointing radio pada lokasi pelanggan dan POP.'),
        text('Performed LTE and fiber-optic installations alongside wireless deployments in city and remote-site environments.', 'Melakukan instalasi LTE dan fiber optik bersama implementasi wireless di lingkungan kota maupun lokasi luar kota.'),
        text('Mapped FTTH coverage and cable routes using field surveys, drone documentation, and Google Earth Pro; planned junction boxes, ODC, and ODP locations for residential coverage.', 'Memetakan cakupan FTTH dan rute kabel melalui survei lapangan, dokumentasi drone, serta Google Earth Pro; merencanakan titik junction box, ODC, dan ODP untuk cakupan perumahan.'),
        text('Executed fiber-optic wiring and maintenance for public-sector, residential, and broadband client sites, including CCTV network connectivity.', 'Melaksanakan penarikan dan pemeliharaan fiber optik untuk sektor publik, perumahan, serta pelanggan broadband, termasuk konektivitas jaringan CCTV.'),
        text('Installed and configured OLT/ONT access equipment and supported PPPoE-based subscriber connectivity.', 'Memasang dan mengonfigurasi perangkat akses OLT/ONT serta mendukung konektivitas pelanggan berbasis PPPoE.'),
      ] },
    ],
  },
  {
    period: text('JUN 2018 - AUG 2018', 'JUN 2018 - AGU 2018'),
    role: 'IT Internship', company: 'PT Angkasa Pura II', location: 'Palembang',
    summary: text('Early exposure to operational systems in an airport environment.', 'Pengalaman awal sistem operasional di lingkungan bandara.'),
    tools: ['System project support', 'Operational monitoring'],
    projectIds: [],
    sections: [{ title: text('Internship scope', 'Lingkup magang'), points: [
      text('Supported a system project for the airport parking-area environment.', 'Mendukung proyek sistem untuk lingkungan area parkir bandara.'),
      text('Assisted with flight traffic monitoring activities in an operational airport environment.', 'Membantu aktivitas pemantauan lalu lintas penerbangan di lingkungan operasional bandara.'),
    ] }],
  },
];

export const experiences = careerRecords.map(item => ({ ...item, points: item.sections.flatMap(section => section.points) }));

export const capabilities = [
  { title: text('Infrastructure & systems', 'Infrastruktur & sistem'), tools: ['Proxmox VE', 'Windows Server', 'Active Directory', 'WSUS', 'NAS'] },
  { title: text('Networks & resilience', 'Jaringan & ketahanan'), tools: ['MikroTik', 'Sophos', 'Ubiquiti', 'BGP', 'VLAN / DMZ', 'FTTH'] },
  { title: text('Observability & security', 'Observabilitas & keamanan'), tools: ['Zabbix', 'Grafana', 'Uptime Kuma', 'Wazuh', 'ELK', 'CrowdStrike'] },
  { title: text('Operations & governance', 'Operasi & tata kelola'), tools: ['GLPI', 'iTop', 'Snipe-IT', 'PCI DSS', 'ISO 27001', 'SOPs'] },
];
