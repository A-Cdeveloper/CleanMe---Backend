import prisma from "@/app/_utils/db/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.problemCategory.findMany({
      orderBy: {
        cat_id: "asc",
      },
      include: {
        organisations: true, // Correct way to include organisations in an implicit relationship
      },
    });
    return NextResponse.json(
      { results: categories.length, data: categories },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Greška prilikom preuzimanja kategorija" },
      { status: 500 }
    );
  }
}
