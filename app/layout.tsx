import { Suspense } from "react";
import Loading from "./loading";
import "./globals.css";

export const metadata = {
  title: "SIRCA - Inicio",
  description: "Sistema de Gestion de la Red de Calidad del Aire.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head />
      <body className="bg-[var(--secondary-bg-1)]">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </body>
    </html>
  );
}
