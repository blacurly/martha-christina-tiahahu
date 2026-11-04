"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAssessment } from "@/context/AssessmentContext";
import AssessmentLayout from "@/components/assessment/AssessmentLayout";
import CoreQuestions from "@/components/assessment/CoreQuestions";

function PregnancyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setCondition, validateCore } = useAssessment();

  const [showQuestions, setShowQuestions] = useState(false);
  const [error, setError] = useState("");

  function handleContinue() {
    setError("");
    setCondition("Hamil");

    if (!showQuestions) {
      setShowQuestions(true);
      return;
    }

    const validationError = validateCore();

    if (validationError) {
      setError(validationError);
      return validationError;
    }

    const activity = searchParams.get("activity");
    const params = new URLSearchParams();

    if (activity) {
      params.set("activity", activity);
    }

    const query = params.toString();

    router.push(`/assessment/result${query ? `?${query}` : ""}`);
  }

  function handleBack() {
    setError("");

    if (showQuestions) {
      setShowQuestions(false);
      return;
    }

    router.push("/assessment");
  }

  return (
    <AssessmentLayout
      step={2}
      title={
        showQuestions
          ? "Pertanyaan Kehamilan"
          : "Assessment Kehamilan"
      }
      description={
        showQuestions
          ? "Pilih jawaban yang paling sesuai dengan kondisimu hari ini."
          : "Catat kondisi tubuh dan gejala yang kamu alami hari ini, serta perhatikan konteks lingkungan di sekitarmu."
      }
      onNext={handleContinue}
      onBack={handleBack}
      error={error}
    >
      {!showQuestions ? (
        <>
          <p className="assessment-flow__eyebrow">
            KONDISI YANG DIPILIH
          </p>

          <h2>Hamil</h2>

          <p className="assessment-flow__description">
            Pertanyaan berikutnya membantumu mencatat kondisi
            kehamilan dan aktivitas secara terstruktur.
          </p>
        </>
      ) : (
        <CoreQuestions />
      )}
    </AssessmentLayout>
  );
}

export default function PregnancyPage() {
  return (
    <Suspense fallback={<p>Memuat assessment...</p>}>
      <PregnancyForm />
    </Suspense>
  );
}