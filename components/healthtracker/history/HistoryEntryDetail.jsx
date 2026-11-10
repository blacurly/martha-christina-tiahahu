"use client";

import { useCallback, useEffect, useState } from "react";
import {
  X,
  LoaderCircle,
  MapPin,
  Clock3,
  Heart,
  Footprints,
  MessageCircle,
  CloudSun,
  AlertCircle,
} from "lucide-react";

import { getTrackerHistoryDetail } from "@/app/healthtracker/history/actions";
import {
  HEALTH_TRACKER_QUESTIONS,
  HEALTH_TRACKER_SCALE,
} from "@/data/healthTrackerQuestions";

const CONDITION_LABELS = {
  menstruasi: "Menstruasi",
  kehamilan: "Hamil",
  menyusui: "Menyusui",
  lewati: "Catatan umum",
};

const GENERAL_QUESTIONS = ["HT-01", "HT-02", "HT-04", "HT-05"];

const CONDITION_QUESTIONS = {
  menstruasi: ["HM-01", "HM-02", "HM-03", "HM-04", "HM-05", "HM-06"],
  kehamilan: ["HK-01"],
  menyusui: ["HS-01", "HS-02", "HS-03", "HS-04"],
  lewati: [],
};

function hasValue(value) {
  return value !== null && value !== undefined && value !== "";
}

// Mengubah nilai menjadi teks yang aman ditampilkan oleh React.
function safeText(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "Ya" : "Tidak";
  }

  if (Array.isArray(value)) {
    return value.map(safeText).filter(Boolean).join(", ");
  }

  if (typeof value === "object") {
    return (
      safeText(
        value.name ??
        value.label ??
        value.value ??
        value.status ??
        value.detail
      ) || ""
    );
  }

  return "";
}

function getQuestion(code) {
  return HEALTH_TRACKER_QUESTIONS?.[code] ?? null;
}

function getQuestionLabel(code) {
  return getQuestion(code)?.question ?? "Informasi Check-In";
}

function getOptionLabel(code, value) {
  if (!hasValue(value)) return "";

  const question = getQuestion(code);

  const option = question?.options?.find(
    (item) => String(item.value) === String(value)
  );

  return option?.label ?? safeText(value).replaceAll("_", " ");
}

function getScaleLabel(value) {
  if (!hasValue(value)) return "";

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return safeText(value);
  }

  if (Array.isArray(HEALTH_TRACKER_SCALE)) {
    const scaleItem = HEALTH_TRACKER_SCALE.find((item, index) => {
      if (typeof item === "string") {
        return index === numericValue;
      }

      return (
        Number(item?.value) === numericValue ||
        index === numericValue
      );
    });

    if (typeof scaleItem === "string") {
      return scaleItem;
    }

    if (scaleItem?.label) {
      return safeText(scaleItem.label);
    }
  }

  if (
    HEALTH_TRACKER_SCALE &&
    !Array.isArray(HEALTH_TRACKER_SCALE)
  ) {
    const scaleItem = HEALTH_TRACKER_SCALE[numericValue];

    if (typeof scaleItem === "string") {
      return scaleItem;
    }

    if (scaleItem?.label) {
      return safeText(scaleItem.label);
    }
  }

  return String(value);
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderInlineMarkdown(text) {
  const parts = [];
  const pattern =
    /(\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\*\*(.+?)\*\*)/g;

  let lastIndex = 0;
  let match;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      parts.push(
        <a
          key={index++}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#B84E73] underline underline-offset-2"
        >
          {match[2]}
        </a>
      );
    } else if (match[4]) {
      parts.push(
        <strong key={index++} className="font-bold text-[#332A35]">
          {match[4]}
        </strong>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function AiReflectionSection({ content }) {
  const reflection =
    typeof content === "string" ? content.trim() : "";

  const lines = reflection.split(/\r?\n/);

  return (
    <section className="rounded-2xl border border-[#EAD9F0] bg-[#FAF7FC] p-4 sm:p-5">
      <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#76558A]">
        <MessageCircle size={18} />
        Refleksi AI SYCLE
      </h3>

      {reflection ? (
        <div className="mt-4 space-y-3 text-sm leading-7 text-[#5F5660]">
          {lines.map((line, index) => {
            const trimmed = line.trim();

            if (!trimmed) return <div key={index} className="h-1" />;

            if (trimmed.startsWith("## ")) {
              return (
                <h4
                  key={index}
                  className="pt-2 text-sm font-extrabold text-[#76558A]"
                >
                  {renderInlineMarkdown(trimmed.slice(3))}
                </h4>
              );
            }

            if (trimmed.startsWith("### ")) {
              return (
                <h5
                  key={index}
                  className="font-bold text-[#76558A]"
                >
                  {renderInlineMarkdown(trimmed.slice(4))}
                </h5>
              );
            }

            if (/^[-*]\s+/.test(trimmed)) {
              return (
                <ul key={index} className="list-disc pl-5">
                  <li>{renderInlineMarkdown(trimmed.replace(/^[-*]\s+/, ""))}</li>
                </ul>
              );
            }

            return (
              <p key={index}>
                {renderInlineMarkdown(trimmed)}
              </p>
            );
          })}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 text-[#817582]">
          Tidak ada refleksi AI pada catatan ini.
        </p>
      )}
    </section>
  );
}

function formatIndicatorName(value) {
  return String(value)
    .replaceAll("_", " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function AnswerRow({ item }) {
  const code = item.code_question;
  const answer = item.answer;
  const scale = item.scale;

  const answerLabel = getOptionLabel(code, answer);
  const scaleLabel = getScaleLabel(scale);

  if (!hasValue(answer) && !hasValue(scale)) {
    return null;
  }

  return (
    <div className="rounded-xl bg-[#F8F5F8] p-3.5">
      <p className="text-xs leading-5 text-[#8A7D89]">
        {getQuestionLabel(code)}
      </p>

      {hasValue(answer) && (
        <p className="mt-1 text-sm font-semibold leading-6 text-[#332A35]">
          {answerLabel}
        </p>
      )}

      {hasValue(scale) && (
        <p className="mt-1 text-xs text-[#8A7D89]">
          Skala:{" "}
          <span className="font-semibold text-[#B84E73]">
            {scaleLabel}
          </span>
        </p>
      )}
    </div>
  );
}

function AnswerSection({ record, answers = [] }) {
  const condition = record?.context;

  const generalAnswers = answers.filter((item) =>
    GENERAL_QUESTIONS.includes(item.code_question)
  );

  const conditionCodes = CONDITION_QUESTIONS[condition] ?? [];

  const conditionAnswers = answers.filter((item) =>
    conditionCodes.includes(item.code_question)
  );

  return (
    <div className="space-y-5">
      <section>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[#332A35]">
          <Heart size={17} className="text-[#B84E73]" />
          Pertanyaan umum
        </h3>

        {generalAnswers.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {generalAnswers.map((item, index) => (
              <AnswerRow
                key={`${item.code_question}-${index}`}
                item={item}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-[#F8F5F8] p-3.5 text-sm text-[#817582]">
            Pertanyaan umum dilewati.
          </p>
        )}
      </section>

      {condition !== "lewati" && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[#332A35]">
            <Footprints size={17} className="text-[#B84E73]" />
            Pertanyaan lanjutan
          </h3>

          {conditionAnswers.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {conditionAnswers.map((item, index) => (
                <AnswerRow
                  key={`${item.code_question}-${index}`}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-[#F8F5F8] p-3.5 text-sm text-[#817582]">
              Pertanyaan lanjutan dilewati.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

// Mengambil nilai indikator tanpa merender object langsung.
function getIndicatorValue(item) {
  if (!item || typeof item !== "object") {
    return safeText(item);
  }

  const value =
    item.value ??
    item.label ??
    item.status ??
    item.temperature ??
    item.aqi ??
    item.pm25 ??
    item.humidity ??
    item.uv;

  return safeText(value);
}

function getIndicatorUnit(item) {
  if (!item || typeof item !== "object") return "";

  return safeText(item.unit);
}

function getIndicatorSource(item) {
  if (!item || typeof item !== "object") return "";

  const source = item.source;

  if (!source) return "";

  if (typeof source === "string") {
    return source;
  }

  return safeText(
    source.name ??
    source.label ??
    source.detail
  );
}

function EnvironmentSection({ snapshot }) {
  if (!snapshot) {
    return (
      <section className="rounded-2xl border border-dashed border-[#E8DCE3] p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#6F6570]">
          <CloudSun size={18} className="text-[#B84E73]" />
          Konteks lingkungan
        </div>

        <p className="mt-2 text-sm text-[#817582]">
          Tidak ada snapshot lingkungan yang tersimpan untuk Check-In ini.
        </p>
      </section>
    );
  }

  const indicators = snapshot.indicators;

  const indicatorEntries = Array.isArray(indicators)
    ? indicators.map((item, index) => [
        item?.name ?? item?.key ?? `Indikator ${index + 1}`,
        item,
      ])
    : Object.entries(
        indicators && typeof indicators === "object"
          ? indicators
          : {}
      );

  const validIndicators = indicatorEntries.filter(
    ([, item]) => hasValue(getIndicatorValue(item))
  );

  return (
    <section className="rounded-2xl border border-[#E9F2EA] bg-[#F7FAF7] p-4 sm:p-5">
      <div className="flex items-center gap-2 text-sm font-extrabold text-[#52745A]">
        <CloudSun size={18} />
        Konteks lingkungan
      </div>

      <div className="mt-3 flex items-start gap-2">
        <MapPin
          size={16}
          className="mt-0.5 shrink-0 text-[#66836B]"
        />

        <div>
          <p className="text-xs text-[#7B897D]">Lokasi</p>

          <p className="mt-0.5 text-sm font-semibold text-[#435A47]">
            {safeText(snapshot.location_label) || "Lokasi tidak tersedia"}
          </p>
        </div>
      </div>

      {snapshot.captured_at && (
        <div className="mt-3 flex items-start gap-2">
          <Clock3
            size={16}
            className="mt-0.5 shrink-0 text-[#66836B]"
          />

          <div>
            <p className="text-xs text-[#7B897D]">
              Waktu pengambilan data
            </p>

            <p className="mt-0.5 text-sm text-[#435A47]">
              {formatDate(snapshot.captured_at)}
            </p>
          </div>
        </div>
      )}

      {validIndicators.length > 0 ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {validIndicators.map(([key, item], index) => {
            const value = getIndicatorValue(item);
            const unit = getIndicatorUnit(item);
            const source = getIndicatorSource(item);

            return (
              <div
                key={`${key}-${index}`}
                className="rounded-xl border border-[#E5EEE6] bg-white p-3"
              >
                <p className="text-xs text-[#7B897D]">
                  {formatIndicatorName(key)}
                </p>

                <p className="mt-1 text-sm font-bold text-[#435A47]">
                  {value}
                  {unit ? ` ${unit}` : ""}
                </p>

                {source && (
                  <p className="mt-1 text-[11px] text-[#8A978C]">
                    Sumber: {source}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 rounded-xl bg-white p-3 text-sm text-[#718174]">
          Data indikator lingkungan belum tersedia.
        </p>
      )}

      <p className="mt-4 text-xs leading-5 text-[#718174]">
        Informasi lingkungan merupakan konteks pendukung untuk memahami
        pengalaman harian, bukan diagnosis medis.
      </p>
    </section>
  );
}

export default function HistoryEntryDetail({
  recordId,
  open,
  onClose,
}) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDetail = useCallback(async () => {
    if (!recordId) return;

    try {
      setLoading(true);
      setError("");
      setDetail(null);

      const result = await getTrackerHistoryDetail(recordId);

      if (!result?.ok) {
        setError(result?.message || "Detail catatan gagal dimuat.");
        return;
      }

      setDetail(result);
    } catch (error) {
      console.error("Gagal memuat detail riwayat:", error);
      setError("Terjadi kesalahan saat memuat detail catatan.");
    } finally {
      setLoading(false);
    }
  }, [recordId]);

  useEffect(() => {
    if (!open || !recordId) return;

    let cancelled = false;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");
        setDetail(null);

        const result = await getTrackerHistoryDetail(recordId);

        if (cancelled) return;

        if (!result?.ok) {
          setError(result?.message || "Detail catatan gagal dimuat.");
          return;
        }

        setDetail(result);
      } catch (error) {
        if (cancelled) return;

        console.error("Gagal memuat detail riwayat:", error);
        setError("Terjadi kesalahan saat memuat detail catatan.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      cancelled = true;
    };
  }, [open, recordId]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-[#332A35]/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-detail-title"
        className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[26px] bg-[#FFF8FB] shadow-2xl sm:rounded-[26px]"
      >
        <header className="flex items-center justify-between gap-3 border-b border-[#F0DFE7] bg-white px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-bold text-[#B84E73]">
              Health Tracker
            </p>

            <h2
              id="history-detail-title"
              className="mt-1 text-lg font-extrabold text-[#332A35]"
            >
              Detail Check-In
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8E8EF] text-[#B84E73] transition hover:bg-[#F1DCE5]"
          >
            <X size={19} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-[#8A6578]">
              <LoaderCircle
                size={28}
                className="animate-spin"
              />

              <p className="text-sm">
                Memuat detail Check-In...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-[#F0D6A8] bg-[#FFF4E5] p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#7A4B00]">
                <AlertCircle size={18} />
                Detail belum tersedia
              </div>

              <p className="mt-2 text-sm leading-6 text-[#7A4B00]">
                {error}
              </p>

              <button
                type="button"
                onClick={loadDetail}
                className="mt-3 rounded-full bg-[#B84E73] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#8E3E5E]"
              >
                Coba lagi
              </button>
            </div>
          )}

          {!loading && detail && (
            <div className="space-y-6">
              <section className="rounded-2xl border border-[#F0DFE7] bg-white p-4">
                <span className="rounded-full bg-[#F8E8EF] px-3 py-1.5 text-xs font-bold text-[#B84E73]">
                  {CONDITION_LABELS[detail.record.context] ??
                    detail.record.context ??
                    "Catatan umum"}
                </span>

                <p className="mt-3 text-xs text-[#8A7D89]">
                  Waktu Check-In
                </p>

                <p className="mt-1 text-sm font-semibold text-[#332A35]">
                  {formatDate(detail.record.recorded_at)}
                </p>
              </section>

              <AnswerSection
                record={detail.record}
                answers={detail.answers ?? []}
              />

              {detail.record.story && (
                <section className="rounded-2xl border border-[#E9F2EA] bg-[#F7FAF7] p-4 sm:p-5">
                  <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#52745A]">
                    <MessageCircle size={17} />
                    Cerita harian
                  </h3>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#5F5660]">
                    {detail.record.story}
                  </p>
                </section>
              )}

              <EnvironmentSection snapshot={detail.snapshot} />

               <AiReflectionSection
                content={detail.record.refleksi_ai}
              />

              {detail.snapshotWarning && (
                <p className="text-xs text-[#8A7D89]">
                  {detail.snapshotWarning}
                </p>
              )}
            </div>
          )}
        </div>

        <footer className="border-t border-[#F0DFE7] bg-white px-5 py-3 text-right sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#E8C9D5] px-5 py-2.5 text-xs font-bold text-[#B84E73] transition hover:bg-[#FFF8FB]"
          >
            Tutup
          </button>
        </footer>
      </section>
    </div>
  );
}