import { NextResponse } from "next/server";
import { validateLocationSearch } from "@/lib/validations/environmentValidation";
import { searchVillages } from "@/lib/repositories/regionRepository";

export async function GET(request) {
  try {
    const validation = validateLocationSearch(
      request.nextUrl.searchParams
    );

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    const { total, items } = searchVillages(validation.value.query, 10);
    return NextResponse.json({ total, items });
  } catch (error) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }

    console.error("GET /api/locations/search gagal:", error);

    return NextResponse.json(
      { error: "Pencarian wilayah gagal dilakukan." },
      { status: 500 }
    );
  }
}
