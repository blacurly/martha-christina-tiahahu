"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/auth/PasswordInput";
import PasswordChecklist from "@/components/auth/PasswordChecklist";
import { isStrongPassword } from "@/lib/auth/passwordRules";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

// Dipakai untuk dua hal: membuat password baru dari tautan email (Lupa Password),
// dan mengubah password saat Member sudah login (dari halaman Profil).
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const linkInvalid = searchParams.get("status") === "link-invalid";

  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setHasSession(Boolean(data?.user));
      setChecking(false);
    });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!isStrongPassword(password)) {
      setError("Password belum memenuhi semua syarat.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password belum cocok.");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(
          updateError.code === "same_password"
            ? "Password baru harus berbeda dari password lama."
            : "Password belum bisa diubah. Silakan coba kembali."
        );
        return;
      }

      setDone(true);
      setTimeout(() => {
        router.push("/profile");
        router.refresh();
      }, 1500);
    } catch {
      setError("Terjadi kendala saat mengubah password. Silakan coba kembali.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-[22px] border border-[#F0E2E9] bg-white p-7 shadow-sm sm:p-9">
        <div className="mb-7 text-center">
          <p className="text-sm font-extrabold uppercase tracking-wider text-[#B84E73]">Keamanan Akun</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[#332A35]">Buat Password Baru</h1>
        </div>

        {checking ? (
          <p className="text-center text-sm text-[#6F6570]">Memeriksa sesi...</p>
        ) : !hasSession ? (
          <div role="alert" className="space-y-4 text-center">
            <p className="rounded-xl bg-[#FCEDEF] p-4 text-sm leading-6 text-[#9B344D]">
              {linkInvalid
                ? "Tautan sudah kedaluwarsa atau tidak valid."
                : "Buka halaman ini dari tautan di email, atau login terlebih dahulu."}
            </p>
            <Link href="/forgot-password" className="inline-block font-extrabold text-[#B84E73] hover:underline">
              Kirim ulang tautan atur ulang password
            </Link>
          </div>
        ) : done ? (
          <p role="status" className="rounded-xl bg-[#E9F2EA] p-4 text-sm leading-6 text-[#426B4A]">
            Password berhasil diubah. Mengarahkan ke Profil...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-bold text-[#332A35]">
                Password baru
              </label>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Buat password yang kuat"
              />
              <PasswordChecklist value={password} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-bold text-[#332A35]">
                Konfirmasi password baru
              </label>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Ulangi password baru"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-[#FCEDEF] px-4 py-3 text-sm leading-6 text-[#9B344D]">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={isLoading} className="w-full">
              {isLoading ? "Menyimpan..." : "Simpan Password Baru"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
