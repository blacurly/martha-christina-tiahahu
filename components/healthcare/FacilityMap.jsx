
import { ExternalLink, MapPin } from "lucide-react";

export default function FacilityMap({
  searched,
  embedUrl,
  mapsUrl,
}) {
  return (
    <section className="panel mapPanel">
      <div className="panelHeader">
        <div>
          <h2 className="panelTitle">
            Peta fasilitas kesehatan
          </h2>
          <p className="panelSubtitle">
            {searched
              ? "Peta berdasarkan pencarianmu"
              : "Fasilitas di sekitar lokasi pilihanmu"}
          </p>
        </div>

        {searched && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="textLink"
          >
            Buka Maps <ExternalLink size={14} />
          </a>
        )}
      </div>

      <div className="mapViewport">
        {searched ? (
          <iframe
            key={embedUrl}
            title="Peta fasilitas kesehatan"
            src={embedUrl}
            loading="lazy"
            allowFullScreen
          />
        ) : (
          <div className="mapPlaceholder">
            <div className="mapPlaceholderIcon">
              <MapPin size={34} />
            </div>

            <h3>Temukan faskes di sekitarmu</h3>

            <p>
              Tentukan lokasi dan kebutuhan kesehatan untuk
              melihat hasil pencarian pada peta.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}