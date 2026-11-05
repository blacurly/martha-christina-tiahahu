"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  ExternalLink,
  Hospital,
  Info,
  Loader2,
  LocateFixed,
  MapPin,
  Navigation,
  RefreshCw,
  Search,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";

import { useAssessment } from "@/context/AssessmentContext";

// Healthcare (Master V2.1 WF-11, FR-15, AC-24–26):
// pilih lokasi bila belum ada → daftar faskes urut jarak → label "Mitra SYCLE" → detail tanpa kontak.

const TYPE_FILTERS = [
  { value: "all", label: "Semua" },
  { value: "hospital", label: "Rumah sakit" },
  { value: "puskesmas", label: "Puskesmas" },
  { value: "clinic", label: "Klinik" },
  { value: "midwife", label: "Bidan" },
  { value: "doctor", label: "Praktik dokter" },
];

const TYPE_ICON = {
  hospital: Building2,
  puskesmas: Hospital,
  clinic: Stethoscope,
  midwife: UserRound,
  doctor: Stethoscope,
};

const COMPLETENESS = {
  lengkap: {
    label: "Data lengkap",
    className: "bg-[#E9F2EA] text-[#3E6E4B]",
    description: "Nama, alamat, dan layanan tersedia.",
  },
  sebagian: {
    label: "Data sebagian",
    className: "bg-[#FFF4E2] text-[#8A5A1E]",
    description: "Nama dan alamat tersedia, informasi layanan belum ada.",
  },
  terbatas: {
    label: "Data terbatas",
    className: "bg-[#F4EFF2] text-[#6E5F6C]",
    description: "Hanya nama dan titik lokasi yang tersedia.",
  },
};

function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toLocaleString("id-ID", { maximumFractionDigits: 1 })} km`;
}

function directionsUrl(facility) {
  return `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lon}`;
}

function osmUrl(facility) {
  if (facility.osmRef) return `https://www.openstreetmap.org/${facility.osmRef}`;
  return `https://www.openstreetmap.org/?mlat=${facility.lat}&mlon=${facility.lon}#map=17/${facility.lat}/${facility.lon}`;
}

export default function HealthcarePage() {
  const { environmentLocation, setEnvironmentLocation } = useAssessment();

  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [errorMessage, setErrorMessage] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [selected, setSelected] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [changingLocation, setChangingLocation] = useState(false);

  const closeButtonRef = useRef(null);

  const adm4 = environmentLocation?.adm4 ?? null;
  const latitude = environmentLocation?.coordinates?.latitude ?? null;
  const longitude = environmentLocation?.coordinates?.longitude ?? null;
  const hasLocation = Boolean(adm4) || (latitude !== null && longitude !== null);

  const loadFacilities = useCallback(async () => {
    const params = new URLSearchParams();
    if (adm4) params.set("adm4", adm4);
    else {
      params.set("lat", String(latitude));
      params.set("lon", String(longitude));
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/healthcare?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Data belum dapat dimuat.");
      setResult(data);
      setStatus("ready");
    } catch (error) {
      setErrorMessage(error.message);
      setStatus("error");
    }
  }, [adm4, latitude, longitude]);

  // Muat faskes setiap kali lokasi berubah.
  useEffect(() => {
    if (!hasLocation) return;
    const frame = requestAnimationFrame(() => {
      setChangingLocation(false);
      loadFacilities();
    });
    return () => cancelAnimationFrame(frame);
  }, [hasLocation, loadFacilities]);

  // Popup detail: kunci scroll, Escape untuk menutup, fokus ke tombol tutup.
  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(event) {
      if (event.key === "Escape") setSelected(null);
    }
    document.addEventListener("keydown", handleKeyDown);
    const frame = requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(frame);
    };
  }, [selected]);

  const facilities = useMemo(() => result?.facilities ?? [], [result]);

  const typeCounts = useMemo(() => {
    const counts = { all: facilities.length };
    for (const facility of facilities) counts[facility.type] = (counts[facility.type] ?? 0) + 1;
    return counts;
  }, [facilities]);

  // Filter jenis tidak mengubah urutan: tetap urut jarak (AC-24).
  const visibleFacilities = useMemo(
    () =>
      activeType === "all"
        ? facilities
        : facilities.filter((facility) => facility.type === activeType),
    [facilities, activeType]
  );

  function handleDeviceLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Browser tidak mendukung deteksi lokasi. Cari nama desa/kelurahan.");
      return;
    }
    setLocationMessage("Sedang mendeteksi lokasi…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationMessage("");
        setEnvironmentLocation({
          adm4: null,
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      () => {
        setLocationMessage("Izin lokasi ditolak atau gagal. Cari nama desa/kelurahan di bawah.");
      },
      { timeout: 10000 }
    );
  }

  async function searchVillage(event) {
    event?.preventDefault();
    const query = searchText.trim();
    if (query.length < 3) {
      setLocationMessage("Ketik minimal 3 huruf.");
      return;
    }
    setSearching(true);
    setLocationMessage("");
    try {
      const response = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Pencarian gagal.");
      setSearchResults(data.items ?? []);
      if ((data.items ?? []).length === 0) setLocationMessage("Desa/kelurahan tidak ditemukan.");
    } catch (error) {
      setLocationMessage(error.message);
    } finally {
      setSearching(false);
    }
  }

  function chooseVillage(item) {
    setSearchResults([]);
    setSearchText("");
    setEnvironmentLocation({ adm4: item.code, coordinates: null });
  }

  const showLocationPicker = !hasLocation || changingLocation;

  return (
    <main className="min-h-screen bg-[#FFF8FB] px-5 py-8 text-[#332A35] md:px-8 md:py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Judul */}
        <section className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F8E8EF] px-3 py-1.5 text-sm font-semibold text-[#8E3E5E]">
            <Stethoscope size={16} aria-hidden="true" />
            Healthcare Sycle
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Temukan fasilitas kesehatan
            <span className="block text-[#B84E73]">terdekat dari lokasimu.</span>
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[#766976]">
            Daftar rumah sakit, puskesmas, klinik, bidan, dan praktik dokter di
            sekitarmu, diurutkan dari yang paling dekat.
          </p>
        </section>

        {/* Lokasi */}
        <section
          aria-labelledby="judul-lokasi"
          className="rounded-[22px] border border-[#F0DDE5] bg-white p-5 shadow-[0_5px_24px_rgb(120_70_90_/_6%)] md:p-7"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#F8E8EF] text-[#B84E73]">
                <MapPin size={22} aria-hidden="true" />
              </div>
              <div>
                <h2 id="judul-lokasi" className="text-lg font-extrabold">
                  {hasLocation && result?.location ? result.location.label : "Pilih lokasimu"}
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#766976]">
                  {hasLocation && result?.location
                    ? `Titik lokasi: ${result.location.coordinateSource}.`
                    : "Lokasi diperlukan untuk mengurutkan fasilitas berdasarkan jarak."}
                </p>
              </div>
            </div>

            {hasLocation && !changingLocation && (
              <button
                type="button"
                onClick={() => setChangingLocation(true)}
                className="rounded-xl border border-[#F0DDE5] px-4 py-2 text-sm font-bold text-[#8E3E5E] hover:bg-[#F8E8EF]"
              >
                Ganti lokasi
              </button>
            )}
          </div>

          {showLocationPicker && (
            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={handleDeviceLocation}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#B84E73] px-4 text-sm font-bold text-white hover:bg-[#8E3E5E]"
              >
                <LocateFixed size={18} aria-hidden="true" />
                Gunakan lokasiku
              </button>

              <form onSubmit={searchVillage} className="flex flex-col gap-3 sm:flex-row">
                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#F0DDE5] bg-[#FFF8FB] px-4">
                  <Search size={19} className="shrink-0 text-[#B84E73]" aria-hidden="true" />
                  <input
                    type="search"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Atau cari desa/kelurahan, contoh: Jati Padang"
                    aria-label="Cari desa atau kelurahan"
                    className="min-h-12 w-full bg-transparent text-sm outline-none placeholder:text-[#A395A2]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={searching}
                  className="min-h-12 rounded-xl border border-[#B84E73] px-5 text-sm font-bold text-[#8E3E5E] hover:bg-[#F8E8EF] disabled:opacity-60"
                >
                  {searching ? "Mencari…" : "Cari"}
                </button>
                {changingLocation && (
                  <button
                    type="button"
                    onClick={() => {
                      setChangingLocation(false);
                      setSearchResults([]);
                      setLocationMessage("");
                    }}
                    className="min-h-12 rounded-xl px-4 text-sm font-bold text-[#766976] hover:bg-[#F8E8EF]"
                  >
                    Batal
                  </button>
                )}
              </form>

              {locationMessage && (
                <p className="text-sm text-[#8E3E5E]" aria-live="polite">
                  {locationMessage}
                </p>
              )}

              {searchResults.length > 0 && (
                <ul className="divide-y divide-[#F3E6EC] overflow-hidden rounded-xl border border-[#F0DDE5]">
                  {searchResults.map((item) => (
                    <li key={item.code}>
                      <button
                        type="button"
                        onClick={() => chooseVillage(item)}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-[#FFF4F8]"
                      >
                        <span className="font-bold">{item.village}</span>
                        <span className="block text-xs text-[#766976]">
                          {item.district}, {item.regency}, {item.province}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>

        {/* Daftar faskes */}
        {hasLocation && (
          <section aria-labelledby="judul-faskes" className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="judul-faskes" className="text-xl font-extrabold">
                  Fasilitas kesehatan terdekat
                </h2>
                {status === "ready" && (
                  <p className="mt-1 text-sm text-[#766976]" aria-live="polite">
                    {visibleFacilities.length} fasilitas dalam radius {result.radiusKm} km,
                    diurutkan dari yang terdekat
                  </p>
                )}
              </div>
              {status === "ready" && (
                <button
                  type="button"
                  onClick={loadFacilities}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#B84E73] hover:text-[#8E3E5E]"
                >
                  <RefreshCw size={15} aria-hidden="true" />
                  Muat ulang
                </button>
              )}
            </div>

            {status === "ready" && facilities.length > 0 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter jenis fasilitas">
                {TYPE_FILTERS.filter(
                  (type) => type.value === "all" || typeCounts[type.value]
                ).map((type) => {
                  const active = activeType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setActiveType(type.value)}
                      aria-pressed={active}
                      className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                        active
                          ? "border-[#B84E73] bg-[#B84E73] text-white"
                          : "border-[#F0DDE5] bg-white text-[#665663] hover:bg-[#F8E8EF]"
                      }`}
                    >
                      {type.label} ({typeCounts[type.value] ?? 0})
                    </button>
                  );
                })}
              </div>
            )}

            {status === "loading" && (
              <div className="flex items-center justify-center gap-3 rounded-[22px] border border-[#F0DDE5] bg-white p-10 text-sm text-[#766976]">
                <Loader2 className="size-5 animate-spin text-[#B84E73]" aria-hidden="true" />
                Mencari fasilitas kesehatan di sekitarmu…
              </div>
            )}

            {status === "error" && (
              <div className="rounded-[22px] border border-[#F2D6B8] bg-[#FFF6EC] p-6 text-sm leading-6 text-[#6E5236]">
                <p className="font-extrabold">Data fasilitas belum dapat dimuat</p>
                <p className="mt-1">{errorMessage}</p>
                <button
                  type="button"
                  onClick={loadFacilities}
                  className="mt-3 rounded-xl bg-[#B84E73] px-4 py-2 font-bold text-white hover:bg-[#8E3E5E]"
                >
                  Coba lagi
                </button>
              </div>
            )}

            {status === "ready" && !result.osmAvailable && (
              <p className="rounded-xl bg-[#FFF6EC] p-4 text-sm leading-6 text-[#6E5236]">
                Data OpenStreetMap sedang tidak dapat diakses. Yang tampil hanya
                faskes mitra SYCLE (bila ada). Coba muat ulang beberapa saat lagi.
              </p>
            )}

            {status === "ready" && visibleFacilities.length === 0 && (
              <div className="rounded-[22px] border border-dashed border-[#E4CBD7] bg-white p-8 text-center text-sm text-[#766976]">
                Belum ada fasilitas kesehatan yang tercatat di sekitar lokasi ini.
              </div>
            )}

            {status === "ready" && visibleFacilities.length > 0 && (
              <ol className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {visibleFacilities.map((facility) => {
                  const Icon = TYPE_ICON[facility.type] ?? Hospital;
                  const quality = COMPLETENESS[facility.completeness] ?? COMPLETENESS.terbatas;

                  return (
                    <li
                      key={facility.id}
                      className="flex flex-col rounded-[22px] border border-[#F0DDE5] bg-white p-5 shadow-[0_5px_24px_rgb(120_70_90_/_5%)]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#F8E8EF] text-[#B84E73]">
                          <Icon size={24} aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="rounded-full bg-[#F8E8EF] px-2.5 py-1 text-xs font-bold text-[#8E3E5E]">
                              {facility.typeLabel}
                            </span>
                            {facility.isPartner && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#EEEAF8] px-2.5 py-1 text-xs font-bold text-[#5E4A86]">
                                <BadgeCheck size={13} aria-hidden="true" />
                                Mitra SYCLE
                              </span>
                            )}
                          </div>
                          <h3 className="mt-2 text-lg font-extrabold leading-snug">
                            {facility.name}
                          </h3>
                        </div>
                        <span className="shrink-0 text-sm font-extrabold text-[#B84E73]">
                          {formatDistance(facility.distanceKm)}
                        </span>
                      </div>

                      <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-[#766976]">
                        <MapPin size={16} className="mt-1 shrink-0" aria-hidden="true" />
                        <span>
                          {facility.address ?? "Alamat jalan belum tercatat"}
                          {facility.area && (
                            <span className="block text-xs text-[#8B7D8A]">{facility.area}</span>
                          )}
                        </span>
                      </p>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0DDE5] pt-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${quality.className}`}>
                          {quality.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelected(facility)}
                          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#B84E73] px-4 text-sm font-bold text-[#8E3E5E] hover:bg-[#F8E8EF]"
                        >
                          <Info size={16} aria-hidden="true" />
                          Lihat detail
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            {status === "ready" && (
              <p className="text-xs leading-5 text-[#8B7D8A]">
                Data faskes ©{" "}
                <a
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline-offset-2 hover:underline"
                >
                  kontributor OpenStreetMap
                </a>{" "}
                (ODbL), snapshot {result.snapshotDate}. Data terbuka bisa belum lengkap atau
                belum diperbarui. Label
                Mitra SYCLE tidak memengaruhi urutan.
              </p>
            )}
          </section>
        )}

        {/* Disclaimer halaman Healthcare ditampilkan oleh Footer (FR-17). */}
      </div>

      {/* Detail faskes — tanpa kontak (AC-26) */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#332A35]/45 backdrop-blur-[3px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="judul-detail-faskes"
            className="relative max-h-[90dvh] w-full max-w-[560px] overflow-y-auto rounded-t-[28px] bg-[#FFFDFE] p-6 shadow-2xl sm:rounded-[28px] sm:p-7"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Tutup"
              className="absolute right-4 top-4 rounded-full p-2 text-[#8A7A85] hover:bg-[#F8E8EF] hover:text-[#B84E73]"
            >
              <X className="size-5" />
            </button>

            <div className="flex flex-wrap items-center gap-1.5 pr-10">
              <span className="rounded-full bg-[#F8E8EF] px-2.5 py-1 text-xs font-bold text-[#8E3E5E]">
                {selected.typeLabel}
              </span>
              {selected.isPartner && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EEEAF8] px-2.5 py-1 text-xs font-bold text-[#5E4A86]">
                  <BadgeCheck size={13} aria-hidden="true" />
                  Mitra SYCLE
                </span>
              )}
            </div>
            <h2 id="judul-detail-faskes" className="mt-3 pr-10 text-2xl font-extrabold leading-tight">
              {selected.name}
            </h2>
            <p className="mt-1 text-sm font-bold text-[#B84E73]">
              {formatDistance(selected.distanceKm)} dari lokasimu
            </p>

            <dl className="mt-5 space-y-4 text-sm leading-6">
              <div>
                <dt className="font-extrabold text-[#514351]">Alamat</dt>
                <dd className="text-[#6F6370]">{selected.address ?? "Alamat jalan belum tercatat"}</dd>
              </div>
              {selected.area && (
                <div>
                  <dt className="font-extrabold text-[#514351]">Wilayah</dt>
                  <dd className="text-[#6F6370]">{selected.area}</dd>
                </div>
              )}
              <div>
                <dt className="font-extrabold text-[#514351]">Layanan</dt>
                <dd className="text-[#6F6370]">
                  {selected.services.length > 0
                    ? selected.services.join(", ")
                    : "Informasi layanan belum tercatat"}
                </dd>
              </div>
              <div>
                <dt className="font-extrabold text-[#514351]">Kelengkapan data</dt>
                <dd className="text-[#6F6370]">
                  {(COMPLETENESS[selected.completeness] ?? COMPLETENESS.terbatas).label}.{" "}
                  {(COMPLETENESS[selected.completeness] ?? COMPLETENESS.terbatas).description}
                </dd>
              </div>
              <div>
                <dt className="font-extrabold text-[#514351]">Sumber data</dt>
                <dd className="text-[#6F6370]">
                  {selected.source === "mitra"
                    ? "Data mitra SYCLE"
                    : `OpenStreetMap (data terbuka), snapshot ${result?.snapshotDate ?? ""}`}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-col gap-2 border-t border-[#F0E3E9] pt-5 sm:flex-row">
              <a
                href={directionsUrl(selected)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#B84E73] px-4 text-sm font-bold text-white hover:bg-[#8E3E5E]"
              >
                <Navigation size={17} aria-hidden="true" />
                Petunjuk arah
                <span className="sr-only">(buka Google Maps di tab baru)</span>
              </a>
              <a
                href={osmUrl(selected)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#B84E73] px-4 text-sm font-bold text-[#8E3E5E] hover:bg-[#F8E8EF]"
              >
                <ExternalLink size={17} aria-hidden="true" />
                Lihat di peta
                <span className="sr-only">(buka OpenStreetMap di tab baru)</span>
              </a>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#8A7A85]">
              Sebelum berkunjung, pastikan jam layanan langsung ke fasilitas. Butuh
              informasi tanda bahaya? Baca{" "}
              <Link href="/education/guidance" className="font-bold text-[#984568] hover:underline">
                Panduan Perlindungan
              </Link>
              .
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
