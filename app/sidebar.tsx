'use client';

import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { NavItem } from './nav-item';
import {
  HomeIcon,
  HammerIcon,
  BoxIcon,
  CalendarIcon
} from '../components/icons';

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="flex-1 overflow-auto pt-6 m-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-black/80">
      <nav className="flex flex-col tems-start px-1 text-sm font-medium h-full gap-1">
        <NavItem href="/">
          <HomeIcon />
          Inicio
        </NavItem>
        <NavItem href="/mantenimiento">
          <HammerIcon />
          Mantenimiento
        </NavItem>
        <div
          aria-label="Mantenimiento-content"
          aria-expanded="false"
          aria-controls="Mantenimiento-content"
          className={clsx('h-0 overflow-hidden transition-all', {
            'h-28': pathname.startsWith('/mantenimiento')
          })}
        >
          <NavItem size={2} href="/mantenimiento/historial">
            Historial
          </NavItem>
          <NavItem size={2} href="/mantenimiento/calibraciones">
            Calibraciones
          </NavItem>
          <NavItem size={2} href="/mantenimiento/rutina">
            Rutina
          </NavItem>
        </div>
        <NavItem href="/inventario">
          <BoxIcon />
          Inventario
        </NavItem>
        <div
          aria-label="Inventario-content"
          aria-controls="Inventario-content"
          className={clsx(
            'h-0 overflow-hidden transition-all animate-in slide-in-from-top',
            {
              'h-36': pathname.startsWith('/inventario')
            }
          )}
        >
          <NavItem size={2} href="/inventario/equipos">
            Equipos
          </NavItem>
          <NavItem size={2} href="/inventario/partes">
            Partes
          </NavItem>
          <NavItem size={2} href="/inventario/consumibles">
            Consumibles
          </NavItem>
          <NavItem size={2} href="/inventario/gases">
            Gases
          </NavItem>
        </div>
        <NavItem href="/calendario">
          <CalendarIcon />
          Calendario
        </NavItem>
      </nav>
    </div>
  );
}
