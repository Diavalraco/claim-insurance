import { getScoreTheme, getRiskTheme, getRecommendationTheme } from '../utils/theme';

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreCard({ result }) {
  const { score, risk, recommendation, summary } = result;
  const scoreTheme = getScoreTheme(score);
  const riskTheme = getRiskTheme(risk);
  const recTheme = getRecommendationTheme(recommendation);
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  return (
    <div className="animate-fade-up overflow-hidden rounded-2xl border border-border bg-surface-raised">
      <div
        className="relative px-6 pb-6 pt-8"
        style={{ background: `radial-gradient(ellipse at 20% 0%, ${scoreTheme.glow} 0%, transparent 60%)` }}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Verdict</p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl text-ink">
              Legitimacy Assessment
            </h3>
          </div>
          <div
            className={`stamp rounded-lg px-4 py-2 text-sm font-bold ${recTheme.color} ${recTheme.border} ${recTheme.bg}`}
          >
            {recommendation}
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
          <div className="relative flex h-44 w-44 shrink-0 items-center justify-center">
            <div
              className="absolute inset-2 rounded-full"
              style={{
                boxShadow: `0 0 40px ${scoreTheme.glow}`,
                animation: 'pulse-ring 3s ease-in-out infinite',
              }}
            />
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              {[...Array(20)].map((_, i) => {
                const angle = (i / 20) * 360 - 90;
                const rad = (angle * Math.PI) / 180;
                const x1 = 60 + 46 * Math.cos(rad);
                const y1 = 60 + 46 * Math.sin(rad);
                const x2 = 60 + 52 * Math.cos(rad);
                const y2 = 60 + 52 * Math.sin(rad);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#2e2b28"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                );
              })}
              <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#1c1a17" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                fill="none"
                stroke={scoreTheme.stroke}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                className="gauge-arc"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-mono text-4xl font-medium tracking-tight ${scoreTheme.text}`}>
                {score}
              </span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-faint">
                / 100
              </span>
              <span className={`mt-1 text-xs font-medium ${scoreTheme.text}`}>
                {scoreTheme.label}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-5 text-center sm:text-left">
            <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-surface-overlay px-4 py-3">
              <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Risk</span>
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${riskTheme.bg} ${riskTheme.text} ${riskTheme.border}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${riskTheme.dot}`} />
                {risk}
              </span>
            </div>

            {summary && (
              <blockquote className="border-l-2 border-accent/50 pl-4">
                <p className="text-sm leading-[1.7] text-ink-muted italic">{summary}</p>
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
