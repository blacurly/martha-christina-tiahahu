"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Assessment Umum sudah digabung ke check-in Health Tracker (satu pintu untuk Guest dan Member).
// Halaman ini hanya meneruskan tautan lama, termasuk pilihan aktivitas dari Beranda.
export default function AssessmentRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const activity = new URLSearchParams(window.location.search).get("activity");
    router.replace(
      activity
        ? `/healthtracker/assessment?activity=${encodeURIComponent(activity)}`
        : "/healthtracker/assessment"
    );
  }, [router]);

  return (
    <main className="min-h-screen px-4 py-8">
      <p className="text-sm text-[#746875]">Membuka check-in Health Tracker...</p>
    </main>
  );
}
