"use client";

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
  Footprints,
  Sparkles,
} from "lucide-react";

import {
  HEALTH_TRACKER_SCALE,
  getHealthTrackerQuestion,
} from "@/data/healthTrackerQuestions";

import {
  getLabel,
  getValue,
} from "@/lib/healthtracker/questionHelpers";

// Ikon pilihan jawaban
function getOptionIcon(label = "") {
  const text = String(label).toLowerCase();

  let Icon = Sparkles;

  if (/haid|menstruasi|siklus/.test(text)) Icon = CalendarDays;
  else if (/hamil|kehamilan/.test(text)) Icon = Baby;
  else if (/menyusui|asi/.test(text)) Icon = Heart;
  else if (/nyeri|sakit|kram/.test(text)) Icon = Activity;
  else if (/lelah|capek|letih|tidur/.test(text)) Icon = Moon;
  else if (/panas|demam|suhu/.test(text)) Icon = Thermometer;
  else if (/darah|flek/.test(text)) Icon = Droplets;
  else if (/makan|minum/.test(text)) Icon = Utensils;
  else if (/jalan|bergerak|aktivitas/.test(text)) Icon = Footprints;
  else if (/matahari|luar ruangan/.test(text)) Icon = Sun;
  else if (/nyaman|baik|normal/.test(text)) Icon = Smile;
  else if (/cemas|sedih|stres/.test(text)) Icon = Frown;

  return <Icon size={24} strokeWidth={1.8} color="#B84E73" />;
}

// Pilihan skala 0–4
function ScaleOptions({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
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

// Renderer pertanyaan Health Tracker
export default function QuestionRenderer({
  question,
  answers = {},
  scores = {},
  updateAnswer,
  updateScore,
}) {
  if (!question) return null;

  const value = answers[question.code];

  // SINGLE
  if (question.type === "single") {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options?.map((option) => {
          const optionValue = getValue(option);
          const label = getLabel(option);
          const selected = value === optionValue;

          return (
            <button
              key={optionValue}
              type="button"
              onClick={() => updateAnswer(question.code, optionValue)}
              aria-pressed={selected}
              className={`group flex min-h-[88px] items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] ${
                selected
                  ? "border-[#B84E73] bg-[#F8E8EF] shadow-sm ring-2 ring-[#B84E73]/15"
                  : "border-[#EADDE3] bg-white hover:border-[#D99AAF]"
              }`}
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  selected ? "bg-white" : "bg-[#FFF8FB]"
                }`}
                aria-hidden="true"
              >
                {getOptionIcon(label)}
              </span>

              <span
                className={`flex-1 text-sm font-semibold ${
                  selected ? "text-[#8E3E5E]" : "text-[#5F5360]"
                }`}
              >
                {label}
              </span>

              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                  selected
                    ? "border-[#B84E73] bg-[#B84E73] text-white"
                    : "border-[#EADDE3] text-transparent"
                }`}
              >
                ✓
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // MULTIPLE + INLINE SCALE
  if (question.type === "multiple") {
    const selectedValues = Array.isArray(value) ? value : [];

    const hasInlineScale = [
      "HT-02",
      "HK-01",
    ].includes(question.code);

    const excludedOptions = [
      "lainnya",
      "tidak_ada",
      "tidak_ada_yang_ingin_dicatat",
    ];

    return (
      <div className="space-y-3">
        {question.options?.map((option) => {
          const optionValue = getValue(option);
          const label = getLabel(option);
          const selected = selectedValues.includes(optionValue);

          const showScale =
            selected &&
            hasInlineScale &&
            !excludedOptions.includes(optionValue);

          return (
            <div
              key={optionValue}
              className={`rounded-2xl border p-4 transition ${
                selected
                  ? "border-[#B84E73] bg-[#FFF8FB]"
                  : "border-[#EADDE3] bg-white"
              }`}
            >
              <label className="flex cursor-pointer items-center gap-4">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF8FB]"
                  aria-hidden="true"
                >
                  {getOptionIcon(label)}
                </span>

                <span className="flex-1 text-sm font-semibold text-[#5F5360]">
                  {label}
                </span>

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
                  className="h-5 w-5 shrink-0 cursor-pointer accent-[#B84E73]"
                />
              </label>

              {showScale && (
                <div className="mt-4 border-t border-[#EADDE3] pt-4">
                  <p className="mb-3 text-sm font-semibold text-[#8E3E5E]">
                    Seberapa mengganggu {label.toLowerCase()} yang kamu rasakan?
                  </p>

                  <ScaleOptions
                    value={scores[optionValue]}
                    onChange={(nextValue) =>
                      updateScore?.(optionValue, nextValue)
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // SCALE
  if (question.type === "scale") {
    return (
      <div className="rounded-2xl bg-[#FFF8FB] p-4">
        <ScaleOptions
          value={value}
          onChange={(nextValue) =>
            updateAnswer(question.code, nextValue)
          }
        />
      </div>
    );
  }

  // PER OPTION SCALE
  if (question.type === "per_option_scale") {
    const parentQuestion = getHealthTrackerQuestion(
      question.dependsOn
    );

    const selectedValues = Array.isArray(
      answers[question.dependsOn]
    )
      ? answers[question.dependsOn]
      : [];

    const excludedOptions = [
      "lainnya",
      "tidak_ada",
      "tidak_ada_yang_ingin_dicatat",
    ];

    const scoredOptions = selectedValues.filter(
      (optionCode) => !excludedOptions.includes(optionCode)
    );

    if (scoredOptions.length === 0) return null;

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#332A35]">
            Tingkat gangguan
          </h3>
          <p className="mt-1 text-sm text-[#8A7D89]">
            Pilih tingkat gangguan untuk setiap keluhan yang kamu pilih.
          </p>
        </div>

        {scoredOptions.map((optionCode) => {
          const selectedOption = parentQuestion?.options?.find(
            (option) => getValue(option) === optionCode
          );

          const optionLabel =
            getLabel(selectedOption) || optionCode;

          return (
            <div
              key={optionCode}
              className="rounded-2xl border border-[#EADDE3] bg-white p-4"
            >
              <p className="mb-3 text-sm font-bold text-[#8E3E5E]">
                {optionLabel}
              </p>

              <ScaleOptions
                value={scores[optionCode]}
                onChange={(nextValue) =>
                  updateScore?.(optionCode, nextValue)
                }
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <p className="text-sm text-[#8A7D89]">
      Tipe pertanyaan belum didukung: {question.type}
    </p>
  );
}