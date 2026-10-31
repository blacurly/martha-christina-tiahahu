import {
  DISRUPTION_SCALE,
  Q_BF_DISCOMFORT,
  Q_BF_DISRUPTION,
  Q_BREASTFEEDING,
  Q_COMFORT,
  Q_FLOW,
  Q_MENSTRUATING,
  Q_MENSTRUATION_DAY,
  Q_OUTDOOR,
  Q_PAIN,
  Q_PAIN_DISRUPTION,
} from "@/data/sycle";

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
    console.warn(`Nilai "${value}" belum memiliki pemetaan untuk ${group}; disimpan kosong.`);
    return null;
  }

  return mapped;
}

function answerOf(answers, question) {
  const value = answers?.[question];
  return value === undefined || value === "" ? null : value;
}

// "Hari ke-3" -> "hari_3"; lebih dari 7 -> "lebih_7"; "Tidak yakin" -> "tidak_yakin".
function mapDay(value) {
  if (value === null) return null;
  if (normalize(value) === "tidak yakin") return "tidak_yakin";
  const match = String(value).match(/(\d+)/);
  if (!match) return null;
  const day = Number(match[1]);
  if (day >= 1 && day <= 7) return `hari_${day}`;
  return day > 7 ? "lebih_7" : null;
}

// Label skala 0–4 -> angka (HM-05, HS-03).
function mapScale(value) {
  if (value === null) return null;
  const index = DISRUPTION_SCALE.indexOf(value);
  return index >= 0 ? index : null;
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

  // HT-01 dan HT-04 (semua kondisi).
  record.ht01_comfort = mapValue("comfort", answerOf(answers, Q_COMFORT));
  record.ht04_outdoor = mapValue("outdoor", answerOf(answers, Q_OUTDOOR));

  // HM-01 s/d HM-05 (khusus menstruasi, mengikuti percabangan database).
  if (context === "menstruasi") {
    record.hm01_menstruating = mapValue("menstruating", answerOf(answers, Q_MENSTRUATING));
    if (record.hm01_menstruating === "ya") {
      record.hm02_day = mapDay(answerOf(answers, Q_MENSTRUATION_DAY));
      record.hm03_flow = mapValue("flow", answerOf(answers, Q_FLOW));
    }
    record.hm04_pain = mapValue("yesNo", answerOf(answers, Q_PAIN));
    if (record.hm04_pain === "ya") {
      record.hm05_pain_disruption = mapScale(answerOf(answers, Q_PAIN_DISRUPTION));
    }
  }

  // HS-01 s/d HS-03 (khusus menyusui).
  if (context === "menyusui") {
    record.hs01_breastfeeding = mapValue("yesNo", answerOf(answers, Q_BREASTFEEDING));
    if (record.hs01_breastfeeding === "ya") {
      record.hs02_discomfort = mapValue("yesNo", answerOf(answers, Q_BF_DISCOMFORT));
    }
    if (record.hs02_discomfort === "ya") {
      record.hs03_disruption = mapScale(answerOf(answers, Q_BF_DISRUPTION));
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