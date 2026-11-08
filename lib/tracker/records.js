import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";

const CONTEXT_LABEL = {
  menstruasi: "Menstruasi",
  kehamilan: "Hamil",
  menyusui: "Menyusui",
  lewati: "Catatan umum",
};

const ACTIVITY_LABEL = {
  dalam_ruangan: "Dalam Ruangan",
  luar_ruangan: "Luar Ruangan",
  perjalanan: "Perjalanan",
  berpindah_pindah: "Berpindah-pindah",
};

const COMFORT_LABEL = {
  sangat_nyaman: "Sangat nyaman",
  nyaman: "Nyaman",
  biasa_saja: "Biasa saja",
  kurang_nyaman: "Kurang nyaman",
  sangat_tidak_nyaman: "Sangat tidak nyaman",
  tidak_ingin_menjawab: "Tidak ingin menjawab",
};

function getJakartaDateParts(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const getPart = (type) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    year: getPart("year"),
    month: getPart("month"),
    day: getPart("day"),
  };
}

function toEntry(row, answers = [], snapshot = null) {
  const recordedAt = new Date(row.recorded_at);
  const { year, month, day } = getJakartaDateParts(recordedAt);

  const getAnswers = (code) =>
    answers
      .filter((item) => item.code_question === code)
      .map((item) => item.answer)
      .filter(Boolean);

  const comfortValue = getAnswers("HT-01")[0] ?? "";
  const activityValue = getAnswers("HT-04")[0] ?? "";

  return {
    id: row.id,
    recordedAt: row.recorded_at,
    dateKey: `${year}-${month}-${day}`,
    monthKey: `${year}-${month}`,
    dayKey: `${year}-${month}-${day}`,
    day,

    weekday: recordedAt.toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
    }),

    date: recordedAt.toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),

    time: recordedAt.toLocaleTimeString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
    }),

    condition: CONTEXT_LABEL[row.context] ?? row.context,
    comfort: COMFORT_LABEL[comfortValue] ?? comfortValue,
    activity: ACTIVITY_LABEL[activityValue] ?? activityValue,
    location: snapshot?.location_label ?? "",
    story: row.story ?? "",
  };
}

// Catatan milik pengguna yang sedang login.
// RLS memastikan pengguna hanya dapat membaca catatannya sendiri.
export async function getMyTrackerEntries(limit = 50) {
  const supabase = await createClient();

  // 1. Pastikan pengguna sudah login
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      entries: [],
      error: "Silakan login untuk melihat riwayat Check-In.",
    };
  }

  // 2. Ambil Check-In milik pengguna yang sedang login
  const { data: records, error: recordError } = await supabase
    .from("health_tracker")
    .select("id, recorded_at, context, story")
    .eq("user_id", user.id)
    .order("recorded_at", { ascending: false })
    .limit(limit);

  if (recordError) {
    console.error(
      "Gagal memuat health_tracker:",
      recordError.message
    );

    return {
      entries: [],
      error: "Catatan belum dapat dimuat. Coba muat ulang halaman.",
    };
  }

  if (!records?.length) {
    console.log("Riwayat Check-In kosong untuk user:", user.id);

    return {
      entries: [],
      error: "",
    };
  }

  const recordIds = records.map((record) => record.id);

  // 3. Ambil jawaban Check-In
  const { data: answers, error: answerError } = await supabase
    .from("tracker_answer")
    .select("health_tracker_id, code_question, answer, scale")
    .in("health_tracker_id", recordIds);

  if (answerError) {
    console.error(
      "Gagal memuat tracker_answer:",
      answerError.message
    );

    return {
      entries: [],
      error: "Jawaban Check-In belum dapat dimuat.",
    };
  }

  // 4. Ambil snapshot lingkungan
  const { data: snapshots, error: snapshotError } = await supabase
    .from("tracker_lingkungan_snapshots")
    .select("id, location_label")
    .in("id", recordIds);

  if (snapshotError) {
    console.error(
      "Gagal memuat snapshot lingkungan:",
      snapshotError.message
    );
  }

  // 5. Kelompokkan jawaban berdasarkan ID Check-In
  const answersByRecord = new Map();

  for (const answer of answers ?? []) {
    const current =
      answersByRecord.get(answer.health_tracker_id) ?? [];

    current.push(answer);
    answersByRecord.set(answer.health_tracker_id, current);
  }

  // 6. Kelompokkan snapshot berdasarkan ID Check-In
  const snapshotsByRecord = new Map(
    (snapshots ?? []).map((snapshot) => [
      snapshot.id,
      snapshot,
    ])
  );

  // 7. Mapping ke format yang digunakan UI
  const entries = records.map((record) =>
    toEntry(
      record,
      answersByRecord.get(record.id) ?? [],
      snapshotsByRecord.get(record.id) ?? null
    )
  );

  console.log("Jumlah Check-In berhasil dimuat:", entries.length);

  return {
    entries,
    error: "",
  };
}

export async function getMyTrackerEntryDetail(recordId) {
  if (!recordId || typeof recordId !== "string") {
    return {
      ok: false,
      message: "ID Check-In tidak valid.",
    };
  }

  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      message: "Silakan login untuk melihat detail Check-In.",
    };
  }

  try {
    const supabase = await createClient();

    // 1. Ambil jawaban utama dari tracker_records
    const {
      data: record,
      error: recordError,
    } = await supabase
      .from("tracker_records")
      .select(`
        id,
        recorded_at,
        context,
        ht01_comfort,
        ht02_other_text,
        ht04_activity_location,
        ht05_outdoor,
        hm01_menstruating,
        hm02_day,
        hm03_flow,
        hm04_pain,
        hm05_pain_disruption,
        hm06_toilet_access,
        hk01_other_text,
        hs01_breastfeeding,
        hs02_discomfort,
        hs03_disruption,
        hs04_other_text,
        story
      `)
      .eq("id", recordId)
      .maybeSingle();

    if (recordError || !record) {
      return {
        ok: false,
        message: "Detail Check-In tidak ditemukan.",
      };
    }

    // 2. Ambil jawaban pilihan dan tingkat gangguan
    const {
      data: items,
      error: itemsError,
    } = await supabase
      .from("tracker_record_items")
      .select("question_code, option_code, disruption_level")
      .eq("record_id", recordId)
      .order("question_code", { ascending: true })
      .order("option_code", { ascending: true });

    if (itemsError) {
      console.error("Gagal mengambil detail jawaban:", itemsError.message);

      return {
        ok: false,
        message: "Jawaban Check-In belum dapat dimuat.",
      };
    }

    // 3. Ambil snapshot lingkungan
    const {
      data: snapshot,
      error: snapshotError,
    } = await supabase
      .from("tracker_environment_snapshots")
      .select(`
        captured_at,
        location_label,
        location_code,
        lat,
        lon,
        indicators
      `)
      .eq("record_id", recordId)
      .order("captured_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (snapshotError) {
      console.error(
        "Gagal mengambil snapshot lingkungan:",
        snapshotError.message
      );
    }

    return {
      ok: true,
      record,
      items: items ?? [],
      snapshot: snapshot ?? null,
      snapshotWarning: snapshotError
        ? "Data lingkungan belum dapat dimuat."
        : "",
    };
  } catch (error) {
    console.error("getMyTrackerEntryDetail gagal:", error.message);

    return {
      ok: false,
      message: "Detail Check-In belum dapat dimuat. Silakan coba lagi.",
    };
  }
}