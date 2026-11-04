"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAssessment } from "@/context/AssessmentContext";
import ProgressSteps from "@/components/healthtracker/ProgressSteps";

import {
  HEALTH_TRACKER_SCALE,
  HEALTH_TRACKER_BASE_STEPS,
  HEALTH_TRACKER_BRANCH_STEPS,
  getHealthTrackerQuestion,
  isHealthTrackerQuestionVisible,
  setHealthTrackerAnswer,
} from "@/data/healthTrackerQuestions";

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

function validateQuestion(question, answers) {
  if (!question?.required) return "";

  if (!isAnswered(question, answers)) {
    return "Pertanyaan ini perlu dijawab terlebih dahulu.";
  }

  return "";
}

function ScaleOptions({ value, onChange }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {HEALTH_TRACKER_SCALE.map((option) => {
        const optionValue =
          typeof option === "object" ? getValue(option) : option;

        const label = getLabel(option);
        const selected = String(value) === String(optionValue);

        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(Number(optionValue))}
            aria-pressed={selected}
            className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
              selected
                ? "border-[#B84E73] bg-[#F8E8EF] text-[#8E3E5E]"
                : "border-[#EADDE3] bg-white text-[#5F5360] hover:border-[#B84E73]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function HealthTrackerAssessment() {
  const router = useRouter();
  const { environmentLocation } = useAssessment();

  const [condition, setCondition] = useState("");
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});

  const [currentStep, setCurrentStep] = useState(0);

  const [snapshot, setSnapshot] = useState(null);
  const [environmentLoading, setEnvironmentLoading] = useState(true);
  const [environmentError, setEnvironmentError] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const activityQuestion = getHealthTrackerQuestion("HT-04");

  const questionSteps = useMemo(
    () => getQuestionSteps(condition, answers),
    [condition, answers]
  );

  const steps = useMemo(
    () => [
      { code: "activity", title: "Aktivitas" },
      { code: "condition", title: "Kondisi" },
      ...questionSteps.map((question) => ({
        code: question.code,
        title: question.code,
      })),
      { code: "summary", title: "Ringkasan" },
    ],
    [questionSteps]
  );

  const summaryStep = steps.length - 1;

  const activeQuestion =
    currentStep >= 2 && currentStep < summaryStep
      ? questionSteps[currentStep - 2]
      : null;

  const inlineScaleQuestion = getInlineScaleQuestion(
    activeQuestion,
    condition
  );

  function changeCondition(value) {
    setCondition(value);

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
      <div className="mt-5 space-y-4 rounded-2xl bg-[#FFF8FB] p-4">
        <p className="text-sm font-semibold text-[#332A35]">
          {scaleQuestion.question}
        </p>

        {optionsToRate.map((optionCode) => {
          const selectedOption = sourceQuestion?.options?.find(
            (option) => getValue(option) === optionCode
          );

          return (
            <div key={optionCode} className="space-y-2">
              <p className="text-sm font-medium text-[#5F5360]">
                {getLabel(selectedOption) || optionCode}
              </p>

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
    );
  }

  function renderQuestion(question) {
    const value = answers[question.code];

    if (question.type === "single") {
      return (
        <div className="space-y-3">
          {question.options?.map((option) => {
            const optionValue = getValue(option);
            const selected = value === optionValue;

            return (
              <button
                key={optionValue}
                type="button"
                onClick={() =>
                  updateAnswer(question.code, optionValue)
                }
                aria-pressed={selected}
                className={`w-full rounded-xl border p-4 text-left text-sm transition ${
                  selected
                    ? "border-[#B84E73] bg-[#F8E8EF] text-[#8E3E5E]"
                    : "border-[#EADDE3] bg-white text-[#5F5360] hover:border-[#B84E73]"
                }`}
              >
                {getLabel(option)}
              </button>
            );
          })}
        </div>
      );
    }

    if (question.type === "multiple") {
      const selectedValues = Array.isArray(value) ? value : [];

      return (
        <div className="space-y-3">
          {question.options?.map((option) => {
            const optionValue = getValue(option);
            const selected = selectedValues.includes(optionValue);

            return (
              <label
                key={optionValue}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition ${
                  selected
                    ? "border-[#B84E73] bg-[#F8E8EF]"
                    : "border-[#EADDE3] bg-white hover:border-[#B84E73]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={(event) => {
                    const nextValues = event.target.checked
                      ? [...selectedValues, optionValue]
                      : selectedValues.filter(
                          (item) => item !== optionValue
                        );

                    updateAnswer(question.code, nextValues);
                  }}
                  className="h-4 w-4 accent-[#B84E73]"
                />

                <span className="text-[#5F5360]">
                  {getLabel(option)}
                </span>
              </label>
            );
          })}
        </div>
      );
    }

    if (question.type === "scale") {
      return (
        <ScaleOptions
          value={value}
          onChange={(nextValue) =>
            updateAnswer(question.code, nextValue)
          }
        />
      );
    }

    return (
      <p className="text-sm text-[#8A7D89]">
        Tipe pertanyaan {question.type} belum didukung.
      </p>
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

          {/* Step 3 and 4: Questions */}
          {activeQuestion && (
            <>
              <p className="mb-2 text-xs font-semibold tracking-wide text-[#B84E73]">
                {activeQuestion.code}
              </p>

              <h2 className="text-lg font-bold text-[#332A35]">
                {activeQuestion.question}
              </h2>

              <div className="mt-5">
                {renderQuestion(activeQuestion)}
              </div>

              {inlineScaleQuestion &&
                renderPerOptionScale(inlineScaleQuestion)}

              {showOtherText && (
                <div className="mt-5">
                  <label
                    htmlFor="health-tracker-other"
                    className="mb-2 block text-sm font-medium text-[#5F5360]"
                  >
                    Ceritakan pilihan lainnya
                  </label>

                  <input
                    id="health-tracker-other"
                    type="text"
                    maxLength={200}
                    value={answers[otherTextKey] ?? ""}
                    onChange={(event) =>
                      setAnswers((previous) => ({
                        ...previous,
                        [otherTextKey]: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#EADDE3] px-4 py-3 text-sm outline-none focus:border-[#B84E73]"
                  />
                </div>
              )}
            </>
          )}

          {/* Step 5: Summary */}
          {currentStep === summaryStep && (
            <>
              <h2 className="text-lg font-bold text-[#332A35]">
                Ringkasan Check-In
              </h2>

              <p className="mb-5 mt-2 text-sm leading-6 text-[#746875]">
                Periksa kembali jawabanmu sebelum menyimpan catatan
                kesehatan.
              </p>

              <div className="space-y-3">
                <div className="rounded-xl border border-[#F0E3E9] bg-[#FFF8FB] p-4">
                  <p className="text-xs font-semibold text-[#B84E73]">
                    KONDISI
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#332A35]">
                    {
                      CONDITION_OPTIONS.find(
                        (item) => item.value === condition
                      )?.label
                    }
                  </p>
                </div>

                {summaryQuestions.map(renderSummaryItem)}
              </div>

              <p className="mt-5 rounded-xl bg-[#E9F2EA] p-4 text-xs leading-5 text-[#426B4A]">
                Data lingkungan merupakan konteks pendukung untuk
                memahami pengalaman harian, bukan diagnosis medis.
              </p>
            </>
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

          {currentStep === summaryStep ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || environmentLoading || !snapshot}
              className="rounded-xl bg-[#B84E73] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8E3E5E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan Check-In"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl bg-[#B84E73] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8E3E5E]"
            >
              Lanjutkan
            </button>
          )}
        </div>
      </section>
    </main>
  );
}