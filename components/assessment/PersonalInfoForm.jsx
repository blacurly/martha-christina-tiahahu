"use client";

import { useAssessment } from "@/context/AssessmentContext";

export default function PersonalInfoForm() {
  const {
    profile,
    setProfile,
    validatePersonal,
  } = useAssessment();

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  const ageError = validatePersonal();

  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-[#332A35]">
          Informasi diri
        </h2>

        <p className="text-sm text-[#766976]">
          Informasi singkat ini membantu memberikan konteks
          pada ringkasan assessment-mu.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="profile-name"
          className="block text-sm font-bold text-[#332A35]"
        >
          Nama panggilan
          <span className="ml-1 font-normal text-[#766976]">
            (opsional)
          </span>
        </label>

        <input
          id="profile-name"
          name="name"
          type="text"
          value={profile.name ?? ""}
          onChange={handleChange}
          placeholder="Masukkan nama panggilan"
          autoComplete="given-name"
          className="w-full rounded-xl border border-[#E8DCE3] bg-white px-4 py-3 text-[#332A35] outline-none transition focus:border-[#B84E73] focus:ring-2 focus:ring-[#B84E73]/15"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="profile-age"
          className="block text-sm font-bold text-[#332A35]"
        >
          Usia <span className="text-[#B84E73]">*</span>
        </label>

        <div className="relative">
          <input
            id="profile-age"
            name="age"
            type="number"
            min="1"
            max="100"
            step="1"
            required
            value={profile.age ?? ""}
            onChange={handleChange}
            placeholder="Contoh: 28"
            aria-invalid={Boolean(ageError)}
            aria-describedby="profile-age-help"
            className="w-full rounded-xl border border-[#E8DCE3] bg-white px-4 py-3 pr-16 text-[#332A35] outline-none transition focus:border-[#B84E73] focus:ring-2 focus:ring-[#B84E73]/15"
          />

          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#766976]">
            tahun
          </span>
        </div>

        <p
          id="profile-age-help"
          className="text-xs text-[#766976]"
        >
          Masukkan usia antara 1–100 tahun.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="profile-weight"
          className="block text-sm font-bold text-[#332A35]"
        >
          Berat badan
          <span className="ml-1 font-normal text-[#766976]">
            (opsional)
          </span>
        </label>

        <div className="relative">
          <input
            id="profile-weight"
            name="weight"
            type="number"
            min="1"
            max="500"
            step="0.1"
            value={profile.weight ?? ""}
            onChange={handleChange}
            placeholder="Contoh: 58"
            className="w-full rounded-xl border border-[#E8DCE3] bg-white px-4 py-3 pr-14 text-[#332A35] outline-none transition focus:border-[#B84E73] focus:ring-2 focus:ring-[#B84E73]/15"
          />

          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#766976]">
            kg
          </span>
        </div>
      </div>

      <p className="rounded-xl bg-[#F8E8EF] p-3 text-sm leading-relaxed text-[#6F4658]">
        Data ini digunakan sebagai konteks pencatatan,
        bukan untuk menetapkan diagnosis medis.
      </p>
    </section>
  );
}