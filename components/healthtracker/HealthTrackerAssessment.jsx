"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAssessment } from "@/context/AssessmentContext";
import StoryScreen from "@/components/healthtracker/assessment/StoryScreen";
import QuestionRenderer from "@/components/healthtracker/assessment/shared/QuestionRenderer";
import SummaryScreen from "./assessment/SummaryScreen";

import {
  HEALTH_TRACKER_SCALE,
  HEALTH_TRACKER_BASE_STEPS,
  HEALTH_TRACKER_BRANCH_STEPS,
  getHealthTrackerQuestion,
  isHealthTrackerQuestionVisible,
  setHealthTrackerAnswer,
} from "@/data/healthTrackerQuestions";

import {
  Heart,
  Activity,
  Moon,
  Sun,
  Droplets,
  Utensils,
  Smile,
  Frown,
  Baby,
  CalendarDays,
  Thermometer,
  Coffee,
  Footprints,
  CircleCheck,
  CircleHelp,
  Sparkles,
} from "lucide-react";

import { buildEnvironmentSnapshot } from "@/lib/healthtracker/buildEnvironmentSnapshot";
import { saveHealthTrackerAssessment } from "@/app/healthtracker/assessment/actions";

const CONDITION_OPTIONS = [
  { value: "menstruasi", label: "Menstruasi" },
  { value: "kehamilan", label: "Kehamilan" },
  { value: "menyusui", label: "Menyusui" },
  { value: "lewati", label: "Lewati" },
];

function getLabel(option) {
  if (typeof option === "string") return option;

  return (
    option?.label ??
    option?.title ??
    option?.value ??
    option?.code ??
    ""
  );
}

function getValue(option) {
  if (typeof option === "string") return option;

  return option?.value ?? option?.code ?? "";
}

function resolveQuestions(items = []) {
  return items
    .map((item) => {
      const code = typeof item === "string" ? item : item?.code;
      return code ? getHealthTrackerQuestion(code) : item;
    })
    .filter(Boolean);
}

function getQuestionSteps(condition, answers) {
  const baseQuestions = resolveQuestions(HEALTH_TRACKER_BASE_STEPS);
  const branchQuestions = resolveQuestions(
    HEALTH_TRACKER_BRANCH_STEPS[condition] ?? []
  );

  return [...baseQuestions, ...branchQuestions].filter(
    (question) =>
      question.code !== "HT-04" &&
      question.type !== "per_option_scale" &&
      isHealthTrackerQuestionVisible(question, answers)
  );
}

function getGeneralQuestions(answers) {
  return resolveQuestions(HEALTH_TRACKER_BASE_STEPS).filter(
    (question) =>
      question.code !== "HT-04" &&
      question.type !== "per_option_scale" &&
      isHealthTrackerQuestionVisible(question, answers)
  );
}

function getConditionQuestions(condition, answers) {
  return resolveQuestions(
    HEALTH_TRACKER_BRANCH_STEPS[condition] ?? []
  ).filter(
    (question) =>
      question.type !== "per_option_scale" &&
      isHealthTrackerQuestionVisible(question, answers)
  );
}

function getInlineScaleQuestion(question, condition) {
  if (!question) return null;

  const allQuestions = [
    ...resolveQuestions(HEALTH_TRACKER_BASE_STEPS),
    ...resolveQuestions(HEALTH_TRACKER_BRANCH_STEPS[condition] ?? []),
  ];

  return (
    allQuestions.find(
      (item) =>
        item.type === "per_option_scale" &&
        item.dependsOn === question.code
    ) ?? null
  );
}

function isAnswered(question, answers) {
  const value = answers[question.code];

  if (question.type === "multiple") {
    return Array.isArray(value) && value.length > 0;
  }

  return value !== undefined && value !== null && value !== "";
}

function validateQuestion() {
  // Semua pertanyaan umum dan lanjutan boleh dilewati.
  return "";
}

export default function HealthTrackerAssessment() {
  const router = useRouter();
  const { environmentLocation } = useAssessment();

  const [condition, setCondition] = useState("");
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [story, setStory] = useState("");

  const [currentStep, setCurrentStep] = useState(0);

  const [snapshot, setSnapshot] = useState(null);
  const [environmentLoading, setEnvironmentLoading] = useState(true);
  const [environmentError, setEnvironmentError] = useState("");

  const [error, setError] = useState("");
  const [aiNotice, setAiNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const activityQuestion = getHealthTrackerQuestion("HT-04");

  const generalQuestions = useMemo(
    () => getGeneralQuestions(answers),
    [answers]
  );

  const conditionQuestions = useMemo(
    () => getConditionQuestions(condition, answers),
    [condition, answers]
  );

  const questionSteps = useMemo(
    () => [...generalQuestions, ...conditionQuestions],
    [generalQuestions, conditionQuestions]
  );

  const steps = useMemo(
    () => [
      { code: "activity", title: "Aktivitas" },
      { code: "condition", title: "Kondisi" },
      { code: "general", title: "Pertanyaan Umum" },
      { code: "followup", title: "Pertanyaan Lanjutan" },
      { code: "story", title: "Cerita" },
      { code: "review", title: "Review" },
      { code: "summary", title: "Ringkasan" },
    ],
    []
  );

  const summaryStep = steps.length - 1;
  const reviewStep = summaryStep - 1;
  const storyStep = reviewStep - 1;

  const activeQuestion =
    currentStep >= 2 && currentStep < storyStep
      ? questionSteps[currentStep - 2]
      : null;

  const inlineScaleQuestion = getInlineScaleQuestion(
    activeQuestion,
    condition
  );

  // Mengambil data lingkungan berdasarkan lokasi yang dipilih pengguna.
  useEffect(() => {
    let cancelled = false;

    async function fetchEnvironment() {
      setEnvironmentLoading(true);
      setEnvironmentError("");
      setSnapshot(null);

      const adm4 = environmentLocation?.adm4;
      const coordinates = environmentLocation?.coordinates;

      const hasCoordinates =
        coordinates?.latitude != null &&
        coordinates?.longitude != null;

      if (!adm4 && !hasCoordinates) {
        setEnvironmentError(
          "Lokasi belum terhubung. Silakan pilih lokasi di Beranda terlebih dahulu."
        );
        setEnvironmentLoading(false);
        return;
      }

      const params = new URLSearchParams();

      if (adm4) {
        params.set("adm4", adm4);
      } else {
        params.set("lat", coordinates.latitude);
        params.set("lon", coordinates.longitude);
      }

      try {
        const response = await fetch(
          `/api/environment?${params.toString()}`,
          { cache: "no-store" }
        );

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(
            payload?.error ?? "Data lingkungan belum dapat diambil."
          );
        }

        const environmentSnapshot =
          buildEnvironmentSnapshot(payload);

        if (!environmentSnapshot) {
          throw new Error(
            "Data lingkungan belum lengkap untuk disimpan."
          );
        }

        if (!cancelled) {
          setSnapshot(environmentSnapshot);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setEnvironmentError(
            fetchError.message ??
              "Data lingkungan belum dapat diambil."
          );
        }
      } finally {
        if (!cancelled) {
          setEnvironmentLoading(false);
        }
      }
    }

    fetchEnvironment();

    return () => {
      cancelled = true;
    };
  }, [environmentLocation]);

  function updateAnswer(code, value) {
    setAnswers((previous) =>
      setHealthTrackerAnswer(previous, code, value)
    );

    setError("");
  }

  function updateScore(optionCode, value) {
    setScores((previous) => ({
      ...previous,
      [optionCode]: value,
    }));

    setError("");
  }

  function changeCondition(value) {
    setCondition(value);

    // Pertahankan jawaban umum, termasuk HT-04.
    // Hapus jawaban khusus kondisi sebelumnya.
    const oldBranchQuestions = resolveQuestions(
      HEALTH_TRACKER_BRANCH_STEPS[condition] ?? []
    );

    setAnswers((previous) => {
      const next = { ...previous };

      oldBranchQuestions.forEach((question) => {
        delete next[question.code];

        if (question.otherText?.key) {
          delete next[question.otherText.key];
        }
      });

      return next;
    });

    // Pertahankan skor HT-02 karena pertanyaan umum tetap berlaku.
    const selectedGeneralOptions = answers["HT-02"] ?? [];

    setScores((previous) =>
      Object.fromEntries(
        Object.entries(previous).filter(([key]) =>
          selectedGeneralOptions.includes(key)
        )
      )
    );

    setCurrentStep(1);
    setError("");
  }

  function validateCurrentStep() {
    if (currentStep === 0) {
      if (!isAnswered(activityQuestion, answers)) {
        setError("Silakan pilih aktivitas terlebih dahulu.");
        return false;
      }

      return true;
    }

    if (currentStep === 1) {
      if (!condition) {
        setError("Silakan pilih kondisi terlebih dahulu.");
        return false;
      }

      return true;
    }

    if (activeQuestion) {
      const validationMessage = validateQuestion(
        activeQuestion,
        answers
      );

      if (validationMessage) {
        setError(validationMessage);
        return false;
      }
    }

    return true;
  }

  function handleNext() {
    if (!validateCurrentStep()) return;

    if (currentStep === storyStep) {
      const hasQuestionAnswer = questionSteps.some((question) =>
        isAnswered(question, answers)
      );

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

  async function handleSubmit() {
    if (!snapshot) {
      setError(
        environmentError ||
          "Data lingkungan belum tersedia. Periksa lokasi terlebih dahulu."
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      const result = await saveHealthTrackerAssessment({
        condition,
        answers,
        scores,
        story,
        snapshot,
      });

      if (!result?.ok) {
        setError(
          result?.message ?? "Check-in gagal disimpan."
        );
        return;
      }

      router.push("/healthtracker");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan saat menyimpan check-in.");
    } finally {
      setSaving(false);
    }
  }

  function renderPerOptionScale(scaleQuestion) {
    const selectedOptions = answers[scaleQuestion.dependsOn] ?? [];

    if (!Array.isArray(selectedOptions)) return null;

    const excludedOptions = new Set(
      scaleQuestion.exclusiveOptions ?? []
    );

    const optionsToRate = selectedOptions.filter(
      (option) => !excludedOptions.has(option)
    );

    const sourceQuestion = getHealthTrackerQuestion(
      scaleQuestion.dependsOn
    );

    if (optionsToRate.length === 0) return null;

    return (
      <div className="mt-5 space-y-4 rounded-2xl border border-[#F0DFE6] bg-[#FFF8FB] p-4 sm:p-5">
        <div>
          <h4 className="text-sm font-bold text-[#332A35]">
            {scaleQuestion.question}
          </h4>

          <p className="mt-1 text-xs text-[#8A7D89]">
            Pilih tingkat gangguan untuk setiap kondisi berikut.
          </p>
        </div>

        <div className="space-y-3">
          {optionsToRate.map((optionCode) => {
            const selectedOption = sourceQuestion?.options?.find(
              (option) => getValue(option) === optionCode
            );

            const optionLabel =
              getLabel(selectedOption) || "Pilihan lainnya";

            return (
              <div
                key={optionCode}
                className="rounded-2xl border border-[#EADDE3] bg-white p-4 transition-all duration-200 hover:border-[#D99AAF]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8E8EF] text-xl">
                    {getOptionIcon(optionLabel)}
                  </span>

                  <p className="text-sm font-semibold text-[#5F5360]">
                    {optionLabel}
                  </p>
                </div>

                <ScaleOptions
                  value={scores[optionCode]}
                  onChange={(value) =>
                    updateScore(optionCode, value)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderQuestion(question) {
    return (
      <QuestionRenderer
        question={question}
        answers={answers}
        updateAnswer={updateAnswer}
      />
    );
  }

  function getAnswerLabel(question) {
    const value = answers[question.code];

    if (Array.isArray(value)) {
      return value
        .map((item) => {
          const option = question.options?.find(
            (candidate) => getValue(candidate) === item
          );

          return getLabel(option) || item;
        })
        .join(", ");
    }

    const option = question.options?.find(
      (candidate) => getValue(candidate) === value
    );

    return getLabel(option) || String(value ?? "");
  }

  function renderSummaryItem(question) {
    if (!isAnswered(question, answers)) return null;

    const otherTextKey = question.otherText?.key;
    const hasOther =
      otherTextKey &&
      Array.isArray(answers[question.code]) &&
      answers[question.code].includes("lainnya");

    return (
      <div
        key={question.code}
        className="rounded-xl border border-[#F0E3E9] bg-white p-4"
      >
        <p className="text-xs font-semibold text-[#B84E73]">
          {question.code}
        </p>

        <p className="mt-1 text-sm font-semibold text-[#332A35]">
          {question.question}
        </p>

        <p className="mt-2 text-sm text-[#5F5360]">
          {getAnswerLabel(question)}
        </p>

        {hasOther && answers[otherTextKey] && (
          <p className="mt-2 text-sm text-[#746875]">
            Keterangan: {answers[otherTextKey]}
          </p>
        )}
      </div>
    );
  }

  const otherTextKey = activeQuestion?.otherText?.key;

  const selectedAnswers = activeQuestion
    ? answers[activeQuestion.code] ?? []
    : [];

  const showOtherText =
    otherTextKey &&
    Array.isArray(selectedAnswers) &&
    selectedAnswers.includes("lainnya");

  const summaryQuestions = [
    activityQuestion,
    ...resolveQuestions(HEALTH_TRACKER_BASE_STEPS).filter(
      (question) =>
        question.code !== "HT-04" &&
        question.type !== "per_option_scale"
    ),
    ...resolveQuestions(
      HEALTH_TRACKER_BRANCH_STEPS[condition] ?? []
    ).filter(
      (question) => question.type !== "per_option_scale"
    ),
  ].filter(Boolean);

  return (
    <main className="health-tracker-flow mx-auto w-full max-w-4xl">

      {/* Hero */}
      <section className="mb-7 overflow-hidden rounded-3xl border border-[#F0E3E9] bg-[#FFF8FB] p-6 sm:p-8">

        <div className="mb-5 flex items-center gap-2">
          <span className="rounded-full bg-[#F8E8EF] px-3 py-1 text-xs font-bold tracking-wide text-[#B84E73]">
            HEALTH TRACKER
          </span>
          <span className="text-xs text-[#8A7B87]">
            Catatan kesehatan personal
          </span>
        </div>

        <h1 className="max-w-2xl text-2xl font-bold leading-snug text-[#332A35] sm:text-3xl">
          Bagaimana keadaan tubuhmu hari ini?
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#746875] sm:text-base">
          Luangkan waktu sejenak untuk mencatat pengalaman tubuh,
          aktivitas, dan situasi lingkungan yang kamu alami hari ini.
        </p>

        {/* Environment information */}
        <div className="mt-7 rounded-2xl border border-[#F0E3E9] bg-white p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8E8EF] text-[#B84E73]">
              <span className="text-lg">☀</span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#332A35]">
                Konteks lingkungan
              </p>

              {environmentLoading ? (
                <p className="mt-1 text-sm text-[#746875]">
                  Mengambil data lingkungan...
                </p>
              ) : environmentError ? (
                <p className="mt-1 text-sm text-red-600">
                  {environmentError}
                </p>
              ) : (
                <p className="mt-1 text-sm leading-6 text-[#52745A]">
                  <span className="mr-1">✓</span>
                  Data lingkungan berhasil disiapkan untuk check-in.
                </p>
              )}
            </div>
          </div>

          <p className="mt-3 border-t border-[#F0E3E9] pt-3 text-xs leading-5 text-[#8A7B87]">
            Informasi lingkungan membantu memahami konteks aktivitas,
            bukan untuk menentukan diagnosis kesehatan.
          </p>
        </div>
      </section>

      {/* Assessment */}
      <section className="rounded-3xl border border-[#F0E3E9] bg-white p-5 sm:p-7">
        <div className="mt-8">
          {/* Step 1: Activity */}
          {currentStep === 0 && (
            <>
              <h2 className="text-lg font-bold text-[#332A35]">
                Aktivitas hari ini
              </h2>

              <p className="mb-5 mt-2 text-sm text-[#746875]">
                Pilih aktivitas yang paling menggambarkan kegiatanmu
                hari ini.
              </p>

              {activityQuestion ? (
                renderQuestion(activityQuestion)
              ) : (
                <p className="text-sm text-red-600">
                  Pertanyaan HT-04 tidak ditemukan.
                </p>
              )}
            </>
          )}

          {/* Step 2: Condition */}
          {currentStep === 1 && (
            <>
              <h2 className="text-lg font-bold text-[#332A35]">
                Kondisi yang ingin kamu catat
              </h2>

              <p className="mb-5 mt-2 text-sm text-[#746875]">
                Pilih kondisi yang ingin dipertimbangkan dalam
                check-in ini.
              </p>

              <div className="space-y-3">
                {CONDITION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => changeCondition(option.value)}
                    aria-pressed={condition === option.value}
                    className={`w-full rounded-xl border p-4 text-left text-sm font-medium transition ${
                      condition === option.value
                        ? "border-[#B84E73] bg-[#F8E8EF] text-[#8E3E5E]"
                        : "border-[#EADDE3] bg-white text-[#5F5360] hover:border-[#B84E73]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 3: Pertanyaan Umum */}
          {currentStep === 2 && (
            <section>
              {generalQuestions.map((question) => (
                <div key={question.code} className="mb-6">
                  <h2 className="text-lg font-bold text-[#332A35]">
                    {question.question}
                  </h2>

                  <div className="mt-5">
                    {renderQuestion(question)}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Step 4: Pertanyaan Lanjutan */}
          {currentStep === 3 && (
            <section>
              {conditionQuestions.length > 0 ? (
                conditionQuestions.map((question) => (
                  <div key={question.code} className="mb-6">
                    <h2 className="text-lg font-bold text-[#332A35]">
                      {question.question}
                    </h2>

                    <div className="mt-5">
                      {renderQuestion(question)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#5F5360]">
                  Tidak ada pertanyaan lanjutan untuk kondisi yang dipilih.
                </p>
              )}
            </section>
          )}

          {/* Story */}
          {currentStep === storyStep && (
            <StoryScreen
              story={story}
              setStory={(value) => {
                setStory(value);
                setError("");
              }}
            />
          )}

          {/* Review Jawaban */}
          {currentStep === reviewStep && (
            <>
              <h2 className="text-lg font-bold text-[#332A35]">
                Periksa Kembali Catatanmu
              </h2>

              <p className="mb-5 mt-2 text-sm leading-6 text-[#746875]">
                Berikut rangkuman informasi yang sudah kamu bagikan.
                Kamu bisa kembali untuk mengubah jawaban sebelum melanjutkan.
              </p>

              <div className="space-y-3">
                <div className="rounded-xl border border-[#F0E3E9] bg-[#FFF8FB] p-4">
                  <p className="text-xs font-semibold text-[#B84E73]">
                    KONDISI
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#332A35]">
                    {CONDITION_OPTIONS.find(
                      (item) => item.value === condition
                    )?.label}
                  </p>
                </div>

                {summaryQuestions.map(renderSummaryItem)}

                {story.trim() ? (
                  <div className="rounded-xl border border-[#F0E3E9] bg-white p-4">
                    <p className="text-xs font-semibold text-[#B84E73]">
                      CERITA HARI INI
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#5F5360]">
                      {story}
                    </p>
                  </div>
                ) : (
                  <p className="rounded-xl bg-[#FFF8FB] p-4 text-sm text-[#8A7D89]">
                    Kamu tidak menambahkan cerita hari ini.
                  </p>
                )}
              </div>
            </>
          )}

          {/* Step 5: Summary */}
          {currentStep === summaryStep && (
            <SummaryScreen
              conditionLabel={
                CONDITION_OPTIONS.find(
                  (item) => item.value === condition
                )?.label || "Belum dipilih"
              }
              questions={summaryQuestions}
              renderSummaryItem={renderSummaryItem}
              story={story}
            />
          )}
        </div>

        {/* Error */}
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {aiNotice && currentStep === reviewStep && (
          <p
            role="status"
            className="mt-4 rounded-xl border border-[#EADDE3] bg-[#FFF8FB] p-4 text-sm leading-6 text-[#746875]"
          >
            {aiNotice}
          </p>
        )}

        {/* Navigation */}
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#F0E3E9] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0 || saving}
            className="rounded-xl border border-[#EADDE3] px-5 py-3 text-sm font-semibold text-[#5F5360] transition hover:bg-[#FFF8FB] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Kembali
          </button>

          {currentStep === reviewStep ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleContinueWithoutAI}
                className="rounded-xl border border-[#B84E73] px-5 py-3 text-sm font-semibold text-[#8E3E5E] transition hover:bg-[#FFF8FB]"
              >
                Lanjut Tanpa AI
              </button>

              <button
                type="button"
                onClick={handleContinueWithAI}
                className="rounded-xl bg-[#B84E73] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8E3E5E]"
              >
                Lanjut dengan AI
              </button>
            </div>
          ) : currentStep === summaryStep ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push("/healthtracker")}
                disabled={saving}
                className="rounded-xl border border-[#B84E73] px-5 py-3 text-sm font-semibold text-[#8E3E5E] transition hover:bg-[#FFF8FB] disabled:opacity-50"
              >
                Jangan Simpan
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || environmentLoading || !snapshot}
                className="rounded-xl bg-[#B84E73] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8E3E5E] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan Check-In"}
              </button>
            </div>
          ) : currentStep === 2 || currentStep === 3 ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep === 2 ? 3 : storyStep)}
                className="rounded-xl border border-[#B84E73] px-5 py-3 text-sm font-semibold text-[#8E3E5E] transition hover:bg-[#FFF8FB]"
              >
                Lewati
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-[#B84E73] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8E3E5E]"
              >
                Lanjutkan
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl bg-[#B84E73] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8E3E5E]"
            >
              Lanjutkan
            </button>
          )}
        </div>
      </section>
    </main>
  );
}