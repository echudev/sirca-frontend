"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { splitPathName, cn } from "@/lib/utils";

export function AppBreadCrumb() {
  const pathName = usePathname();
  const partesRuta = splitPathName(pathName);

  return (
    <Breadcrumb className={cn("flex items-center ml-5")}>
      <BreadcrumbList>
        {partesRuta.map((parte, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink
                // href={`/${parte}`}
                className={cn(
                  "font-medium text-primary hover:text-secondary cursor-pointer select-none"
                )}
              >
                {parte.charAt(0).toUpperCase() + parte.slice(1)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {partesRuta.length > index + 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
