"use client";

import { useRouter } from "next/navigation";
import { useAssessment } from "@/context/AssessmentContext";

export default function MenyusuiPage() {
  const router = useRouter();
  const { setCondition } = useAssessment();

  function startAssessment() {
    setCondition("Menyusui");
    router.push("/assessment/result");
  }

  return (
    <>
      <section className="hero">
        <div className="eyebrow">Sycle · HEALTH CHECK-IN</div>
        <h1>Assessment Menyusui</h1>
        <p>
          Catat kondisi tubuh, kenyamanan saat menyusui,
          serta konteks lingkungan di sekitarmu.
        </p>
      </section>

      <section className="form-panel">
        <div className="eyebrow">KONDISI YANG DIPILIH</div>
        <h2>Menyusui</h2>
        <p className="muted">
          Pertanyaan selanjutnya akan membantumu mencatat kondisi
          menyusui, gejala, dan kondisi lingkungan secara terstruktur.
        </p>

        <div className="actions">
          <button
            type="button"
            className="btn"
            onClick={() => router.push("/assessment")}
          >
            Kembali
          </button>

          <button
            type="button"
            className="btn primary"
            onClick={startAssessment}
          >
            Lanjutkan
          </button>
        </div>
      </section>

      <p className="muted">
        Informasi bersifat edukatif dan bukan diagnosis medis.
      </p>
    </>
  );
}