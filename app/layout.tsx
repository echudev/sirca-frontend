import './globals.css';
import Sidebar from './sidebar';

// const ubuntu = localFont({
//   src: [
//     {
//       path: "../public/font/Ubuntu-Bold.ttf",
//       weight: "700",
//       style: "normal",
//     },
//     {
//       path: "../public/font/Ubuntu-Regular.ttf",
//       weight: "400",
//       style: "normal",
//     },
//   ],
//   variable: "--font-ubuntu",
// });

export const metadata = {
  title: 'SIRCA - Inicio',
  description: 'Sistema de Gestion de la Red de Calidad del Aire.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head />
      <body className="flex flex-col h-screen bg-slate-200">
        <div className="flex flex-row h-full">
          <Sidebar />
          <main className="flex w-full flex-col bg-gray-50 rounded m-3 shadow-md shadow-black/80">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
