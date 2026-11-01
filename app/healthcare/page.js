"use client";

import { useMemo, useState } from "react";
import {
  MapPin,
  Search,
  Hospital,
  Building2,
  Stethoscope,
  ShieldCheck,
  ExternalLink,
  Navigation,
  Info,
  Phone,
} from "lucide-react";

import { healthcareFacilities } from "./data";

const facilityTypes = [
  { label: "Semua fasilitas", value: "all", icon: Hospital },
  { label: "Rumah sakit", value: "hospital", icon: Building2 },
  { label: "Puskesmas", value: "puskesmas", icon: Hospital },
  { label: "Klinik", value: "clinic", icon: Stethoscope },
];

export default function HealthcarePage() {
  const [location, setLocation] = useState("");
  const [activeType, setActiveType] = useState("all");

  
  const filteredFacilities = useMemo(() => {
    const keyword = location.trim().toLowerCase();

    return healthcareFacilities.filter((facility) => {
      const matchesType =
        activeType === "all" || facility.type === activeType;

      const searchableText = [
        facility.name,
        facility.code,
        facility.address,
        facility.district,
        facility.regency,
        facility.city,
        facility.province,
        facility.type,
        facility.serviceCapability,
        facility.areaCharacteristic,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesLocation = searchableText.includes(keyword);

      return matchesType && matchesLocation;
    });
  }, [location, activeType]);

  return (
    <main className="min-h-screen bg-[#FFF8FB] px-5 py-8 text-[#332A35] md:px-8 md:py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F8E8EF] px-3 py-1.5 text-sm font-semibold text-[#8E3E5E]">
            <Stethoscope size={16} />
            Healthcare Sycle
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Temukan layanan kesehatan
            <span className="block text-[#B84E73]">
              yang dekat denganmu.
            </span>
          </h1>

          <p className="max-w-2xl text-base leading-7 text-[#766976]">
            Temukan informasi fasilitas kesehatan untuk membantu kamu
            mengetahui pilihan layanan yang tersedia di sekitarmu.
          </p>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-extrabold">
              Jenis fasilitas kesehatan
            </h2>
            <p className="mt-1 text-sm text-[#766976]">
              Pilih jenis fasilitas yang ingin kamu temukan.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {facilityTypes.map((type) => {
              const Icon = type.icon;
              const isActive = activeType === type.value;

              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setActiveType(type.value)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-colors ${
                    isActive
                      ? "border-[#B84E73] bg-[#B84E73] text-white"
                      : "border-[#F0DDE5] bg-white text-[#665663] hover:bg-[#F8E8EF]"
                  }`}
                >
                  <Icon size={17} />
                  {type.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[22px] border border-[#F0DDE5] bg-white p-5 shadow-[0_5px_24px_rgb(120_70_90_/_6%)] md:p-7">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#F8E8EF] text-[#B84E73]">
              <MapPin size={22} />
            </div>

            <div>
              <h2 className="text-lg font-extrabold">
                Cari berdasarkan lokasi
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#766976]">
                Masukkan nama fasilitas, kota, atau provinsi.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#F0DDE5] bg-[#FFF8FB] px-4">
              <Search size={19} className="shrink-0 text-[#B84E73]" />
              <input
                type="search"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Contoh: Padang, Sumatera Barat"
                aria-label="Cari fasilitas berdasarkan nama atau lokasi"
                className="min-h-12 w-full bg-transparent text-sm outline-none placeholder:text-[#A395A2]"
              />
            </div>

            {location && (
              <button
                type="button"
                onClick={() => setLocation("")}
                className="min-h-12 rounded-xl border border-[#F0DDE5] bg-white px-5 font-bold text-[#665663] hover:bg-[#F8E8EF]"
              >
                Hapus pencarian
              </button>
            )}
          </div>
          
          <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-[#766976]">
            <Navigation size={15} className="mt-0.5 shrink-0" />
            Cari fasilitas kesehatan berdasarkan nama atau wilayah.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-xl font-extrabold">
                Fasilitas kesehatan
              </h2>
              <p className="mt-1 text-sm text-[#766976]">
                {filteredFacilities.length} fasilitas ditemukan
              </p>
            </div>

            <span className="rounded-full bg-[#FFF0CC] px-3 py-1.5 text-xs font-bold text-[#805B16]">
              Data dummy
            </span>
          </div>

          {filteredFacilities.length > 0 ? (       
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredFacilities.map((facility) => {
                const Icon =
                  facility.type === "hospital"
                    ? Building2
                    : facility.type === "clinic"
                      ? Stethoscope
                      : Hospital;

                const typeLabel = {
                  hospital: "Rumah sakit",
                  puskesmas: "Puskesmas",
                  clinic: "Klinik",
                }[facility.type];

                return (
                  <article
                    key={facility.id}
                    className="rounded-[22px] border border-[#F0DDE5] bg-white p-5 shadow-[0_5px_24px_rgb(120_70_90_/_6%)] transition-shadow hover:shadow-md md:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#F8E8EF] text-[#B84E73]">
                        <Icon size={24} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="inline-block rounded-full bg-[#F8E8EF] px-2.5 py-1 text-xs font-bold text-[#8E3E5E]">
                          {typeLabel}
                        </span>

                        <h3 className="mt-2 text-lg font-extrabold leading-snug">
                          {facility.name}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-4 flex items-start gap-2 text-sm leading-6 text-[#766976]">
                      <MapPin size={17} className="mt-1 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-[#665663]">
                          {facility.regency}, {facility.province}
                        </p>
                        <p className="mt-1">
                          {facility.address}
                          {facility.district ? `, Kec. ${facility.district}` : ""}
                        </p>
                      </div>
                    </div>

                    {facility.phone && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-[#766976]">
                        <Phone size={16} />
                        <span>{facility.phone}</span>
                      </div>
                    )}
                    
                    <div className="mt-5 border-t border-[#F0DDE5] pt-4">
                      <p className="text-xs leading-5 text-[#8B7D8A]">
                        {facility.source}
                      </p>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => setSelectedFacility(facility)}
                          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#B84E73] px-4 py-2.5 text-sm font-bold text-[#B84E73] transition-colors hover:bg-[#F8E8EF]"
                        >
                          <Info size={17} />
                          Lihat Detail
                        </button>

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${facility.name}, ${facility.address}, ${facility.district}, ${facility.regency}, ${facility.province}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#B84E73] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#8E3E5E]"
                        >
                          <MapPin size={17} />
                          Cek Lokasi
                        </a>
                      </div>
                    </div>

                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[22px] border border-dashed border-[#E5CBD6] bg-white p-8 text-center">
              <Search size={28} className="mx-auto text-[#B84E73]" />
              <h3 className="mt-3 font-extrabold">
                Fasilitas tidak ditemukan
              </h3>
              <p className="mt-2 text-sm text-[#766976]">
                Coba kata kunci atau jenis fasilitas yang berbeda.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLocation("");
                  setActiveType("all");
                }}
                className="mt-4 rounded-xl bg-[#B84E73] px-5 py-2.5 font-bold text-white hover:bg-[#8E3E5E]"
              >
                Tampilkan semua
              </button>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-4 rounded-[22px] border border-[#D7E6D9] bg-[#E9F2EA] p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#52785B]">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h2 className="font-extrabold">
                Mengutamakan sumber resmi
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#526653]">
                Data saat ini hanya untuk pengujian tampilan. Nantinya,
                informasi fasilitas akan diperbarui menggunakan data resmi
                Kementerian Kesehatan yang dapat diverifikasi.
              </p>
            </div>
          </div>

          <a
            href="https://rs.kemkes.go.id/hospitals"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 self-start font-bold text-[#416B4B] hover:underline md:self-center"
          >
            KEMENKES
            <ExternalLink size={16} />
          </a>
        </section>
      </div>
    </main>
  );
}