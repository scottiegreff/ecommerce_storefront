"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Category } from "@/types";

interface MainNavProps {
  data: Category[];
}

const MainNav: React.FC<MainNavProps> = ({ data }) => {
  const pathname = usePathname();

  const goodsCategories = data.filter(
    (category) => category.itemType === "GOODS"
  );
  const servicesCategories = data.filter(
    (category) => category.itemType === "SERVICES"
  );

  const goodsRoutes = goodsCategories.map((route) => ({
    href: `/goodsCategory/${route.id}`,
    label: route.name,
    active: pathname === `/goodsCategory/${route.id}`,
  }));
  const servicesRoutes = servicesCategories.map((route) => ({
    href: `/servicesCategory/${route.id}`,
    label: route.name,
    active: pathname === `/servicesCategory/${route.id}`,
  }));

  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
      {servicesRoutes.map((servicesRoute) => (
        <Link
          key={servicesRoute.href}
          href={servicesRoute.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-neutral-300",
            servicesRoute.active ? "text-[#C68DBA]" : "text-white"
          )}
        >
          {servicesRoute.label}
        </Link>
      ))}
      {goodsRoutes.map((goodsRoute) => (
        <Link
          key={goodsRoute.href}
          href={goodsRoute.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-neutral-300",
            goodsRoute.active ? "text-[#C68DBA]" : "text-white"
          )}
        >
          {goodsRoute.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
