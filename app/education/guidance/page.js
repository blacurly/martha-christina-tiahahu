"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Baby,
  BookOpen,
  CalendarHeart,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HandHeart,
  ShieldCheck,
  Sun,
  SunMedium,
  Wind,
} from "lucide-react";

import { educationArticles } from "@/data/education";
import { EVIDENCE_SOURCES } from "@/data/education/references";
import { GUIDANCE_CATEGORIES } from "@/data/education/guidance";

// Tampilan kartu kategori: nama singkat, ikon Lucide, warna latar, dan warna ikon.
const CATEGORY_UI = {
  panas: { label: "Cuaca Panas", icon: Sun, bg: "#FFF1E5", color: "#D78B35" },
  "kualitas-udara": {
    label: "Kualitas Udara Buruk",
    icon: Wind,
    bg: "#E8F1F7",
    color: "#4789B2",
  },
  uv: { label: "Indeks UV Tinggi", icon: SunMedium, bg: "#EEEAF8", color: "#8066BC" },
  menstruasi: {
    label: "Menstruasi",
    icon: CalendarHeart,
    bg: "#F8E8EF",
    color: "#B84E73",
  },
  kehamilan: { label: "Kehamilan", icon: Baby, bg: "#E9F2EA", color: "#57936B" },
  menyusui: { label: "Menyusui", icon: HandHeart, bg: "#F5EDF8", color: "#9A6DB1" },
};

function getReferences(referenceIds = []) {
  return referenceIds
    .map((id) => EVIDENCE_SOURCES.find((source) => source.id === id))
    .filter(Boolean);
}

function getArticles(slugs = []) {
  return slugs
    .map((slug) => educationArticles.find((article) => article.slug === slug))
    .filter(Boolean);
}

// Satu langkah panduan: judul selalu terlihat, penjelasan muncul saat dibuka.
function GuidanceStep({ step, index, isOpen, onToggle, idPrefix }) {
  const buttonId = `${idPrefix}-step-${index}`;
  const panelId = `${buttonId}-panel`;
  const Chevron = isOpen ? ChevronUp : ChevronDown;

  return (
    <li className="rounded-2xl border border-[#F0E3E9] bg-white">
      <h4>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center gap-3 rounded-2xl p-4 text-left transition hover:bg-[#FFF8FB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#B84E73]/20"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#F8E8EF] text-sm font-extrabold text-[#B84E73]">
            {index + 1}
          </span>
          <span className="flex-1 font-extrabold text-[#332A35]">{step.action}</span>
          <Chevron className="size-5 shrink-0 text-[#984568]" aria-hidden="true" />
        </button>
      </h4>

      {/* Animasi tinggi halus dengan grid-rows 0fr → 1fr */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-4 pb-4 pl-14 text-sm leading-6 text-[#6F6370]">{step.reason}</p>
        </div>
      </div>
    </li>
  );
}

export default function EducationGuidancePage() {
  const [activeId, setActiveId] = useState(null);
  const [openSteps, setOpenSteps] = useState(() => new Set([0]));
  const panelRef = useRef(null);

  const active = GUIDANCE_CATEGORIES.find((category) => category.id === activeId);
  const activeUi = active ? CATEGORY_UI[active.id] : null;

  function selectCategory(id) {
    setActiveId(id);
    setOpenSteps(new Set([0]));
    requestAnimationFrame(() =>
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    );
  }

  function toggleStep(index) {
    setOpenSteps((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function toggleAllSteps() {
    if (!active) return;
    setOpenSteps((previous) =>
      previous.size === active.steps.length
        ? new Set()
        : new Set(active.steps.map((_, index) => index))
    );
  }

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
              Panduan Sycle
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
              {GUIDANCE_CATEGORIES.length} panduan berbasis sumber tepercaya
            </div>
          </div>

          <div className="hidden justify-center lg:flex">
            <Image
              src="/brand/guidance-hero.webp"
              alt=""
              width={458}
              height={640}
              priority
              className="h-auto w-[210px] mix-blend-multiply"
            />
          </div>
        </div>
      </section>

        {/* Langkah 1: pilih kondisi */}
        <section className="mt-10" aria-labelledby="pilih-kondisi">
          <h2 id="pilih-kondisi" className="text-xl font-extrabold sm:text-2xl">
            Pilih kondisi, temukan panduan
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#786B77]">
            Pilih kondisi lingkungan atau kondisimu untuk melihat langkah
            perlindungannya.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3 sm:gap-4">
            {GUIDANCE_CATEGORIES.map((category) => {
              const ui = CATEGORY_UI[category.id];
              const Icon = ui.icon;
              const selected = category.id === activeId;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => selectCategory(category.id)}
                  aria-pressed={selected}
                  aria-controls="panel-panduan"
                  className={`relative flex flex-col items-start gap-3 rounded-[22px] border-2 bg-white p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgb(120_70_90_/_8%)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#B84E73]/20 sm:flex-row sm:items-center sm:p-5 ${
                    selected ? "shadow-[0_10px_26px_rgb(120_70_90_/_10%)]" : "border-[#F0E3E9]"
                  }`}
                  style={selected ? { borderColor: ui.color } : undefined}
                >
                  <span
                    className="flex size-12 shrink-0 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: ui.bg, color: ui.color }}
                  >
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="flex-1 font-extrabold leading-snug">{ui.label}</span>
                  {selected && (
                    <CheckCircle2
                      className="absolute right-3 top-3 size-5 sm:static"
                      style={{ color: ui.color }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Langkah 2: panduan yang dipilih */}
        <section
          id="panel-panduan"
          ref={panelRef}
          aria-live="polite"
          className="mt-8 scroll-mt-24"
        >
          {!active ? (
            <div className="rounded-[22px] border border-dashed border-[#E4CBD7] bg-white px-6 py-10 text-center">
              <ShieldCheck className="mx-auto size-8 text-[#B84E73]" aria-hidden="true" />
              <p className="mt-3 font-extrabold">Belum ada kondisi yang dipilih</p>
              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[#786B77]">
                Pilih salah satu kartu di atas untuk melihat panduannya.
              </p>
            </div>
          ) : (
            <article
              key={active.id}
              className="animate-in fade-in rounded-[24px] border border-[#F0E3E9] bg-white p-5 shadow-sm duration-300 sm:p-7"
              aria-labelledby="judul-panduan"
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: activeUi.bg, color: activeUi.color }}
                >
                  <activeUi.icon className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 id="judul-panduan" className="text-xl font-extrabold sm:text-2xl">
                    {active.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#6F6370]">{active.description}</p>
                </div>
              </div>

              {/* Keselamatan: selalu terlihat, tidak dilipat */}
              <div
                role="note"
                className="mt-5 flex gap-3 rounded-2xl border border-[#F2D6B8] bg-[#FFF6EC] p-4"
              >
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#A35F2A]" aria-hidden="true" />
                <div>
                  <p className="text-sm font-extrabold text-[#7A4A1F]">Kapan perlu bantuan</p>
                  <p className="mt-1 text-sm leading-6 text-[#6E5236]">{active.warning}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <h4 className="font-extrabold">Langkah perlindungan</h4>
                <button
                  type="button"
                  onClick={toggleAllSteps}
                  className="text-sm font-bold text-[#B84E73] hover:text-[#8E3E5E]"
                >
                  {openSteps.size === active.steps.length ? "Tutup semua" : "Buka semua"}
                </button>
              </div>

              <ol className="mt-3 space-y-2.5">
                {active.steps.map((step, index) => (
                  <GuidanceStep
                    key={step.action}
                    step={step}
                    index={index}
                    idPrefix={active.id}
                    isOpen={openSteps.has(index)}
                    onToggle={() => toggleStep(index)}
                  />
                ))}
              </ol>

              <div className="mt-6 grid gap-5 border-t border-[#F0E7EC] pt-5 md:grid-cols-2">
                {getArticles(active.articles).length > 0 && (
                  <div>
                    <h4 className="text-sm font-extrabold text-[#514351]">Baca selengkapnya</h4>
                    <ul className="mt-2 space-y-1.5">
                      {getArticles(active.articles).map((article) => (
                        <li key={article.slug}>
                          <Link
                            href={`/education/${article.slug}`}
                            className="inline-flex items-start gap-1.5 text-sm font-bold text-[#B84E73] hover:text-[#8E3E5E]"
                          >
                            <ArrowRight className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                            {article.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#514351]">
                    <BookOpen className="size-4" aria-hidden="true" />
                    Referensi ilmiah
                  </h4>
                  <ul className="mt-2 space-y-1.5">
                    {getReferences(active.references).map((source) => (
                      <li key={source.id}>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-start gap-1.5 text-sm text-[#6F6370] hover:text-[#984568]"
                        >
                          <span>
                            <span className="font-bold text-[#514351]">{source.publisher}</span>
                            {" — "}
                            {source.title}
                          </span>
                          <ExternalLink className="mt-1 size-3.5 shrink-0" aria-hidden="true" />
                          <span className="sr-only">(buka di tab baru)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/education/references"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#984568] hover:underline"
                  >
                    Lihat semua referensi
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          )}
        </section>

        <section className="mt-10 flex flex-col gap-4 rounded-[22px] border border-[#D7E6D9] bg-[#E9F2EA] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#52775B]" />
            <p className="leading-relaxed text-[#3F5A45]">
              Ingin panduan yang menyesuaikan kondisi dan rencana aktivitasmu
              hari ini? Isi Personalisasi.
            </p>
          </div>
          <Link
            href="/assessment"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#52775B] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#41613F]"
          >
            <BookOpen size={16} />
            Mulai Personalisasi
          </Link>
        </section>

        <footer className="mt-10 border-t border-[#EEDFE7] py-6 text-center text-sm leading-6 text-[#8A7A85]">
          Panduan Sycle bersifat edukatif dan tidak menggantikan pemeriksaan
          atau saran dari tenaga kesehatan.
        </footer>
      </div>
    </main>
  );
}