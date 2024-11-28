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
      <body className="flex flex-col h-screen bg-slate-200">
        <div className="flex flex-row h-full">
          <main className="flex w-full flex-col bg-gray-50 rounded m-3 shadow-md shadow-black/80">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
