
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileText,
  Leaf,
  Search,
  Sparkles,
  Sun,
  Wind,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { GLOSSARY } from "@/data/education/glossary";

function getTermIcon(term = "") {
  const value = term.toLowerCase();

  if (
    value.includes("uv") ||
    value.includes("panas") ||
    value.includes("heat") ||
    value.includes("suhu")
  ) {
    return Sun;
  }

  if (
    value.includes("udara") ||
    value.includes("pm2.5") ||
    value.includes("aqi") ||
    value.includes("polusi")
  ) {
    return Wind;
  }

  if (
    value.includes("perempuan") ||
    value.includes("menstruasi") ||
    value.includes("menopause") ||
    value.includes("hamil")
  ) {
    return Leaf;
  }

  return BookOpen;
}

function getTermStyle(term = "") {
  const value = term.toLowerCase();

  if (
    value.includes("uv") ||
    value.includes("panas") ||
    value.includes("heat") ||
    value.includes("suhu")
  ) {
    return {
      icon: "bg-[#FFF0E4] text-[#98562B]",
      badge: "bg-[#FFF0E4] text-[#98562B]",
    };
  }

  if (
    value.includes("udara") ||
    value.includes("pm2.5") ||
    value.includes("aqi") ||
    value.includes("polusi")
  ) {
    return {
      icon: "bg-[#E8F1F7] text-[#41677E]",
      badge: "bg-[#E8F1F7] text-[#41677E]",
    };
  }

  if (
    value.includes("perempuan") ||
    value.includes("menstruasi") ||
    value.includes("menopause") ||
    value.includes("hamil")
  ) {
    return {
      icon: "bg-[#F8E8EF] text-[#984568]",
      badge: "bg-[#F8E8EF] text-[#984568]",
    };
  }

  return {
    icon: "bg-[#EEEAF8] text-[#76629A]",
    badge: "bg-[#EEEAF8] text-[#76629A]",
  };
}

function getSummary(definition = "", maxLength = 125) {
  const text = String(definition).trim();

  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [selectedTerm, setSelectedTerm] = useState(null);

  const closeButtonRef = useRef(null);

  const visibleTerms = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return GLOSSARY.filter((item) => {
      if (!keyword) return true;

      const relatedNames = (item.related || [])
        .map((relatedId) =>
          GLOSSARY.find((term) => term.id === relatedId)?.term
        )
        .filter(Boolean)
        .join(" ");

      const searchableText = [
        item.term,
        item.definition,
        item.note,
        item.basis,
        relatedNames,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [search]);

  useEffect(() => {
    if (!selectedTerm) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedTerm(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    const frame = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(frame);
    };
  }, [selectedTerm]);

  function openTerm(term) {
    setSelectedTerm(term);
  }

  function openRelatedTerm(relatedId) {
    const relatedTerm = GLOSSARY.find(
      (term) => term.id === relatedId
    );

    if (relatedTerm) {
      setSelectedTerm(relatedTerm);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF8FB] text-[#332A35]">
      <div className="mx-auto w-full max-w-[1120px] px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pt-10">
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
            Glosarium
          </span>

          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.17em] text-[#B84E73]">
            </p>
        </nav>
        <Link
          href="/education"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#8E3E5E] transition hover:text-[#B84E73]"
        >
          <ArrowLeft size={18} />
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
                Glosarium Sycle
              </div>

              <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.17em] text-[#B84E73]">
                INFO &amp; EDUKASI · GLOSARIUM
              </p>

              <h1 className="mt-5 max-w-[680px] text-3xl font-extrabold leading-tight tracking-[-0.035em] sm:text-4xl lg:text-[46px]">
                Kenali istilahnya,
                <span className="block text-[#B84E73]">
                  pahami maknanya.
                </span>
              </h1>

              <p className="mt-5 max-w-[620px] text-base leading-7 text-[#756774] sm:text-lg sm:leading-8">
                Temukan penjelasan istilah seputar lingkungan,
                cuaca, kualitas udara, dan kesehatan perempuan
                dalam bahasa yang lebih mudah dipahami.
              </p>
            </div>

            <div className="hidden justify-center lg:flex">
              <div className="relative flex size-[210px] items-center justify-center rounded-[34px] border border-white bg-white/70 shadow-[0_12px_40px_rgb(120_70_90_/_8%)] backdrop-blur-sm">
                <div className="absolute inset-4 rounded-[27px] border border-[#D7E6D9] bg-[#F2F7F0]" />

                <div className="relative flex size-28 items-center justify-center rounded-full bg-[#E0EDDF] text-[#52775B]">
                  <BookOpen
                    className="size-14"
                    strokeWidth={1.5}
                  />
                </div>

                <div className="absolute right-3 top-5 flex size-11 items-center justify-center rounded-2xl bg-[#F8E8EF] text-[#B84E73] shadow-sm">
                  <Sparkles className="size-5" />
                </div>

                <div className="absolute bottom-5 left-3 flex size-11 items-center justify-center rounded-2xl bg-[#EEEAF8] text-[#76629A] shadow-sm">
                  <Leaf className="size-5" />
                </div>

                <div className="absolute bottom-5 right-5 flex size-8 items-center justify-center rounded-full border-4 border-white bg-[#D7E6D9] text-[#52775B]">
                  <CheckCircle2 className="size-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="mt-10 sm:mt-12">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#B84E73]">
                Kamus istilah
              </p>

              <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Istilah yang perlu kamu kenali
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#827382] sm:text-base">
                Pilih kartu untuk membaca penjelasan lengkapnya.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D7E6D9] bg-[#E9F2EA] px-3.5 py-2 text-sm font-bold text-[#52775B]">
              <BookOpen className="size-4" />
              {visibleTerms.length} istilah
            </div>
          </div>

          <div className="mt-5 rounded-[22px] border border-[#F0DFE7] bg-white p-4 shadow-[0_5px_24px_rgb(120_70_90_/_4%)] sm:p-5">
            <label
              htmlFor="glossary-search"
              className="mb-2 block text-sm font-bold text-[#514351]"
            >
              Cari istilah
            </label>

            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#A08D9C]" />

              <input
                id="glossary-search"
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Misalnya Heat Index, PM2.5, UV, menstruasi..."
                aria-label="Cari istilah glosarium"
                className="h-12 w-full rounded-xl border border-[#E9DCE3] bg-[#FFFCFD] pl-12 pr-4 text-sm text-[#332A35] outline-none transition placeholder:text-[#B2A2AE] focus:border-[#B84E73] focus:ring-4 focus:ring-[#B84E73]/10"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-[#827382]" aria-live="polite">
                Menampilkan{" "}
                <span className="font-extrabold text-[#514351]">
                  {visibleTerms.length}
                </span>{" "}
                dari{" "}
                <span className="font-extrabold text-[#514351]">
                  {GLOSSARY.length}
                </span>{" "}
                istilah
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-sm font-bold text-[#B84E73] underline-offset-4 hover:underline"
                >
                  Hapus pencarian
                </button>
              )}
            </div>
          </div>
        </section>


        {/* Interactive cards */}
        <section className="mt-7" aria-label="Daftar istilah glosarium">
          {visibleTerms.length > 0 ? (
            <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-4 lg:gap-6">
              {visibleTerms.map((item, index) => {
                const Icon = getTermIcon(item.term);
                const style = getTermStyle(item.term);

                const cardColors = [
                  {
                    bg: "bg-[#FFF0F5]",
                    border: "border-[#F3D5E1]",
                    icon: "bg-[#F9D9E6] text-[#A6406B]",
                    accent: "bg-[#EFB8CD]",
                  },
                  {
                    bg: "bg-[#EDF6EE]",
                    border: "border-[#D6E8D8]",
                    icon: "bg-[#D8EBDD] text-[#427D55]",
                    accent: "bg-[#B7D9BE]",
                  },
                  {
                    bg: "bg-[#F2EEFF]",
                    border: "border-[#E1D9F8]",
                    icon: "bg-[#E0D8FA] text-[#7355AD]",
                    accent: "bg-[#C9B9F0]",
                  },
                  {
                    bg: "bg-[#EBF5FC]",
                    border: "border-[#D3E7F5]",
                    icon: "bg-[#D5EAF8] text-[#397BA5]",
                    accent: "bg-[#B5D9EF]",
                  },
                ];

                const color = cardColors[index % cardColors.length];

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openTerm(item)}
                    aria-label={`Baca penjelasan ${item.term}`}
                    className={`group relative flex h-full min-h-[230px] flex-col overflow-hidden rounded-[24px] border ${color.border} ${color.bg} p-5 text-left shadow-[0_5px_20px_rgb(80_60_80_/_4%)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgb(80_60_80_/_10%)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#B84E73]/20 sm:p-6`}
                  >
                    <div
                      className={`absolute -right-8 -top-8 size-28 rounded-full ${color.accent} opacity-30 transition-transform duration-500 group-hover:scale-150`}
                    />

                    <div className="relative flex items-start justify-between gap-3">
                      <div
                        className={`flex size-14 items-center justify-center rounded-[20px] ${color.icon} shadow-sm transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}
                      >
                        <Icon className="size-7" strokeWidth={1.8} />
                      </div>

                      {item.draft && (
                        <span className="rounded-full border border-[#F0D9A9] bg-[#FFF8E8] px-3 py-1.5 text-[11px] font-extrabold text-[#8A641E]">
                          Draf
                        </span>
                      )}
                    </div>

                    <div className="relative mt-5">
                      <h3 className="text-lg font-extrabold leading-snug text-[#332A35] transition-colors group-hover:text-[#984568] sm:text-xl">
                        {item.term}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#625666]">
                        {getSummary(item.definition)}
                      </p>
                    </div>

                    <div className="relative mt-auto pt-6">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-extrabold shadow-sm transition-all group-hover:bg-white ${color.icon}`}
                      >
                        <BookOpen className="size-4" />
                        Baca penjelasan
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-[#E4CBD7] bg-white px-6 py-14 text-center sm:py-16">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#F8E8EF] text-[#B84E73]">
                <Search className="size-7" />
              </div>

              <h2 className="mt-5 text-xl font-extrabold text-[#332A35]">
                Istilah tidak ditemukan
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#827382]">
                Coba kata kunci lain untuk menemukan istilah yang kamu cari.
              </p>

              <Button
                type="button"
                onClick={() => setSearch("")}
                className="mt-6 h-10 rounded-full bg-[#B84E73] px-5 text-sm font-extrabold text-white hover:bg-[#8E3E5E]"
              >
                Tampilkan semua istilah
              </Button>
            </div>
          )}
        </section>

        {/* Disclaimer */}
        <section className="mt-10 rounded-[22px] border border-[#D7E6D9] bg-[#E9F2EA] p-5 sm:mt-12 sm:p-7">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-[#52775B]">
              <CheckCircle2 className="size-5" />
            </div>

            <div>
              <h2 className="text-base font-extrabold text-[#354A39] sm:text-lg">
                Informasi untuk memahami, bukan mendiagnosis.
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#617465]">
                Istilah berlabel draf merupakan materi demonstrasi
                yang masih perlu ditinjau tim. Informasi glosarium
                bersifat edukatif dan bukan diagnosis atau penilaian
                kesehatan pribadi.
              </p>

              <Link
                href="/education/references"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-extrabold text-[#48634D] underline-offset-4 hover:underline"
              >
                Jelajahi referensi
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Detail modal */}
      {selectedTerm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#332A35]/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedTerm(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="glossary-modal-title"
            className="relative max-h-[90dvh] w-full max-w-[680px] overflow-y-auto rounded-t-[28px] border border-[#F0DFE7] bg-[#FFFDFE] shadow-2xl sm:rounded-[28px]"
          >
            {/* Modal header */}
            <div className="relative overflow-hidden border-b border-[#F0E3E9] bg-white p-5 sm:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-16 size-44 rounded-full bg-[#F8E8EF] opacity-70 blur-3xl"
              />

              <div className="relative flex items-start gap-4 pr-10">
                {(() => {
                  const Icon = getTermIcon(selectedTerm.term);
                  const style = getTermStyle(selectedTerm.term);

                  return (
                    <div
                      className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${style.icon}`}
                    >
                      <Icon className="size-6" />
                    </div>
                  );
                })()}

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-[#B84E73]">
                    Detail istilah
                  </p>

                  <h2
                    id="glossary-modal-title"
                    className="mt-1 break-words text-2xl font-extrabold leading-tight text-[#332A35] sm:text-3xl"
                  >
                    {selectedTerm.term}
                  </h2>

                  {selectedTerm.draft && (
                    <span className="mt-3 inline-flex rounded-full bg-[#FFF1D6] px-3 py-1.5 text-xs font-extrabold text-[#8A641E]">
                      Draf · Perlu ditinjau
                    </span>
                  )}
                </div>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelectedTerm(null)}
                aria-label="Tutup detail istilah"
                className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-[#E9DCE3] bg-white text-[#796878] transition-colors hover:bg-[#FFF4F8] hover:text-[#B84E73] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#B84E73]/15 sm:right-5 sm:top-5"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal content */}
            <div className="space-y-6 p-5 sm:p-7">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-[#984568]">
                  Pengertian
                </h3>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#514451] sm:text-base">
                  {selectedTerm.definition}
                </p>
              </div>

              {selectedTerm.note && (
                <div className="rounded-2xl border border-[#D7E6D9] bg-[#F1F6EF] p-4 sm:p-5">
                  <div className="flex items-center gap-2">
                    <Leaf className="size-5 text-[#52775B]" />
                    <h3 className="text-sm font-extrabold text-[#42634B]">
                      Catatan
                    </h3>
                  </div>

                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#536657]">
                    {selectedTerm.note}
                  </p>
                </div>
              )}

              {selectedTerm.basis && (
                <div className="rounded-2xl border border-[#F0E3E9] bg-white p-4 sm:p-5">
                  <div className="flex items-center gap-2">
                    <FileText className="size-5 text-[#B84E73]" />
                    <h3 className="text-sm font-extrabold text-[#514351]">
                      Dasar informasi
                    </h3>
                  </div>

                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#756774]">
                    {selectedTerm.basis}
                  </p>
                </div>
              )}

              {selectedTerm.related?.some((relatedId) =>
                GLOSSARY.some((term) => term.id === relatedId)
              ) && (
                <div>
                  <h3 className="mb-3 text-sm font-extrabold text-[#514351]">
                    Istilah terkait
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {selectedTerm.related.map((relatedId) => {
                      const relatedTerm = GLOSSARY.find(
                        (term) => term.id === relatedId
                      );

                      if (!relatedTerm) return null;

                      return (
                        <button
                          key={relatedId}
                          type="button"
                          onClick={() =>
                            openRelatedTerm(relatedId)
                          }
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#E7D5DE] bg-white px-3.5 py-2 text-sm font-bold text-[#984568] transition-colors hover:border-[#D7A9BC] hover:bg-[#FFF4F8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#B84E73]/15"
                        >
                          {relatedTerm.term}
                          <ArrowUpRight className="size-3.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="rounded-xl bg-[#F8E8EF]/60 p-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#B84E73]" />

                  <p className="text-xs leading-5 text-[#796878]">
                    Penjelasan ini bersifat edukatif. Gunakan
                    informasi sebagai bahan pemahaman, bukan sebagai
                    diagnosis atau penilaian kesehatan pribadi.
                  </p>
                </div>
              </div>

              <div className="flex justify-end border-t border-[#F0E3E9] pt-5">
                <Button
                  type="button"
                  onClick={() => setSelectedTerm(null)}
                  className="h-10 rounded-full bg-[#B84E73] px-5 text-sm font-extrabold text-white hover:bg-[#8E3E5E]"
                >
                  Selesai membaca
                </Button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}