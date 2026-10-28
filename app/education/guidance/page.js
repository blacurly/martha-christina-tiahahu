
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CloudSun,
  CheckCircle2,
  ShieldCheck,
  Sun,
} from "lucide-react";

const GUIDANCE_CATEGORIES = [
  {
    id: "panas",
    title: "Paparan Panas",
    description:
      "Bagian ini akan memuat informasi perlindungan saat beraktivitas dalam kondisi panas.",
    status: "Dalam penyusunan",
    icon: CloudSun,
    iconClass: "bg-[#FCEFD9] text-[#9A6B27]",
    sources: "2 kandidat sumber",
  },
  {
    id: "kualitas-udara",
    title: "Kualitas Udara",
    description:
      "Bagian ini akan membahas informasi terkait kualitas udara dan paparan partikulat.",
    status: "Dalam penyusunan",
    icon: ShieldCheck,
    iconClass: "bg-[#E9F2EA] text-[#4D7656]",
    sources: "5 kandidat sumber",
  },
  {
    id: "uv",
    title: "Paparan UV",
    description:
      "Bagian ini akan memuat informasi perlindungan dari paparan sinar ultraviolet.",
    status: "Dalam penyusunan",
    icon: Sun,
    iconClass: "bg-[#F8E8EF] text-[#B84E73]",
    sources: "2 kandidat sumber",
  },
];

export default function EducationGuidancePage() {
  return (
    <main className="min-h-screen bg-[#FFF8FB] px-4 py-8 text-[#332A35] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#887986]"
      >
        <Link
          href="/"
          className="transition-colors hover:text-[#B84E73]"
        >
          Beranda
        </Link>

        <span aria-hidden="true">/</span>

        <Link
          href="/education"
          className="transition-colors hover:text-[#B84E73]"
        >
          Info &amp; Edukasi
        </Link>

        <span aria-hidden="true">/</span>

        <span className="font-bold text-[#B84E73]">
          Panduan Perlindungan
        </span>
      </nav>
      <Link
        href="/education"
        className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm font-bold text-[#8E3E5E] transition hover:bg-white"
      >
        <ArrowLeft size={16} />
        Kembali ke Info & Edukasi
      </Link>

      {/* Hero */}
      <section className="relative isolate overflow-hidden rounded-[28px] border border-[#F0DFE7] bg-white p-6 shadow-[0_5px_24px_rgb(120_70_90_/_6%)] sm:p-9 lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 -z-10 size-64 rounded-full bg-[#F8E8EF] opacity-80 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-36 -z-10 size-56 rounded-full bg-[#E9F2EA] opacity-90 blur-3xl"
        />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_230px] lg:gap-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#EAD7E0] bg-[#FFF8FB] px-3.5 py-2 text-sm font-extrabold text-[#984568]">
              <BookOpen className="size-4" />
              Panduan SYCLE
            </div>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.17em] text-[#B84E73]">
              INFO &amp; EDUKASI · PANDUAN
            </p>

            <h1 className="mt-3 max-w-[680px] text-3xl font-extrabold leading-tight tracking-[-0.035em] sm:text-4xl lg:text-[46px]">
              Kenali paparannya,
              <span className="block text-[#B84E73]">
                pahami perlindungannya.
              </span>
            </h1>

            <p className="mt-5 max-w-[620px] text-base leading-7 text-[#756774] sm:text-lg sm:leading-8">
              Temukan panduan edukatif mengenai paparan lingkungan,
              cuaca, kualitas udara, dan sinar ultraviolet dalam
              aktivitas sehari-hari.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#EAD7E0] bg-[#FFF8FB] px-4 py-2 text-sm font-bold text-[#765C6D]">
              <ShieldCheck className="size-4 text-[#B84E73]" />
              Konten sedang disiapkan
            </div>
          </div>

          <div className="hidden justify-center lg:flex">
            <div className="relative flex size-[210px] items-center justify-center rounded-[34px] border border-white bg-white/70 shadow-[0_12px_40px_rgb(120_70_90_/_8%)] backdrop-blur-sm">
              <div className="absolute inset-4 rounded-[27px] border border-[#D7E6D9] bg-[#F2F7F0]" />

              <div className="relative flex size-28 items-center justify-center rounded-full bg-[#E0EDDF] text-[#52775B]">
                <ShieldCheck
                  className="size-14"
                  strokeWidth={1.5}
                />
              </div>

              <div className="absolute right-3 top-5 flex size-11 items-center justify-center rounded-2xl bg-[#F8E8EF] text-[#B84E73] shadow-sm">
                <Sun className="size-5" />
              </div>

              <div className="absolute bottom-5 left-3 flex size-11 items-center justify-center rounded-2xl bg-[#EEEAF8] text-[#76629A] shadow-sm">
                <CloudSun className="size-5" />
              </div>

              <div className="absolute bottom-5 right-5 flex size-8 items-center justify-center rounded-full border-4 border-white bg-[#D7E6D9] text-[#52775B]">
                <CheckCircle2 className="size-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

        <section
          role="note"
          className="mt-8 mb-8 rounded-[22px] border border-[#E9D8A6] bg-[#FFF8E8] p-5 sm:p-6"
        >
          <div className="mb-2 flex items-center gap-2 font-extrabold text-[#72551A]">
            <ShieldCheck size={20} />
            Konten sedang disiapkan
          </div>

          <p className="text-sm leading-6 text-[#725F3A]">
            Butir panduan masih dalam tahap penyusunan dan peninjauan. Informasi
            di halaman ini belum merupakan rekomendasi kesehatan yang telah
            disetujui. Konten akan ditampilkan setelah memenuhi proses
            pemeriksaan yang berlaku.
          </p>
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-xl font-extrabold">
              Jelajahi kategori panduan
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#786B77]">
              Tiga kategori yang direncanakan untuk pengembangan panduan SYCLE.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {GUIDANCE_CATEGORIES.map((category) => {
              const Icon = category.icon;

              return (
                <article
                  key={category.id}
                  className="flex h-full flex-col rounded-[22px] border border-[#F0E3E9] bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${category.iconClass}`}
                    >
                      <Icon size={24} />
                    </div>

                    <span className="rounded-full bg-[#F6F1F5] px-3 py-1.5 text-xs font-bold text-[#786B77]">
                      {category.status}
                    </span>
                  </div>

                  <h3 className="mb-2 text-lg font-extrabold">
                    {category.title}
                  </h3>

                  <p className="mb-5 flex-1 text-sm leading-6 text-[#6F6370]">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between gap-3 border-t border-[#F0E7EC] pt-4">
                    <span className="text-xs font-semibold text-[#8A7A85]">
                      {category.sources}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9B8793]">
                      Segera tersedia
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <footer className="mt-10 border-t border-[#EEDFE7] py-6 text-center text-sm leading-6 text-[#8A7A85]">
          Panduan SYCLE bersifat edukatif dan tidak menggantikan pemeriksaan
          atau saran dari tenaga kesehatan.
        </footer>
      </div>
    </main>
  );
}