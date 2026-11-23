"use client";

import { Link, useNavigate } from "@/lib/navigation";
import { BadgeCheck, Briefcase, GraduationCap, Heart, MapPin, Ruler } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProfileAvatar } from "./ProfileAvatar";
import { MembershipBadge } from "@/components/common/StatusBadge";
import { useSession } from "@/hooks/use-demo";
import { toggleShortlist } from "@/lib/actions";
import { ageFromDob, profileCompletion, shortHeight } from "@/lib/matching";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProfileCard({
  profile,
  layout = "grid",
  compat,
  footer,
}: {
  profile: Profile;
  layout?: "grid" | "list";
  compat?: number;
  footer?: React.ReactNode;
}) {
  const { state, account } = useSession();
  const navigate = useNavigate();
  const owner = state.accounts.find((a) => a.id === profile.ownerId);
  const shortlisted = account ? (state.shortlists[account.id] ?? []).includes(profile.id) : false;
  const completion = profileCompletion(profile);
  const isMine = account?.profileId === profile.id;

  const onShortlist = () => {
    if (!account) {
      toast.info("Please log in to shortlist profiles.");
      navigate({ to: "/login", search: { redirect: "/profiles" } });
      return;
    }
    const r = toggleShortlist(profile.id);
    if (r.ok)
      toast.success(
        r.added
          ? `${profile.name} added to your shortlist`
          : `${profile.name} removed from shortlist`,
      );
    else toast.error(r.error);
  };

  const facts = [
    { icon: Ruler, text: `${ageFromDob(profile.dob)} yrs · ${shortHeight(profile.heightCm)}` },
    { icon: MapPin, text: profile.city || "—" },
    { icon: GraduationCap, text: profile.qualification || "—" },
    { icon: Briefcase, text: profile.occupation || "—" },
  ];

  return (
    <article
      className={cn(
        "surface group flex overflow-hidden transition-shadow hover:shadow-lift",
        layout === "grid" ? "flex-col" : "flex-col sm:flex-row",
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-center bg-secondary",
          layout === "grid" ? "h-36" : "h-36 sm:h-auto sm:w-48",
        )}
      >
        <ProfileAvatar name={profile.name} tone={profile.tone} size="lg" />
        {typeof compat === "number" && (
          <span className="absolute left-3 top-3 rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-primary shadow-sm">
            {compat}% match*
          </span>
        )}
        {!isMine && (
          <button
            type="button"
            onClick={onShortlist}
            aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
            className={cn(
              "absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-card shadow-sm transition-colors",
              shortlisted ? "text-primary" : "text-muted-foreground hover:text-primary",
            )}
          >
            <Heart className={cn("h-4 w-4", shortlisted && "fill-current")} />
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="flex items-center gap-1.5 truncate text-xl leading-tight">
              <span className="truncate">{profile.name}</span>
              {profile.verified && (
                <BadgeCheck className="h-4 w-4 shrink-0 text-success" aria-label="Verified" />
              )}
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {profile.religion || "—"}
              {profile.community ? ` · ${profile.community}` : ""}
            </p>
          </div>
          {owner && owner.membership !== "free" && <MembershipBadge tier={owner.membership} />}
        </div>
        <ul className={cn("mt-4 grid gap-2 text-sm", layout === "list" && "sm:grid-cols-2")}>
          {facts.map(({ icon: Icon, text }, i) => (
            <li key={i} className="flex items-center gap-2 text-foreground/85">
              <Icon className="h-4 w-4 shrink-0 text-gold" />
              <span className="truncate">{text}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>Profile completeness</span>
            <span>{completion}%</span>
          </div>
          <Progress value={completion} className="h-1.5 bg-muted" />
        </div>
        <div className="mt-5 flex flex-wrap gap-2 pt-1">
          <Button asChild size="sm" className="flex-1">
            <Link to="/profiles/$id" params={{ id: profile.id }}>
              View profile
            </Link>
          </Button>
          {footer}
        </div>
      </div>
    </article>
  );
}
