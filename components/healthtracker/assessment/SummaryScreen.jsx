"use client";

export default function SummaryScreen({
  conditionLabel,
  summaryQuestions = [],
  renderSummaryItem,
  story = "",
}) {
  return (
    <section className="space-y-6">
      {/* Judul Ringkasan */}
      <div>
        <h2 className="text-xl font-bold text-[#332A35]">
          Ringkasan Check-In
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#6F6571]">
          Berikut ringkasan dari aktivitas, kondisi, dan
          jawaban yang telah kamu berikan selama check-in.
        </p>
      </div>

      {/* Kondisi */}
      <div className="rounded-2xl border border-[#E8DDE5] bg-white p-4">
        <p className="text-sm font-semibold text-[#8A7E8C]">
          Kondisi yang dipilih
        </p>

        <p className="mt-1 text-base font-bold text-[#332A35]">
          {conditionLabel}
        </p>
      </div>

      {/* Ringkasan jawaban */}
      <div className="space-y-4">
        {summaryQuestions.map(renderSummaryItem)}
      </div>

      {/* Cerita Hari Ini */}
      {story.trim() && (
        <div className="rounded-2xl border border-[#E8DDE5] bg-white p-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#8E3E5E]">
            Cerita Hari Ini
          </h3>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#6F6571]">
            {story}
          </p>
        </div>
      )}

      {/* Disclaimer lingkungan */}
      <div className="rounded-2xl border border-[#D7E6D9] bg-[#E9F2EA] p-4">
        <p className="text-sm leading-6 text-[#526A59]">
          Data lingkungan merupakan konteks pendukung untuk
          memahami pengalaman harian, bukan diagnosis medis.
        </p>
      </div>
    </section>
  );
}