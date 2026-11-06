"use client";

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
}) {
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

  function handleContinueWithAI() {
    setAiNotice(
      "AI Health Tracker berbasis Hybrid RAG sedang dalam tahap pengembangan. Untuk saat ini, kamu dapat melanjutkan tanpa AI."
    );
  }

  return {
    handleNext,
    handleBack,
    handleSkipQuestions,
    handleContinueWithoutAI,
    handleContinueWithAI,
  };
}