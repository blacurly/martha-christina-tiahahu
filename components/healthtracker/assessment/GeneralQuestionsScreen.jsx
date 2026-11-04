"use client";

export default function GeneralQuestionsScreen({
  questions = [],
  renderQuestion,
}) {
  return (
    <section className="space-y-7">
      {questions.length > 0 ? (
        questions.map((question) => (
          <div
            key={question.code}
            className="border-b border-[#F0E3E9] pb-6 last:border-0 last:pb-0"
          >
            <h2 className="text-lg font-bold leading-relaxed text-[#332A35]">
              {question.question}
            </h2>

            <div className="mt-5">
              {renderQuestion(question)}
            </div>
          </div>
        ))
      ) : (
        <p className="rounded-xl bg-[#FFF8FB] p-4 text-sm leading-6 text-[#746875]">
          Tidak ada pertanyaan umum yang perlu ditampilkan saat ini.
        </p>
      )}
    </section>
  );
}