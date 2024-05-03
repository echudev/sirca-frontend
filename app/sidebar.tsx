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
    <div className="flex w-64 pt-6 m-3 rounded bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-black/80">
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
            'h-20': pathname.startsWith('/mantenimiento')
          })}
        >
          <NavItem size={2} href="/mantenimiento/ordenes">
            Ordenes de trabajo
          </NavItem>
          <NavItem size={2} href="/mantenimiento/programado">
            Programado
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
          <NavItem size={2} href="/inventario/estaciones">
            Estaciones
          </NavItem>
          <NavItem size={2} href="/inventario/equipos">
            Equipos
          </NavItem>
          <NavItem size={2} href="/inventario/partes">
            Partes
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
