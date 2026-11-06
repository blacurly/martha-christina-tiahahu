import {
  HEALTH_TRACKER_BASE_STEPS,
  HEALTH_TRACKER_BRANCH_STEPS,
  getHealthTrackerQuestion,
  isHealthTrackerQuestionVisible,
} from "@/data/healthTrackerQuestions";

// Mengambil label dari opsi pertanyaan.
export function getLabel(option) {
  if (typeof option === "string") return option;

  return (
    option?.label ??
    option?.title ??
    option?.value ??
    option?.code ??
    ""
  );
}

// Mengambil value dari opsi pertanyaan.
export function getValue(option) {
  if (typeof option === "string") return option;

  return option?.value ?? option?.code ?? "";
}

// Mengubah kode pertanyaan menjadi objek pertanyaan.
function resolveQuestions(items = []) {
  return items
    .map((item) => {
      const code = typeof item === "string" ? item : item?.code;
      return code ? getHealthTrackerQuestion(code) : item;
    })
    .filter(Boolean);
}

// Mencari pertanyaan skala yang berhubungan dengan pertanyaan utama.
export function getInlineScaleQuestion(question, condition) {
  if (!question?.code) return null;

  const allSteps = [
    ...HEALTH_TRACKER_BASE_STEPS,
    ...(HEALTH_TRACKER_BRANCH_STEPS[condition] ?? []),
  ];

  return (
    resolveQuestions(allSteps).find(
      (item) =>
        item &&
        item.type === "per_option_scale" &&
        item.dependsOn === question.code
    ) ?? null
  );
}

// Membaca jawaban dan mengubahnya menjadi label.
export function getAnswerLabel(question, answers) {
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

// Menyusun daftar pertanyaan untuk ringkasan.
export function buildSummaryQuestions(condition, activityQuestion) {
  return [
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
}

// Mengambil pertanyaan umum yang perlu ditampilkan.
export function getGeneralQuestions(answers) {
  return resolveQuestions(HEALTH_TRACKER_BASE_STEPS).filter(
    (question) =>
      question.code !== "HT-04" &&
      question.type !== "per_option_scale" &&
      isHealthTrackerQuestionVisible(question, answers)
  );
}

// Mengambil pertanyaan lanjutan sesuai kondisi.
export function getConditionQuestions(condition, answers) {
  return resolveQuestions(
    HEALTH_TRACKER_BRANCH_STEPS[condition] ?? []
  ).filter(
    (question) =>
      question.type !== "per_option_scale" &&
      isHealthTrackerQuestionVisible(question, answers)
  );
}