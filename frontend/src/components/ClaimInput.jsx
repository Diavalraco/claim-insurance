import { useRef } from 'react';
import { extractTextFromPdf } from '../utils/pdfParser';
import { SAMPLE_CLAIM } from '../utils/sampleData';

function IconUpload() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 2v8M5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 11v1a1 1 0 001 1h8a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconSample() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 6h5M5.5 8.5h5M5.5 11h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconScan() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M2 6V4a2 2 0 012-2h2M14 2h2a2 2 0 012 2v2M16 12v2a2 2 0 01-2 2h-2M4 16H2a2 2 0 01-2-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function ClaimInput({
  claimText,
  onClaimTextChange,
  onAnalyze,
  isLoading,
  error,
}) {
  const fileInputRef = useRef(null);
  const charCount = claimText.length;
  const lineCount = claimText ? claimText.split('\n').length : 0;

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      onClaimTextChange(claimText, 'Please upload a valid PDF file.');
      return;
    }

    try {
      const text = await extractTextFromPdf(file);
      onClaimTextChange(text, null);
    } catch (err) {
      onClaimTextChange(claimText, err.message || 'Failed to read PDF file.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Intake</p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-ink">
            Claim Document
          </h2>
        </div>
        {charCount > 0 && (
          <div className="shrink-0 rounded-lg border border-border bg-surface-overlay px-3 py-2 text-right">
            <p className="font-mono text-xs text-ink-muted">{charCount.toLocaleString()} chars</p>
            <p className="font-mono text-[10px] text-ink-faint">{lineCount} lines</p>
          </div>
        )}
      </div>

      <div className="relative flex-1">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-2 border-b border-border bg-surface-overlay/80 px-4 py-2 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-accent/60" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
            CMS-1500 / EOB Parser
          </span>
        </div>

        <textarea
          value={claimText}
          onChange={(e) => onClaimTextChange(e.target.value, null)}
          placeholder={"Paste claim or EOB text here...\n\nSupports CMS-1500 forms, explanation of benefits, and itemized billing statements."}
          className="claim-editor h-full min-h-[380px] w-full resize-none rounded-xl border border-border bg-[#0e0d0b] px-4 pb-4 pt-10 text-ink transition-colors focus:border-accent/40 focus:ring-1 focus:ring-accent/20 disabled:opacity-60"
          disabled={isLoading}
          spellCheck={false}
        />

        {isLoading && (
          <div className="pointer-events-none absolute inset-x-4 top-10 h-px overflow-hidden">
            <div
              className="h-full w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent"
              style={{ animation: 'scan-line 2s ease-in-out infinite' }}
            />
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-ink-muted transition hover:border-border-bright hover:bg-surface-overlay hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          <IconUpload />
          PDF Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handlePdfUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => onClaimTextChange(SAMPLE_CLAIM, null)}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-ink-muted transition hover:border-border-bright hover:bg-surface-overlay hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          <IconSample />
          Load Sample
        </button>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={isLoading || !claimText.trim()}
          className="ml-auto inline-flex items-center gap-2.5 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-surface transition hover:bg-[#d4ad2f] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent"
        >
          <IconScan />
          {isLoading ? 'Scanning...' : 'Run Analysis'}
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3">
          <span className="mt-0.5 text-danger">✕</span>
          <p className="text-sm leading-relaxed text-danger/90">{error}</p>
        </div>
      )}
    </div>
  );
}
