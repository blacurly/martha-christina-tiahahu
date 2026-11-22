"use client";

import Link from "next/link";
import { useState } from "react";
import { BookmarkPlus, LogIn, Sparkles, UserPlus, Lock } from "lucide-react";
import { RESUME_PATH, savePendingCheckIn } from "@/lib/healthtracker/pendingCheckIn";

const INTENT_TEXT = {
  save: {
    title: "Simpan catatanmu dengan akun SYCLE",
    body: "Masuk atau daftar dulu, ya. Setelah itu catatan check-in ini otomatis tersimpan dan bisa kamu lihat lagi di Riwayat.",
  },
  ai: {
    title: "Refleksi AI tersedia untuk Member",
    body: "Masuk atau daftar dulu, ya. Setelah itu SYCLE langsung menyusun Refleksi AI dari catatan check-in ini, berdasarkan sumber kesehatan tepercaya.",
  },
};

// Pilihan di akhir check-in untuk Guest: simpan atau Refleksi AI butuh akun.
// Jawaban ditahan di perangkat (localStorage) agar tidak hilang selama proses login/daftar.
export default function GuestActionsPanel({ draft, onFinish }) {
  const [intent, setIntent] = useState(null);
  const [storageError, setStorageError] = useState("");

  function choose(nextIntent) {
    const ok = savePendingCheckIn({ ...draft, intent: nextIntent });
    setStorageError(
      ok
        ? ""
        : "Perangkat ini tidak mengizinkan penyimpanan sementara, jadi jawabanmu belum bisa dibawa ke halaman masuk/daftar."
    );
    setIntent(nextIntent);
  }

  const next = encodeURIComponent(RESUME_PATH);
  const text = intent ? INTENT_TEXT[intent] : null;

  return (
    <section className="mt-8 border-t border-[#F0E3E9] pt-7">
      <h3 className="text-lg font-bold text-[#332A35]">Mau lanjut ke mana?</h3>
      <p className="mt-1 text-sm leading-6 text-[#746875]">
        Kamu sedang mencoba check-in tanpa akun. Catatan ini belum disimpan dan tidak dikirim ke mana pun.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => choose("save")}
          aria-pressed={intent === "save"}
          className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
            intent === "save"
              ? "border-2 border-[#B84E73] bg-[#FDF2F6]"
              : "border-[#EADDE3] bg-white hover:border-[#D7A3B8]"
          }`}
        >
          <BookmarkPlus size={20} className="mt-0.5 shrink-0 text-[#B84E73]" />
          <span>
            <span className="flex items-center gap-1.5 text-sm font-bold text-[#332A35]">
              Simpan catatan <Lock size={13} className="text-[#A08D9C]" />
            </span>
            <span className="mt-1 block text-xs leading-5 text-[#746875]">
              Simpan ke Riwayat dan unduh PDF kapan saja.
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => choose("ai")}
          aria-pressed={intent === "ai"}
          className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
            intent === "ai"
              ? "border-2 border-[#B84E73] bg-[#FDF2F6]"
              : "border-[#EADDE3] bg-white hover:border-[#D7A3B8]"
          }`}
        >
          <Sparkles size={20} className="mt-0.5 shrink-0 text-[#77649B]" />
          <span>
            <span className="flex items-center gap-1.5 text-sm font-bold text-[#332A35]">
              Refleksi dengan AI <Lock size={13} className="text-[#A08D9C]" />
            </span>
            <span className="mt-1 block text-xs leading-5 text-[#746875]">
              Dirangkum AI dari catatanmu dan sumber kesehatan tepercaya.
            </span>
          </span>
        </button>
      </div>

      {text && (
        <div className="mt-5" role="status">
          <p className="text-sm font-bold text-[#332A35]">{text.title}</p>
          <p className="mt-1 text-sm leading-6 text-[#746875]">{text.body}</p>
          {storageError && (
            <p className="mt-2 rounded-lg bg-[#FCEDEF] px-3 py-2 text-xs leading-5 text-[#9B344D]">
              {storageError}
            </p>
          )}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/signup?next=${next}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B84E73] px-5 py-3 text-sm font-semibold !text-white transition hover:bg-[#8E3E5E]"
            >
              <UserPlus size={17} />
              Daftar akun
            </Link>
            <Link
              href={`/login?next=${next}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#B84E73] bg-white px-5 py-3 text-sm font-semibold text-[#8E3E5E] transition hover:bg-[#FFF8FB]"
            >
              <LogIn size={17} />
              Sudah punya akun? Masuk
            </Link>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onFinish}
        className="mt-5 text-sm font-semibold text-[#8A6578] underline-offset-4 transition hover:text-[#B84E73] hover:underline"
      >
        Selesai tanpa menyimpan
      </button>
    </section>
  );
}
