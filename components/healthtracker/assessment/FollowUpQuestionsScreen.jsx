"use client";

export default function FollowUpQuestionsScreen({
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
        <div className="rounded-2xl border border-[#D7E6D9] bg-[#E9F2EA] p-4">
          <p className="text-sm font-semibold text-[#365541]">
            Tidak ada pertanyaan lanjutan
          </p>

          <p className="mt-1 text-sm leading-6 text-[#526A59]">
            Belum ada pertanyaan tambahan berdasarkan kondisi
            yang kamu pilih. Kamu bisa melanjutkan ke tahap
            berikutnya.
          </p>
        </div>
      )}
    </section>
  );
}