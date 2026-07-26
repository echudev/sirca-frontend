import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth-session";

// 1. Specify protected and public routes
//
// Se comparan por prefijo de segmento, no con includes(): con igualdad exacta
// sólo quedaba cubierto "/estaciones", y no "/estaciones/centenario" —la landing
// posterior al login— ni "/datos/contaminante".
//
// No figura "/api": el matcher de abajo excluye esa rama, así que el proxy nunca
// corre ahí. Cada route handler verifica su propia sesión y devuelve 401.
// Tampoco "/": se resuelve en el bloque especial de más abajo, antes de llegar acá.
const protectedRoutes = [
  "/admin",
  "/aqi",
  "/datos",
  "/descargas",
  "/estaciones",
  "/inventario",
  "/mantenimiento",
  "/reportes",
];
const publicRoutes = ["/login"];

// Coincide con la ruta exacta o con un subpath, pero sin dar falsos positivos por
// prefijo suelto: "/datos" cubre "/datos/contaminante" y no "/datos-publicos".
function matches(path: string, routes: string[]) {
  return routes.some((route) => path === route || path.startsWith(`${route}/`));
}

export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = matches(path, protectedRoutes);
  const isPublicRoute = matches(path, publicRoutes);

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

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
