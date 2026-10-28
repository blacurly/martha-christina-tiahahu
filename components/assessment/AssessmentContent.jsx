"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAssessment } from "@/context/AssessmentContext";

import SymptomScale from "@/components/assessment/SymptomScale";
import AssessmentLayout from "@/components/assessment/AssessmentLayout";
import ConditionSelector from "@/components/assessment/ConditionSelector";
import PersonalInfoForm from "@/components/assessment/PersonalInfoForm";
import CoreQuestions from "@/components/assessment/CoreQuestions";
import StoryForm from "@/components/assessment/StoryForm";

const steps = [
  {
    title: "Kondisi",
    description: "Pilih kondisi tubuh",
    heading: "Yuk, kenali kondisimu hari ini",
    detail: "Pilih kondisi yang paling sesuai dengan pengalaman tubuhmu.",
  },
  {
    title: "Data Diri",
    description: "Kenali profilmu",
    heading: "Ceritakan sedikit tentang dirimu",
    detail: "Informasi ini membantu memberikan konteks pada check-in.",
  },
  {
    title: "Pertanyaan",
    description: "Jawab pertanyaan",
    heading: "Kenali kondisi tubuhmu",
    detail: "Pilih jawaban yang paling sesuai dengan kondisimu hari ini.",
  },
  {
    title: "Gejala",
    description: "Catat yang dirasakan",
    heading: "Apa yang kamu rasakan hari ini?",
    detail: "Catat gejala yang kamu alami, termasuk jika tidak ada.",
  },
  {
    title: "Cerita",
    description: "Bagikan ceritamu",
    heading: "Ada hal lain yang ingin kamu ceritakan?",
    detail: "Ceritakan pengalamanmu dengan kata-katamu sendiri.",
  },
  {
    title: "Proses",
    description: "Menyiapkan ringkasan",
    heading: "Menyiapkan ringkasanmu",
    detail: "Informasi check-in akan dirangkum untuk ditinjau.",
  },
  {
    title: "Hasil",
    description: "Lihat ringkasanmu",
    heading: "Ringkasan check-in",
    detail: "Tinjau kembali informasi yang telah kamu catat.",
  },
];

export default function AssessmentContent() {
  const searchParams = useSearchParams();

  const {
    condition,
    setCondition,
    activity,
    setActivity,
    validatePersonal,
    validateCore,
    validateSymptoms,
    saveEntry,
  } = useAssessment();

  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const activityParam = searchParams.get("activity");

    if (activityParam === "outdoor") {
      setActivity("Luar Ruangan");
    } else if (activityParam === "indoor") {
      setActivity("Dalam Ruangan");
    }
  }, [searchParams, setActivity]);

  const current = steps[currentStep];

  
  function handleNext() {
    setError("");

    if (currentStep === 0 && !condition) {
      setError("Pilih kondisi kesehatan terlebih dahulu.");
      return;
    }

    if (currentStep === 1) {
      const message = validatePersonal();
      if (message) {
        setError(message);
        return;
      }
    }

    if (currentStep === 2) {
      const message = validateCore();
      if (message) {
        setError(message);
        return;
      }
    }

    if (currentStep === 3) {
      const message = validateSymptoms();
      if (message) {
        setError(message);
        return;
      }
    }

    setCurrentStep((step) =>
      Math.min(step + 1, steps.length - 1)
    );
  }

  function handleBack() {
    setError("");
    setCurrentStep((step) =>
      Math.max(step - 1, 0)
    );
  }

  function handleSubmit() {
    saveEntry();
    setError("");
  }

  return (
    <AssessmentLayout
      step={currentStep}
      title={current.heading}
      description={current.detail}
      onNext={handleNext}
      onBack={handleBack}
      onSubmit={handleSubmit}
      error={error}
    >
      {currentStep === 0 && (
        <ConditionSelector
          selected={condition}
          onSelect={setCondition}
        />
      )}

      {currentStep === 1 && <PersonalInfoForm />}

      {currentStep === 2 && <CoreQuestions />}

      {currentStep === 3 && <SymptomScale />}

      {currentStep === 4 && <StoryForm />}

      {currentStep === 5 && (
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-[#332A35]">
            Pemeriksaan data
          </h2>
          <p className="text-sm text-[#766976]">
            Data yang kamu masukkan akan digunakan untuk menyiapkan
            ringkasan check-in. Belum ada analisis AI yang dijalankan.
          </p>
        </section>
      )}

      {currentStep === 6 && (
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-[#332A35]">
            Check-in selesai
          </h2>
          <p className="text-sm text-[#766976]">
            Catatan demo tersimpan pada sesi aplikasi ini.
          </p>
        </section>
      )}
    </AssessmentLayout>
  );
}