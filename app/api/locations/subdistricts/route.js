import { NextResponse } from "next/server";

export async function GET(request) {
  const district = request.nextUrl.searchParams
    .get("district")
    ?.trim();

  if (!district || !/^\d{2}\.\d{2}$/.test(district)) {
    return NextResponse.json(
      { message: "Kode kabupaten/kota tidak valid." },
      { status: 400 }
    );
  }

  try {
    const url = new URL(
      "https://bmkg-api.dhanypedia.com/v1/wilayah/subdistricts"
    );

    url.searchParams.set("district", district);

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Daftar kecamatan gagal dimuat." },
        { status: 502 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      data: result.data ?? [],
      attribution: result.attribution,
    });
  } catch {
    return NextResponse.json(
      { message: "Layanan wilayah sedang tidak tersedia." },
      { status: 502 }
    );
  }
}