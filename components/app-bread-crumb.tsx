"use client";

import { usePathname } from "next/navigation";

export function AppBreadCrumb() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <p>{pathname}</p>
    </div>
  );
}
