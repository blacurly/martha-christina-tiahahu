"use client";

import QuestionRenderer from "./shared/QuestionRenderer";

export default function FollowUpQuestionsScreen({
  questions,
  answers,
  scores,
  updateAnswer,
  updateScore,
}) {
  return (
    <section>
      {questions.length > 0 ? (
        questions.map((question) => (
          <div key={question.code} className="mb-6">
            <h2 className="text-lg font-bold text-[#332A35]">
              {question.question}
            </h2>

            <div className="mt-5">
              <QuestionRenderer
                question={question}
                answers={answers}
                scores={scores}
                updateAnswer={updateAnswer}
                updateScore={updateScore}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-[#5F5360]">
          Tidak ada pertanyaan lanjutan untuk kondisi yang dipilih.
        </p>
      )}
    </section>
  );
}