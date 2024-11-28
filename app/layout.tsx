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
      <body className="flex flex-col h-screen bg-slate-200">{children}</body>
    </html>
  );
}
