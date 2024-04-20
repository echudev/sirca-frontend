import { NavItem } from './nav-item';
import {
  ScreenIcon,
  HammerIcon,
  ArchiveIcon,
  CalendarIcon
} from '../components/icons';

export default function Sidebar() {
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
        <NavItem size={2} href="/mantenimiento/reparaciones">
          Equipos
        </NavItem>
        <NavItem size={2} href="/mantenimiento/reparaciones">
          Calibraciones
        </NavItem>
        <NavItem size={2} href="/mantenimiento/reparaciones">
          Edilicio
        </NavItem>
        <NavItem size={2} href="/mantenimiento/reparaciones">
          Programado
        </NavItem>
        <NavItem href="/inventario">
          <ArchiveIcon />
          Inventario
        </NavItem>
        <NavItem size={2} href="/mantenimiento/reparaciones">
          Equipos
        </NavItem>
        <NavItem size={2} href="/mantenimiento/reparaciones">
          Repuestos
        </NavItem>
        <NavItem size={2} href="/mantenimiento/reparaciones">
          Gases
        </NavItem>
        <NavItem size={2} href="/mantenimiento/reparaciones">
          Consumibles
        </NavItem>
        <NavItem href="/calendario">
          <CalendarIcon />
          Calendario
        </NavItem>
      </nav>
    </div>
  );
}
