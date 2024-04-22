'use client';

import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { NavItem } from './nav-item';
import {
  ScreenIcon,
  HammerIcon,
  ArchiveIcon,
  CalendarIcon
} from '../components/icons';

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="flex-1 overflow-auto py-2">
      <nav className="flex flex-col tems-start px-4 text-sm font-medium h-full">
        <NavItem href="/">
          <ScreenIcon />
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
          <NavItem size={2} href="/mantenimiento/reparaciones">
            Equipos
          </NavItem>
          <NavItem size={2} href="/mantenimiento/reparaciones">
            Calibraciones
          </NavItem>
          <NavItem size={2} href="/mantenimiento/reparaciones">
            Programado
          </NavItem>
        </div>
        <NavItem href="/inventario">
          <ArchiveIcon />
          Inventario
        </NavItem>
        <div
          aria-label="Inventario-content"
          aria-controls="Inventario-content"
          className={clsx(
            'h-0 overflow-hidden transition-all animate-in slide-in-from-top',
            {
              'h-28': pathname.startsWith('/inventario')
            }
          )}
        >
          <NavItem size={2} href="/mantenimiento/reparaciones">
            Equipos
          </NavItem>
          <NavItem size={2} href="/mantenimiento/reparaciones">
            Partes
          </NavItem>
          <NavItem size={2} href="/mantenimiento/reparaciones">
            Gases
          </NavItem>
          <NavItem size={2} href="/mantenimiento/reparaciones">
            Consumibles
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
