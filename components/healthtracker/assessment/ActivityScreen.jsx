"use client";

import QuestionRenderer from "./shared/QuestionRenderer";

export default function ActivityScreen({
  question,
  answers,
  scores,
  updateAnswer,
  updateScore,
}) {
  return (
    <>
      <h2 className="text-lg font-bold text-[#332A35]">
        Aktivitas hari ini
      </h2>

      <p className="mb-5 mt-2 text-sm text-[#746875]">
        Pilih aktivitas yang paling menggambarkan kegiatanmu
        hari ini.
      </p>

      {question ? (
        <QuestionRenderer
          question={question}
          answers={answers}
          scores={scores}
          updateAnswer={updateAnswer}
          updateScore={updateScore}
        />
      ) : (
        <p className="text-sm text-red-600">
          Pertanyaan HT-04 tidak ditemukan.
        </p>
      )}
    </>
  );
}