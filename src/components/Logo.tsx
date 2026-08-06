import React from 'react';

// ─── BuildScript Logo System ──────────────────────────────────────────────────
//
// Two distinct rendering modes:
//
//  LogoMark   — bare floating spark (no background container).
//               Light lavender→indigo gradient fill.
//               Use INSIDE the app on dark surfaces (nav, headers, splash).
//
//  AppIconMark — spark inside rounded-square midnight-indigo container.
//               White spark on dark bg. Use ONLY for the actual app icon,
//               loading screen full bleed, or anywhere needing a self-contained
//               square asset.
//
//  LogoWordmark — LogoMark + "BuildScript" text. Default export.
//
// Spark bolt polygon (80×80 viewBox):
//   points="46,10 24,44 40,44 34,70 58,34 42,34"
// ─────────────────────────────────────────────────────────────────────────────

// ── Bare spark (for UI use) ───────────────────────────────────────────────────
interface LogoMarkProps {
  size?: number;
  /** Override gradient. Defaults to light lavender→indigo (readable on dark bg). */
  lightGrad?: boolean;
}

export const LogoMark: React.FC<LogoMarkProps> = ({ size = 40, lightGrad = true }) => {
  const id = `bsGrad_${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="BuildScript"
    >
      <defs>
        {lightGrad ? (
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0e7ff" />
            <stop offset="100%" stopColor="#a5b4fc" />
          </linearGradient>
        ) : (
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0c0a2e" />
            <stop offset="100%" stopColor="#2d1b69" />
          </linearGradient>
        )}
      </defs>
      <polygon
        points="46,10 24,44 40,44 34,70 58,34 42,34"
        fill={`url(#${id})`}
      />
    </svg>
  );
};

// ── App icon (dark container + white spark) ───────────────────────────────────
interface AppIconMarkProps {
  size?: number;
  /** Corner radius as fraction of size. Default 0.22 (~iOS ratio). */
  radiusFraction?: number;
}

export const AppIconMark: React.FC<AppIconMarkProps> = ({
  size = 80,
  radiusFraction = 0.22,
}) => {
  const rx = Math.round(size * radiusFraction);
  const id = `bsIconGrad_${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="BuildScript"
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0c0a2e" />
          <stop offset="100%" stopColor="#2d1b69" />
        </linearGradient>
      </defs>
      {/* Background */}
      <rect width="100" height="100" rx={rx} fill={`url(#${id})`} />
      {/* White spark bolt */}
      <polygon
        points="57,13 29,55 50,55 42,87 73,43 52,43"
        fill="white"
      />
    </svg>
  );
};

// ── Full wordmark ─────────────────────────────────────────────────────────────
interface LogoWordmarkProps {
  size?: number;
  /** 'dark-bg' = white text (default). 'light-bg' = slate-900 text. */
  theme?: 'dark-bg' | 'light-bg';
  gap?: number;
}

export const LogoWordmark: React.FC<LogoWordmarkProps> = ({
  size = 40,
  theme = 'dark-bg',
  gap = 11,
}) => {
  const isDark = theme === 'dark-bg';
  const primaryColor = isDark ? '#ffffff' : '#0f172a';
  const secondaryColor = isDark ? 'rgba(255,255,255,0.45)' : '#64748b';
  const taglineColor = isDark ? 'rgba(165,180,252,0.65)' : '#6366f1';
  const fontSize = Math.round(size * 0.5);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap,
        userSelect: 'none',
        lineHeight: 1,
      }}
    >
      {/* Bare spark — no container box */}
      <LogoMark size={size} lightGrad={isDark} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", "Segoe UI", sans-serif',
              fontSize,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: primaryColor,
              lineHeight: 1,
            }}
          >
            Build
          </span>
          <span
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", "Segoe UI", sans-serif',
              fontSize,
              fontWeight: 300,
              letterSpacing: '-0.01em',
              color: secondaryColor,
              lineHeight: 1,
            }}
          >
            Script
          </span>
        </div>
        <span
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", "Segoe UI", sans-serif',
            fontSize: Math.max(8, Math.round(size * 0.18)),
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            color: taglineColor,
            lineHeight: 1,
          }}
        >
          Automotive Intelligence
        </span>
      </div>
    </div>
  );
};

/** Default export — full wordmark, dark background variant */
const Logo: React.FC<LogoWordmarkProps> = (props) => <LogoWordmark {...props} />;
export default Logo;
