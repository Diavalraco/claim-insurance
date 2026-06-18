function LoadingState() {
  const steps = [
    'Parsing claim structure',
    'Cross-referencing CPT / ICD codes',
    'Checking billing anomalies',
    'Generating risk assessment',
  ];

  return (
    <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-border bg-surface-raised p-12">
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-accent/20" />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent border-t-accent"
          style={{ animation: 'spin 1s linear infinite' }}
        />
        <div className="absolute inset-5 rounded-full border border-border" />
        <span className="font-mono text-lg font-medium text-accent">AI</span>
      </div>

      <p className="font-[family-name:var(--font-display)] text-2xl text-ink">Analyzing claim</p>
      <p className="mt-2 text-sm text-ink-muted">Running fraud detection heuristics</p>

      <ul className="mt-8 w-full max-w-xs space-y-2">
        {steps.map((step, i) => (
          <li
            key={step}
            className="flex items-center gap-3 text-sm text-ink-faint"
            style={{ animation: `fade-up 0.4s ease-out ${i * 0.3}s both` }}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
              style={{ animation: `pulse-ring 1.5s ease-in-out ${i * 0.3}s infinite` }}
            />
            {step}
          </li>
        ))}
      </ul>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-raised/50 p-12 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-surface-overlay">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="text-ink-faint" aria-hidden>
          <rect x="8" y="4" width="20" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 12h12M12 17h12M12 22h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="26" cy="26" r="8" fill="var(--color-surface)" stroke="currentColor" strokeWidth="1.5" />
          <path d="M24 26l1.5 1.5L29 24" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="font-[family-name:var(--font-display)] text-2xl text-ink">Awaiting Document</h3>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
        Submit a claim or EOB on the left. Results will appear here with a legitimacy score,
        risk classification, and itemized flags.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {['CPT/ICD mismatch', 'Upcoding', 'Unbundling', 'Billing gaps'].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border px-3 py-1 text-[11px] text-ink-faint"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export { LoadingState, EmptyState };
