import { useState } from 'react';
import ClaimInput from './components/ClaimInput';
import ScoreCard from './components/ScoreCard';
import FlagList from './components/FlagList';
import ExtractedFields from './components/ExtractedFields';
import { LoadingState, EmptyState } from './components/AnalysisStates';

export default function App() {
  const [claimText, setClaimText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClaimTextChange = (text, err) => {
    setClaimText(text);
    if (err !== undefined) setError(err);
    else setError(null);
  };

  const handleAnalyze = async () => {
    if (claimText.trim().length < 20) {
      setError('Please enter a valid claim (at least 20 characters).');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim_text: claimText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze claim.');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grain relative min-h-screen bg-surface">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <header className="relative border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="relative flex h-11 w-11 items-center justify-center">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
                <rect width="44" height="44" rx="10" fill="#1c1a17" stroke="#2e2b28" strokeWidth="1" />
                <path d="M22 8l12 5v9c0 7.2-5 12-12 14.4C14 34 9 29.2 9 22V13z" fill="#c9a227" fillOpacity="0.15" stroke="#c9a227" strokeWidth="1.5" />
                <path d="M22 14v6M19 18l3-3 3 3" stroke="#c9a227" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="22" cy="26" r="3" stroke="#3d9e8f" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-ink sm:text-[1.75rem]">
                ClaimScope
              </h1>
              <p className="text-xs text-ink-faint">
                US Insurance Fraud Detection
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <span className="rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              v1.0
            </span>
            <span className="flex items-center gap-1.5 text-xs text-ink-faint">
              <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
              Engine ready
            </span>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-8 max-w-xl">
          <p className="font-[family-name:var(--font-display)] text-3xl leading-tight text-ink sm:text-4xl">
            Audit claims before they{' '}
            <em className="text-accent">cost you.</em>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Paste or upload CMS-1500 forms and EOB reports. AI scans for coding mismatches,
            billing anomalies, and common fraud patterns in seconds.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
          <section className="rounded-2xl border border-border bg-surface-raised p-5 sm:p-6">
            <ClaimInput
              claimText={claimText}
              onClaimTextChange={handleClaimTextChange}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              error={error}
            />
          </section>

          <section className="space-y-5">
            {isLoading && <LoadingState />}
            {!isLoading && !result && <EmptyState />}
            {!isLoading && result && (
              <>
                <ScoreCard result={result} />
                <FlagList flags={result.flags} />
                <ExtractedFields fields={result.extracted_fields} />
              </>
            )}
          </section>
        </div>
      </main>

      <footer className="relative mt-12 border-t border-border py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 sm:flex-row sm:px-8">
          <p className="text-xs text-ink-faint">
            Powered by OpenAI · Educational use only
          </p>
          <p className="font-mono text-[10px] text-ink-faint">
            Not a substitute for professional claims review
          </p>
        </div>
      </footer>
    </div>
  );
}
