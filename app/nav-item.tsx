'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowIcon } from '../components/icons';

export function NavItem({
  size = 1,
  toggleState,
  href,
  children
}: {
  size?: number;
  toggleState?: () => void | undefined;
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      onClick={toggleState}
      className={clsx(
        'animate-in slide-in-from-left flex items-center gap-2 rounded-lg px-3 py-2 text-base text-gray-900 transition-all hover:bg-gray-200/90  dark:text-gray-50 dark:hover:text-gray-50',
        {
          'bg-gray-300/70 dark:bg-gray-800': pathname === href,
          'text-sm ml-7': size === 2
        }
      )}
    >
      {children}
      <div
        className={clsx(
          'ml-auto transition-all',
          {
            hidden: !(href == '/mantenimiento' || href == '/inventario')
          },
          { '-rotate-90 transition-all': pathname === href }
        )}
      >
        <ArrowIcon />
      </div>
    </Link>
  );
}
