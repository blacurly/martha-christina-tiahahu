import { NextResponse } from "next/server";

export async function GET(request) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json(
      { data: [], message: "Masukkan minimal 2 karakter." },
      { status: 400 }
    );
  }

  const url = new URL(
    "https://bmkg-api.dhanypedia.com/v1/wilayah/search"
  );

  url.searchParams.set("q", query);
  url.searchParams.set("limit", "100");

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 86400 },
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: "Pencarian wilayah gagal." },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { message: "Layanan pencarian wilayah tidak dapat diakses." },
      { status: 502 }
    );
  }
}