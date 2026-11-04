"use client";

export default function ActivityScreen({
  activityQuestion,
  renderQuestion,
}) {
  return (
    <section>
      <h2 className="text-lg font-bold text-[#332A35]">
        Aktivitas hari ini
      </h2>

      <p className="mb-5 mt-2 text-sm text-[#746875]">
        Pilih aktivitas yang paling menggambarkan kegiatanmu
        hari ini.
      </p>

      {activityQuestion ? (
        renderQuestion(activityQuestion)
      ) : (
        <p className="text-sm text-red-600">
          Pertanyaan HT-04 tidak ditemukan.
        </p>
      )}
    </section>
  );
}