// Saran umum berbasis aturan untuk ringkasan check-in (tanpa AI, gratis untuk Guest).
// Diturunkan dari logika Assessment Umum sebelumnya, disesuaikan dengan kode pertanyaan Health Tracker.

const OUTSIDE_ACTIVITIES = ["luar_ruangan", "perjalanan", "berpindah_pindah"];
const LONG_OUTSIDE = ["1_2_jam", "lebih_2_jam"];

function includesAny(value, items) {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return items.some((item) => list.includes(item));
}

export function getHealthTrackerRecommendations({ condition, answers = {} }) {
  const items = [];

  if (OUTSIDE_ACTIVITIES.includes(answers["HT-04"])) {
    items.push({
      key: "paparan",
      tone: "sage",
      title: "Perhatikan paparan lingkungan",
      description:
        "Saat beraktivitas di luar atau berpindah tempat, perhatikan suhu, paparan UV, dan kualitas udara di lingkungan sekitar.",
    });
  }

  if (LONG_OUTSIDE.includes(answers["HT-05"])) {
    items.push({
      key: "jeda",
      tone: "sage",
      title: "Atur jeda aktivitas",
      description:
        "Pertimbangkan untuk mengambil jeda secara berkala, terutama ketika cuaca terasa panas. Sesuaikan durasi istirahat dengan kebutuhan tubuh.",
    });
  }

  if (
    includesAny(answers["HT-02"], ["merasa_kepanasan", "pusing", "lelah"]) ||
    includesAny(answers["HK-01"], ["sulit_air_minum"]) ||
    includesAny(answers["HS-04"], ["akses_air_terbatas", "lingkungan_panas"])
  ) {
    items.push({
      key: "air",
      tone: "sage",
      title: "Siapkan air minum",
      description:
        "Usahakan air minum mudah dijangkau dan minum secara teratur sesuai kebutuhan.",
    });
  }

  if (
    includesAny(answers["HT-02"], ["merasa_kepanasan"]) ||
    includesAny(answers["HK-01"], ["sulit_tempat_sejuk"])
  ) {
    items.push({
      key: "teduh",
      tone: "sage",
      title: "Perhatikan akses tempat teduh",
      description:
        "Cari tempat yang lebih sejuk untuk beristirahat ketika lingkungan terasa panas.",
    });
  }

  if (condition === "menstruasi") {
    items.push({
      key: "menstruasi",
      tone: "pink",
      title: "Perhatikan kenyamanan selama menstruasi",
      description:
        "Sesuaikan aktivitas dengan kenyamanan tubuh dan perhatikan kebutuhan istirahat serta fasilitas yang mendukung.",
    });
  }

  if (condition === "kehamilan") {
    items.push({
      key: "kehamilan",
      tone: "pink",
      title: "Perhatikan kondisi panas",
      description:
        "Selama kehamilan, perhatikan paparan panas, jaga kecukupan cairan, dan beristirahat di tempat yang lebih sejuk ketika diperlukan.",
    });
  }

  if (condition === "menyusui") {
    items.push({
      key: "menyusui",
      tone: "pink",
      title: "Perhatikan kenyamanan menyusui",
      description:
        "Usahakan tersedia tempat yang nyaman dan waktu istirahat yang cukup sesuai kebutuhan.",
    });
  }

  items.push({
    key: "pantau",
    tone: "sage",
    title: "Pantau kondisi lingkungan",
    description:
      "Gunakan informasi suhu, kelembapan, UV, dan kualitas udara sebagai konteks untuk menyesuaikan aktivitas sehari-hari.",
  });

  return items.slice(0, 5);
}
