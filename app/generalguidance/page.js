"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAssessment } from "@/context/AssessmentContext";
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CloudSun,
  Droplets,
  Heart,
  Info,
  Leaf,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
  Thermometer,
  Wind,
  House,
  Footprints,
} from "lucide-react";

const INDICATORS = [
  {
    key: "temperature",
    title: "Suhu udara",
    shortTitle: "Suhu",
    icon: Thermometer,
    unit: "°C",
    description:
      "Suhu udara membantu kamu memahami seberapa panas atau sejuk lingkungan saat ini.",
    tips: [
      "Pilih pakaian yang nyaman dan menyerap keringat.",
      "Cari tempat teduh saat cuaca terasa panas.",
      "Minum air secara berkala.",
    ],
  },
  {
    key: "humidity",
    title: "Kelembapan",
    shortTitle: "Kelembapan",
    icon: Droplets,
    unit: "%",
    description:
      "Kelembapan tinggi dapat membuat keringat lebih sulit menguap, sehingga tubuh terasa gerah.",
    tips: [
      "Pilih pakaian yang ringan dan nyaman.",
      "Berikan jeda saat mulai merasa gerah.",
      "Cari tempat dengan sirkulasi udara yang baik.",
    ],
  },
  {
    key: "uv",
    title: "Indeks UV",
    shortTitle: "UV",
    icon: Sun,
    unit: "",
    description:
      "Indeks UV menunjukkan tingkat radiasi ultraviolet matahari yang dapat berdampak pada kulit dan mata.",
    tips: [
      "Gunakan tabir surya dan aplikasikan ulang sesuai petunjuk.",
      "Pakai topi atau pakaian pelindung.",
      "Cari tempat teduh ketika indeks UV tinggi.",
    ],
  },
  {
    key: "airQuality",
    title: "Kualitas udara",
    shortTitle: "Udara",
    icon: Wind,
    unit: "",
    description:
      "Kualitas udara memberi konteks tentang polusi di lingkungan. Nilai dan kategorinya mengikuti sumber data yang tersedia.",
    tips: [
      "Perhatikan informasi kualitas udara sebelum beraktivitas.",
      "Kurangi aktivitas berat di luar ketika kualitas udara memburuk.",
      "Jika sensitif terhadap polusi, sesuaikan aktivitas dengan kondisi udara.",
    ],
  },
  {
    key: "heatIndex",
    title: "Heat Index",
    shortTitle: "Rasa panas",
    icon: Activity,
    unit: "°C",
    description:
      "Heat Index memperkirakan rasa panas dengan mempertimbangkan suhu dan kelembapan udara.",
    tips: [
      "Jangan hanya mengandalkan suhu udara untuk menilai rasa panas.",
      "Kurangi intensitas aktivitas saat tubuh terasa kepanasan.",
      "Beristirahatlah di tempat sejuk jika diperlukan.",
    ],
  },
];

const QUICK_TOPICS = [
  { id: "panas", label: "Cuaca gerah", icon: Sun },
  { id: "matahari", label: "Paparan matahari", icon: ShieldCheck },
  { id: "udara", label: "Kualitas udara", icon: Wind },
];

function getStatus(item) {
  if (!item) return "";

  const category =
    typeof item.category === "object"
      ? item.category?.label
      : item.category;

  return category || item.status || "Kategori belum tersedia";
}

function getValue(item, unit = "") {
  if (!item || item.value == null) return "Belum tersedia";

  const suffix = item.unit ?? unit;
  return `${item.value}${suffix ? ` ${suffix}` : ""}`;
}

function getPriority(item) {
  const status = getStatus(item).toLowerCase();

  if (
    /ekstrem|sangat tinggi|sangat buruk|berbahaya|bahaya|tidak sehat|sangat panas/.test(
      status
    )
  ) {
    return 3;
  }

  if (/hati-hati|sedang|waspada|panas|buruk|tinggi/.test(status)) {
    return 2;
  }

  if (/nyaman|baik|rendah|aman|normal/.test(status)) {
    return 0;
  }

  return 1;
}

function getVibe(indicators) {
  const available = INDICATORS.filter(
    (item) => indicators?.[item.key]?.value != null
  );

  if (!available.length) {
    return {
      emoji: "🌷",
      title: "Yuk, cek kondisi lingkungan",
      text: "Pilih lokasi untuk melihat informasi lingkungan yang tersedia hari ini.",
    };
  }

  const priorities = available.map((item) =>
    getPriority(indicators[item.key])
  );

  if (priorities.some((priority) => priority === 3)) {
    return {
      emoji: "🧡",
      title: "Saatnya lebih aware",
      text: "Ada indikator yang perlu diperhatikan. Cek detailnya dan sesuaikan aktivitas dengan kondisi sekitar.",
    };
  }

  if (priorities.some((priority) => priority === 2)) {
    return {
      emoji: "🌤️",
      title: "Santai, tapi tetap aware",
      text: "Beberapa kondisi lingkungan mungkin butuh perhatian ekstra. Kamu tetap bisa beraktivitas sambil menyesuaikan kebutuhan tubuh.",
    };
  }

  return {
    emoji: "🌿",
    title: "Kenali kondisi sebelum beraktivitas",
    text: "Belum terlihat indikator berstatus perhatian tinggi dari data yang tersedia. Tetap dengarkan respons tubuhmu.",
  };
}

function getAdvice(item) {
  const priority = getPriority(item);

  if (priority >= 3) {
    return "Prioritaskan perlindungan diri dan kurangi paparan atau aktivitas berat yang berkaitan dengan indikator ini.";
  }

  if (priority === 2) {
    return "Pertimbangkan jeda istirahat dan sesuaikan aktivitas dengan kondisi lingkungan.";
  }

  return "Pertahankan kebiasaan yang nyaman dan sesuaikan aktivitas dengan kebutuhan tubuh.";
}

function getQuickTips(topic, mode) {
  const outdoors = mode === "outdoor";

  const tips = {
    panas: [
      outdoors
        ? "Cari area teduh dan ambil jeda saat cuaca terasa panas."
        : "Pastikan ruangan memiliki sirkulasi udara yang nyaman.",
      "Minum air secara berkala, jangan tunggu sampai sangat haus.",
      "Jika merasa pusing, lemas, atau mual karena panas, hentikan aktivitas dan cari tempat sejuk.",
    ],
    matahari: [
      "Gunakan tabir surya sesuai petunjuk pemakaian.",
      "Topi, kacamata pelindung, dan pakaian yang sesuai dapat membantu mengurangi paparan.",
      outdoors
        ? "Jika memungkinkan, kurangi paparan matahari langsung ketika indeks UV tinggi."
        : "Jika duduk dekat jendela, ingat bahwa paparan UV dapat berbeda menurut jenis kaca.",
    ],
    udara: [
      "Periksa kategori kualitas udara yang ditampilkan dan sumber datanya.",
      outdoors
        ? "Saat kualitas udara memburuk, pertimbangkan aktivitas indoor atau kurangi aktivitas berat."
        : "Jaga sirkulasi udara sesuai kondisi luar dan kualitas udara di dalam ruangan.",
      "Jika muncul sesak napas atau gejala berat, cari bantuan medis.",
    ],
  };

  return tips[topic] || tips.panas;
}

export default function GeneralGuidancePage() {
  const { location, environmentLocation, condition, activity } =
    useAssessment();

  const [environment, setEnvironment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [topic, setTopic] = useState("panas");
  const [activityMode, setActivityMode] = useState(
    /luar|outdoor/i.test(activity || "") ? "outdoor" : "indoor"
  );

  const adm4 = environmentLocation?.adm4;
  const coordinates = environmentLocation?.coordinates;

  const fetchEnvironment = useCallback(async () => {
    if (!adm4 && !coordinates) {
      setEnvironment(null);
      setError(
        "Lokasi belum terhubung. Pilih lokasi di Beranda terlebih dahulu."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (adm4) {
        params.set("adm4", adm4);
      } else {
        params.set("lat", String(coordinates.latitude));
        params.set("lon", String(coordinates.longitude));
      }

      const response = await fetch(
        `/api/environment?${params.toString()}`,
        { cache: "no-store" }
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload?.error || "Data lingkungan belum dapat dimuat."
        );
      }

      const snapshot =
        payload?.data ?? payload?.environment ?? payload;

      if (!snapshot?.indicators) {
        throw new Error(
          "Struktur data indikator belum sesuai dengan respons API."
        );
      }

      setEnvironment(snapshot);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memuat data."
      );
    } finally {
      setLoading(false);
    }
  }, [adm4, coordinates]);

  useEffect(() => {
    fetchEnvironment();
  }, [fetchEnvironment]);

  const indicators = environment?.indicators;

  const availableIndicators = useMemo(
    () =>
      INDICATORS.filter(
        (item) =>
          indicators?.[item.key]?.value !== null &&
          indicators?.[item.key]?.value !== undefined
      ),
    [indicators]
  );

  const vibe = useMemo(() => getVibe(indicators), [indicators]);

  const priorityIndicators = useMemo(
    () =>
      [...availableIndicators]
        .filter((item) => getPriority(indicators[item.key]) >= 2)
        .sort(
          (a, b) =>
            getPriority(indicators[b.key]) -
            getPriority(indicators[a.key])
        )
        .slice(0, 2),
    [availableIndicators, indicators]
  );

  const selectedItem = INDICATORS.find(
    (item) => item.key === selectedIndicator
  );

  const selectedData = selectedItem
    ? indicators?.[selectedItem.key]
    : null;

  const tips = getQuickTips(topic, activityMode);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <header>
        <p className="text-sm font-bold tracking-wide text-[#B84E73]">
          YOUR DAILY WELLNESS CHECK 🌷
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#332A35] sm:text-4xl">
          Panduan Umum
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6B606B] sm:text-base">
          Cuaca bisa berubah, kebutuhan tubuh juga bisa berbeda.
          Kenali lingkunganmu, lalu pilih langkah kecil yang
          cocok buat hari ini.
        </p>
      </header>

      <section className="mt-7 overflow-hidden rounded-3xl border border-[#F0DCE5] bg-gradient-to-br from-[#FFF8FB] to-[#F8E8EF] p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
            {vibe.emoji}
          </div>

          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8E3E5E]">
              Vibe lingkungan hari ini
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#332A35] sm:text-2xl">
              {vibe.title}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B606B]">
              {vibe.text}
            </p>

            <p className="mt-3 text-xs text-[#817580]">
              <span className="font-semibold">Lokasi:</span>{" "}
              {location || "Belum dipilih"}
              {lastUpdated &&
                ` · Diperbarui ${lastUpdated.toLocaleTimeString(
                  "id-ID",
                  { hour: "2-digit", minute: "2-digit" }
                )}`}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchEnvironment}
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#B84E73] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#8E3E5E] disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            {loading ? "Memuat..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div
            role="status"
            className="mt-5 rounded-2xl border border-[#E8C8D4] bg-white/90 p-4 text-sm leading-6 text-[#6B606B]"
          >
            <p className="font-semibold text-[#8E3E5E]">
              Data belum siap
            </p>
            <p className="mt-1">{error}</p>
          </div>
        )}
      </section>

      <section className="mt-9">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#332A35] sm:text-2xl">
              Cek kondisi sekitarmu
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6B606B]">
              Tap kartu untuk tahu artinya dan apa yang bisa kamu lakukan.
            </p>
          </div>

          <span className="hidden rounded-full bg-[#F8E8EF] px-3 py-1 text-xs font-semibold text-[#8E3E5E] sm:inline-flex">
            {availableIndicators.length} indikator tersedia
          </span>
        </div>

        {loading && !environment && (
          <p className="mt-4 text-sm text-[#6B606B]">
            Sedang memuat data lingkungan...
          </p>
        )}

        {availableIndicators.length > 0 ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INDICATORS.map((item) => {
              const Icon = item.icon;
              const data = indicators?.[item.key];
              const isAvailable = data?.value != null;
              const isSelected = selectedIndicator === item.key;

              return (
                <button
                  type="button"
                  key={item.key}
                  onClick={() =>
                    setSelectedIndicator(isSelected ? null : item.key)
                  }
                  aria-expanded={isSelected}
                  className={`rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    isSelected
                      ? "border-[#B84E73] bg-[#FFF8FB] ring-2 ring-[#F8E8EF]"
                      : "border-[#F0E4EA] bg-white hover:border-[#D9A9BC]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="rounded-xl bg-[#F8E8EF] p-2.5 text-[#B84E73]">
                        <Icon size={20} />
                      </span>

                      <span className="font-semibold text-[#332A35]">
                        {item.title}
                      </span>
                    </div>

                    {isSelected ? (
                      <ChevronDown
                        size={18}
                        className="mt-1 text-[#B84E73]"
                      />
                    ) : (
                      <ArrowUpRight
                        size={18}
                        className="mt-1 text-[#A99AA5]"
                      />
                    )}
                  </div>

                  <p className="mt-5 text-2xl font-bold text-[#332A35]">
                    {getValue(data, item.unit)}
                  </p>

                  <p className="mt-1 text-sm text-[#8E3E5E]">
                    {isAvailable
                      ? getStatus(data)
                      : "Belum tersedia"}
                  </p>

                  {isSelected && (
                    <div className="mt-4 border-t border-[#F0DCE5] pt-4">
                      <p className="text-sm leading-6 text-[#6B606B]">
                        {item.description}
                      </p>

                      {isAvailable && (
                        <p className="mt-3 text-sm font-semibold leading-6 text-[#8E3E5E]">
                          {getAdvice(data)}
                        </p>
                      )}

                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#B84E73]">
                        {isAvailable
                          ? "Lihat tips di bawah"
                          : "Menunggu data indikator"}
                        <ArrowDown size={14} />
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          !loading &&
          !error && (
            <p className="mt-4 rounded-2xl border border-[#F0E4EA] bg-white p-5 text-sm leading-6 text-[#6B606B]">
              Belum ada nilai indikator yang tersedia untuk lokasi ini.
            </p>
          )
        )}
      </section>

      <section className="mt-9 rounded-3xl border border-[#D7E6D9] bg-[#E9F2EA] p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-3 text-[#66836B]">
            <Sparkles size={22} />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#526A56]">
              Small steps, better day
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#332A35] sm:text-2xl">
              Apa yang bisa aku lakukan?
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#526A56]">
              Pilih aktivitasmu untuk melihat tips yang lebih relevan.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setActivityMode("indoor")}
            aria-pressed={activityMode === "indoor"}
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition ${
              activityMode === "indoor"
                ? "border-[#66836B] bg-white text-[#332A35] shadow-sm"
                : "border-[#D7E6D9] bg-transparent text-[#526A56] hover:bg-white/70"
            }`}
          >
            <House size={18} />
            Dalam ruangan
            {activityMode === "indoor" && <Check size={16} />}
          </button>

          <button
            type="button"
            onClick={() => setActivityMode("outdoor")}
            aria-pressed={activityMode === "outdoor"}
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition ${
              activityMode === "outdoor"
                ? "border-[#66836B] bg-white text-[#332A35] shadow-sm"
                : "border-[#D7E6D9] bg-transparent text-[#526A56] hover:bg-white/70"
            }`}
          >
            <Footprints size={18} />
            Luar ruangan
            {activityMode === "outdoor" && <Check size={16} />}
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm font-bold text-[#332A35]">
            Aku mau tips tentang...
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK_TOPICS.map((item) => {
              const Icon = item.icon;
              const active = topic === item.id;

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setTopic(item.id)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-[#66836B] bg-[#66836B] text-white"
                      : "border-[#D7E6D9] bg-white text-[#526A56] hover:border-[#66836B]"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-[#D7E6D9] bg-white p-4 sm:p-5">
          <h3 className="font-bold text-[#332A35]">
            {QUICK_TOPICS.find((item) => item.id === topic)?.label}
          </h3>

          <ul className="mt-4 space-y-3">
            {tips.map((tip, index) => (
              <li key={tip} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E9F2EA] text-xs font-bold text-[#526A56]">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-[#6B606B]">
                  {tip}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-[#EEEAF8] bg-[#F8F6FC] p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-white p-3 text-[#8E3E5E]">
            <Heart size={22} />
          </span>

          <div>
            <h2 className="text-xl font-bold text-[#332A35]">
              Kondisi × Iklim
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6B606B]">
              Lingkungan dapat memengaruhi kenyamanan dan kebutuhan
              tubuh, tetapi respons setiap orang berbeda. Gunakan
              informasi ini sebagai konteks, bukan sebagai diagnosis.
            </p>
          </div>
        </div>

        {condition && (
          <p className="mt-4 rounded-xl bg-white p-4 text-sm leading-6 text-[#6B606B]">
            Konteks kesehatan pilihanmu:{" "}
            <strong className="text-[#332A35]">{condition}</strong>.
            Tips di halaman ini tetap bersifat umum.
          </p>
        )}

        {priorityIndicators.length > 0 ? (
          <div className="mt-5 space-y-3">
            <p className="text-sm font-bold text-[#332A35]">
              Yang perlu kamu perhatikan
            </p>

            {priorityIndicators.map((item) => {
              const Icon = item.icon;
              const data = indicators[item.key];

              return (
                <div
                  key={item.key}
                  className="rounded-2xl border border-[#EEEAF8] bg-white p-4"
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      size={20}
                      className="mt-0.5 shrink-0 text-[#8E3E5E]"
                    />
                    <div>
                      <p className="font-semibold text-[#332A35]">
                        {item.title} · {getStatus(data)}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#6B606B]">
                        {getAdvice(data)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6 text-[#6B606B]">
            {availableIndicators.length
              ? "Belum ada indikator yang ditandai perlu perhatian ekstra. Tetap sesuaikan aktivitas dengan kenyamanan tubuh."
              : "Ringkasan kondisi akan tersedia setelah data lingkungan berhasil dimuat."}
          </p>
        )}
      </section>

      <footer className="mt-7 rounded-2xl border border-[#F0E4EA] bg-white p-4">
        <div className="flex items-start gap-3">
          <Info
            size={19}
            className="mt-0.5 shrink-0 text-[#B84E73]"
          />
          <p className="text-xs leading-5 text-[#817580]">
            Data dapat memiliki keterlambatan atau keterbatasan
            sumber. Status indikator mengikuti kategori yang
            diberikan sumber data, jika tersedia. Hentikan aktivitas
            jika merasa tidak sehat dan cari bantuan medis untuk
            gejala berat.
          </p>
        </div>
      </footer>
    </main>
  );
}