import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { ArrowLeft, UserRoundPen } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/repositories/profileRepository";

import { ProfileDetailsForm } from "@/components/auth/ProfileDetailsForm";

export const metadata = {
  title: "Lengkapi Profil | SYCLE",
};

async function CompleteProfileContent() {
  await connection();

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const profileResult = await getProfile(supabase, user.id);

  const profile = profileResult.profile ?? {};

  const completedFields = [
    profile.full_name,
    profile.birth_date,
    profile.domicile,
    profile.occupation,
  ].filter(Boolean).length;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      {/* Kembali */}
      <Link
        href="/profile"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#8E3E5E] transition-colors hover:text-[#B84E73]"
      >
        <ArrowLeft size={18} />
        Kembali ke Profil
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#F8E8EF] text-[#B84E73]">
          <UserRoundPen size={28} />
        </div>

        <p className="text-sm font-extrabold uppercase tracking-wider text-[#B84E73]">
          Informasi Pribadi
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-[#332A35]">
          Lengkapi Profil
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-[#6F6570]">
          Lengkapi informasi dasar agar SYCLE dapat memberikan
          pengalaman yang lebih personal. Kamu dapat memperbarui
          informasi ini kapan saja.
        </p>
      </header>

      {/* Progress */}
      <section className="mb-6 rounded-[22px] border border-[#F0E5EB] bg-white p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-extrabold text-[#332A35]">
            Kelengkapan Profil
          </h2>

          <span className="text-sm font-bold text-[#8E3E5E]">
            {completedFields}/4
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[#F0E5EB]">
          <div
            className="h-full rounded-full bg-[#B84E73] transition-all"
            style={{
              width: `${(completedFields / 4) * 100}%`,
            }}
          />
        </div>

        <p className="mt-3 text-xs text-[#8A7D89]">
          {completedFields === 4
            ? "Informasi profil sudah lengkap."
            : "Masih ada informasi yang dapat kamu lengkapi."}
        </p>
      </section>

      {/* Form */}
      <section className="rounded-[22px] border border-[#F0E5EB] bg-white p-6 sm:p-8">
        <h2 className="mb-2 text-lg font-extrabold text-[#332A35]">
          Informasi Dasar
        </h2>

        <p className="mb-6 text-sm leading-6 text-[#6F6570]">
          Isi informasi berikut sesuai dengan kondisimu.
          Kolom dapat dibiarkan kosong jika belum ingin mengisinya.
        </p>

        {profileResult.missingTable ? (
          <p className="text-sm text-[#8E3E5E]">
            Tabel profil belum tersedia. Periksa kembali migration
            Supabase.
          </p>
        ) : !profileResult.ok ? (
          <p className="text-sm text-[#8E3E5E]">
            Informasi profil belum dapat dimuat. Silakan coba kembali.
          </p>
        ) : (
          <ProfileDetailsForm profile={profile} />
        )}
      </section>
    </main>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
          <p className="text-sm text-[#6F6570]">
            Memuat informasi profil...
          </p>
        </main>
      }
    >
      <CompleteProfileContent />
    </Suspense>
  );
}