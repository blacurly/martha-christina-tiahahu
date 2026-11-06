"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAssessment } from "@/context/AssessmentContext";

export default function StartHealthTrackerButton() {
  const router = useRouter();
  const { startNewHealthTrackerCheckIn } = useAssessment();

  function handleStart() {
    startNewHealthTrackerCheckIn();
    router.push("/healthtracker/assessment");
  }

  return (
    <Button
      onClick={handleStart}
      variant="default"
      size="lg"
      className="mt-6 h-12 rounded-full border-transparent !bg-[#B84E73] !text-white px-7 text-sm font-extrabold hover:!bg-[#8E3E5E]"
    >
      <span>+</span>
      Mulai Daily Check-In
    </Button>
  );
}