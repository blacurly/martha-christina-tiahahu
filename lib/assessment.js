const CONDITION_MAP = {
  Menstruasi: "menstruasi",
  Hamil: "kehamilan",
  Menyusui: "menyusui",
};

const VALUE_MAP = {
  comfort: {
    "sangat nyaman": "sangat_nyaman",
    nyaman: "nyaman",
    "biasa saja": "biasa_saja",
    "kurang nyaman": "kurang_nyaman",
    "sangat tidak nyaman": "sangat_tidak_nyaman",
    "tidak ingin menjawab": "tidak_ingin_menjawab",
  },
  outdoor: {
    tidak: "tidak",
    "tidak berada di luar": "tidak",
    "kurang dari 30 menit": "kurang_30",
    "30–60 menit": "30_60",
    "30-60 menit": "30_60",
    "1–2 jam": "1_2_jam",
    "1-2 jam": "1_2_jam",
    "lebih dari 2 jam": "lebih_2_jam",
    "tidak yakin": "tidak_yakin",
  },
  menstruating: {
    ya: "ya",
    tidak: "tidak",
    "tidak yakin": "tidak_yakin",
    "tidak ingin menjawab": "tidak_ingin_menjawab",
  },
  flow: {
    ringan: "sedikit",
    sedikit: "sedikit",
    sedang: "sedang",
    banyak: "banyak",
    "tidak ingin menjawab": "tidak_ingin_menjawab",
  },
  yesNo: {
    ya: "ya",
    tidak: "tidak",
    "tidak ingin menjawab": "tidak_ingin_menjawab",
  },
};

function normalize(value) {
  if (typeof value !== "string") return "";

  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function mapValue(group, value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const normalized = normalize(value);
  const mapped = VALUE_MAP[group]?.[normalized];

  if (!mapped) {
    throw new Error(
      `Nilai "${value}" belum memiliki pemetaan untuk ${group}.`
    );
  }

  return mapped;
}

function findAnswer(answers, keywords) {
  const entries = Object.entries(answers ?? {});

  const match = entries.find(([question]) => {
    const normalizedQuestion = normalize(question);

    return keywords.some((keyword) =>
      normalizedQuestion.includes(normalize(keyword))
    );
  });

  return match?.[1] ?? null;
}

function mapContext(condition) {
  const context = CONDITION_MAP[condition];

  if (!context) {
    throw new Error(
      `Kondisi "${condition}" belum didukung oleh skema database.`
    );
  }

  return context;
}

export function mapAssessmentToRecord({
  condition,
  answers = {},
  activity = "",
  story = "",
}) {
  const context = mapContext(condition);

  const record = {
    context,
    ht01_comfort: null,
    ht02_other_text: null,
    ht04_outdoor: null,
    hm01_menstruating: null,
    hm02_day: null,
    hm03_flow: null,
    hm04_pain: null,
    hm05_pain_disruption: null,
    hk01_other_text: null,
    hs01_breastfeeding: null,
    hs02_discomfort: null,
    hs03_disruption: null,
    story: story.trim() || null,
  };

  // Pemetaan jawaban lingkungan.
  const comfort = findAnswer(answers, [
    "kenyamanan",
    "nyaman terhadap lingkungan",
  ]);

  if (comfort !== null) {
    record.ht01_comfort = mapValue("comfort", comfort);
  }

  // Pemetaan durasi di luar ruangan.
  const outdoor = findAnswer(answers, [
    "durasi di luar",
    "berapa lama di luar",
    "aktivitas luar ruangan",
  ]);

  if (outdoor !== null) {
    record.ht04_outdoor = mapValue("outdoor", outdoor);
  }

  // Pemetaan khusus menstruasi.
  if (context === "menstruasi") {
    const menstruating = findAnswer(answers, [
      "sedang menstruasi",
      "menstruasi saat ini",
    ]);

    if (menstruating !== null) {
      record.hm01_menstruating = mapValue(
        "menstruating",
        menstruating
      );
    }

    const flow = findAnswer(answers, [
      "aliran menstruasi",
      "aliran haid",
    ]);

    if (flow !== null) {
      record.hm03_flow = mapValue("flow", flow);
    }

    const pain = findAnswer(answers, [
      "mengalami nyeri",
      "nyeri menstruasi",
      "nyeri atau kram",
    ]);

    if (pain !== null) {
      record.hm04_pain = mapValue("yesNo", pain);
    }
  }

  // Validasi panjang teks mengikuti batas database.
  for (const field of ["ht02_other_text", "hk01_other_text"]) {
    if (record[field] && record[field].length > 200) {
      throw new Error(`Jawaban ${field} maksimal 200 karakter.`);
    }
  }

  if (record.story && record.story.length > 2000) {
    throw new Error("Cerita maksimal 2000 karakter.");
  }

  return record;
}