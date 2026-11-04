
"use client";

import { useAssessment } from "@/context/AssessmentContext";
import { Q_MENSTRUATION_DAY, visibleQuestions } from "@/data/sycle";

const MENSTRUATION_DAY_QUESTION = Q_MENSTRUATION_DAY;

export default function CoreQuestions() {
  const {
    condition,
    answers,
    updateAnswer,
  } = useAssessment();

  const questions = visibleQuestions(condition, answers);

  if (questions.length === 0) {
    return (
      <p className="text-sm text-[#766976]">
        Pertanyaan untuk kondisi ini belum tersedia.
      </p>
    );
  }

  const menstruationAnswer =
    answers[MENSTRUATION_DAY_QUESTION] ?? "";

  const isUncertain = menstruationAnswer === "Tidak yakin";

  const dayMatch = menstruationAnswer.match(/^Hari ke-(\d+)$/);

  const selectedDay = dayMatch
    ? Number(dayMatch[1])
    : null;

  function changeDay(nextDay) {
    const boundedDay = Math.min(14, Math.max(1, nextDay));
    updateAnswer(
      MENSTRUATION_DAY_QUESTION,
      `Hari ke-${boundedDay}`
    );
  }

  function toggleUncertain(checked) {
    updateAnswer(
      MENSTRUATION_DAY_QUESTION,
      checked ? "Tidak yakin" : ""
    );
  }

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-[#332A35]">
          Pertanyaan tentang kondisi tubuh
        </h2>

        <p className="text-sm leading-relaxed text-[#766976]">
          Pilih jawaban yang paling sesuai dengan kondisimu saat ini.
        </p>
      </div>

      {questions.map(([question, options], index) => (
        <fieldset
          key={question}
          className="space-y-3 border-0 p-0"
        >
          <legend className="mb-3 text-sm font-bold leading-relaxed text-[#332A35]">
            {index + 1}. {question}
          </legend>

          {condition === "Menstruasi" &&
          question === MENSTRUATION_DAY_QUESTION ? (
            <div className="space-y-4 rounded-2xl border border-[#E8DCE3] bg-white p-4">
              <div
                className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition-colors ${
                  isUncertain
                    ? "border-[#E8DCE3] bg-[#F9F6F8]"
                    : "border-[#E8C4D2] bg-[#FFF8FB]"
                }`}
              >
                <button
                  type="button"
                  aria-label="Kurangi hari menstruasi"
                  disabled={isUncertain || selectedDay === 1}
                  onClick={() =>
                    changeDay((selectedDay ?? 2) - 1)
                  }
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8E8EF] text-xl font-bold text-[#B84E73] transition-colors hover:bg-[#F0D5E1] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  −
                </button>

                <div className="min-w-0 flex-1 text-center">
                  <p className="text-xs font-bold text-[#766976]">
                    HARI MENSTRUASI
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-[#332A35]">
                    {isUncertain
                      ? "—"
                      : selectedDay
                        ? `Hari ke-${selectedDay}`
                        : "Pilih hari"}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Tambah hari menstruasi"
                  disabled={isUncertain || selectedDay === 14}
                  onClick={() =>
                    changeDay((selectedDay ?? 0) + 1)
                  }
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8E8EF] text-xl font-bold text-[#B84E73] transition-colors hover:bg-[#F0D5E1] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <p className="text-xs leading-relaxed text-[#766976]">
                Pilih angka dari hari ke-1 hingga hari ke-14.
              </p>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E8DCE3] p-3 transition-colors hover:border-[#D6A1B5] hover:bg-[#FFF8FB]">
                <input
                  type="checkbox"
                  checked={isUncertain}
                  onChange={(event) =>
                    toggleUncertain(event.target.checked)
                  }
                  className="h-4 w-4 accent-[#B84E73]"
                />

                <span className="text-sm font-semibold text-[#332A35]">
                  Tidak yakin
                </span>
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              {options.map((option) => {
                const selected = answers[question] === option;

                return (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                      selected
                        ? "border-[#B84E73] bg-[#F8E8EF]"
                        : "border-[#E8DCE3] bg-white hover:border-[#D6A1B5]"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={selected}
                      onChange={() =>
                        updateAnswer(question, option)
                      }
                      className="mt-1 accent-[#B84E73]"
                    />

                    <span className="text-sm leading-relaxed text-[#332A35]">
                      {option}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </fieldset>
      ))}
    </section>
  );
}