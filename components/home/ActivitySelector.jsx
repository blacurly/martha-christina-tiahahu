"use client";

import "./ActivitySelector.css";

import {
  House,
  Sun,
  Activity,
  Footprints,
  Navigation,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const activities = [
  {
    id: "indoor",
    title: "Dalam Ruangan",
    description: "Bekerja, belajar, memasak, atau beraktivitas di rumah.",
    detail: "Kenali kondisi lingkungan di dalam ruangan.",
    icon: House,
    iconClass: "activity-icon-indoor",
  },
  {
    id: "outdoor",
    title: "Luar Ruangan",
    description: "Berjalan kaki, berbelanja, berjualan, atau bekerja di luar.",
    detail: "Perhatikan paparan panas, UV, dan kualitas udara.",
    icon: Sun,
    iconClass: "activity-icon-outdoor",
  },
  {
  id: "moving",
  title: "Berpindah-pindah",
  description: "Sering berpindah tempat di dalam dan luar ruangan. Tidak menetap dalam waktu lama.",
  detail: "Perhatikan paparan lingkungan di setiap lokasi yang dikunjungi.",
  icon: Footprints,
  iconClass: "activity-icon-moving",
},
  {
    id: "travel",
    title: "Perjalanan",
    description: "Bepergian dengan motor, kendaraan umum, atau berjalan kaki.",
    detail: "Kenali paparan lingkungan selama perjalanan.",
    icon: Navigation,
    iconClass: "activity-icon-travel",
  },
];

export default function ActivitySelector({
  activity,
  setActivity,
  onStartCheckin,
}) {
  return (
    <section className="panel activity-panel">
      <div className="activity-header">
        <div className="activity-heading-icon">
          <Sparkles size={23} />
        </div>

        <div className="activity-heading-text">
          <span className="activity-eyebrow">
            LANGKAH PERTAMA
          </span>

          <h2>Kenali Aktivitasmu</h2>

          <p>Apa aktivitas utamamu hari ini?</p>
        </div>
      </div>

      <div className="activity-options">
        {activities.map((item) => {
          const Icon = item.icon;
          const isSelected = activity === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={[
                "activity-option",
                isSelected ? "is-selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setActivity(item.id)}
              aria-pressed={isSelected}
            >
              <div className="activity-option-top">
                <div
                  className={[
                    "activity-option-icon",
                    item.iconClass,
                  ].join(" ")}
                >
                  <Icon size={25} strokeWidth={1.8} />
                </div>

                <span
                  className={[
                    "activity-check",
                    isSelected ? "is-visible" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-hidden="true"
                >
                  <CheckCircle2 size={22} />
                </span>
              </div>

              <div className="activity-option-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              <span className="activity-option-detail">
                {item.detail}
              </span>
            </button>
          );
        })}
      </div>

      <div className="activity-note">
        <Sparkles size={18} />

        <p>
          Pilihanmu membantu SYCLE menyesuaikan informasi
          lingkungan yang relevan untukmu.
        </p>
      </div>

      <button
        type="button"
        className="activity-start-button"
        onClick={onStartCheckin}
        disabled={!activity}
      >
        <span>Yuk, Kenali Kondisimu Hari Ini</span>
        <ArrowRight size={19} />
      </button>

      <p className="activity-disclaimer">
        Informasi bersifat edukatif dan bukan diagnosis medis.
      </p>
    </section>
  );
}