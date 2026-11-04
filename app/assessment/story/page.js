"use client";

import { useRouter } from "next/navigation";

import AssessmentLayout from "@/components/assessment/AssessmentLayout";
import StoryForm from "@/components/healthtracker/StoryForm";
import { Button } from "@/components/ui/button";

export default function AssessmentStoryPage() {
  const router = useRouter();

  return (
    <AssessmentLayout
      step={4}
      title="Ceritakan Pengalamanmu"
      description="Ada cerita lain yang ingin kamu sampaikan? Bagikan jika kamu merasa nyaman."
      onBack={() => router.back()}
      showNavigation={false}
    >
      <StoryForm />

      <div className="mt-6 flex flex-row items-stretch gap-2 border-t border-[#F0E3E9] pt-5 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-auto min-h-11 min-w-0 flex-1 whitespace-normal rounded-xl border-[#E8DCE3] bg-white px-2 py-3 text-xs font-extrabold text-[#6F5968] hover:bg-[#F8E8EF] hover:text-[#B84E73] sm:px-4 sm:text-sm"
        >
          Kembali
        </Button>

        <Button
          type="button"
          onClick={() =>
            router.push("/assessment/result?mode=without-ai")
          }
          className="h-auto min-h-11 min-w-0 flex-1 whitespace-normal rounded-xl bg-[#F8E8EF] px-2 py-3 text-xs font-extrabold text-[#B84E73] hover:bg-[#F2DCE5] sm:px-4 sm:text-sm"
        >
          Lanjut tanpa AI
        </Button>

        <Button
          type="button"
          onClick={() => router.push("/assessment/process")}
          className="h-auto min-h-11 min-w-0 flex-1 whitespace-normal rounded-xl bg-[#B84E73] px-2 py-3 text-xs font-extrabold text-white hover:bg-[#8E3E5E] sm:px-4 sm:text-sm"
        >
          Saya setuju, gunakan AI
        </Button>
      </div>
    </AssessmentLayout>
  );
}