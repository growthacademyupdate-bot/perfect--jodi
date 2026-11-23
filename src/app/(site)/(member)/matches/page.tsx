"use client";

import { Info, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { NativeSelect } from "@/components/common/NativeSelect";
import { MemberPageTitle } from "@/components/member/MemberPageTitle";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { useSession } from "@/hooks/use-demo";
import { recommendedMatches } from "@/lib/matching";

export default function MatchesPage() {
  const { state, profile } = useSession();
  const [min, setMin] = useState("0");
  const matches = useMemo(
    () => (profile ? recommendedMatches(profile, state.profiles) : []),
    [profile, state.profiles],
  );
  const shown = matches.filter((m) => m.compat.score >= Number(min));
  if (!profile) return null;

  return (
    <div>
      <MemberPageTitle
        title="Recommended matches"
        text="Ranked by how many of your partner preferences each profile meets."
        action={
          <div className="w-48">
            <NativeSelect
              aria-label="Filter by minimum match"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              options={[
                { value: "0", label: "All matches" },
                { value: "50", label: "50% and above" },
                { value: "70", label: "70% and above" },
                { value: "85", label: "85% and above" },
              ]}
            />
          </div>
        }
      />
      <div className="mb-6 flex gap-2 rounded-lg border border-gold/40 bg-gold-soft p-3 text-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        <p>
          Compatibility scores are demo estimates based on age, height, location, education and
          marital status preferences.
        </p>
      </div>
      {shown.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No profiles match this filter"
          text="Try lowering the minimum score or widening your partner preferences."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map(({ profile: p, compat }) => (
            <ProfileCard key={p.id} profile={p} compat={compat.score} />
          ))}
        </div>
      )}
    </div>
  );
}
