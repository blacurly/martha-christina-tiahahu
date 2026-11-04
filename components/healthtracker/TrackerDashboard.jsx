import Link from "next/link";
import { Button } from "@/components/ui/button";

function StatCard({ label, value, description, icon }) {
  return (
    <div className="rounded-[22px] border border-[#F0E2E9] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-extrabold uppercase tracking-wider text-[#8A7D89]">
          {label}
        </p>

        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8E8EF] text-xl">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-2xl font-extrabold text-[#332A35]">
        {value}
      </p>

      <p className="mt-1 text-sm text-[#8A7D89]">
        {description}
      </p>
    </div>
  );
}

export default function TrackerDashboard({
  entries = [],
  loadError = "",
}) {
  const latestEntry = entries[0] ?? null;

  const totalCheckIns = entries.length;

  const lastCheckIn = latestEntry?.date || "Belum ada";

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-6 sm:py-10">

      {/* HEADER */}
      <header className="mb-8">
        <p className="text-sm font-extrabold uppercase tracking-wider text-[#B84E73]">
          Ruang Kesehatanmu
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-[#332A35] sm:text-4xl">
          Health Tracker
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6F6570] sm:text-base">
          Kenali pola tubuhmu melalui catatan kesehatan,
          aktivitas sehari-hari, dan pengalaman lingkungan
          yang menyertainya.
        </p>
      </header>

      {/* DAILY CHECK-IN */}
      <section className="relative mb-8 overflow-hidden rounded-[24px] bg-[#F8E8EF] p-6 sm:p-9">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-extrabold tracking-wider text-[#8E3E5E]">
            DAILY CHECK-IN
          </span>

          <h2 className="mt-4 text-2xl font-extrabold leading-tight text-[#332A35] sm:text-3xl">
            Bagaimana keadaanmu hari ini?
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-[#6F6570] sm:text-base">
            Luangkan beberapa menit untuk mencatat kondisi
            tubuh, gejala, aktivitas, dan ceritamu hari ini.
          </p>

          <Button
            nativeButton={false}
            render={<Link href="/healthtracker/assessment" />}
            variant="default"
            size="lg"
            className="mt-6 h-12 rounded-full border-transparent !bg-[#B84E73] !text-white px-7 text-sm font-extrabold hover:!bg-[#8E3E5E]"
          >
            <span>+</span>
            Mulai Daily Check-In
          </Button>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-12 hidden h-64 w-64 rounded-full border-[35px] border-white/30 sm:block"
        />
      </section>

      {/* ERROR MESSAGE */}
      {loadError && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-[#F0D6A8] bg-[#FFF4E5] p-4 text-sm leading-6 text-[#7A4B00]"
        >
          {loadError}
        </div>
      )}

      {/* STATISTICS */}
      <section className="mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-extrabold text-[#332A35]">
            Perkembangan Catatanmu
          </h2>

          <p className="mt-1 text-sm text-[#8A7D89]">
            Ringkasan aktivitas pencatatan kesehatanmu.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            label="Total Check-In"
            value={totalCheckIns}
            description="Catatan kesehatan tersimpan"
            icon="♡"
          />

          <StatCard
            label="Check-In Terakhir"
            value={lastCheckIn}
            description={
              latestEntry
                ? "Tanggal pencatatan terakhirmu"
                : "Mulai catat kondisi tubuhmu"
            }
            icon="◷"
          />
        </div>
      </section>

      {/* LATEST ENTRY */}
      <section className="mb-6 rounded-[22px] border border-[#F0E2E9] bg-white p-6 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#B84E73]">
              CATATAN TERBARU
            </p>

            <h2 className="mt-2 text-xl font-extrabold text-[#332A35]">
              Check-In Terakhirmu
            </h2>
          </div>

          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8E8EF] text-xl text-[#B84E73]">
            ♡
          </span>
        </div>

        {latestEntry ? (
          <div className="mt-5">
            <p className="text-sm text-[#8A7D89]">
              {latestEntry.date}
            </p>

            <h3 className="mt-2 text-2xl font-extrabold text-[#332A35]">
              {latestEntry.condition || "Check-In Harian"}
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              {latestEntry.activity && (
                <span className="rounded-full bg-[#F8E8EF] px-4 py-2 text-xs font-bold text-[#8E3E5E]">
                  Aktivitas: {latestEntry.activity}
                </span>
              )}

              {latestEntry.comfort && (
                <span className="rounded-full bg-[#E9F2EA] px-4 py-2 text-xs font-bold text-[#426B4A]">
                  Kenyamanan: {latestEntry.comfort}
                </span>
              )}
            </div>

            <Link
              href="/healthtracker/history"
              className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#B84E73] hover:text-[#8E3E5E] hover:underline"
            >
              Lihat Detail Riwayat
              <span>→</span>
            </Link>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-[#FFF8FB] px-5 py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F8E8EF] text-2xl text-[#B84E73]">
              ♡
            </div>

            <h3 className="mt-4 font-extrabold text-[#332A35]">
              Belum Ada Catatan
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#6F6570]">
              Catatan kesehatan pertamamu akan muncul di sini
              setelah kamu menyelesaikan Daily Check-In.
            </p>

          </div>
        )}
      </section>

      {/* HEALTH JOURNEY */}
      <section className="rounded-[22px] border border-[#D7E6D9] bg-[#E9F2EA] p-6 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#426B4A]">
              PERJALANANMU
            </p>

            <h2 className="mt-2 text-xl font-extrabold text-[#332A35]">
              Setiap Catatan Punya Cerita
            </h2>

            <p className="mt-2 text-sm leading-7 text-[#5F7162]">
              Lihat kembali pengalaman tubuh, aktivitas,
              dan kondisi lingkungan yang menyertai
              keseharianmu dari waktu ke waktu.
            </p>
          </div>

          <div className="shrink-0">
            <p className="text-3xl font-extrabold text-[#426B4A]">
              {totalCheckIns}
            </p>

            <p className="mt-1 text-xs font-bold text-[#5F7162]">
              Catatan tersimpan
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            nativeButton={false}
            render={<Link href="/healthtracker/history" />}
            variant="outline"
            size="lg"
            className="h-11 rounded-full border-[#B6CEB9] bg-white px-5 text-sm text-[#426B4A] hover:bg-[#DCEBDD]"
          >
            Lihat Riwayat →
          </Button>

          <Button
            nativeButton={false}
            render={<Link href="/healthtracker/summary" />}
            variant="outline"
            size="lg"
            className="h-11 rounded-full border-transparent !bg-[#B84E73] !text-white px-7 text-sm font-extrabold hover:!bg-[#8E3E5E]"
          >
            Lihat Ringkasan →
          </Button>
        </div>
      </section>

      {/* DISCLAIMER */}
      <footer className="mt-7 border-t border-[#F0E2E9] pt-5">
        <p className="text-xs leading-6 text-[#8A7D89]">
          Health Tracker membantu mendokumentasikan pengalaman
          kesehatan dan mengenali pola dari waktu ke waktu.
          Informasi yang ditampilkan bukan merupakan diagnosis
          atau pengganti konsultasi tenaga kesehatan.
        </p>
      </footer>

    </main>
  );
}