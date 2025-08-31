"use client";

import Link from "next/link";
import { useRouteRegistry } from "../routing/RouteRegistry";
import type { ReactNode } from "react";

interface PreloadLinkProps {
  href: string;
  children: ReactNode;
  preloadStrategy?: "hover" | "viewport" | "immediate";
  className?: string;
  [key: string]: unknown;
}

export function PreloadLink({
  href,
  children,
  preloadStrategy = "hover",
  className,
  ...props
}: PreloadLinkProps) {
  const { preloadRoute, preloadOnHover } = useRouteRegistry();

  const handleMouseEnter = () => {
    if (preloadStrategy === "hover") {
      preloadOnHover(href);
    }
  };

  if (preloadStrategy === "immediate") {
    preloadRoute(href);
  }

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      data-preload-route={preloadStrategy === "viewport" ? href : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}
