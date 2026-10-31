import Link from "next/link";

// entries: catatan dari Supabase, terbaru di urutan pertama.
export default function TrackerDashboard({ entries = [], loadError = "" }) {
  const latestEntry = entries[0] ?? null;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-extrabold uppercase tracking-wider text-[#B84E73]">
          Ruang Kesehatanmu
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-[#332A35]">
          Health Tracker
        </h1>

        <p className="mt-2 max-w-2xl leading-7 text-[#6F6570]">
          Catat kondisi tubuhmu setiap hari dan pahami konteks
          lingkungan yang menyertai aktivitasmu.
        </p>
      </div>

      <div className="mb-6 rounded-[22px] bg-[#F8E8EF] p-6 sm:p-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold text-[#8E3E5E]">
            CHECK-IN HARIAN
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-[#332A35]">
            Bagaimana keadaanmu hari ini?
          </h2>

          <p className="mt-2 leading-7 text-[#6F6570]">
            Luangkan beberapa menit untuk mencatat kondisi,
            gejala, aktivitas, dan ceritamu hari ini.
          </p>

          <Link
            href="/assessment"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-[#B84E73] px-6 py-3 font-extrabold text-white transition hover:bg-[#8E3E5E]"
          >
            Mulai Daily Check-In →
          </Link>
        </div>
      </div>

      {loadError && (
        <p role="alert" className="mb-4 rounded-xl bg-[#FFF4E5] p-3 text-sm text-[#7A4B00]">
          {loadError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-[22px] border border-[#F0E2E9] bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[#8A7D89]">
                CHECK-IN TERAKHIR
              </p>

              <h2 className="mt-2 text-xl font-extrabold text-[#332A35]">
                {latestEntry
                  ? latestEntry.condition
                  : "Belum ada catatan"}
              </h2>
            </div>

            <span className="rounded-xl bg-[#F8E8EF] p-3 text-xl">
              ♡
            </span>
          </div>

          {latestEntry ? (
            <>
              <p className="mt-3 text-sm text-[#6F6570]">
                {latestEntry.date}
              </p>

              {latestEntry.comfort && (
                <p className="mt-2 text-sm text-[#6F6570]">
                  Kenyamanan tubuh: {latestEntry.comfort}
                </p>
              )}

              {latestEntry.activity && (
                <p className="mt-1 text-sm text-[#6F6570]">
                  Aktivitas: {latestEntry.activity}
                </p>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm leading-6 text-[#6F6570]">
              Hasil check-in yang kamu simpan akan muncul di sini.
            </p>
          )}

          <Link
            href="/healthtracker/history"
            className="mt-5 inline-flex font-extrabold text-[#B84E73] hover:underline"
          >
            Lihat Riwayat →
          </Link>
        </div>

        <div className="rounded-[22px] border border-[#D7E6D9] bg-[#E9F2EA] p-6">
          <p className="text-sm font-bold text-[#426B4A]">
            PERJALANANMU
          </p>

          <h2 className="mt-2 text-xl font-extrabold text-[#332A35]">
            {entries.length} check-in tersimpan
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#5F7162]">
            Setiap catatan membantumu melihat kembali pengalaman
            tubuh dan kondisi lingkungan dari waktu ke waktu.
          </p>

          <Link
            href="/healthtracker/summary"
            className="mt-5 inline-flex font-extrabold text-[#426B4A] hover:underline"
          >
            Lihat Ringkasan →
          </Link>
        </div>
      </div>

      <p className="mt-6 text-xs leading-5 text-[#8A7D89]">
        Catatan ini membantu mendokumentasikan pengalaman harian,
        bukan untuk mendiagnosis kondisi medis.
      </p>
    </section>
  );
}