export function getScoreTheme(score) {
  if (score > 80) {
    return {
      stroke: '#5a9e6f',
      glow: 'rgba(90, 158, 111, 0.25)',
      text: 'text-safe',
      label: 'Legitimate',
    };
  }
  if (score >= 50) {
    return {
      stroke: '#d4a03c',
      glow: 'rgba(212, 160, 60, 0.25)',
      text: 'text-warn',
      label: 'Uncertain',
    };
  }
  return {
    stroke: '#c45c4a',
    glow: 'rgba(196, 92, 74, 0.3)',
    text: 'text-danger',
    label: 'Suspicious',
  };
}

export function getRiskTheme(risk) {
  const map = {
    Low: { bg: 'bg-safe/15', text: 'text-safe', border: 'border-safe/30', dot: 'bg-safe' },
    Medium: { bg: 'bg-warn/15', text: 'text-warn', border: 'border-warn/30', dot: 'bg-warn' },
    High: { bg: 'bg-danger/15', text: 'text-danger', border: 'border-danger/30', dot: 'bg-danger' },
  };
  return map[risk] || map.Medium;
}

export function getRecommendationTheme(rec) {
  const map = {
    Approve: { color: 'text-safe', border: 'border-safe', bg: 'bg-safe/10' },
    Review: { color: 'text-warn', border: 'border-warn', bg: 'bg-warn/10' },
    Reject: { color: 'text-danger', border: 'border-danger', bg: 'bg-danger/10' },
  };
  return map[rec] || map.Review;
}

export function getSeverityTheme(severity) {
  const map = {
    Low: { rail: 'bg-safe', badge: 'bg-safe/15 text-safe border-safe/25' },
    Medium: { rail: 'bg-warn', badge: 'bg-warn/15 text-warn border-warn/25' },
    High: { rail: 'bg-danger', badge: 'bg-danger/15 text-danger border-danger/25' },
  };
  return map[severity] || map.Medium;
}
