import { createClient } from "@/lib/supabase/server";

const CONTEXT_LABEL = {
  menstruasi: "Menstruasi",
  kehamilan: "Hamil",
  menyusui: "Menyusui",
  lewati: "Catatan umum",
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
  return {
    id: row.id,
    date: new Date(row.recorded_at).toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    condition: CONTEXT_LABEL[row.context] ?? row.context,
    comfort: COMFORT_LABEL[row.ht01_comfort] ?? "",
    activity: OUTDOOR_LABEL[row.ht04_outdoor] ?? "",
    location: "",
    story: row.story ?? "",
  };
}

// Catatan milik pengguna yang sedang login (RLS memastikan hanya miliknya), terbaru di atas.
export async function getMyTrackerEntries(limit = 50) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tracker_records")
    .select("id, recorded_at, context, ht01_comfort, ht04_outdoor, story")
    .order("recorded_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Gagal memuat catatan Tracker:", error.message);
    return { entries: [], error: "Catatan belum dapat dimuat. Coba muat ulang halaman." };
  }

  console.info("[tracker] memuat riwayat:", (data ?? []).length, "catatan");
  return { entries: (data ?? []).map(toEntry), error: "" };
}
