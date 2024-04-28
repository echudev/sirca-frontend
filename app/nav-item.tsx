'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowIcon } from '../components/icons';

export function NavItem({
  size = 1,
  href,
  children
}: {
  size?: number;
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={clsx(
        'animate-in gap-4 slide-in-from-left flex items-center rounded px-3 py-2 text-white/80 transition-all hover:bg-white/20  dark:text-gray-50 dark:hover:text-gray-50',
        {
          'bg-white/20 dark:bg-gray-800': pathname === href,
          'text-sm ml-10': size === 2,
          uppercase: size === 1
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
          { '-rotate-90 transition-all': pathname.startsWith(href) }
        )}
      >
        <ArrowIcon />
      </div>
    </Link>
  );
}
