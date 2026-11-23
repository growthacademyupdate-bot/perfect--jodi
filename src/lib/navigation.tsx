"use client";

import NextLink from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { forwardRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href?: string;
  to?: string;
  params?: Record<string, string | number>;
  search?: Record<string, unknown> | ((prev: Record<string, unknown>) => Record<string, unknown>);
  activeProps?: { className?: string };
  activeOptions?: { exact?: boolean };
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, href, params, search, activeProps, activeOptions, className, children, ...props },
  ref,
) {
  const pathname = usePathname();
  const rawPath = to || href || "/";
  const searchParamsObj = typeof search === "function" ? useSearchParams() : null;

  let resolvedHref = rawPath;
  if (params) {
    for (const [key, val] of Object.entries(params)) {
      resolvedHref = resolvedHref.replace(`$${key}`, String(val)).replace(`:${key}`, String(val));
    }
  }

  if (search) {
    let queryObj: Record<string, unknown> = {};
    if (typeof search === "function") {
      if (searchParamsObj) {
        searchParamsObj.forEach((val, key) => {
          queryObj[key] = val;
        });
      }
      queryObj = search(queryObj);
    } else {
      queryObj = search;
    }
    const qs = new URLSearchParams();
    for (const [key, val] of Object.entries(queryObj)) {
      if (val !== undefined && val !== null && val !== "") {
        qs.set(key, String(val));
      }
    }
    const qStr = qs.toString();
    if (qStr) resolvedHref = `${resolvedHref.split("?")[0]}?${qStr}`;
  }

  const basePath = rawPath.split("?")[0] || "/";
  const isActive = activeOptions?.exact
    ? pathname === basePath
    : basePath === "/"
      ? pathname === "/"
      : pathname.startsWith(basePath);

  const finalClass = cn(className, isActive && activeProps?.className);

  return (
    <NextLink ref={ref} href={resolvedHref} className={finalClass} {...props}>
      {children}
    </NextLink>
  );
});

export function useNavigate(_options?: { from?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (dest: {
    to?: string;
    href?: string;
    search?: Record<string, unknown> | ((prev: Record<string, unknown>) => Record<string, unknown>);
    params?: Record<string, string | number>;
    replace?: boolean;
    resetScroll?: boolean;
  }) => {
    const targetPath = dest.to || dest.href || pathname;
    let resolved = targetPath;
    if (dest.params) {
      for (const [key, val] of Object.entries(dest.params)) {
        resolved = resolved.replace(`$${key}`, String(val)).replace(`:${key}`, String(val));
      }
    }

    let queryObj: Record<string, unknown> = {};
    if (typeof dest.search === "function") {
      searchParams.forEach((val, key) => {
        queryObj[key] = val;
      });
      queryObj = dest.search(queryObj);
    } else if (dest.search) {
      queryObj = dest.search;
    }

    const qs = new URLSearchParams();
    for (const [key, val] of Object.entries(queryObj)) {
      if (val !== undefined && val !== null && val !== "") {
        qs.set(key, String(val));
      }
    }
    const qStr = qs.toString();
    const finalUrl = qStr ? `${resolved.split("?")[0]}?${qStr}` : resolved;

    if (dest.replace) {
      router.replace(finalUrl, { scroll: dest.resetScroll !== false });
    } else {
      router.push(finalUrl, { scroll: dest.resetScroll !== false });
    }
  };
}

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
