"use client";

import { useAssessment } from "@/context/AssessmentContext";

const scaleLevels = [
  { value: 0, label: "Tidak ada" },
  { value: 1, label: "Ringan" },
  { value: 2, label: "Sedang" },
  { value: 3, label: "Kuat" },
  { value: 4, label: "Sangat kuat" },
];

export default function SymptomScale() {
  const {
    condition,
    symptoms,
    scores,
    setScores,
  } = useAssessment();

  const conditionSymptoms = symptoms[condition] ?? [];

  function handleScoreChange(symptom, value) {
    setScores((previous) => ({
      ...previous,
      [symptom]: value,
    }));
  }

  if (!condition) {
    return (
      <p className="text-sm text-[#766976]">
        Pilih kondisi kesehatan terlebih dahulu.
      </p>
    );
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm leading-relaxed text-[#766976]">
          Pilih angka yang paling menggambarkan pengalamanmu
          untuk setiap gejala.
        </p>

        <div className="rounded-xl border border-[#E8DCE3] bg-white p-3 sm:p-4">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {scaleLevels.map((level) => (
              <div
                key={level.value}
                className="min-w-0 text-center"
              >
                <div className="mb-1.5 text-lg font-extrabold text-[#B84E73]">
                  {level.value}
                </div>

                <p className="text-[10px] font-semibold leading-tight text-[#6F5968] sm:text-xs">
                  {level.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 border-t border-[#F0E3E9] pt-3">
            <p className="text-xs leading-relaxed text-[#766976]">
              Skala ini menggambarkan apa yang kamu rasakan,
              bukan tingkat risiko kesehatan.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {conditionSymptoms.map((symptom, index) => {
          const selectedScore = scores[symptom];

          return (
            <fieldset
              key={symptom}
              className="rounded-2xl border border-[#E8DCE3] bg-white p-4"
            >
              <legend className="sr-only">
                Tingkat gejala: {symptom}
              </legend>

              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold text-[#332A35]">
                  {symptom}
                </h3>

                {selectedScore !== undefined && (
                  <span className="shrink-0 rounded-full bg-[#F8E8EF] px-2.5 py-1 text-xs font-bold text-[#B84E73]">
                    {scaleLevels[selectedScore].label}
                  </span>
                )}
              </div>

              <div
                className="grid grid-cols-5 gap-2"
                role="group"
                aria-label={`Pilih tingkat ${symptom}`}
              >
                {scaleLevels.map((level) => {
                  const isSelected =
                    selectedScore === level.value;

                  return (
                    <button
                      key={level.value}
                      type="button"
                      aria-label={`${symptom}: ${level.value} - ${level.label}`}
                      aria-pressed={isSelected}
                      onClick={() =>
                        handleScoreChange(symptom, level.value)
                      }
                      className={`flex h-11 items-center justify-center rounded-xl border text-sm font-extrabold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B84E73] focus-visible:ring-offset-2 ${
                        isSelected
                          ? "border-[#B84E73] bg-[#B84E73] text-white"
                          : "border-[#E8DCE3] bg-white text-[#6F5968] hover:border-[#D6A1B5] hover:bg-[#F8E8EF] hover:text-[#B84E73]"
                      }`}
                    >
                      {level.value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>

      <p className="text-xs leading-relaxed text-[#766976]">
        Pastikan setiap gejala memiliki pilihan angka sebelum
        melanjutkan. Jika tidak merasakan gejala, pilih 0.
      </p>
    </section>
  );
}