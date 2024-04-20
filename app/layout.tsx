import './globals.css';
import Link from 'next/link';
import { NavItem } from './nav-item';
import {
  ScreenIcon,
  HammerIcon,
  RulerIcon,
  ArchiveIcon,
  CalendarIcon
} from '../components/icons';
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
                  <p>Logo</p>
                  <span className="">SIRCA</span>
                </Link>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <nav className="flex flex-col tems-start px-4 text-sm font-medium h-full">
                  <NavItem href="/">
                    <ScreenIcon />
                    Panel General
                  </NavItem>
                  <NavItem href="/inventario">
                    <ArchiveIcon />
                    Inventario
                  </NavItem>
                  <NavItem href="/mantenimiento">
                    <HammerIcon />
                    Mantenimiento
                  </NavItem>
                  <NavItem href="/calibraciones">
                    <RulerIcon />
                    Calibraciones
                  </NavItem>
                  <NavItem href="/calendario">
                    <CalendarIcon />
                    Calendario
                  </NavItem>
                </nav>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 justify-between lg:justify-end">
              <Link
                className="flex items-center gap-2 font-semibold lg:hidden"
                href="/"
              >
                <p>Logo2</p>
                <span className="">SIRCA2</span>
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
