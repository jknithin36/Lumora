// src/pages/Credits.jsx (or src/components/Credits.jsx)
import React, { useEffect, useMemo, useState } from "react";
import { dummyPlans } from "@/assets/assets"; // (remove dummyChats import; it's unused)

function SkeletonPlan() {
  return (
    <div className="rounded-2xl border border-border/30 bg-muted/50 backdrop-blur-sm p-5 shadow-sm animate-pulse">
      <div className="h-6 w-1/2 bg-muted rounded mb-2" />
      <div className="h-4 w-1/3 bg-muted rounded mb-4" />
      <div className="h-10 w-full bg-muted rounded mb-4" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-3 w-3/4 bg-muted rounded" />
        ))}
      </div>
    </div>
  );
}

function formatMoney(n) {
  const v = Number.isFinite(+n) ? +n : 0;
  return v.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function PlanCard({ plan, onSelect }) {
  // Be forgiving about field names
  const name = plan?.name ?? plan?.title ?? "Plan";
  const credits = plan?.credits ?? plan?.quota ?? plan?.tokens ?? "—";
  const priceMonthly =
    plan?.priceMonthly ?? plan?.monthly ?? plan?.price ?? plan?.amount ?? 0;
  const priceYearly =
    plan?.priceYearly ?? plan?.yearly ?? (priceMonthly ? priceMonthly * 10 : 0); // default 2 months free
  const description = plan?.description ?? plan?.subtitle ?? "";
  const features = plan?.features ?? plan?.perks ?? [];
  const popular = !!(plan?.popular ?? plan?.isPopular);

  return (
    <div
      className={`relative rounded-2xl border p-5 shadow-sm bg-muted/50 backdrop-blur-sm hover:shadow-md transition
                  ${
                    popular
                      ? "border-primary/40 ring-1 ring-primary/25"
                      : "border-border/30"
                  }`}
    >
      {popular && (
        <span className="absolute -top-3 left-5 text-[11px] px-2 py-1 rounded-full bg-primary text-primary-foreground shadow">
          Most Popular
        </span>
      )}

      <div className="mb-1 text-sm text-muted-foreground">{name}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-semibold">
          {formatMoney(priceMonthly)}
        </div>
        <div className="text-sm text-muted-foreground">/ month</div>
      </div>

      <div className="mt-2 text-sm">
        <span className="font-medium">{credits}</span>{" "}
        <span className="text-muted-foreground">credits / month</span>
      </div>

      {description && (
        <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      )}

      <button
        onClick={() => onSelect?.(plan)}
        className="mt-4 w-full rounded-full bg-primary text-primary-foreground py-2.5 text-sm font-medium shadow hover:opacity-90 transition"
      >
        Choose {name}
      </button>

      {Array.isArray(features) && features.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-primary/70" />
              <span className="text-fg/90">{f}</span>
            </li>
          ))}
        </ul>
      )}

      {/* subtle footer note for yearly value */}
      {priceYearly && priceMonthly && priceYearly < priceMonthly * 12 && (
        <div className="mt-4 rounded-lg border border-border/30 bg-bg/40 p-2 text-[12px] text-muted-foreground">
          Save{" "}
          <span className="font-medium">
            {formatMoney(priceMonthly * 12 - priceYearly)}
          </span>{" "}
          with yearly billing ({formatMoney(priceYearly)}/yr)
        </div>
      )}
    </div>
  );
}

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetch; replace with your API call if needed
  useEffect(() => {
    const t = setTimeout(() => {
      setPlans(Array.isArray(dummyPlans) ? dummyPlans : []);
      setLoading(false);
    }, 200); // tiny delay for skeleton demo
    return () => clearTimeout(t);
  }, []);

  const hasPlans = plans && plans.length > 0;

  const handleSelect = (plan) => {
    // Hook up to checkout or route to billing
    // e.g., navigate(`/billing/checkout?plan=${plan.id}`)
    console.log("Selected plan:", plan);
  };

  return (
    <div className="relative min-h-[60vh]">
      {/* faint background grid to match your app */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          color: "oklch(0.21 0.02 255)",
          maskImage:
            "radial-gradient(ellipse at 50% 10%, black 40%, transparent 75%)",
        }}
      />

      {/* header */}
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-muted/50 backdrop-blur text-xs text-muted-foreground mb-4">
          billing
        </div>
        <h1 className="text-3xl sm:text-[2.25rem] font-semibold tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-white via-[oklch(0.75_0.05_250)] to-[oklch(0.35_0.12_250)] bg-clip-text text-transparent">
            Credits
          </span>{" "}
          & Plans
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground">
          Pick a plan that fits your usage. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* plans */}
      <div className="mx-auto max-w-5xl px-4 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonPlan key={i} />
            ))}
          </div>
        ) : hasPlans ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((p, i) => (
              <PlanCard
                key={p.id ?? p.name ?? i}
                plan={p}
                onSelect={handleSelect}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border/30 bg-muted/40 p-10 text-center">
            <div className="text-4xl mb-2">💳</div>
            <h3 className="text-lg font-medium">No plans available</h3>
            <p className="text-sm text-muted-foreground">
              Plans will appear here when the catalog is ready.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Credits;
