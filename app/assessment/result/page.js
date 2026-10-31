"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/components/assessment/AssessmentLayout";
import AssessmentResult from "@/components/assessment/AssessmentResult";
import { useAssessment } from "@/context/AssessmentContext";
import { saveAssessmentAction } from "./actions";
import AccountPrompt from "@/components/assessment/AccountPrompt";

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
  const [needsAccount, setNeedsAccount] = useState(false);

  async function handleSave() {
    if (mode === "guest") {
      setNeedsAccount(true);
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
        if (result.needsAccount) {
          setNeedsAccount(true);
        } else {
          setErrorMessage(result.message);
        }
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
      submitLabel={saving ? "Menyimpan..." : "Simpan Catatan"}
    >
      <AssessmentResult />
      {needsAccount && <AccountPrompt />}
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </AssessmentLayout>
  );
}