export default function ReviewScreen({
  conditionLabel,
  summaryQuestions,
  renderSummaryItem,
  story,
}) {
  return (
    <>
      <h2 className="text-lg font-bold text-[#332A35]">
        Periksa Kembali Catatanmu
      </h2>

      <p className="mb-5 mt-2 text-sm leading-6 text-[#746875]">
        Berikut rangkuman informasi yang sudah kamu bagikan.
        Kamu bisa kembali untuk mengubah jawaban sebelum melanjutkan.
      </p>

      <div className="space-y-3">
        <div className="rounded-xl border border-[#F0E3E9] bg-[#FFF8FB] p-4">
          <p className="text-xs font-semibold text-[#B84E73]">
            KONDISI
          </p>

          <p className="mt-1 text-sm font-semibold text-[#332A35]">
            {conditionLabel}
          </p>
        </div>

        {summaryQuestions.map(renderSummaryItem)}

        {story.trim() ? (
          <div className="rounded-xl border border-[#F0E3E9] bg-white p-4">
            <p className="text-xs font-semibold text-[#B84E73]">
              CERITA HARI INI
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#5F5360]">
              {story}
            </p>
          </div>
        ) : (
          <p className="rounded-xl bg-[#FFF8FB] p-4 text-sm text-[#8A7D89]">
            Kamu tidak menambahkan cerita hari ini.
          </p>
        )}
      </div>
    </>
  );
}