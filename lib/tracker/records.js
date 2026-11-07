import { createClient } from "@/lib/supabase/server";

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

const OUTDOOR_LABEL = {
  tidak: "Tidak keluar ruangan",
  kurang_30: "Di luar < 30 menit",
  "30_60": "Di luar 30–60 menit",
  "1_2_jam": "Di luar 1–2 jam",
  lebih_2_jam: "Di luar > 2 jam",
  tidak_yakin: "Tidak yakin",
};

const COMFORT_LABEL = {
  sangat_nyaman: "Sangat nyaman",
  nyaman: "Nyaman",
  biasa_saja: "Biasa saja",
  kurang_nyaman: "Kurang nyaman",
  sangat_tidak_nyaman: "Sangat tidak nyaman",
  tidak_ingin_menjawab: "Tidak ingin menjawab",
};

function toEntry(row) {
  const recordedAt = new Date(row.recorded_at);

  const dateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(recordedAt);

  const getPart = (type) =>
    dateParts.find((part) => part.type === type)?.value ?? "";

  const year = getPart("year");
  const month = getPart("month");
  const day = getPart("day");

  return {
    id: row.id,
    dateKey: `${year}-${month}`,
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
    condition: CONTEXT_LABEL[row.context] ?? row.context,
    comfort: COMFORT_LABEL[row.ht01_comfort] ?? "",
    activity: ACTIVITY_LABEL[row.ht04_activity_location] ?? "",
    location: "",
    story: row.story ?? "",
  };
}

// Catatan milik pengguna yang sedang login (RLS memastikan hanya miliknya), terbaru di atas.
export async function getMyTrackerEntries(limit = 50) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tracker_records")
    .select(
      "id, recorded_at, context, ht01_comfort, ht04_activity_location, ht05_outdoor, story"
    )
    .order("recorded_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Gagal memuat catatan Tracker:", error.message);
    return { entries: [], error: "Catatan belum dapat dimuat. Coba muat ulang halaman." };
  }

  console.info("[tracker] memuat riwayat:", (data ?? []).length, "catatan");
  return { entries: (data ?? []).map(toEntry), error: "" };
}