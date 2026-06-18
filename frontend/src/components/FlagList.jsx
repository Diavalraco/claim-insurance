import { useState } from 'react';
import { getSeverityTheme } from '../utils/theme';

export default function FlagList({ flags }) {
  const [expanded, setExpanded] = useState(false);
  const visibleFlags = expanded ? flags : flags.slice(0, 3);
  const hasMore = flags.length > 3;

  if (!flags || flags.length === 0) {
    return (
      <div className="animate-fade-up animate-fade-up-delay-1 rounded-2xl border border-border bg-surface-raised p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Flags</p>
        <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl text-ink">No Issues Detected</h3>
        <p className="mt-3 text-sm text-ink-muted">
          The claim passed all automated red-flag checks. Manual review is still recommended for high-value claims.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-safe/25 bg-safe/10 px-3 py-2 text-sm text-safe">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Clean scan
        </div>
      </div>
    );
  }

  const highCount = flags.filter((f) => f.severity === 'High').length;

  return (
    <div className="animate-fade-up animate-fade-up-delay-1 rounded-2xl border border-border bg-surface-raised p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Anomalies</p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl text-ink">
            Flagged Issues
          </h3>
        </div>
        <div className="flex gap-2">
          <span className="rounded-lg border border-border bg-surface-overlay px-3 py-1.5 font-mono text-xs text-ink-muted">
            {flags.length} total
          </span>
          {highCount > 0 && (
            <span className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-1.5 font-mono text-xs text-danger">
              {highCount} critical
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {visibleFlags.map((flag, index) => {
          const theme = getSeverityTheme(flag.severity);
          return (
            <div
              key={`${flag.type}-${index}`}
              className="group relative flex gap-4 overflow-hidden rounded-xl border border-border bg-surface-overlay p-4 transition hover:border-border-bright"
            >
              <div className={`absolute left-0 top-0 h-full w-1 ${theme.rail}`} />
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface font-mono text-xs text-ink-faint">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-ink">{flag.type}</span>
                  <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${theme.badge}`}>
                    {flag.severity}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-ink-muted">{flag.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full rounded-lg border border-dashed border-border py-2.5 text-sm font-medium text-ink-muted transition hover:border-accent/40 hover:text-accent"
        >
          {expanded ? 'Collapse list' : `Reveal ${flags.length - 3} additional flags`}
        </button>
      )}
    </div>
  );
}
