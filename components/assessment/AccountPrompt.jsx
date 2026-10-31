import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

// Muncul saat Guest menekan Simpan Catatan: catatan hanya bisa disimpan dengan akun Member.
export default function AccountPrompt({ next = "/assessment/result" }) {
  const target = encodeURIComponent(next);

  return (
    <section
      role="alert"
      className="mt-6 rounded-2xl border border-[#E8C4D2] bg-[#F8E8EF] p-5"
    >
      <h3 className="text-lg font-extrabold text-[#332A35]">
        Simpan catatan dengan akun SYCLE
      </h3>
      <p className="mt-2 text-sm leading-6 text-[#6F6570]">
        Catatan Health Tracker hanya bisa disimpan oleh Member agar riwayatnya tetap
        pribadi dan bisa kamu buka kembali. Jawabanmu tetap ada setelah kamu masuk.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/login?next=${target}`}
          className="inline-flex items-center gap-2 rounded-full bg-[#B84E73] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#8E3E5E]"
        >
          <LogIn size={16} />
          Masuk
        </Link>
        <Link
          href={`/signup?next=${target}`}
          className="inline-flex items-center gap-2 rounded-full border border-[#B84E73] bg-white px-5 py-2.5 text-sm font-extrabold text-[#8E3E5E] hover:bg-[#FFF8FB]"
        >
          <UserPlus size={16} />
          Buat akun
        </Link>
      </div>
    </section>
  );
}
