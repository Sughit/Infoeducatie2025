import React from 'react';

const colors = {
  dark: '#122C34',
  blue: '#2A4494',
  light: '#224870',
  highlight: '#4EA5D9',
};

// Hero 
export function HeroIllustration() {
  return (
    <svg width="450" height="340" viewBox="0 0 450 340" fill="none">
      <rect x="0" y="0" width="180" height="180" rx="30" fill={colors.dark} />
      <circle cx="340" cy="140" r="110" fill={colors.highlight} />
      <rect
        x="240"
        y="180"
        width="160"
        height="128"
        fill={colors.blue}
        transform="rotate(45 240 180)"
      />
    </svg>
  );
}

// Lectii
export function LessonsIllustration() {
  return (
    <svg width="400" height="350" viewBox="0 0 400 350" fill="none">
      <rect x="0"   y="0"   width="96"  height="96"  rx="12" fill={colors.highlight} />
      <circle cx="224" cy="80" r="56" fill={colors.light} />
      <rect x="128" y="128" width="80"  height="80"  rx="18" fill={colors.blue} />
      <circle cx="320" cy="224" r="42" fill={colors.dark} />
    </svg>
  );
}

// Simulari 
export function SimulationsIllustration() {
  return (
    <svg width="450" height="350" viewBox="0 0 450 350" fill="none">
      <polygon points="0,350 160,140 320,350" fill={colors.light} />
      <rect x="225" y="0"   width="225" height="160" fill={colors.dark} />
      <circle cx="90" cy="90" r="54" fill={colors.highlight} />
    </svg>
  );
}

// Teste
export function TestsIllustration() {
  return (
    <svg width="400" height="320" viewBox="0 0 400 320" fill="none">
      <rect x="60"  y="100" width="64"  height="200" rx="8" fill={colors.highlight} />
      <rect x="160" y="60"  width="64"  height="240" rx="8" fill={colors.blue} />
      <rect x="260" y="140" width="64"  height="160" rx="8" fill={colors.light} />
    </svg>
  );
}

// Sandbox 
export function SandboxIllustration() {
  return (
    <svg width="450" height="350" viewBox="0 0 450 350" fill="none">
      <rect x="30"  y="30"  width="180" height="120" fill={colors.highlight} />
      <rect x="180" y="90"  width="180" height="120" fill={colors.blue} opacity="0.8" />
      <rect x="108" y="150" width="180" height="120" fill={colors.light} opacity="0.6" />
    </svg>
  );
}

// Feedback
export function FeedbackIllustration() {
  return (
    <svg width="600" height="450" viewBox="0 0 600 450" fill="none">
      <path
        d="M60 60 h360 v180 h-120 l-40 40 l0 -40 h-260 z"
        fill={colors.highlight}
        stroke={colors.dark}
      />
      <path
        d="M180 180 h360 v160 h-80 l-40 40 l0 -40 h-360 z"
        fill={colors.blue}
        opacity="0.8"
      />
    </svg>
  );
}

