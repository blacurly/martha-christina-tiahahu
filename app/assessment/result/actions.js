"use server";

import { createClient } from "@/lib/supabase/server";
import { mapAssessmentToRecord } from "@/lib/assessment";

export async function saveAssessmentAction({
  condition,
  answers = {},
  activity = "",
  story = "",
}) {
  try {
    const supabase = await createClient();

    // Pastikan pengguna sudah login.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn("[tracker] simpan ditolak: belum login", authError?.message ?? "");
      return {
        success: false,
        needsAccount: true,
        message: "Masuk atau buat akun untuk menyimpan catatan ini.",
      };
    }

    // Petakan jawaban ke kolom tracker_records.
    const record = mapAssessmentToRecord({
      condition,
      answers,
      activity,
      story,
    });

    // Simpan catatan milik pengguna yang sedang login.
    const { data, error } = await supabase
      .from("tracker_records")
      .insert({
        ...record,
        user_id: user.id,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Gagal menyimpan assessment:", error.code, error.message);

      return {
        success: false,
        message: "Catatan belum berhasil disimpan.",
      };
    }

    console.info("[tracker] catatan tersimpan:", data.id, record.context);
    return {
      success: true,
      message: "Catatan berhasil disimpan.",
      recordId: data.id,
    };
  } catch (error) {
    console.error("Kesalahan assessment:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan catatan.",
    };
  }
}