"use client";

export default function ReviewScreen({
  conditionLabel,
  questions = [],
  renderSummaryItem,
  story = "",
}) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#332A35]">
          Periksa kembali check-in kamu
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#6F6571]">
          Berikut rangkuman kondisi dan jawaban yang sudah
          kamu isi. Pastikan semuanya sudah sesuai.
        </p>
      </div>

      {/* Kondisi yang dipilih */}
      <div className="rounded-2xl border border-[#E8DDE5] bg-white p-4">
        <p className="text-sm font-semibold text-[#8A7E8C]">
          Kondisi yang dipilih
        </p>

        <p className="mt-1 text-base font-bold text-[#332A35]">
          {conditionLabel || "Belum dipilih"}
        </p>
      </div>

      {/* Ringkasan jawaban */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#332A35]">
          Jawaban check-in
        </h3>

        {questions.length > 0 ? (
          questions.map((question) => (
            <div
              key={question.code}
              className="rounded-2xl border border-[#E8DDE5] bg-white p-4"
            >
              {renderSummaryItem(question)}
            </div>
          ))
        ) : (
          <p className="rounded-xl bg-[#FFF8FB] p-4 text-sm leading-6 text-[#746875]">
            Belum ada jawaban pertanyaan yang ditampilkan.
          </p>
        )}
      </div>

      {/* Cerita pengguna */}
      <div className="rounded-2xl border border-[#E8DDE5] bg-white p-4">
        <h3 className="text-base font-bold text-[#332A35]">
          Cerita kamu
        </h3>

        {story.trim() ? (
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#6F6571]">
            {story}
          </p>
        ) : (
          <p className="mt-2 text-sm italic text-[#8A7E8C]">
            Tidak ada cerita tambahan.
          </p>
        )}
      </div>
    </section>
  );
}