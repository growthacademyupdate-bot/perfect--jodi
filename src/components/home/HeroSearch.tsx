"use client";

import { useNavigate } from "@/lib/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/common/NativeSelect";
import { AGES, CITIES, COMMUNITIES, RELIGIONS } from "@/lib/options";

export function HeroSearch({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const [f, setF] = useState({
    lookingFor: "bride",
    ageMin: "24",
    ageMax: "32",
    religion: "",
    community: "",
    location: "",
  });
  const [error, setError] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(f.ageMin) > Number(f.ageMax)) {
      setError("Minimum age can't be more than maximum age.");
      return;
    }
    setError("");
    navigate({
      to: "/profiles",
      search: {
        lookingFor: f.lookingFor as "bride" | "groom",
        ageMin: Number(f.ageMin),
        ageMax: Number(f.ageMax),
        religion: f.religion || undefined,
        community: f.community || undefined,
        location: f.location || undefined,
      },
    });
  };

  const ages = AGES.map(String);
  return (
    <form
      onSubmit={submit}
      className={`surface p-6 text-foreground md:p-8 shadow-2xl border border-border/80 bg-card rounded-2xl ${className}`}
      aria-label="Partner search"
    >
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border/60 pb-4 mb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-primary">Begin your search</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Find profiles that match what your family is looking for.
          </p>
        </div>
        <div className="text-xs font-medium text-gold-foreground/70 hidden md:block">
          ✦ 100% Manually Verified Profiles
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 items-end">
        <div className="space-y-1.5">
          <Label htmlFor="hs-looking" className="text-xs font-semibold">
            I'm looking for a
          </Label>
          <NativeSelect
            id="hs-looking"
            value={f.lookingFor}
            onChange={set("lookingFor")}
            options={[
              { value: "bride", label: "Bride" },
              { value: "groom", label: "Groom" },
            ]}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hs-amin" className="text-xs font-semibold">
            Age from
          </Label>
          <NativeSelect id="hs-amin" value={f.ageMin} onChange={set("ageMin")} options={ages} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hs-amax" className="text-xs font-semibold">
            Age to
          </Label>
          <NativeSelect id="hs-amax" value={f.ageMax} onChange={set("ageMax")} options={ages} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hs-rel" className="text-xs font-semibold">
            Religion
          </Label>
          <NativeSelect
            id="hs-rel"
            value={f.religion}
            onChange={set("religion")}
            placeholder="Any religion"
            options={RELIGIONS}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hs-loc" className="text-xs font-semibold">
            Location
          </Label>
          <NativeSelect
            id="hs-loc"
            value={f.location}
            onChange={set("location")}
            placeholder="Anywhere in India"
            options={CITIES}
          />
        </div>
        <div>
          <Button
            type="submit"
            size="xl"
            className="w-full h-11 font-semibold shadow-md cursor-pointer"
          >
            <Search className="h-4 w-4 mr-1.5" /> Search
          </Button>
        </div>
      </div>
      {error && (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
