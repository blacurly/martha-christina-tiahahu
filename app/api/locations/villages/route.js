import { NextResponse } from "next/server";

export async function GET(request) {
  const subdistrict = request.nextUrl.searchParams
    .get("subdistrict")
    ?.trim();

  if (!subdistrict || !/^\d{2}\.\d{2}\.\d{2}$/.test(subdistrict)) {
    return NextResponse.json(
      { message: "Kode kecamatan tidak valid." },
      { status: 400 }
    );
  }

  try {
    const url = new URL(
      "https://bmkg-api.dhanypedia.com/v1/wilayah/villages"
    );

    url.searchParams.set("subdistrict", subdistrict);

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Daftar kelurahan/desa gagal dimuat." },
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