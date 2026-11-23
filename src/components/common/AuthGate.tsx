"use client";

import { useHydrated, useNavigate } from "@/lib/navigation";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { PageLoader } from "./PageLoader";
import { useSession } from "@/hooks/use-demo";

/** Demo route protection: session lives in localStorage, so the check runs after hydration. */
export function AuthGate({ role, children }: { role: "member" | "admin"; children: ReactNode }) {
  const hydrated = useHydrated();
  const { account } = useSession();
  const navigate = useNavigate();
  const pathname = usePathname();
  const allowed = !!account && account.role === role;

  useEffect(() => {
    if (!hydrated || allowed) return;
    if (account && account.role === "admin" && role === "member")
      navigate({ to: "/admin", replace: true });
    else if (account && account.role === "member" && role === "admin")
      navigate({ to: "/dashboard", replace: true });
    else navigate({ to: "/login", search: { redirect: pathname }, replace: true });
  }, [hydrated, allowed, account, role, navigate, pathname]);

  if (!hydrated || !allowed) return <PageLoader label="Checking your session…" />;
  return <>{children}</>;
}
