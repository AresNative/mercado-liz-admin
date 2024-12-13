import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware para proteger rutas
export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token"); // Suponiendo que el token de autenticación está en una cookie

  // Si no hay token, redirige al login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Si el usuario está autenticado, verifica el rol
  const userRole = req.cookies.get("user-role")?.value || ""; // Suponiendo que el rol está en una cookie
  const pathname = req.nextUrl.pathname;

  // Redirecciona según el rol a las rutas correspondientes
  if (userRole === "admin" && pathname.startsWith("/dashboard/@user")) {
    return NextResponse.redirect(new URL("/dashboard/@admin", req.url));
  }

  if (userRole === "user" && pathname.startsWith("/dashboard/@admin")) {
    return NextResponse.redirect(new URL("/dashboard/@user", req.url));
  }

  // Permite el acceso si está autenticado
  return NextResponse.next();
}

// Indica las rutas protegidas
export const config = {
  matcher: ["/dashboard/:path*"],
};
