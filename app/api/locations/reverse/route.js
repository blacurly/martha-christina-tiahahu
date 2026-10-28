import { NextResponse } from "next/server";

export async function GET(request) {
  const params = request.nextUrl.searchParams;
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));

  if (
    !params.has("lat") ||
    !params.has("lon") ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return NextResponse.json(
      { message: "Koordinat tidak valid." },
      { status: 400 }
    );
  }

  const url = new URL(
    "https://nominatim.openstreetmap.org/reverse"
  );

  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "id");

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "SYCLE-Web-PWA/1.0",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Nama wilayah gagal ditemukan." },
        { status: 502 }
      );
    }

    const result = await response.json();
    const address = result.address ?? {};

    const village =
      address.village ??
      address.suburb ??
      address.neighbourhood ??
      address.quarter ??
      address.hamlet ??
      "";

    const district =
      address.city_district ??
      address.district ??
      address.county ??
      "";

    const city =
      address.city ??
      address.town ??
      address.municipality ??
      "";

    const province = address.state ?? "";

    const location = [
      village,
      district,
      city,
      province,
    ]
      .filter(Boolean)
      .filter((value, index, array) =>
        array.indexOf(value) === index
      )
      .join(", ");

    return NextResponse.json({
      location: location || result.display_name || "",
      address,
      attribution: "© OpenStreetMap contributors",
    });
  } catch {
    return NextResponse.json(
      { message: "Layanan reverse geocoding tidak dapat diakses." },
      { status: 502 }
    );
  }
}