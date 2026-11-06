"use client";

import { saveHealthTrackerAssessment } from "@/app/healthtracker/assessment/actions";

export default function useHealthTrackerSubmission({
  router,
  condition,
  answers,
  scores,
  story,
  snapshot,
  setError,
  setSaving,
}) {
  async function handleSubmit() {
    setSaving(true);
    setError("");

    try {
      const result = await saveHealthTrackerAssessment({
        condition,
        answers,
        scores,
        story,
        snapshot: snapshot ?? null,
      });

      if (!result?.ok) {
        setError(
          result?.message ?? "Check-in gagal disimpan."
        );
        return;
      }

      router.push("/healthtracker");
      router.refresh();
    } catch (error) {
      console.error("Gagal menyimpan Health Tracker:", error);
      setError("Terjadi kesalahan saat menyimpan check-in.");
    } finally {
      setSaving(false);
    }
  }

  return { handleSubmit };
}