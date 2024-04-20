'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavItem({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={clsx(
        'animate-in slide-in-from-left flex items-center gap-2 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-200/90  dark:text-gray-50 dark:hover:text-gray-50',
        {
          'bg-gray-300/70 dark:bg-gray-800': pathname === href
        }
      )}
    >
      {children}
    </Link>
  );
}
