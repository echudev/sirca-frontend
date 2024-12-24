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
    <html lang="es" className="bg-[var(--secondary-bg-1)] overflow-hidden">
      <head />
      <body>
        {children}
      </body>
    </html>
  );
}
