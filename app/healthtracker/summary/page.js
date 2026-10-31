import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getMyTrackerEntries } from "@/lib/tracker/records";

export const metadata = { title: "Ringkasan Health Tracker" };

export default function HealthTrackerSummaryPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-6xl px-6 py-10">Memuat ringkasan...</main>
      }
    >
      <Content />
    </Suspense>
  );
}

async function Content() {
  await connection();
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/healthtracker/summary");

  const { entries } = await getMyTrackerEntries();

  const latestEntry = entries[0] ?? null;

  const conditionCounts = entries.reduce((counts, entry) => {
    if (entry.condition) {
      counts[entry.condition] = (counts[entry.condition] || 0) + 1;
    }

    return counts;
  }, {});

  const mostRecordedCondition = Object.entries(conditionCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <Link
        href="/healthtracker"
        className="text-sm font-extrabold text-[#B84E73] hover:underline"
      >
        ← Kembali ke Health Tracker
      </Link>

      <div className="mb-8 mt-5">
        <p className="text-sm font-extrabold uppercase tracking-wider text-[#B84E73]">
          Gambaran Perjalananmu
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-[#332A35]">
          Ringkasan Kesehatan
        </h1>

        <p className="mt-2 max-w-2xl leading-7 text-[#6F6570]">
          Lihat rangkuman catatan check-in yang telah kamu simpan.
          Gunakan catatan ini untuk mengenali pengalamanmu dari
          waktu ke waktu, bukan untuk mendiagnosis kondisi medis.
        </p>
      </div>

      {/* Statistik utama */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[22px] border border-[#F0E2E9] bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-[#8A7D89]">
            TOTAL CHECK-IN
          </p>

          <p className="mt-3 text-4xl font-extrabold text-[#B84E73]">
            {entries.length}
          </p>

          <p className="mt-2 text-sm text-[#6F6570]">
            Catatan yang tersimpan
          </p>
        </div>

        <div className="rounded-[22px] border border-[#D7E6D9] bg-[#E9F2EA] p-6">
          <p className="text-sm font-bold text-[#426B4A]">
            KONDISI TERAKHIR
          </p>

          <p className="mt-3 text-2xl font-extrabold text-[#332A35]">
            {latestEntry?.condition || "Belum ada data"}
          </p>

          <p className="mt-2 text-sm text-[#5F7162]">
            {latestEntry?.date || "Selesaikan check-in pertamamu"}
          </p>
        </div>

        <div className="rounded-[22px] border border-[#E1DCF0] bg-[#EEEAF8] p-6 sm:col-span-2 lg:col-span-1">
          <p className="text-sm font-bold text-[#66558F]">
            KONDISI YANG SERING DICATAT
          </p>

          <p className="mt-3 text-2xl font-extrabold text-[#332A35]">
            {mostRecordedCondition?.[0] || "Belum ada data"}
          </p>

          <p className="mt-2 text-sm text-[#71658A]">
            {mostRecordedCondition
              ? `${mostRecordedCondition[1]} kali dicatat`
              : "Data akan muncul setelah kamu menyimpan check-in."}
          </p>
        </div>
      </div>

      {/* Distribusi kondisi */}
      <div className="mt-6 rounded-[22px] border border-[#F0E2E9] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-extrabold text-[#332A35]">
          Catatan berdasarkan kondisi
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#6F6570]">
          Jumlah catatan untuk setiap kondisi yang kamu pilih.
        </p>

        {Object.keys(conditionCounts).length === 0 ? (
          <div className="mt-6 rounded-xl bg-[#FFF8FB] p-5">
            <p className="text-sm leading-6 text-[#6F6570]">
              Belum ada data untuk diringkas. Setelah kamu menyimpan
              hasil assessment, distribusi catatan akan ditampilkan di sini.
            </p>

            <Link
              href="/assessment"
              className="mt-4 inline-flex font-extrabold text-[#B84E73] hover:underline"
            >
              Mulai Daily Check-In →
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {Object.entries(conditionCounts).map(([condition, count]) => {
              const percentage = Math.round(
                (count / entries.length) * 100
              );

              return (
                <div key={condition}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="font-bold text-[#332A35]">
                      {condition}
                    </span>

                    <span className="text-sm text-[#6F6570]">
                      {count} catatan ({percentage}%)
                    </span>
                  </div>

                  <div
                    className="h-3 overflow-hidden rounded-full bg-[#F8E8EF]"
                    role="progressbar"
                    aria-label={`Proporsi catatan ${condition}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percentage}
                  >
                    <div
                      className="h-full rounded-full bg-[#B84E73] transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Aktivitas terbaru */}
      {latestEntry && (
        <div className="mt-6 rounded-[22px] border border-[#F0E2E9] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-[#332A35]">
            Aktivitas pada check-in terakhir
          </h2>

          <p className="mt-4 text-sm text-[#8A7D89]">
            {latestEntry.date}
          </p>

          <p className="mt-1 text-lg font-extrabold text-[#332A35]">
            {latestEntry.activity || "Aktivitas belum dicatat"}
          </p>

          <p className="mt-2 text-sm text-[#6F6570]">
            Kenyamanan tubuh: {latestEntry.comfort || "Belum dicatat"}
          </p>

          {latestEntry.story && (
            <div className="mt-4 rounded-xl bg-[#FFF8FB] p-4">
              <p className="text-xs font-extrabold text-[#8A7D89]">
                CERITAMU
              </p>

              <p className="mt-2 text-sm leading-6 text-[#6F6570]">
                {latestEntry.story}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/healthtracker/history"
          className="inline-flex rounded-full border border-[#E5CCD7] px-5 py-3 font-extrabold text-[#B84E73] transition hover:bg-[#FFF8FB]"
        >
          Lihat Riwayat
        </Link>

        <Link
          href="/assessment"
          className="inline-flex rounded-full bg-[#B84E73] px-5 py-3 font-extrabold text-white transition hover:bg-[#8E3E5E]"
        >
          Daily Check-In →
        </Link>
      </div>
    </section>
  );
}