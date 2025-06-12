// components/layouts/AppLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import NavBar from "../commons/navigations/NavBar";
import { ReactNode } from "react";

const excludedRoutes = ["/account/sign-in"];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const showNav = !excludedRoutes.includes(pathname);

  return (
    <>
      {showNav && <NavBar />}
      {children}
    </>
  );
}
