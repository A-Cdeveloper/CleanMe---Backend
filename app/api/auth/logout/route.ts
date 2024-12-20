import { authMiddleware } from "@/app/_utils/auth/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authResponse = await authMiddleware(request);
  if (!authResponse.ok) {
    return authResponse; // If unauthorized, return the middleware response
  }

  // Create a response that clears the `authToken` cookie
  const response = NextResponse.json({
    success: true,
    message: "Uspešno ste se odjavili.",
  });

  // Clear the `authToken` cookie by setting it with a past expiration date
  response.cookies.set("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || true,
    sameSite: "strict",
    expires: new Date(0), // Set the cookie expiration to the past
  });

  return response;
}
