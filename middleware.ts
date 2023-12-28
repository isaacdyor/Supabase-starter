import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";
import prisma from "@/lib/prisma";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  await supabase.auth.getSession();

  const baseUrl = "http://localhost:3000";

  const unprotectedRoutes = [baseUrl + "/", baseUrl + "/login"];

  if (!unprotectedRoutes.includes(request.url)) {
    // If the requested URL requires authentication

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      // Redirect to the login page or unauthorized page if authentication fails
      return NextResponse.redirect(new URL("/login", request.url)); // Adjust the URL as needed
    }
  }
}

export const config = {
  matcher: ["/", "/login"],
};
