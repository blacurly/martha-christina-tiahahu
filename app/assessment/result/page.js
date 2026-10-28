"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/components/assessment/AssessmentLayout";
import AssessmentResult from "@/components/assessment/AssessmentResult";
import { useAssessment } from "@/context/AssessmentContext";
import { saveAssessmentAction } from "./actions";

export default function AssessmentResultPage() {
  const router = useRouter();

  const {
    mode,
    condition,
    answers,
    activity,
    story,
    saveEntry,
  } = useAssessment();

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSave() {
    if (mode === "guest") {
      router.push("/signup");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      const result = await saveAssessmentAction({
        condition,
        answers,
        activity,
        story,
      });

      if (!result.success) {
        setErrorMessage(result.message);
        return;
      }

      saveEntry();
      router.push("/healthtracker");
      router.refresh();
    } catch {
      setErrorMessage("Terjadi kesalahan saat menyimpan catatan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AssessmentLayout
      step={6}
      title="Ringkasan Check-In"
      description="Lihat kembali catatan tubuh, aktivitas, dan informasi edukatif yang relevan."
      onBack={() => router.back()}
      onSubmit={handleSave}
    >
      <AssessmentResult />
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </AssessmentLayout>
  );
}