"use client";

export default function SummaryScreen({
  conditionLabel,
  questions = [],
  renderSummaryItem,
  story = "",
}) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#332A35]">
          Ringkasan Check-In
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#6F6571]">
          Berikut rangkuman check-in kamu. Periksa kembali
          informasi yang sudah kamu berikan sebelum menyimpan
          hasilnya ke riwayat Health Tracker.
        </p>
      </div>

      {/* Kondisi */}
      <div className="rounded-2xl border border-[#E8DDE5] bg-white p-4">
        <p className="text-sm font-semibold text-[#8A7E8C]">
          Kondisi yang dipilih
        </p>

        <p className="mt-1 text-base font-bold text-[#332A35]">
          {conditionLabel || "Belum dipilih"}
        </p>
      </div>

      {/* Jawaban */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#332A35]">
          Jawaban Check-In
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
            Belum ada jawaban pertanyaan.
          </p>
        )}
      </div>

      {/* Cerita */}
      <div className="rounded-2xl border border-[#E8DDE5] bg-white p-4">
        <h3 className="text-base font-bold text-[#332A35]">
          Cerita Kamu
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

      {/* Disclaimer */}
      <div className="rounded-2xl border border-[#D7E6D9] bg-[#E9F2EA] p-4">
        <p className="text-sm font-semibold text-[#365541]">
          Informasi untuk kamu
        </p>

        <p className="mt-1 text-sm leading-6 text-[#526A59]">
          Ringkasan ini merupakan catatan kondisi dan
          pengalaman yang kamu bagikan. Informasi ini bukan
          diagnosis medis dan tidak menggantikan konsultasi
          dengan tenaga kesehatan.
        </p>
      </div>
    </section>
  );
}