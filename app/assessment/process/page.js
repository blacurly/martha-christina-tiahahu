import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AssessmentProcessPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F8E8EF] text-3xl">
        🌷
      </div>

      <h1 className="text-2xl font-bold text-[#332A35]">
        Menyiapkan Ringkasan Kondisimu
      </h1>

      <p className="mt-3 max-w-xl leading-7 text-[#6B606B]">
        Jawabanmu sedang dipersiapkan untuk membantu menyusun informasi
        dan saran awal yang relevan. SYCLE bukan alat diagnosis medis.
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/assessment">Kembali ke Assessment</Link>
        </Button>

        <Button asChild variant="outline">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    </main>
  );
}