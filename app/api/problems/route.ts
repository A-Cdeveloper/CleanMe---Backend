/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/_utils/db/db";
import { z } from "zod";
import { problemSchema } from "@/app/_utils/zod/problemSchemas";
import { authMiddleware } from "../../_utils/auth/authMiddleware";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status") || undefined;
  const cat_id = searchParams.get("cat_id") || undefined;
  const sort = searchParams.get("sort")?.split(",") || ["createdAt"]; // Default sort field
  const order = searchParams.get("order")?.split(",") || ["desc"]; // Default order

  const orderBy = sort.map((field: string, index: number) => ({
    [field]: order[index]?.toLowerCase() as "asc" | "desc",
  }));

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conditions: any = {
      NOT: { status: "archive" },
    };
    if (status) conditions.status = status;
    if (cat_id) conditions.cat_id = +cat_id;

    const problems = await prisma.problem.findMany({
      where: conditions,
      orderBy,
    });
    return NextResponse.json(
      { results: problems.length, data: problems },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Greška prilikom preuzimanja problema" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResponse = await authMiddleware(request);
  if (!authResponse.ok) {
    return authResponse; // If unauthorized, return the middleware response
  }
  try {
    // Parse and validate the incoming data
    const body = await request.json();
    const data = problemSchema.parse(body);

    // Check if problem already exist
    const existingProblem = await prisma.problem.findUnique({
      where: {
        id: data.id,
      },
    });

    if (existingProblem) {
      return NextResponse.json(
        { message: "Problem već postoji u bazi." },
        { status: 500 }
      );
    }

    // Create a new problem record in the database
    const newProblem = await prisma.problem.create({
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        position: {
          lat: parseFloat(data.position.lat),
          lng: parseFloat(data.position.lng),
        },
        createdAt: new Date(), // Set the current date/time
        updatedAt: null, // Explicitly set to null
        status: "active",
        cat_id: data.cat_id, // Match your database column name
        uid: data.uid, // Match your database column name
        image: data.image || "",
        pinata_id: data.id || "",
      },
    });

    // Respond with the created problem
    return NextResponse.json(newProblem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Greška prilikom dodavanja problema" },
      { status: 500 }
    );
  }
}
