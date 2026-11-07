"use client";

import { useState } from "react";

export default function useHealthTrackerNavigation({
  router,
  currentStep,
  setCurrentStep,
  storyStep,
  summaryStep,
  questionSteps,
  hasQuestionAnswer,
  story,
  validateCurrentStep,
  setError,
  setAiNotice,
  condition,
  answers,
  snapshot,
}) {
  const [isAILoading, setIsAILoading] = useState(false);

  function handleNext() {
    if (!validateCurrentStep()) return;

    if (currentStep === storyStep) {
      const hasStory = story.trim().length > 0;

      if (!hasQuestionAnswer && !hasStory) {
        router.push("/healthtracker");
        return;
      }
    }

    setError("");

    setCurrentStep((previous) =>
      Math.min(previous + 1, summaryStep)
    );
  }

  function handleBack() {
    setError("");

    setCurrentStep((previous) =>
      Math.max(previous - 1, 0)
    );
  }

  function handleSkipQuestions() {
    setError("");

    if (currentStep === 2) {
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      setCurrentStep(storyStep);
    }
  }

  function handleContinueWithoutAI() {
    setError("");
    setAiNotice("");
    setCurrentStep(summaryStep);
  }

    function handleContinueWithoutAI() {
    setError("");
    setAiNotice([]);
    setCurrentStep(summaryStep);
  }

  async function handleContinueWithAI() {
    if (isAILoading) return
    setIsAILoading(true)

    const gejala = answers?.['HT-02']
    const catatan = {
      kondisi: condition,
      gejala: Array.isArray(gejala) ? gejala : gejala ? [gejala] : [],
      cerita: (story ?? '').trim(),
      iklim: Object.values(snapshot?.indicators ?? {})
        .filter((i) => i.status === 'ok' && i.value != null)
        .map(({ label, value, unit }) => ({ label, value, unit })),
    }

    try {
      const response = await fetch('/api/refleksi-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ catatan }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Permintaan gagal')

      setAiNotice((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: typeof data.answer === 'string' && data.answer
            ? data.answer
            : 'Belum ada jawaban.',
        },
      ])
    } catch (error) {
      setAiNotice((prev) => [
        ...prev,
        { role: 'assistant', content: `Maaf, terjadi kendala: ${error.message}` },
      ])
    } finally {
      setIsAILoading(false)
    }
  }

  function handleAIComplete() {
    setIsAILoading(false);
    setCurrentStep(summaryStep);
  }

  return {
    handleNext,
    handleBack,
    handleSkipQuestions,
    handleContinueWithoutAI,
    handleContinueWithAI,
    handleAIComplete,
    isAILoading,
  };
}