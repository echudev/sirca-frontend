import './globals.css';
import Link from 'next/link';
import Sidebar from './sidebar';
import { User } from './user';

export const metadata = {
  title: 'SIRCA',
  description: 'Sistema de Gestion de la Red de Calidad del Aire.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full bg-gray-50">
      <body>
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-[60px] items-center border-b px-5">
                <Link
                  className="flex items-center gap-2 font-semibold"
                  href="/"
                >
                  <span className="ml-9">SIRCA</span>
                </Link>
              </div>
              <Sidebar />
            </div>
          </div>
          <div className="flex flex-col">
            <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 justify-between lg:justify-end">
              <Link
                className="flex items-center gap-2 font-semibold lg:hidden"
                href="/"
              >
                <span className="">sirca</span>
              </Link>
              <User />
            </header>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
