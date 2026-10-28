export const conditions = ["Menstruasi", "Hamil", "Menyusui"];

export const symptoms = {
  Menstruasi: [
    "Nyeri/kram",
    "Sakit kepala",
    "Kembung",
    "Pusing",
    "Mual",
    "Perubahan suasana hati",
  ],
  Hamil: [
    "Sakit kepala",
    "Pusing",
    "Mual",
    "Lemas/kelelahan",
    "Sangat haus",
    "Rasa panas/tidak nyaman karena panas",
  ],
  Menyusui: [
    "Lelah/kelelahan",
    "Pusing",
    "Sakit kepala",
    "Merasa kepanasan",
    "Sulit beristirahat",
    "Ketidaknyamanan saat menyusui",
  ],
};

export const coreQuestions = {
  Menstruasi: [
    [
      "Hari keberapa menstruasimu saat ini?",
      [],
    ],
    [
      "Bagaimana aliran menstruasimu hari ini?",
      [
        "Ringan",
        "Sedang",
        "Banyak",
        "Lebih banyak dari biasanya",
        "Tidak yakin",
      ],
    ],
    [
      "Dibandingkan menstruasimu biasanya, bagaimana kondisi hari ini?",
      [
        "Lebih ringan",
        "Kurang lebih sama",
        "Lebih berat",
        "Terasa berbeda dari biasanya",
        "Tidak yakin",
      ],
    ],
    [
      "Kira-kira berapa lama kamu berada di luar ruangan hari ini?",
      [
        "Tidak berada di luar",
        "<1 jam",
        "1–3 jam",
        "3–6 jam",
        ">6 jam",
      ],
    ],
  ],

  Hamil: [
    ["Berapa usia kehamilanmu saat ini?", ["Trimester 1", "Trimester 2", "Trimester 3", "Tidak yakin"]],
    ["Kira-kira berapa lama kamu berada di luar ruangan hari ini?", ["Tidak berada di luar", "<1 jam", "1–3 jam", "3–6 jam", ">6 jam"]],
    ["Apa yang mudah kamu akses saat lingkungan terasa panas?", ["Air minum", "Tempat teduh", "Tempat lebih sejuk", "Waktu beristirahat", "Tidak ada dari pilihan di atas"]],
  ],
  
  Menyusui: [
    [
      "Apakah kamu sedang menyusui saat ini?",
      ["Ya", "Tidak", "Tidak ingin menjawab"],
    ],
    [
      "Apakah kamu mengalami ketidaknyamanan saat menyusui?",
      ["Ya", "Tidak", "Tidak ingin menjawab"],
    ],
    [
      "Apakah ketidaknyamanan tersebut mengganggu aktivitasmu?",
      ["Tidak mengganggu", "Sedikit", "Sedang", "Berat", "Sangat berat"],
    ],
    [
      "Kira-kira berapa lama kamu berada di luar ruangan hari ini?",
      [
        "Tidak berada di luar",
        "<1 jam",
        "1–3 jam",
        "3–6 jam",
        ">6 jam",
      ],
    ],
  ],
};

export const evidence = {
  Hamil: {
    text: "Kehamilan dapat meningkatkan kerentanan terhadap panas. Suhu hari ini dan durasi aktivitas luar ruangan relevan untuk diperhatikan. Ini tidak menjelaskan penyebab sakit kepala atau kelelahanmu.",
    source: "CDC · Heat and Pregnancy",
    url: "https://www.cdc.gov/heat-health/risk-factors/heat-and-pregnancy.html",
  },
  Menstruasi: {
    text: "Penelitian meninjau perbedaan pengaturan suhu sepanjang siklus. Temuan mengenai respons saat beraktivitas di lingkungan panas tidak konsisten. Catatan hari menstruasi tidak cukup untuk menyimpulkan bahwa panas menyebabkan kram atau perubahan aliran.",
    source: "Systematic review & meta-analysis · 2020",
    url: "https://pubmed.ncbi.nlm.nih.gov/32499153/",
  },  
  Menyusui: {
    text: "Menyusui membutuhkan perhatian terhadap kenyamanan, kecukupan cairan, dan kesempatan beristirahat. Kondisi lingkungan dicatat sebagai konteks, bukan sebagai diagnosis atau bukti penyebab keluhan.",
    source: "SYCLE · Informasi edukatif",
    url: "",
  },
};

export const guidance = [
  ["Air minum mudah dijangkau", "Minum air secara teratur saat cuaca panas.", "WHO · Heat and health"],
  ["Cari tempat lebih sejuk", "Pilih tempat teduh atau ruangan sejuk.", "WHO · Heat and health"],
  ["Atur waktu aktivitas", "Hindari aktivitas berat pada waktu terpanas.", "WHO · Heat and health"],
];

export const topics = [
  ["Panas & Kehamilan", "Kehamilan", "Konteks lingkungan panas selama kehamilan."],
  ["Menstruasi & Suhu Tubuh", "Menstruasi", "Kenali pengaturan suhu sepanjang siklus."],
  ["Menopause & Rasa Panas", "Menopause", "Istilah dan pengalaman yang sering dicatat."],
  ["PM2.5 & Kesehatan", "Kualitas Udara", "Mengenal data partikel pada kondisi lingkungan."],
];