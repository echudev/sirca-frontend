import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth-session";

// 1. Specify protected and public routes
const protectedRoutes = [
  "/admin",
  "/api",
  "/datos",
  "/mantenimiento",
  "/inventario",
  "/estaciones",
  "/reportes",
  "/",
];
const publicRoutes = ["/login"];

export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // Redirigir a /login o /inicio si el usuario ingresa a "/"
  if (path === "/") {
    if (session?.userId) {
      return NextResponse.redirect(
        new URL("/estaciones/centenario", req.nextUrl),
      );
    } else {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 5. Redirect to /inicio if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith("/estaciones/centenario")
  ) {
    return NextResponse.redirect(
      new URL("/estaciones/centenario", req.nextUrl),
    );
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
