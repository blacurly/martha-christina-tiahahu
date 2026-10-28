"use client";

import { Button } from "@/components/ui/button";

export default function FormNavigation({
  currentStep = 0,
  totalSteps = 1,
  onBack,
  onNext,
  onSubmit,
  backLabel = "Kembali",
  nextLabel = "Lanjutkan",
  submitLabel = "Lihat Hasil",
}) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex flex-col-reverse gap-3 border-t border-[#F0E3E9] pt-5 sm:flex-row sm:items-center sm:justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={currentStep === 0}
        className="h-11 rounded-xl border-[#E8DCE3] bg-white px-5 font-extrabold text-[#6F5968] transition-colors duration-200 hover:border-[#E8C4D2] hover:bg-[#F8E8EF] hover:text-[#B84E73] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#E8DCE3] disabled:hover:bg-white disabled:hover:text-[#6F5968]"
      >
        {backLabel}
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          className="h-11 rounded-xl bg-[#B84E73] px-6 font-extrabold text-white shadow-sm transition-colors duration-200 hover:bg-[#8E3E5E]"
        >
          {submitLabel}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          className="h-11 rounded-xl bg-[#B84E73] px-6 font-extrabold text-white shadow-sm transition-colors duration-200 hover:bg-[#8E3E5E]"
        >
          {nextLabel}
        </Button>
      )}
    </div>
  );
}