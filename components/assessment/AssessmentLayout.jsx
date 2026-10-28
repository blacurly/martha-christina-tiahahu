"use client";

import { useState } from "react";
import { useAssessment } from "@/context/AssessmentContext";
import ProgressSteps from "./ProgressSteps";
import FormNavigation from "./FormNavigation";

const steps = [
  { title: "Kondisi", description: "Pilih kondisi tubuh" },
  { title: "Data diri", description: "Kenali profilmu" },
  { title: "Pertanyaan", description: "Jawab pertanyaan" },
  { title: "Gejala", description: "Catat yang dirasakan" },
  { title: "Cerita", description: "Bagikan ceritamu" },
  { title: "Proses", description: "Menyiapkan ringkasan" },
  { title: "Hasil", description: "Lihat ringkasanmu" },
];

export default function AssessmentLayout({
  children,
  onNext,
  onBack,
  onSubmit,
  step: controlledStep,
  title,
  description,
  error: externalError = "",
  showNavigation = true,
}) {
  const [internalStep, setInternalStep] = useState(0);
  const [internalError, setInternalError] = useState("");

  const { condition, location, activity } = useAssessment();

  const activityLabel =
    activity === "outdoor"
    ? "Luar ruangan"
    : activity === "indoor"
      ? "Dalam ruangan"
      : activity || "Belum dipilih";

  const step =
    typeof controlledStep === "number"
      ? Math.min(Math.max(controlledStep, 0), steps.length - 1)
      : internalStep;

  const error = externalError || internalError;

  function handleNext() {
    setInternalError("");

    if (onNext) {
      const result = onNext();

      if (typeof result === "string" && result) {
        setInternalError(result);
      }

      return;
    }

    setInternalStep((current) =>
      Math.min(current + 1, steps.length - 1)
    );
  }

  function handleBack() {
    setInternalError("");

    if (onBack) {
      onBack();
      return;
    }

    setInternalStep((current) => Math.max(current - 1, 0));
  }

  function handleSubmit() {
    setInternalError("");

    if (onSubmit) {
      const result = onSubmit();

      if (typeof result === "string" && result) {
        setInternalError(result);
      }
    }
  }

  
  return (
    <main className="assessment-flow">
      <div className="assessment-flow__layout">
        <aside className="assessment-flow__sidebar">
          <p className="assessment-flow__eyebrow">
            Daily Check-In
          </p>

          <h2>Kenali tubuhmu, sedikit demi sedikit.</h2>

          <div className="assessment-flow__logo">
            SYCLE
          </div>

          <p>
            Lingkungan dan aktivitasmu sudah dibawa ke check-in ini.
          </p>

          <div className="assessment-flow__context">
            <h3>{location || "Lokasi belum dipilih"}</h3>

            <p>
              Data cuaca belum tersedia.
            </p>

            <p>{activityLabel}</p>
          </div>

          <ol className="assessment-flow__steps">
            <li className="assessment-flow__step">
              01 · Pilih kondisi dan data diri
            </li>
            <li className="assessment-flow__step">
              02 · Catat gejala dan cerita
            </li>
            <li className="assessment-flow__step">
              03 · Lihat ringkasan dan sumber
            </li>
          </ol>
        </aside>

        <section className="assessment-flow__main">
          <header className="assessment-flow__hero">
            <p className="assessment-flow__eyebrow">
              DAILY CHECK-IN
            </p>

            <div className="assessment-flow__heading-row">
              <h1 className="assessment-flow__title">
                {title || "Yuk, kenali kondisimu hari ini"}
              </h1>

              <span className="assessment-flow__condition-badge">
                {condition || "PILIH KONDISI"}
              </span>
            </div>

            <p className="assessment-flow__description">
              {description ||
                "Ikuti tahapan check-in untuk memahami kondisi tubuh dan lingkunganmu."}
            </p>

            <ProgressSteps
              steps={steps}
              currentStep={step}
            />
          </header>

          <div className="assessment-flow__panel">
            {children}

            {error && (
              <p
                className="assessment-flow__error"
                role="alert"
              >
                {error}
              </p>
            )}

            {showNavigation && (
              <FormNavigation
                currentStep={step}
                totalSteps={steps.length}
                onBack={handleBack}
                onNext={handleNext}
                onSubmit={handleSubmit}
              />
            )}
          </div>

          <p className="assessment-flow__disclaimer">
            Informasi bersifat edukatif dan bukan pengganti
            diagnosis atau konsultasi tenaga kesehatan.
          </p>
        </section>
      </div>
    </main>
  );
}