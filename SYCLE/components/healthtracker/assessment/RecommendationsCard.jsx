"use client";

import { Heart, Sparkles } from "lucide-react";
import { getHealthTrackerRecommendations } from "@/lib/healthtracker/recommendations";

// Saran umum berbasis aturan (tanpa AI). Tampil di ringkasan untuk Guest maupun Member.
export default function RecommendationsCard({ condition, answers }) {
  const items = getHealthTrackerRecommendations({ condition, answers });

  return (
    <section className="mt-8 border-t border-[#F0E3E9] pt-7">
      <div className="flex items-center gap-2 text-[#527A59]">
        <Sparkles size={18} />
        <h3 className="text-lg font-bold text-[#332A35]">Saran untukmu hari ini</h3>
      </div>
      <p className="mt-1 text-sm leading-6 text-[#746875]">
        Beberapa hal yang bisa kamu pertimbangkan berdasarkan jawaban check-in dan aktivitasmu.
      </p>

      <ul className="mt-4 divide-y divide-[#F0E3E9]">
        {items.map((item) => (
          <li key={item.key} className="flex gap-3 py-4">
            <Heart
              size={18}
              className={`mt-0.5 shrink-0 ${item.tone === "pink" ? "text-[#B84E73]" : "text-[#527A59]"}`}
            />
            <div>
              <p className="text-sm font-bold text-[#332A35]">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-[#746875]">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-2 text-xs leading-5 text-[#8A7D89]">
        Informasi ini bersifat edukatif. Data lingkungan merupakan konteks untuk membantu
        menyesuaikan aktivitas, bukan alat diagnosis.
      </p>
    </section>
  );
}
