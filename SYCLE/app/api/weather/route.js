import { NextResponse } from "next/server";

// Kode cuaca WMO (Open-Meteo) ke deskripsi berbahasa Indonesia,
// memakai istilah yang sama dengan BMKG agar ikon kartu cuaca tetap cocok.
const WMO_CONDITIONS = {
  0: "Cerah",
  1: "Cerah Berawan",
  2: "Berawan",
  3: "Berawan Tebal",
  45: "Kabut",
  48: "Kabut",
  51: "Hujan Ringan",
  53: "Hujan Ringan",
  55: "Hujan Ringan",
  56: "Hujan Ringan",
  57: "Hujan Ringan",
  61: "Hujan Ringan",
  63: "Hujan Sedang",
  65: "Hujan Lebat",
  66: "Hujan Ringan",
  67: "Hujan Lebat",
  80: "Hujan Ringan",
  81: "Hujan Sedang",
  82: "Hujan Lebat",
  95: "Hujan Petir",
  96: "Hujan Petir",
  99: "Hujan Petir",
};

const toCoordinate = (value, min, max) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max
    ? number
    : null;
};

async function fetchBmkgForecast(adm4) {
  const url = new URL("https://api.bmkg.go.id/publik/prakiraan-cuaca");
  url.searchParams.set("adm4", adm4);

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
      next: { revalidate: 1800 },
    });

    if (!response.ok) return { location: null, forecasts: [] };

    const result = await response.json();
    const forecasts = (result.data ?? []).flatMap((group) =>
      (group.cuaca ?? []).flat()
    );

    return { location: result.lokasi ?? null, forecasts };
  } catch {
    return { location: null, forecasts: [] };
  }
}

// Cadangan bila BMKG tidak mengirim prakiraan: Open-Meteo per koordinat.
async function fetchOpenMeteoForecast(latitude, longitude) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "hourly",
    "temperature_2m,relative_humidity_2m,weather_code,precipitation"
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "3");

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
      next: { revalidate: 1800 },
    });

    if (!response.ok) return [];

    const result = await response.json();
    const hourly = result.hourly ?? {};
    const times = hourly.time ?? [];

    // Mulai dari jam sekarang di zona waktu lokasi (bukan jam yang sudah lewat).
    const offsetSeconds = Number(result.utc_offset_seconds) || 0;
    const nowLocal = new Date(Date.now() + offsetSeconds * 1000)
      .toISOString()
      .slice(0, 13);
    const startIndex = Math.max(
      0,
      times.findIndex((time) => time.slice(0, 13) >= nowLocal)
    );

    return times.slice(startIndex).map((time, offset) => {
      const index = startIndex + offset;
      return {
        time: `${time.replace("T", " ")}:00`,
        temperature: hourly.temperature_2m?.[index] ?? null,
        condition: WMO_CONDITIONS[hourly.weather_code?.[index]] ?? null,
        humidity: hourly.relative_humidity_2m?.[index] ?? null,
        rainfall: hourly.precipitation?.[index] ?? null,
        icon: null,
      };
    });
  } catch {
    return [];
  }
}

export async function GET(request) {
  const params = request.nextUrl.searchParams;
  const adm4 = params.get("adm4")?.trim();

  if (!adm4 || !/^\d{2}\.\d{2}\.\d{2}\.\d{4}$/.test(adm4)) {
    return NextResponse.json(
      { message: "Kode wilayah kelurahan (adm4) tidak valid." },
      { status: 400 }
    );
  }

  const bmkg = await fetchBmkgForecast(adm4);
  const bmkgLocation = bmkg.location;

  const location = {
    adm4: bmkgLocation?.adm4 ?? adm4,
    province: bmkgLocation?.provinsi ?? null,
    city: bmkgLocation?.kotkab ?? null,
    district: bmkgLocation?.kecamatan ?? null,
    village: bmkgLocation?.desa ?? null,
    latitude: toCoordinate(
      bmkgLocation?.lat ?? bmkgLocation?.latitude ?? params.get("lat"),
      -90,
      90
    ),
    longitude: toCoordinate(
      bmkgLocation?.lon ?? bmkgLocation?.longitude ?? params.get("lon"),
      -180,
      180
    ),
  };

  if (bmkg.forecasts.length > 0) {
    return NextResponse.json({
      location,
      forecasts: bmkg.forecasts.map((item) => ({
        time: item.local_datetime,
        temperature: item.t,
        condition: item.weather_desc,
        humidity: item.hu,
        rainfall: item.tp,
        icon: item.image,
      })),
      source: "BMKG",
    });
  }

  if (location.latitude !== null && location.longitude !== null) {
    const forecasts = await fetchOpenMeteoForecast(
      location.latitude,
      location.longitude
    );

    if (forecasts.length > 0) {
      return NextResponse.json({
        location,
        forecasts,
        source: "Open-Meteo",
      });
    }
  }

  return NextResponse.json(
    { message: "Prakiraan cuaca belum tersedia untuk wilayah ini." },
    { status: 404 }
  );
}
