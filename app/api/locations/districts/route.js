import { NextResponse } from "next/server";

export async function GET(request) {
  const province = request.nextUrl.searchParams
    .get("province")
    ?.trim();

  if (!province || !/^\d{2}$/.test(province)) {
    return NextResponse.json(
      { message: "Kode provinsi harus terdiri dari 2 digit." },
      { status: 400 }
    );
  }

  try {
    const url = new URL(
      "https://bmkg-api.dhanypedia.com/v1/wilayah/districts"
    );

    url.searchParams.set("province", province);

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Daftar kabupaten/kota gagal dimuat." },
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