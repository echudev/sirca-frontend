import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../app/sidebar';

jest.mock('next/navigation', () => ({
  usePathname: () => '/'
}));

describe('Sidebar', () => {
  it('renders the sidebar with the correct links', () => {
    render(<Sidebar />);

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Mantenimiento')).toBeInTheDocument();
    expect(screen.getByText('Inventario')).toBeInTheDocument();
    expect(screen.getByText('Calendario')).toBeInTheDocument();
  });
});
