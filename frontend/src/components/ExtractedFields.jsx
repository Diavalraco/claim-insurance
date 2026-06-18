const FIELD_LABELS = {
  patient_name: 'Patient',
  provider_name: 'Provider',
  date_of_service: 'Date of Service',
  cpt_codes: 'CPT Codes',
  icd_codes: 'ICD Codes',
  billed_amount: 'Billed',
  allowed_amount: 'Allowed',
  insurance_type: 'Payer Type',
};

const FIELD_ICONS = {
  patient_name: '◉',
  provider_name: '⊕',
  date_of_service: '◷',
  cpt_codes: '⌗',
  icd_codes: '⊞',
  billed_amount: '$',
  allowed_amount: '¢',
  insurance_type: '◎',
};

function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return { display: '—', isEmpty: true };
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return { display: '—', isEmpty: true };
    return { display: value.join(' · '), isEmpty: false };
  }
  return { display: String(value), isEmpty: false };
}

export default function ExtractedFields({ fields }) {
  if (!fields) return null;

  const entries = Object.entries(FIELD_LABELS);

  return (
    <div className="animate-fade-up animate-fade-up-delay-2 rounded-2xl border border-border bg-surface-raised p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Extraction</p>
      <h3 className="mt-1 mb-5 font-[family-name:var(--font-display)] text-xl text-ink">
        Parsed Claim Data
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {entries.map(([key, label]) => {
          const { display, isEmpty } = formatValue(fields[key]);
          const isAmount = key === 'billed_amount' || key === 'allowed_amount';

          return (
            <div
              key={key}
              className="rounded-xl border border-border bg-surface-overlay px-4 py-3.5 transition hover:border-border-bright"
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span className="font-mono text-xs text-accent/70" aria-hidden>
                  {FIELD_ICONS[key]}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  {label}
                </span>
              </div>
              <p
                className={`truncate text-sm ${
                  isEmpty
                    ? 'text-ink-faint'
                    : isAmount
                      ? 'font-mono font-medium text-ink'
                      : 'text-ink-muted'
                }`}
                title={display}
              >
                {display}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
