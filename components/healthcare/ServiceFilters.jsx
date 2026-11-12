import {
  Baby,
  BookOpen,
  HeartPulse,
  Hospital,
  Stethoscope,
} from "lucide-react";

const services = [
  { label: "Kesehatan reproduksi", icon: HeartPulse },
  { label: "Kehamilan", icon: Baby },
  { label: "Menstruasi", icon: BookOpen },
  { label: "Menopause", icon: HeartPulse },
  { label: "Puskesmas & klinik", icon: Hospital },
  { label: "Dokter spesialis", icon: Stethoscope },
];

export default function ServiceFilters({
  selected,
  onToggle,
}) {
  return (
    <fieldset className="filterSection">
      <legend className="fieldLabel">
        Kebutuhan kesehatan
      </legend>

      <p className="helperText">
        Pilih satu atau lebih jenis layanan.
      </p>

      <div className="filterList">
        {services.map(({ label, icon: Icon }) => {
          const active = selected.includes(label);

          return (
            <label
              key={label}
              className={`filterOption ${active ? "filterActive" : ""}`}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => onToggle(label)}
              />

              <span className="filterIcon">
                <Icon size={18} />
              </span>

              <span className="filterText">{label}</span>

              <span className="checkIndicator">
                {active ? "✓" : ""}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}