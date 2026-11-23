import { Link } from "@/lib/navigation";
import { useDemoState } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Text logo — name comes from website settings (defaults to BRAND.name). */
export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  const { settings } = useDemoState();
  const [first, ...rest] = settings.siteName.trim().split(/\s+/);
  return (
    <Link
      to="/"
      className={cn("group inline-flex items-center gap-2", className)}
      aria-label={`${settings.siteName} home`}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full border font-display text-lg font-bold",
          inverted ? "border-gold text-gold" : "border-gold/60 bg-primary text-gold",
        )}
        aria-hidden
      >
        {first?.[0]}
        {rest[0]?.[0]}
      </span>
      <span
        className={cn(
          "font-display text-2xl font-semibold leading-none",
          inverted ? "text-ink-foreground" : "text-primary",
        )}
      >
        {first}
        {rest.length > 0 && <span className="italic text-gold"> {rest.join(" ")}</span>}
      </span>
    </Link>
  );
}
