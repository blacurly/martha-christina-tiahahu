import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://bmkg-api.dhanypedia.com/v1/wilayah/provinces",
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
        next: { revalidate: 86400 },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Daftar provinsi gagal dimuat." },
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