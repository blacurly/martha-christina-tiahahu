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


/**
 * BANK PERTANYAAN ASSESSMENT UMUM SYCLE
 *
 * P-00 = Aktivitas
 * P-01 = Kondisi yang ingin dipertimbangkan
 *
 * Bank ini terpisah dari coreQuestions dan symptoms
 * yang masih digunakan oleh Health Tracker.
 */

export const PERSONALIZATION_QUESTIONS = {
  "P-00": {
    code: "P-00",
    type: "single",
    question: "Hari ini kamu akan lebih banyak beraktivitas di mana?",
    required: true,
    options: [
      { value: "indoor", label: "Di dalam ruangan" },
      { value: "outdoor", label: "Di luar ruangan" },
      {
        value: "travel",
        label: "Di perjalanan (jalan kaki, motor, atau angkutan umum)",
      },
      {
        value: "moving",
        label: "Berpindah-pindah, dalam dan luar ruangan",
      },
    ],
  },

  "P-01": {
    code: "P-01",
    type: "single",
    question:
      "Kondisi apa yang ingin kamu pertimbangkan untuk panduan hari ini?",
    required: true,
    options: [
      { value: "menstruasi", label: "Menstruasi" },
      { value: "kehamilan", label: "Kehamilan" },
      { value: "menyusui", label: "Menyusui" },
      { value: "lewati", label: "Lewati" },
    ],
  },

  "P-02": {
    code: "P-02",
    type: "single",
    question:
      "Berapa lama kamu memperkirakan akan berada di luar ruangan?",
    required: true,
    options: [
      { value: "tidak_keluar", label: "Tidak berencana keluar" },
      { value: "kurang_30", label: "Kurang dari 30 menit" },
      { value: "30_60", label: "30–60 menit" },
      { value: "1_2_jam", label: "1–2 jam" },
      { value: "lebih_2_jam", label: "Lebih dari 2 jam" },
      { value: "belum_tahu", label: "Belum tahu" },
    ],
  },

  "P-03": {
    code: "P-03",
    type: "multiple",
    question: "Apa saja yang kamu bawa atau tersedia hari ini?",
    required: true,
    exclusiveOptions: ["tidak_ada", "belum_tahu"],
    options: [
      { value: "air_minum", label: "Air minum" },
      { value: "tempat_teduh", label: "Tempat teduh" },
      { value: "masker", label: "Masker N95 atau KN95" },
      {
        value: "perlindungan_matahari",
        label: "Perlindungan matahari (topi, payung, tabir surya)",
      },
      { value: "tidak_ada", label: "Tidak ada" },
      { value: "belum_tahu", label: "Belum tahu" },
    ],
  },

  "PM-01": {
    code: "PM-01",
    type: "single",
    question: "Apakah kamu sedang menstruasi saat ini?",
    required: true,
    options: [
      { value: "ya", label: "Ya" },
      { value: "tidak", label: "Tidak" },
      { value: "tidak_yakin", label: "Tidak yakin" },
      {
        value: "tidak_ingin_menjawab",
        label: "Tidak ingin menjawab",
      },
    ],
  },

  "PM-02": {
    code: "PM-02",
    type: "multiple",
    question:
      "Adakah kebutuhan yang ingin kamu pertimbangkan untuk aktivitas hari ini?",
    required: true,
    exclusiveOptions: [
      "tidak_ada_kebutuhan",
      "tidak_ingin_menjawab",
    ],
    options: [
      {
        value: "akses_toilet",
        label: "Akses toilet atau tempat mengganti pembalut",
      },
      {
        value: "istirahat",
        label: "Kesempatan beristirahat",
      },
      {
        value: "kurangi_aktivitas_berat",
        label: "Mengurangi aktivitas berat",
      },
      {
        value: "tidak_ada_kebutuhan",
        label: "Tidak ada kebutuhan khusus",
      },
      {
        value: "tidak_ingin_menjawab",
        label: "Tidak ingin menjawab",
      },
    ],
  },

  "PS-01": {
    code: "PS-01",
    type: "single",
    question:
      "Apakah kamu berencana menyusui atau memompa ASI selama aktivitas hari ini?",
    required: true,
    options: [
      { value: "ya", label: "Ya" },
      { value: "tidak", label: "Tidak" },
      { value: "belum_tahu", label: "Belum tahu" },
      {
        value: "tidak_ingin_menjawab",
        label: "Tidak ingin menjawab",
      },
    ],
  },

  "PS-02": {
    code: "PS-02",
    type: "single",
    question:
      "Apa yang mungkin kamu perlukan untuk menyusui atau memompa ASI?",
    required: true,
    options: [
      {
        value: "tempat_nyaman",
        label: "Tempat yang nyaman",
      },
      {
        value: "waktu_istirahat",
        label: "Waktu untuk beristirahat",
      },
      {
        value: "keduanya",
        label: "Tempat yang nyaman dan waktu beristirahat",
      },
      {
        value: "tidak_ada_kebutuhan",
        label: "Tidak ada kebutuhan khusus",
      },
      {
        value: "belum_tahu",
        label: "Belum tahu",
      },
    ],
  },
};

/**
 * Urutan pertanyaan dan percabangan assessment umum.
 */
export const PERSONALIZATION_BASE_STEPS = [
  "P-00",
  "P-01",
  "P-02",
  "P-03",
];

export function getPersonalizationBranchSteps(answers = {}) {
  const condition = answers["P-01"];

  if (condition === "menstruasi") {
    const steps = ["PM-01"];

    if (answers["PM-01"] === "ya") {
      steps.push("PM-02");
    }

    return steps;
  }

  if (condition === "menyusui") {
    const steps = ["PS-01"];

    if (
      answers["PS-01"] === "ya" ||
      answers["PS-01"] === "belum_tahu"
    ) {
      steps.push("PS-02");
    }

    return steps;
  }

  // Kehamilan dan Lewati tidak memiliki cabang tambahan
  // dalam bank pertanyaan LCH yang digunakan saat ini.
  return [];
}

export function getVisiblePersonalizationSteps(answers = {}) {
  return [
    ...PERSONALIZATION_BASE_STEPS,
    ...getPersonalizationBranchSteps(answers),
  ];
}

export function setPersonalizationAnswer(
  answers = {},
  code,
  value,
) {
  let normalizedValue = value;

  const question = PERSONALIZATION_QUESTIONS[code];

  if (
    question?.type === "multiple" &&
    Array.isArray(value) &&
    question.exclusiveOptions
  ) {
    const selectedExclusive = value.find((item) =>
      question.exclusiveOptions.includes(item),
    );

    normalizedValue = selectedExclusive
      ? [selectedExclusive]
      : value.filter(
          (item) => !question.exclusiveOptions.includes(item),
        );
  }

  const nextAnswers = {
    ...answers,
    [code]: normalizedValue,
  };

  const visibleSteps = new Set(
    getVisiblePersonalizationSteps(nextAnswers),
  );

  for (const key of Object.keys(nextAnswers)) {
    if (
      (key.startsWith("PM-") || key.startsWith("PS-")) &&
      !visibleSteps.has(key)
    ) {
      delete nextAnswers[key];
    }
  }

  return nextAnswers;
}

export function isPersonalizationQuestionAnswered(
  code,
  answers = {},
) {
  const value = answers[code];

  if (value === undefined || value === null || value === "") {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}