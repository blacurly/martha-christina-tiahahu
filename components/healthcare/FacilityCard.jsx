
import {
  ExternalLink,
  Hospital,
  MapPin,
} from "lucide-react";

export default function FacilityCard({
  searched,
  location,
  categories,
  mapsUrl,
}) {
  return (
    <section className="panel resultsPanel">
      <div className="panelHeader">
        <div>
          <p className="eyebrow">REKOMENDASI FASKES</p>
          <h2 className="panelTitle">
            Hasil pencarian fasilitas
          </h2>
        </div>
      </div>

      {!searched ? (
        <div className="emptyResults">
          <div className="resultIcon">
            <Hospital size={23} />
          </div>

          <h3>Belum ada hasil pencarian</h3>

          <p>
            Pilih lokasi dan kebutuhan kesehatan untuk
            menemukan fasilitas yang relevan.
          </p>
        </div>
      ) : (
        <div className="resultCard">
          <div className="resultIcon">
            <Hospital size={23} />
          </div>

          <div className="resultContent">
            <h3>Fasilitas kesehatan di area pilihanmu</h3>

            <p className="resultMeta">
              <MapPin size={14} />
              {location}
            </p>

            <p className="resultDescription">
              Kebutuhan: {categories.join(", ")}
            </p>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="resultButton"
            >
              Lihat hasil di Google Maps
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      )}

      <p className="disclaimer">
        Konfirmasikan jenis layanan, alamat, dan jam operasional
        kepada fasilitas kesehatan sebelum berkunjung.
      </p>
    </section>
  );
}