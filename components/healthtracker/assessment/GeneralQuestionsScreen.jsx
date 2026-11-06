"use client";

import QuestionRenderer from "./shared/QuestionRenderer";

export default function GeneralQuestionsScreen({
  questions,
  answers,
  scores,
  updateAnswer,
  updateScore,
}) {
  return (
    <section>
      {questions.map((question) => (
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
      ))}
    </section>
  );
}