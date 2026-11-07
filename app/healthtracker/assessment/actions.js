"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { saveTrackerRecord, saveHealthTracker} from "@/lib/repositories/trackerRepository";
import { mapHealthTrackerToPayload, mapHealthTrackerToTable } from "@/lib/healthtracker/trackerMapper";

export async function saveHealthTrackerAssessment({
  condition,
  answers,
  scores,
  story = "",
  snapshot = null,
}) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      message: "Sesi login berakhir. Silakan masuk kembali.",
    };
  }

  try {
    const payload = mapHealthTrackerToPayload({
      condition,
      answers,
      scores,
      story,
      snapshot,
    });

    const supabase = await createClient();

    const result = await saveTrackerRecord(supabase, payload);

    if (!result.ok) {
      const messages = {
        not_ready: "Fitur penyimpanan belum siap. Silakan hubungi tim SYCLE.",
        forbidden: "Kamu tidak memiliki akses untuk menyimpan catatan ini.",
        error: "Catatan gagal disimpan. Silakan coba kembali.",
      };

      return {
        ok: false,
        message: messages[result.reason] ?? messages.error,
      };
    }

    revalidatePath("/healthtracker");
    revalidatePath("/healthtracker/history");
    revalidatePath("/healthtracker/summary");

    return {
      ok: true,
      id: result.id,
      message: "Check-in berhasil disimpan.",
    };
  } catch (error) {
    console.error(
      "saveHealthTrackerAssessment gagal:",
      error.message
    );

    return {
      ok: false,
      message: "Data check-in tidak valid atau gagal disimpan.",
    };
  }
}