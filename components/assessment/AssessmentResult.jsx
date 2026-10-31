"use client";

import { useAssessment } from "@/context/AssessmentContext";
import { evidence, guidance, symptoms, visibleQuestions } from "@/data/sycle";

function formatAnswer(value) {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "Belum diisi";
  }

  if (value === undefined || value === null || value === "") {
    return "Belum diisi";
  }

  return String(value);
}

export default function AssessmentResult() {
  const {
    condition,
    activity,
    location,
    profile,
    answers,
    scores,
    story,
    notice,
  } = useAssessment();

  const questions = visibleQuestions(condition, answers);
  const conditionSymptoms = symptoms[condition] ?? [];
  const education = evidence[condition];

  const filledAnswers = questions.filter(([question]) => {
    const value = answers[question];

    return (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      (!Array.isArray(value) || value.length > 0)
    );
  });

  const filledSymptoms = conditionSymptoms.filter(
    (symptom) => scores[symptom] !== undefined
  );

  const activityLabel =
    activity === "outdoor"
      ? "Luar ruangan"
      : activity === "indoor"
        ? "Dalam ruangan"
        : activity || "Belum dipilih";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-[#F0E3E9] bg-white p-5 sm:p-6">
        <p className="mb-2 text-xs font-extrabold tracking-[0.14em] text-[#B84E73]">
          RINGKASAN CHECK-IN
        </p>

        <h2 className="text-2xl font-extrabold text-[#332A35]">
          Terima kasih sudah mencatat kondisimu.
        </h2>

        <p className="mt-2 leading-relaxed text-[#6F5968]">
          Ringkasan ini membantu mengorganisasi catatan tubuh,
          aktivitas, dan lingkunganmu. Hasilnya bukan diagnosis
          atau penentuan penyebab gejala.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-[#FFF8FB] p-4">
            <p className="text-sm text-[#806D7B]">Kondisi</p>
            <p className="mt-1 font-extrabold text-[#332A35]">
              {condition || "Belum dipilih"}
            </p>
          </div>

          <div className="rounded-xl bg-[#FFF8FB] p-4">
            <p className="text-sm text-[#806D7B]">Aktivitas</p>
            <p className="mt-1 font-extrabold text-[#332A35]">
              {activityLabel}
            </p>
          </div>

          <div className="rounded-xl bg-[#FFF8FB] p-4">
            <p className="text-sm text-[#806D7B]">Lokasi</p>
            <p className="mt-1 font-extrabold text-[#332A35]">
              {location || "Belum dipilih"}
            </p>
          </div>

          <div className="rounded-xl bg-[#FFF8FB] p-4">
            <p className="text-sm text-[#806D7B]">Profil</p>
            <p className="mt-1 font-extrabold text-[#332A35]">
              {profile.name || "Pengguna"}
            </p>
            <p className="mt-1 text-sm text-[#6F5968]">
              Usia {profile.age || "Belum diisi"} tahun
              {profile.weight ? ` · ${profile.weight} kg` : ""}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#F0E3E9] bg-white p-5 sm:p-6">
        <p className="mb-2 text-xs font-extrabold tracking-[0.14em] text-[#B84E73]">
          JAWABAN CHECK-IN
        </p>

        <h3 className="text-lg font-extrabold text-[#332A35]">
          Catatan kondisimu
        </h3>

        {filledAnswers.length > 0 ? (
          <dl className="mt-4 space-y-4">
            {filledAnswers.map(([question]) => (
              <div
                key={question}
                className="border-b border-[#F4EAF0] pb-3 last:border-0 last:pb-0"
              >
                <dt className="text-sm leading-relaxed text-[#806D7B]">
                  {question}
                </dt>
                <dd className="mt-1 font-bold text-[#332A35]">
                  {formatAnswer(answers[question])}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-[#806D7B]">
            Belum ada jawaban yang dapat ditampilkan.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-[#F0E3E9] bg-white p-5 sm:p-6">
        <p className="mb-2 text-xs font-extrabold tracking-[0.14em] text-[#B84E73]">
          GEJALA HARI INI
        </p>

        <h3 className="text-lg font-extrabold text-[#332A35]">
          Apa yang kamu rasakan?
        </h3>

        {filledSymptoms.length > 0 ? (
          <div className="mt-4 space-y-3">
            {filledSymptoms.map((symptom) => (
              <div
                key={symptom}
                className="flex items-center justify-between gap-4 rounded-xl bg-[#FFF8FB] p-3"
              >
                <span className="text-sm font-semibold text-[#514451]">
                  {symptom}
                </span>

                <span className="shrink-0 rounded-full bg-[#F8E8EF] px-3 py-1 text-sm font-extrabold text-[#8E3E5E]">
                  Skala {scores[symptom]}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-[#806D7B]">
            Belum ada skala gejala yang tercatat. Bagian ini akan
            menampilkan gejala setelah kamu mengisinya.
          </p>
        )}

        {story?.trim() ? (
          <div className="mt-5 rounded-xl bg-[#F8E8EF] p-4">
            <p className="text-sm font-extrabold text-[#8E3E5E]">
              Ceritamu
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#514451]">
              {story}
            </p>
          </div>
        ) : null}
      </section>

      {education && (
        <section className="rounded-2xl border border-[#D7E6D9] bg-[#E9F2EA] p-5 sm:p-6">
          <p className="mb-2 text-xs font-extrabold tracking-[0.14em] text-[#477253]">
            MEMAHAMI KONDISI
          </p>

          <h3 className="text-lg font-extrabold text-[#332A35]">
            {condition} dan konteks lingkungan
          </h3>

          <p className="mt-3 leading-relaxed text-[#514451]">
            {education.text}
          </p>

          <a
            href={education.url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex font-extrabold text-[#477253] underline underline-offset-4"
          >
            Baca sumber: {education.source}
          </a>
        </section>
      )}

      <section className="rounded-2xl border border-[#E8E1F3] bg-[#F7F4FC] p-5 sm:p-6">
        <p className="mb-2 text-xs font-extrabold tracking-[0.14em] text-[#76639A]">
          LANGKAH PRAKTIS
        </p>

        <h3 className="text-lg font-extrabold text-[#332A35]">
          Jaga kenyamanan saat beraktivitas
        </h3>

        <div className="mt-4 space-y-4">
          {guidance.map(([title, description, source]) => (
            <div key={title} className="flex gap-3">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white font-extrabold text-[#76639A]"
              >
                ✓
              </span>

              <div>
                <p className="font-extrabold text-[#332A35]">
                  {title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[#6F5968]">
                  {description}
                </p>
                <p className="mt-1 text-xs text-[#806D7B]">
                  {source}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {notice && (
        <p
          role="status"
          className="rounded-xl border border-[#D7E6D9] bg-[#E9F2EA] p-4 text-sm font-semibold text-[#477253]"
        >
          {notice}
        </p>
      )}

      <p className="text-sm leading-relaxed text-[#806D7B]">
        Jika kamu mengalami gejala berat, memburuk, atau
        mengkhawatirkan, cari bantuan tenaga kesehatan. Ringkasan
        ini tidak menggantikan pemeriksaan medis.
      </p>
    </div>
  );
}