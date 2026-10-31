import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getMyTrackerEntries } from "@/lib/tracker/records";

export const metadata = { title: "Riwayat Check-In" };

export default function HealthTrackerHistoryPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-6xl px-6 py-10">Memuat riwayat...</main>
      }
    >
      <Content />
    </Suspense>
  );
}

async function Content() {
  await connection();
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/healthtracker/history");

  // Catatan dari Supabase, terbaru di bagian paling atas.
  const { entries, error } = await getMyTrackerEntries();
  const history = entries;

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
          Catatan Harian
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-[#332A35]">
          Riwayat Check-In
        </h1>

        <p className="mt-2 leading-7 text-[#6F6570]">
          Lihat kembali catatan kondisi tubuh dan lingkungan
          yang pernah kamu dokumentasikan.
        </p>
      </div>

      <div className="mb-6 rounded-[22px] border border-[#F0E2E9] bg-white p-5 shadow-sm">
        <p className="text-sm text-[#6F6570]">
          Total catatan tersimpan
        </p>

        <p className="mt-1 text-3xl font-extrabold text-[#332A35]">
          {entries.length}
        </p>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-[#FFF4E5] p-3 text-sm text-[#7A4B00]">
          {error}
        </p>
      )}

      {history.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-[#E5CCD7] bg-white px-6 py-12 text-center">
          <div className="text-4xl text-[#B84E73]">♡</div>

          <h2 className="mt-4 text-xl font-extrabold text-[#332A35]">
            Belum ada riwayat check-in
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6F6570]">
            Setelah menyelesaikan assessment dan menyimpan hasilnya,
            catatanmu akan muncul di halaman ini.
          </p>

          <Link
            href="/assessment"
            className="mt-5 inline-flex rounded-full bg-[#B84E73] px-6 py-3 font-extrabold text-white transition hover:bg-[#8E3E5E]"
          >
            Mulai Daily Check-In →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <article
              key={entry.id}
              className="rounded-[22px] border border-[#F0E2E9] bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm text-[#8A7D89]">
                    {entry.date}
                  </p>

                  <h2 className="mt-1 text-xl font-extrabold text-[#332A35]">
                    {entry.condition}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-fit rounded-full bg-[#E9F2EA] px-3 py-1 text-sm font-bold text-[#426B4A]">
                    Tersimpan
                  </span>
                  <a
                    href={`/api/tracker/records/${entry.id}/pdf`}
                    className="w-fit rounded-full border border-[#B84E73] px-3 py-1 text-sm font-bold text-[#8E3E5E] hover:bg-[#F8E8EF]"
                  >
                    Unduh PDF
                  </a>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-[#FFF8FB] p-3">
                  <p className="text-xs font-bold text-[#8A7D89]">
                    AKTIVITAS
                  </p>
                  <p className="mt-1 font-bold text-[#332A35]">
                    {entry.activity || "Belum dicatat"}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FFF8FB] p-3">
                  <p className="text-xs font-bold text-[#8A7D89]">
                    KENYAMANAN TUBUH
                  </p>
                  <p className="mt-1 font-bold text-[#332A35]">
                    {entry.comfort || "Belum dicatat"}
                  </p>
                </div>
              </div>

              {entry.story && (
                <div className="mt-4">
                  <p className="text-xs font-bold text-[#8A7D89]">
                    CERITAMU
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#6F6570]">
                    {entry.story}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}