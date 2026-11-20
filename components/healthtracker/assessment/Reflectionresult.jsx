import {
  BookOpen,
  CheckCircle2,
  CloudSun,
  ExternalLink,
  HeartPulse,
  Info,
  Lightbulb,
} from "lucide-react";

/* ---------- Helpers ---------- */

// Render **bold** dan *italic* sederhana (tanpa dependency tambahan)
function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
      return (
        <em key={i} className="italic text-slate-700">
          {part.slice(1, -1)}
        </em>
      );
    return part;
  });
}

// Pecah markdown berdasarkan heading "## "
function parseSections(md) {
  return md
    .split(/^##\s+/m)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [title, ...rest] = chunk.split("\n");
      return { title: title.trim(), body: rest.join("\n").trim() };
    });
}

function parseBullets(body) {
  return body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^[-*]\s+/.test(l))
    .map((l) => l.replace(/^[-*]\s+/, ""));
}

/* ---------- Small UI pieces ---------- */

const headingTones = {
  rose: "text-[#B84E73]",
  sky: "text-[#4789B2]",
  amber: "text-[#B0631F]",
  violet: "text-[#77649B]",
  slate: "text-[#8A7D89]",
};

function SectionHeading({ icon: Icon, children, tone = "rose" }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon className={`h-[18px] w-[18px] shrink-0 ${headingTones[tone]}`} />
      <h3 className="text-base font-bold text-[#332A35]">{children}</h3>
    </div>
  );
}

/* ---------- Main component ---------- */

export default function ReflectionResult({ data }) {
  const sections = parseSections(data?.answer ?? "");
  const find = (kw) => sections.find((s) => s.title.toLowerCase().includes(kw));

  // Format baru: "Gambaran kondisi hari ini" dan "Konteks lingkungan".
  // Format lama: "Ringkasan catatanmu" dan "Kondisi iklim saat pencatatan".
  const ringkasan = find("gambaran") ?? find("ringkasan");
  const iklim = find("lingkungan") ?? find("iklim");
  const saran = find("saran");
  // Judul "CATATAN" harus persis; find("catatan") juga cocok dengan
  // "Ringkasan catatanmu" sehingga ringkasan tampil dua kali.
  const catatan = sections.find(
    (s) => s.title.trim().toLowerCase() === "catatan",
  );

  // Section yang tidak dikenali tetap ditampilkan (kecuali "Referensi",
  // karena sudah ditampilkan lewat data.sources)
  const known = [ringkasan, iklim, saran, catatan];
  const others = sections.filter(
    (s) => !known.includes(s) && !s.title.toLowerCase().includes("referensi"),
  );

  const tips = saran ? parseBullets(saran.body) : [];

  return (
    <div className="divide-y divide-[#F0E3E9] [&>section]:py-5 [&>section:first-child]:pt-0 [&>section:last-child]:pb-0">
      {/* Gambaran kondisi hari ini */}
      {ringkasan && (
        <section>
          <SectionHeading icon={HeartPulse} tone="rose">
            {ringkasan.title}
          </SectionHeading>
          <p className="text-sm leading-relaxed text-[#5F5360]">
            {renderInline(ringkasan.body)}
          </p>
        </section>
      )}

      {/* Konteks lingkungan */}
      {iklim && (
        <section>
          <SectionHeading icon={CloudSun} tone="sky">
            {iklim.title}
          </SectionHeading>
          <p className="text-sm leading-relaxed text-[#5F5360]">
            {renderInline(iklim.body)}
          </p>
        </section>
      )}

      {/* Saran */}
      {saran && (
        <section>
          <SectionHeading icon={Lightbulb} tone="amber">
            {saran.title}
          </SectionHeading>
          <ul className="space-y-3">
            {tips.map((tip, i) => {
              const m = tip.match(/\s*\(([^)]+)\)\s*$/);
              const text = m ? tip.replace(m[0], "") : tip;
              return (
                <li
                  key={i}
                  className="flex gap-3"
                >
                  <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#527A59]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-relaxed text-[#5F5360]">
                      {renderInline(text)}
                    </p>
                    {m && (
                      <span className="mt-1 inline-block text-[11px] font-medium text-[#8A7D89]">
                        {m[1]}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Section lain yang tidak dikenali */}
      {others.map((s) => (
        <section key={s.title}>
          <SectionHeading icon={Info} tone="slate">
            {s.title}
          </SectionHeading>
          <p className="whitespace-pre-line text-sm leading-relaxed text-[#5F5360]">
            {renderInline(s.body)}
          </p>
        </section>
      ))}

      {/* Sumber */}
      {data?.sources?.length > 0 && (
        <section>
          <SectionHeading icon={BookOpen} tone="violet">
            Sumber rujukan
          </SectionHeading>
          <ul className="space-y-3">
            {data.sources.map((src) => (
              <li key={src.n}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3"
                >
                  <span className="w-5 shrink-0 pt-0.5 text-xs font-bold text-[#77649B]">
                    {src.n}.
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug text-[#332A35] group-hover:text-[#B84E73] group-hover:underline">
                      {src.title}
                    </p>
                    <p className="mt-0.5 text-xs text-[#8A7D89]">
                      {src.publisher}
                      {src.page ? ` · Hal. ${src.page}` : ""}
                    </p>
                  </div>
                  <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-[#A08D9C] group-hover:text-[#B84E73]" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Artikel terkait */}
      {data?.relatedArticles?.length > 0 && (
        <section>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#8A7D89]">
            Bacaan terkait
          </h3>
          <div className="space-y-3">
            {data.relatedArticles.map((a) => (
              <a
                key={a.url}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-3"
              >
                <span>
                  <span className="block text-sm font-semibold leading-snug text-[#332A35] group-hover:text-[#B84E73] group-hover:underline">
                    {a.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-[#8A7D89]">{a.publisher}</span>
                </span>
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-[#A08D9C] group-hover:text-[#B84E73]" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Catatan / disclaimer dari AI tidak ditampilkan: sudah diwakili
          kotak "Catatan Penting" di bawah hasil refleksi. */}
    </div>
  );
}