import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Download,
  Footprints,
  Heart,
  HeartPulse,
  MessageCircle,
} from "lucide-react";

import { getCurrentUser } from "@/lib/auth/session";
import { getMyTrackerEntries } from "@/lib/tracker/records";
import DeleteHistoryButton from "@/components/healthtracker/DeleteHistoryButton";

export const metadata = {
  title: "Riwayat Check-In",
};

export default function HealthTrackerHistoryPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6">
          <p className="text-sm text-[#8A7D89]">
            Memuat riwayat check-in...
          </p>
        </main>
      }
    >
      <Content />
    </Suspense>
  );
}

async function Content() {
  await connection();

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/healthtracker/history");
  }

  // Data Supabase: catatan terbaru berada di bagian paling atas.
  const { entries = [], error } = await getMyTrackerEntries();

  const history = entries;
  const totalEntries = history.length;

  const groupedHistory = Object.values(
    history.reduce((groups, entry) => {
      const key = entry.dateKey || "tanggal-tidak-diketahui";

      if (!groups[key]) {
        groups[key] = {
          key,
          label:
            key === "tanggal-tidak-diketahui"
              ? "Tanggal tidak diketahui"
              : new Date(`${key}-01T12:00:00+07:00`).toLocaleDateString(
                  "id-ID",
                  {
                    timeZone: "Asia/Jakarta",
                    month: "long",
                    year: "numeric",
                  }
                ),
          entries: [],
        };
      }

      groups[key].entries.push(entry);
      return groups;
    }, {})
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-6 sm:py-10">

      {/* BACK NAVIGATION */}
      <Link
        href="/healthtracker"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#B84E73] transition hover:text-[#8E3E5E]"
      >
        <ArrowLeft size={17} />
        Kembali ke Health Tracker
      </Link>

      {/* HEADER */}
      <header className="mb-8 mt-7">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#B84E73]" />

          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#B84E73]">
            Catatan Harian
          </p>
        </div>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#332A35] sm:text-4xl">
              Riwayat Check-In
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6F6570] sm:text-base">
              Setiap catatan adalah bagian dari perjalananmu
              memahami tubuh, aktivitas, dan kondisi lingkungan
              yang menyertai keseharianmu.
            </p>
          </div>

          <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F8E8EF] text-[#B84E73] sm:flex">
            <Heart size={28} strokeWidth={1.5} />
          </div>
        </div>
      </header>

      {/* TOTAL ENTRIES */}
      <section className="mb-8 rounded-[22px] border border-[#F0E2E9] bg-[#F8E8EF] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold tracking-[0.12em] text-[#8E3E5E]">
              TOTAL CATATAN TERSIMPAN
            </p>

            <p className="mt-2 text-3xl font-extrabold text-[#332A35] sm:text-4xl">
              {totalEntries}
            </p>

            <p className="mt-1 text-sm text-[#6F6570]">
              Dokumentasi perjalanan kesehatanmu
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-[#B84E73]">
            <ClipboardList size={27} strokeWidth={1.6} />
          </div>
        </div>
      </section>

      {/* ERROR MESSAGE */}
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-[#F0D6A8] bg-[#FFF4E5] p-4 text-sm leading-6 text-[#7A4B00]"
        >
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {!error && history.length === 0 && (
        <section className="rounded-[24px] border border-dashed border-[#E5CCD7] bg-white px-6 py-12 text-center sm:py-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8E8EF] text-[#B84E73]">
            <Heart size={30} strokeWidth={1.5} />
          </div>

          <h2 className="mt-5 text-xl font-extrabold text-[#332A35]">
            Belum Ada Riwayat Check-In
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#6F6570]">
            Perjalanan kesehatanmu dimulai dari satu cerita.
            Setelah menyelesaikan assessment dan menyimpan hasilnya,
            catatanmu akan muncul di sini.
          </p>

          <Link
            href="/assessment"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#B84E73] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#8E3E5E]"
          >
            Mulai Daily Check-In
            <span>→</span>
          </Link>
        </section>
      )}

      {/* HISTORY LIST */}
      {history.length > 0 && (
        <section>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-[#332A35]">
                Semua Catatanmu
              </h2>

              <p className="mt-1 text-sm text-[#8A7D89]">
                Pilih tanggal untuk menemukan kembali catatanmu.
              </p>
            </div>

            <span className="rounded-full bg-[#F8E8EF] px-4 py-2 text-xs font-bold text-[#8E3E5E]">
              {totalEntries} catatan
            </span>
          </div>

          <div className="space-y-9">
            {groupedHistory.map((group) => (
              <section key={group.key}>
                {/* MONTH HEADING */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8E8EF] text-[#B84E73]">
                    <CalendarDays size={19} />
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold capitalize text-[#332A35]">
                      {group.label}
                    </h3>

                    <p className="text-xs text-[#8A7D89]">
                      {group.entries.length} catatan
                    </p>
                  </div>

                  <div className="h-px flex-1 bg-[#F0E2E9]" />
                </div>

                {/* MONTH ENTRIES */}
                <div className="space-y-4">
                  {group.entries.map((entry) => (
                    <article
                      key={entry.id}
                      className="overflow-hidden rounded-[24px] border border-[#F0E2E9] bg-white shadow-[0_5px_24px_rgb(120_70_90_/_5%)] transition-shadow duration-200 hover:shadow-[0_8px_28px_rgb(120_70_90_/_9%)]"
                    >
                      {/* ENTRY HEADER */}
                      <div className="flex flex-col justify-between gap-4 border-b border-[#F5EAF0] p-5 sm:flex-row sm:items-center sm:px-6">
                        <div className="flex items-center gap-4">
                          {/* DATE EMPHASIS */}
                          <div className="flex h-[76px] w-[72px] shrink-0 flex-col items-center justify-center rounded-2xl bg-[#F8E8EF]">
                            <span className="text-2xl font-extrabold leading-none text-[#B84E73]">
                              {entry.day || "—"}
                            </span>

                            <span className="mt-2 text-[11px] font-bold capitalize text-[#8E3E5E]">
                              {entry.weekday || ""}
                            </span>
                          </div>

                          {/* DATE AND CONDITION */}
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-[#8A7D89]">
                              {entry.date || "Tanggal tidak tersedia"}
                            </p>

                            <div className="mt-2">
                              <span className="inline-flex rounded-full border border-[#F0E2E9] bg-[#FFF8FB] px-3 py-1 text-xs font-bold text-[#8E3E5E]">
                                {entry.condition || "Check-In Harian"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                          <a
                            href={`/api/tracker/records/${entry.id}/pdf`}
                            className="inline-flex items-center gap-2 rounded-full border border-[#B84E73] px-4 py-2 text-xs font-bold text-[#8E3E5E] transition hover:bg-[#F8E8EF]"
                          >
                            <Download size={15} />
                            Unduh PDF
                          </a>

                          <DeleteHistoryButton recordId={entry.id} />
                        </div>
                      </div>

                      {/* ENTRY INFORMATION */}
                      <div className="p-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {/* ACTIVITY */}
                          <div className="rounded-2xl bg-[#FFF8FB] p-4">
                            <div className="flex items-center gap-2 text-[#B84E73]">
                              <Footprints size={18} />

                              <p className="text-[11px] font-extrabold tracking-[0.12em]">
                                AKTIVITAS
                              </p>
                            </div>

                            <p className="mt-3 font-bold text-[#332A35]">
                              {entry.activity || "Belum dicatat"}
                            </p>
                          </div>

                          {/* COMFORT */}
                          <div className="rounded-2xl bg-[#FFF8FB] p-4">
                            <div className="flex items-center gap-2 text-[#B84E73]">
                              <HeartPulse size={18} />

                              <p className="text-[11px] font-extrabold tracking-[0.12em]">
                                KENYAMANAN TUBUH
                              </p>
                            </div>

                            <p className="mt-3 font-bold text-[#332A35]">
                              {entry.comfort || "Belum dicatat"}
                            </p>
                          </div>
                        </div>

                        {/* USER STORY */}
                        {entry.story && (
                          <div className="mt-4 rounded-2xl border border-[#F0E2E9] bg-white p-4 sm:p-5">
                            <div className="flex items-center gap-2 text-[#B84E73]">
                              <MessageCircle size={17} />

                              <p className="text-[11px] font-extrabold tracking-[0.12em]">
                                CERITAMU
                              </p>
                            </div>

                            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#6F6570]">
                              {entry.story}
                            </p>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER DISCLAIMER */}
      <footer className="mt-9 border-t border-[#F0E2E9] pt-5">
        <p className="text-xs leading-6 text-[#8A7D89]">
          Riwayat ini merupakan dokumentasi pengalaman kesehatan
          yang kamu catat. Informasi yang tersimpan bukan merupakan
          diagnosis medis atau pengganti konsultasi tenaga kesehatan.
        </p>
      </footer>
    </main>
  );
}