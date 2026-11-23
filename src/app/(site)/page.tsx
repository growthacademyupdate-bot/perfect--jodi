"use client";

import { ArrowRight, BadgeCheck, Heart, Lock, Quote, Users } from "lucide-react";
import { useMemo } from "react";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HeroSlider } from "@/components/home/HeroSlider";
import { HeroSearch } from "@/components/home/HeroSearch";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { PlanCards } from "@/components/site/PlanCards";
import { SectionHeading } from "@/components/site/PageHero";
import { FAQS, HOW_IT_WORKS, TESTIMONIALS } from "@/data/content";
import { formatDate } from "@/hooks/use-demo";
import { useDemoState } from "@/lib/store";

export default function HomePage() {
  const state = useDemoState();
  const approved = useMemo(
    () => state.profiles.filter((p) => p.status === "approved"),
    [state.profiles],
  );
  const featured = useMemo(() => {
    const paid = new Set(state.accounts.filter((a) => a.membership !== "free").map((a) => a.id));
    return approved.filter((p) => p.verified && paid.has(p.ownerId)).slice(0, 4);
  }, [approved, state.accounts]);
  const recent = useMemo(
    () => [...approved].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4),
    [approved],
  );
  const stories = state.stories.filter((s) => s.published).slice(0, 3);

  return (
    <>
      {/* Hero Slider */}
      <HeroSlider
        stats={{
          profiles: approved.length,
          verified: approved.filter((p) => p.verified).length,
          cities: new Set(approved.map((p) => p.city)).size,
        }}
      />

      {/* Partner Search Form (Down Side To Slider Images) */}
      <section className="relative z-30 -mt-10 sm:-mt-14 container-page mb-6">
        <HeroSearch />
      </section>

      {/* Trust strip */}
      <section className="border-b bg-card">
        <div className="container-page grid gap-6 py-8 sm:grid-cols-3">
          {[
            {
              icon: BadgeCheck,
              title: "Manually reviewed profiles",
              text: "Every profile is checked before it goes live.",
            },
            {
              icon: Lock,
              title: "Privacy first",
              text: "Phone numbers and emails are never shown publicly.",
            },
            {
              icon: Users,
              title: "Made for families",
              text: "Parents and siblings can create and manage profiles.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container-page py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Featured"
            title="Featured profiles"
            text="Verified members with premium visibility."
          />
          <Button asChild variant="link" className="px-0">
            <Link to="/profiles">
              View all profiles <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProfileCard key={p.id} profile={p} />
          ))}
        </div>
      </section>

      {/* Recently joined */}
      <section className="bg-secondary/50 py-16 md:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="New members"
            title="Recently joined"
            text="Fresh profiles approved by our team this month."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((p) => (
              <ProfileCard key={p.id} profile={p} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-16 md:py-20">
        <SectionHeading
          center
          eyebrow="Simple & secure"
          title="How it works"
          text="Four calm, considered steps from sign-up to meeting the family."
        />
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((s, i) => (
            <li key={s.title} className="surface p-6">
              <span className="font-display text-4xl font-semibold text-gold">0{i + 1}</span>
              <h3 className="mt-3 text-xl">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link to="/how-it-works">Learn more</Link>
          </Button>
        </div>
      </section>

      {/* Success stories */}
      <section className="bg-primary-soft/60 py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Happily married" title="Success stories" />
            <Button asChild variant="link" className="px-0">
              <Link to="/success-stories">
                Read all stories <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {stories.map((s) => (
              <article key={s.id} className="surface p-6">
                <Heart className="h-5 w-5 fill-primary text-primary" />
                <h3 className="mt-3 text-2xl">{s.couple}</h3>
                <p className="text-xs text-muted-foreground">
                  {s.city} · Married {formatDate(s.marriedOn)}
                </p>
                <p className="mt-3 line-clamp-4 text-sm text-foreground/80">{s.story}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="container-page py-16 md:py-20">
        <SectionHeading
          center
          eyebrow="Membership"
          title="Plans for every family"
          text="Start free. Upgrade when you're ready — prices shown are sample demo prices."
        />
        <div className="mt-12">
          <PlanCards compact />
        </div>
        <div className="mt-6 text-center">
          <Button asChild variant="link">
            <Link to="/membership">Compare all features</Link>
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/50 py-16 md:py-20">
        <div className="container-page">
          <SectionHeading center eyebrow="Kind words" title="What families say" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="surface p-6">
                <Quote className="h-6 w-6 text-gold" />
                <blockquote className="mt-3 font-display text-xl leading-snug">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold">{t.name}</span>{" "}
                  <span className="text-muted-foreground">· {t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page grid gap-10 py-16 md:py-20 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <SectionHeading
            eyebrow="Questions"
            title="Frequently asked"
            text="Still unsure? Our team is happy to help."
          />
          <Button asChild variant="outline" className="mt-6">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
        <Accordion type="single" collapsible className="surface px-6">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`f${i}`}
              className={i === FAQS.length - 1 ? "border-b-0" : ""}
            >
              <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="container-page">
        <div className="hero-panel flex flex-col items-start justify-between gap-6 rounded-2xl p-8 md:flex-row md:items-center md:p-12">
          <div>
            <h2 className="text-3xl md:text-4xl">Your story could be next.</h2>
            <p className="mt-2 text-primary-foreground/80">
              Registration is free and takes less than two minutes.
            </p>
          </div>
          <Button asChild variant="gold" size="xl">
            <Link to="/register">Create a free profile</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
