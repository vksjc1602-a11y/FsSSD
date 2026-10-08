/**
 * AEGIS Signature Geometric Shield Logo
 * Minimalist financial-security emblem combining protection, stability, and intelligence.
 */

interface AegisLogoProps {
  className?: string;
  size?: number;
  variant?: 'light' | 'dark' | 'brand';
  showText?: boolean;
}

export default function AegisLogo({
  className = '',
  size = 32,
  variant = 'light',
  showText = true,
}: AegisLogoProps) {
  // Variant colors:
  // light: For deep brown background (white & terracotta)
  // dark: For cream background (deep brown & terracotta)
  // brand: Terracotta primary
  const strokeColor = variant === 'light' ? '#FFFFFF' : '#102A23';
  const accentColor = '#557A68';
  const textColor = variant === 'light' ? '#FFFFFF' : '#102A23';
  const subtitleColor = variant === 'light' ? '#9BAF9F' : '#557A68';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-label="AEGIS Emblem"
      >
        {/* Outer Minimalist Shield Geometry */}
        <polygon
          points="32,4 58,16 58,38 32,60 6,38 6,16"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeLinejoin="miter"
          fill="none"
        />

        {/* Inner Security Facet (Financial Vault & Intelligence Core) */}
        <polygon
          points="32,15 48,23 48,36 32,49 16,36 16,23"
          stroke={accentColor}
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="none"
        />

        {/* Central Core Keystone (Protection Axis) */}
        <line
          x1="32"
          y1="16"
          x2="32"
          y2="48"
          stroke={strokeColor}
          strokeWidth="2"
        />

        <line
          x1="18"
          y1="32"
          x2="46"
          y2="32"
          stroke={accentColor}
          strokeWidth="2"
        />

        {/* Central Intelligence Node */}
        <circle cx="32" cy="32" r="3.5" fill={accentColor} />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className="font-bold tracking-widest text-lg leading-tight uppercase"
              style={{ color: textColor, letterSpacing: '0.18em' }}
            >
              AEGIS
            </span>
          </div>
          <span
            className="text-[9px] font-mono tracking-wider uppercase leading-none opacity-80"
            style={{ color: subtitleColor }}
          >
            Financial Threat Intelligence
          </span>
        </div>
      )}
    </div>
  );
}
