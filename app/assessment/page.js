import { Suspense } from "react";
import AssessmentContent from "@/components/assessment/AssessmentContent";

export default function AssessmentPage() {
  return (
    <Suspense fallback={<p>Memuat assessment...</p>}>
      <AssessmentContent />
    </Suspense>
  );
}