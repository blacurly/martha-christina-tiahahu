// Faskes dari snapshot OpenStreetMap (Master V2.1 6.4: sumber data terbuka).
// Sumber: ekspor HOT/HDX "Health Facilities (OSM)" Indonesia, lisensi ODbL; dibangun dengan
// `node scripts/build-healthcare-data.mjs`. Snapshot dipakai karena server publik Overpass sering penuh,
// sehingga Healthcare tetap cepat dan bisa dipakai saat demo. Data tidak memuat kontak (FR-15/AC-26).
import snapshot from "@/data/healthcare/faskes-osm.json";
import { distanceKm } from "@/lib/environment/geo";

export const OSM_SNAPSHOT_DATE = snapshot.snapshot;

export const FACILITY_TYPES = {
  hospital: "Rumah sakit",
  puskesmas: "Puskesmas",
  clinic: "Klinik",
  midwife: "Bidan",
  doctor: "Praktik dokter",
};

// Label kelengkapan data (Master V2.1 6.4): data OSM bisa tidak lengkap.
function completeness(item) {
  if (item.a && item.s.length > 0) return "lengkap";
  if (item.a) return "sebagian";
  return "terbatas";
}

function toFacility(item) {
  return {
    id: `osm-${item.i.replace("/", "-")}`,
    osmRef: item.i,
    name: item.n,
    hasName: true,
    type: item.t,
    typeLabel: FACILITY_TYPES[item.t],
    address: item.a,
    area: item.w,
    services: item.s,
    lat: item.y,
    lon: item.x,
    completeness: completeness(item),
    source: "osm",
  };
}

// Faskes dalam radius tertentu dari titik lokasi (perhitungan lokal, tanpa panggilan API).
export function findOsmFacilities(lat, lon, radiusKm) {
  // Saring kasar dengan kotak batas dulu agar cepat, lalu hitung jarak sebenarnya.
  const latDelta = radiusKm / 111;
  const lonDelta = radiusKm / (111 * Math.max(Math.cos((lat * Math.PI) / 180), 0.2));

  return snapshot.facilities
    .filter(
      (item) =>
        Math.abs(item.y - lat) <= latDelta &&
        Math.abs(item.x - lon) <= lonDelta &&
        distanceKm(lat, lon, item.y, item.x) <= radiusKm
    )
    .map(toFacility);
}
