"use client";

import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";

export type RevenuePoint = {
  date: string;
  label: string;
  revenue: number;
};

function compactPKR(amount: number) {
  if (amount >= 1_000_000) return `PKR ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `PKR ${(amount / 1_000).toFixed(amount >= 10_000 ? 0 : 1)}k`;
  return `PKR ${amount}`;
}

function fullPKR(amount: number) {
  return `PKR ${new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 0,
  }).format(Math.round(amount))}`;
}

export default function RevenueChart({
  data,
  total,
  rangeLabel = "Last 30 Days",
}: {
  data: RevenuePoint[];
  total: number;
  rangeLabel?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const max = useMemo(
    () => Math.max(1, ...data.map((d) => d.revenue)),
    [data],
  );

  const avg = useMemo(() => {
    if (data.length === 0) return 0;
    return total / data.length;
  }, [data.length, total]);

  const peak = useMemo(() => {
    if (data.length === 0) return null;
    return data.reduce((p, c) => (c.revenue > p.revenue ? c : p), data[0]);
  }, [data]);

  const active = hovered !== null ? data[hovered] : null;

  return (
    <div className="rounded-2xl border border-border bg-cream p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Revenue
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-cocoa">
            {rangeLabel}
          </p>
        </div>

        <div className="flex flex-col items-start gap-1 sm:items-end">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-light px-3 py-1.5 text-xs font-semibold text-rose">
            <TrendingUp
              strokeWidth={2}
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            {fullPKR(total)}
          </span>
          <span className="text-[11px] text-muted">
            Avg/day {compactPKR(avg)}
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted">
          No revenue data yet.
        </div>
      ) : (
        <>
          <div
            className="relative flex items-end gap-1"
            style={{ height: "180px" }}
            onMouseLeave={() => setHovered(null)}>
            {[0.25, 0.5, 0.75].map((g) => (
              <div
                key={g}
                aria-hidden="true"
                className="pointer-events-none absolute left-0 right-0 border-t border-dashed border-border/60"
                style={{ bottom: `${g * 100}%` }}
              />
            ))}

            {data.map((d, i) => {
              const height = Math.max(2, Math.round((d.revenue / max) * 100));
              const isHovered = hovered === i;
              const isPeak = peak && d.date === peak.date && d.revenue > 0;
              return (
                <button
                  type="button"
                  key={d.date}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  aria-label={`${d.label}: ${fullPKR(d.revenue)}`}
                  className="group relative flex h-full flex-1 flex-col items-center justify-end gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className={`w-full rounded-t-md transition-all duration-200 ${
                        isHovered
                          ? "bg-rose"
                          : isPeak
                            ? "bg-rose/70"
                            : "bg-rose-light group-hover:bg-rose/60"
                      }`}
                      style={{ height: `${height}%` }}
                      aria-hidden="true"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex gap-1">
            {data.map((d, i) => {
              const showLabel =
                data.length <= 14 ||
                i === 0 ||
                i === data.length - 1 ||
                i % Math.ceil(data.length / 6) === 0;
              return (
                <div
                  key={d.date}
                  className="flex-1 text-center text-[10px] font-medium text-muted">
                  {showLabel ? d.label : ""}
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full bg-rose"
                  aria-hidden="true"
                />
                Daily revenue
              </span>
              {peak && peak.revenue > 0 && (
                <span className="hidden sm:inline">
                  Peak{" "}
                  <span className="font-semibold text-cocoa">{peak.label}</span>{" "}
                  ({compactPKR(peak.revenue)})
                </span>
              )}
            </div>

            {active ? (
              <p className="text-xs text-muted">
                <span className="font-semibold text-cocoa">{active.label}</span>{" "}
                ·{" "}
                <span className="font-semibold text-cocoa">
                  {fullPKR(active.revenue)}
                </span>
              </p>
            ) : (
              <p className="text-xs text-muted">
                Hover a bar for details
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
