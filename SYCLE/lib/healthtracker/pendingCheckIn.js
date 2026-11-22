// Draf check-in milik Guest yang menunggu login/daftar.
// Disimpan hanya di perangkat ini (localStorage), tidak dikirim ke server sampai pengguna
// masuk dan memilih Simpan atau Refleksi AI. Kedaluwarsa otomatis setelah 24 jam.

const KEY = "sycle_pending_checkin";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export const PENDING_INTENTS = ["save", "ai"];

export function savePendingCheckIn({ intent, condition, answers, scores, story, snapshot }) {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({
        intent: PENDING_INTENTS.includes(intent) ? intent : "save",
        condition: condition ?? "",
        answers: answers ?? {},
        scores: scores ?? {},
        story: story ?? "",
        snapshot: snapshot ?? null,
        savedAt: Date.now(),
      })
    );
    return true;
  } catch {
    return false;
  }
}

export function readPendingCheckIn() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    if (!draft?.savedAt || Date.now() - draft.savedAt > MAX_AGE_MS) {
      window.localStorage.removeItem(KEY);
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

export function clearPendingCheckIn() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // abaikan: penyimpanan perangkat tidak tersedia
  }
}

// Halaman tujuan setelah login/daftar agar draf dilanjutkan.
export const RESUME_PATH = "/healthtracker/assessment?resume=1";

// Aktivitas di Beranda → jawaban HT-04 di check-in.
export const HOME_ACTIVITY_TO_HT04 = {
  indoor: "dalam_ruangan",
  outdoor: "luar_ruangan",
  moving: "berpindah_pindah",
  travel: "perjalanan",
};
