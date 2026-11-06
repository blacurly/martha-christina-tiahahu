"use client";

export default function ConditionScreen({
  options,
  condition,
  onChange,
}) {
  return (
    <>
      <h2 className="text-lg font-bold text-[#332A35]">
        Kondisi yang ingin kamu catat
      </h2>

      <p className="mb-5 mt-2 text-sm text-[#746875]">
        Pilih kondisi yang ingin dipertimbangkan dalam
        check-in ini.
      </p>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={condition === option.value}
            className={`w-full rounded-xl border p-4 text-left text-sm font-medium transition ${
              condition === option.value
                ? "border-[#B84E73] bg-[#F8E8EF] text-[#8E3E5E]"
                : "border-[#EADDE3] bg-white text-[#5F5360] hover:border-[#B84E73]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </>
  );
}