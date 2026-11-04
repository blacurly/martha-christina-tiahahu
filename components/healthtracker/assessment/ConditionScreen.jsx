"use client";

import { CalendarDays, Baby, HandHeart, Check } from "lucide-react";

const conditions = [
  {
    name: "Menstruasi",
    description:
      "Catat kondisi tubuh dan gejala selama menstruasi.",
    icon: CalendarDays,
    tone: "bg-[#F8E8EF]",
    iconColor: "text-[#B84E73]",
  },
  {
    name: "Hamil",
    description:
      "Kenali kondisi tubuh dan paparan lingkungan selama kehamilan.",
    icon: Baby,
    tone: "bg-[#E9F2EA]",
    iconColor: "text-[#557C60]",
  },
  {
    name: "Menyusui",
    description:
      "Catat kondisi tubuh, kenyamanan saat menyusui, dan paparan lingkungan sehari-hari.",
    icon: HandHeart,
    tone: "bg-[#E9F2EA]",
    iconColor: "text-[#557C60]",
  },
];

export default function ConditionScreen({ selected, onSelect }) {
  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-[#332A35]">
          Kondisi kesehatanmu
        </h2>

        <p className="text-sm leading-relaxed text-[#766976]">
          Pilih kondisi yang paling sesuai agar pertanyaan
          berikutnya relevan dengan kebutuhanmu.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {conditions.map((item) => {
          const Icon = item.icon;
          const isSelected = selected === item.name;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => onSelect(item.name)}
              aria-pressed={isSelected}
              className={`relative flex min-h-[190px] flex-col items-start rounded-[20px] border-2 p-5 text-left transition-all duration-200 ${
                isSelected
                  ? "border-[#B84E73] bg-[#FFF8FB] shadow-[0_0_0_3px_rgba(184,78,115,0.10)]"
                  : "border-[#E8DCE3] bg-white hover:border-[#D6A1B5] hover:shadow-[0_5px_20px_rgba(120,70,90,0.06)]"
              }`}
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone} ${item.iconColor}`}
              >
                <Icon size={24} strokeWidth={1.8} />
              </div>

              <h3 className="text-base font-extrabold text-[#332A35]">
                {item.name}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[#766976]">
                {item.description}
              </p>

              <span
                className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border ${
                  isSelected
                    ? "border-[#B84E73] bg-[#B84E73] text-white"
                    : "border-[#E8DCE3] bg-white text-transparent"
                }`}
              >
                <Check size={14} strokeWidth={2.5} />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}