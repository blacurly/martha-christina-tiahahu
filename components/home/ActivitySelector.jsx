
"use client";

import "./ActivitySelector.css";

const activities = [
  {
    id: "indoor",
    title: "Dalam Ruangan",
    description: "Bekerja, belajar, memasak, atau beraktivitas di rumah.",
    image: "/images/activities/activity-indoor.png",
    imageAlt: "Ilustrasi perempuan bekerja di dalam ruangan",
  },
  {
    id: "outdoor",
    title: "Luar Ruangan",
    description: "Berjalan kaki, berbelanja, berjualan, atau bekerja di luar.",
    image: "/images/activities/activity-outdoor.png",
    imageAlt: "Ilustrasi perempuan beraktivitas di luar ruangan",
  },
  {
    id: "moving",
    title: "Berpindah-pindah",
    description:
      "Sering berpindah tempat di dalam dan luar ruangan. Tidak menetap dalam waktu lama.",
    image: "/images/activities/activity-moving.png",
    imageAlt: "Ilustrasi perempuan berpindah antara ruangan dan luar",
  },
  {
    id: "travel",
    title: "Perjalanan",
    description:
      "Bepergian dengan motor, kendaraan umum, atau berjalan kaki.",
    image: "/images/activities/activity-travel.png",
    imageAlt: "Ilustrasi perempuan melakukan perjalanan",
  },
];

export default function ActivitySelector({
  activity,
  setActivity,
  onStartCheckin,
}) {
  const canContinue = Boolean(activity);

  return (
    <section className="panel activity-panel">
      <div className="activity-header">
        <div className="activity-heading-text">
          <span className="activity-eyebrow">
            LANGKAH PERTAMA
          </span>

          <h2>Kenali Aktivitasmu</h2>
        </div>
      </div>

      <div className="activity-options">
        {activities.map((item) => {
          const isSelected = activity === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`activity-option ${
                isSelected ? "is-selected" : ""
              }`}
              onClick={() => setActivity(item.id)}
              aria-pressed={isSelected}
            >
              <div className="activity-image-wrapper">
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  className="activity-option-image"
                  loading="lazy"
                />
              </div>

              <div className="activity-option-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="activity-note">
        <p>
          Pilihanmu membantu Sycle menyesuaikan informasi
          lingkungan yang relevan untukmu.
        </p>
      </div>

      <button
        type="button"
        className="activity-start-button"
        onClick={onStartCheckin}
        disabled={!canContinue}
      >
        <span>Yuk, Kenali Kondisimu Hari Ini</span>
      </button>

      <p className="activity-disclaimer">
        Informasi bersifat edukatif dan bukan diagnosis medis.
      </p>
    </section>
  );
}