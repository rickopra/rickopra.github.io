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

export const experiences = [
  {
    period: text('MAR 2024 - AUG 2026', 'MAR 2024 - AGU 2026'),
    role: 'IT Operations Supervisor', company: 'PT ATI Business Group', location: 'Jakarta',
    summary: text('Enterprise operations, with hands-on technical ownership.', 'Operasi enterprise dengan tanggung jawab teknis langsung.'),
    points: [
      text('Supervised day-to-day IT operations supporting 500+ users, including workload allocation, 24/7 shift planning, and cross-functional coordination.', 'Mengawasi operasi IT harian untuk 500+ pengguna, termasuk pembagian pekerjaan, perencanaan shift 24/7, serta koordinasi lintas fungsi.'),
      text('Delivered multi-site BGP, enterprise monitoring, Proxmox virtualization, ITSM/ITAM platforms, and internal operational applications.', 'Mengimplementasikan BGP multi-lokasi, monitoring enterprise, virtualisasi Proxmox, platform ITSM/ITAM, serta aplikasi operasional internal.'),
      text('Supported PCI DSS SAQ cycles and ISO/IEC 27001:2022 controls through documentation, technical implementation, evidence, and internal audit activities.', 'Mendukung siklus PCI DSS SAQ dan kontrol ISO/IEC 27001:2022 melalui dokumentasi, implementasi teknis, bukti, serta audit internal.'),
    ],
  },
  {
    period: text('OCT 2022 - MAR 2024', 'OKT 2022 - MAR 2024'),
    role: 'IT Operations Staff', company: 'PT ATI Business Group', location: 'Jakarta',
    summary: text('The operational foundation: systems, networks, and users.', 'Fondasi operasional: sistem, jaringan, dan pengguna.'),
    points: [
      text('Administered WSUS and email domains; provided hardware, software, and connectivity support.', 'Mengelola WSUS serta domain email; mendukung perangkat keras, perangkat lunak, dan konektivitas.'),
      text('Maintained server and network operations across MikroTik, Sophos, and Ubiquiti, together with asset records and CCTV systems.', 'Mengelola operasi server dan jaringan MikroTik, Sophos, serta Ubiquiti, termasuk inventaris aset dan sistem CCTV.'),
    ],
  },
  {
    period: text('APR 2022 - OCT 2022', 'APR 2022 - OKT 2022'),
    role: 'IT Support Specialist', company: 'PT Mandiangin Batubara', location: 'South Sumatra',
    summary: text('Site operations and practical infrastructure support.', 'Operasi lokasi dan dukungan infrastruktur langsung.'),
    points: [
      text('Supported local networks, servers, CCTV, Motorola radios, and internal operational platforms in the Thriveni Group environment.', 'Mendukung jaringan lokal, server, CCTV, radio Motorola, serta platform operasional internal di lingkungan Thriveni Group.'),
      text('Supported ISO 27001 documentation and technical implementation within a server-room-only scope, not as a member of the ISMS team.', 'Mendukung dokumentasi dan implementasi teknis ISO 27001 khusus lingkup ruang server, bukan sebagai anggota tim ISMS.'),
    ],
  },
  {
    period: text('FEB 2022 - APR 2022', 'FEB 2022 - APR 2022'),
    role: 'IT Support Plant', company: 'PT Hokkan Deltapack Industry', location: 'Banyuasin',
    summary: text('Reliable day-to-day technology on the plant floor.', 'Keandalan teknologi harian di lingkungan pabrik.'),
    points: [
      text('Maintained QNAP NAS, end-user devices, printers, and fingerprint devices; supported utility software and IoT-related project planning.', 'Mengelola QNAP NAS, perangkat pengguna, printer, serta perangkat sidik jari; mendukung perangkat lunak utilitas dan perencanaan proyek IoT.'),
    ],
  },
  {
    period: text('MAR 2021 - FEB 2022', 'MAR 2021 - FEB 2022'),
    role: 'Network Engineer & NOC', company: 'PT Telemedia Prima Nusantara', location: 'Palembang',
    summary: text('Where it started: field engineering and ISP operations.', 'Awal perjalanan: rekayasa lapangan dan operasi ISP.'),
    points: [
      text('Delivered network reconstruction, wireless PTP/PTMP, fiber-optic installations, and FTTH planning for government, healthcare, enterprise, and residential sites.', 'Menjalankan rekonstruksi jaringan, wireless PTP/PTMP, instalasi fiber optik, serta perencanaan FTTH untuk pemerintah, kesehatan, enterprise, dan perumahan.'),
      text('Built Telegram operational alerts and MikroTik Netwatch/L2TP routing automation to improve incident visibility and tunnel continuity.', 'Membangun notifikasi operasional Telegram serta otomasi routing MikroTik Netwatch/L2TP untuk visibilitas insiden dan kontinuitas tunnel.'),
    ],
  },
  {
    period: text('JUN 2018 - AUG 2018', 'JUN 2018 - AGU 2018'),
    role: 'IT Internship', company: 'PT Angkasa Pura II', location: 'Palembang',
    summary: text('Early exposure to operational systems in an airport environment.', 'Pengalaman awal sistem operasional di lingkungan bandara.'),
    points: [text('Supported a parking-area system project and assisted with flight traffic monitoring activities.', 'Mendukung proyek sistem area parkir serta aktivitas pemantauan lalu lintas penerbangan.')],
  },
];

export const capabilities = [
  { title: text('Infrastructure & systems', 'Infrastruktur & sistem'), tools: ['Proxmox VE', 'Windows Server', 'Active Directory', 'WSUS', 'NAS'] },
  { title: text('Networks & resilience', 'Jaringan & ketahanan'), tools: ['MikroTik', 'Sophos', 'Ubiquiti', 'BGP', 'VLAN / DMZ', 'FTTH'] },
  { title: text('Observability & security', 'Observabilitas & keamanan'), tools: ['Zabbix', 'Grafana', 'Uptime Kuma', 'Wazuh', 'ELK', 'CrowdStrike'] },
  { title: text('Operations & governance', 'Operasi & tata kelola'), tools: ['GLPI', 'iTop', 'Snipe-IT', 'PCI DSS', 'ISO 27001', 'SOPs'] },
];
