"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveProfile } from "@/app/profile/actions";

export function ProfileForm({ displayName = "" }) {
  const router = useRouter();
  const [name, setName] = useState(displayName);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const normalizedName = name.trim();

    if (!normalizedName || normalizedName.length > 60) {
      setMessage("Nama harus terdiri dari 1–60 karakter.");
      return;
    }

    startTransition(async () => {
      const result = await saveProfile(normalizedName);

      if (!result?.ok) {
        setMessage(
          result?.message || "Nama profil gagal diperbarui."
        );
        return;
      }

      setName(result.displayName);
      setMessage("Nama profil berhasil diperbarui.");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="display-name"
          className="text-sm font-semibold text-[#332A35]"
        >
          Nama tampilan
        </label>

        <Input
          id="display-name"
          name="displayName"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={60}
          required
          disabled={isPending}
          placeholder="Masukkan nama tampilan"
        />

        <p className="text-xs text-[#8A7D89]">
          Nama akan ditampilkan pada Navbar dan halaman profil.
        </p>
      </div>

      {message && (
        <p
          role="status"
          className="text-sm text-[#8E3E5E]"
        >
          {message}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending || !name.trim()}
        className="bg-[#B84E73] text-white hover:bg-[#8E3E5E]"
      >
        {isPending ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  );
}