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
    <html lang="es" className="bg-(--secondary-bg-1) overflow-hidden">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/maplibre-gl@5.14.0/dist/maplibre-gl.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
