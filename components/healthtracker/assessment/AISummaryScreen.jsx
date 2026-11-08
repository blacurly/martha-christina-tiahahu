"use client";

import {
  Sparkles,
  MessageCircleHeart,
  ShieldCheck,
} from "lucide-react";

import SummaryScreen from "./SummaryScreen";

function SummaryCard({ icon: Icon, title, children }) {
  return (
    <article className="rounded-2xl border border-[#F0E3E9] bg-white p-5 shadow-[0_5px_24px_rgb(120_70_90_/_4%)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F8E8EF] text-[#B84E73]">
          <Icon size={21} />
        </div>

        <h3 className="text-sm font-bold text-[#8E3E5E]">
          {title}
        </h3>
      </div>

      <div className="text-sm leading-relaxed text-[#5F5360]">
        {children}
      </div>
    </article>
  );
}

export default function AISummaryScreen({
  conditionLabel,
  summaryQuestions = [],
  answers = {},
  scores = {},
  condition,
  story = "",
  snapshot = null,
  aiNotice = [],
}) {
  const messages = Array.isArray(aiNotice)
    ? aiNotice.filter(
        (message) =>
          message.role === "assistant" &&
          typeof message.content === "string" &&
          message.content.trim()
      )
    : [];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F8E8EF] px-3 py-1.5 text-xs font-bold tracking-wide text-[#8E3E5E]">
          <Sparkles size={15} />
          REFLEKSI AI
        </div>

        <h2 className="text-xl font-bold text-[#332A35]">
          Gambaran Check-In Hari Ini
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-[#746875]">
          Berikut rangkuman aktivitas, kondisi tubuh, dan
          pengalaman yang kamu catat hari ini, beserta
          refleksi AI.
        </p>
      </div>

      {/* Hasil Refleksi AI - paling atas */}
      <SummaryCard
        icon={MessageCircleHeart}
        title="Hasil Refleksi AI"
      >
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <p
                key={index}
                className="whitespace-pre-wrap"
              >
                {message.content}
              </p>
            ))}
          </div>
        ) : (
          <p>
            Belum ada hasil refleksi yang dapat ditampilkan.
          </p>
        )}
      </SummaryCard>

      {/* Seluruh rangkuman check-in */}
      <SummaryScreen
        conditionLabel={conditionLabel}
        summaryQuestions={summaryQuestions}
        answers={answers}
        scores={scores}
        condition={condition}
        story={story}
        snapshot={snapshot}
        showHeader={false}
      />

      {/* Catatan Penting */}
      <div className="rounded-2xl border border-[#D7E6D9] bg-[#E9F2EA] p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-[#52745A]"
          />

          <div>
            <p className="text-sm font-bold text-[#365541]">
              Catatan Penting
            </p>

            <p className="mt-1 text-xs leading-5 text-[#526A59]">
              Refleksi AI merupakan informasi pendukung untuk
              membantu memahami pengalaman tubuh dan konteks
              lingkungan. Hasil ini bukan diagnosis atau
              pengganti konsultasi tenaga kesehatan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}