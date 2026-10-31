import { Suspense } from "react";
import AssessmentContent from "@/components/assessment/AssessmentContent";

export default function HealthTrackerAssessmentPage() {
  return (
    <main className="min-h-screen px-4 py-8">
      <Suspense fallback={<p>Memuat assessment personal...</p>}>
        <AssessmentContent />
      </Suspense>
    </main>
  );
}