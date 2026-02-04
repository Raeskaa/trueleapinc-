/**
 * Shared theme configuration for TrueLeap
 * 
 * This file exports color values that match the CSS custom properties
 * defined in global.css for use in JavaScript contexts like Three.js.
 * 
 * Keep in sync with: src/styles/global.css @theme block
 */

// Primary palette
export const colors = {
  // Brand colors
  primary: '#5a2d82',        // oklch(0.3206 0.1561 300.2795) - Deep purple
  primaryBright: '#7c3aed',  // Brighter purple for hover/active
  primaryLight: '#a78bfa',   // oklch(0.6602 0.1163 307.9805) - Light purple
  primaryLighter: '#f3e8ff', // Light purple tint for backgrounds
  
  // Neutrals
  cream: '#faf9f7',          // oklch(0.9810 0.0053 106.4963)
  paper: '#f5f4f0',          // oklch(0.9649 0.0045 78.2980)
  charcoal: '#2a2533',       // oklch(0.25 0.03 300)
  charcoalLight: '#1f1a29',  // oklch(0.20 0.025 300)
  ink: '#2a2533',            // Same as charcoal
  muted: '#6b6173',          // oklch(0.55 0.02 300)
  
  // Globe-specific colors
  globe: {
    land: '#d1d5db',           // Light gray dots for land
    landDim: '#e5e7eb',        // Even lighter land
    cluster: '#5a2d82',        // Deep purple for clusters
    clusterBright: '#7c3aed',  // Brighter purple for hover
    arc: '#5a2d82',            // Arc connections
    glow: '#5a2d82',           // Glow effect
    atmosphere: '#f3e8ff',     // Light purple atmosphere
    base: '#f9fafb',           // Very light gray for globe base
    grid: '#e5e7eb',           // Light gray for grid lines
  },
  
  // Borders
  border: '#ebe9e5',         // oklch(0.9364 0.0068 97.3557)
  borderHover: '#e2dfd9',    // oklch(0.9141 0.0162 99.0098)
  borderDark: 'rgba(255, 255, 255, 0.08)',
  borderDarkHover: 'rgba(255, 255, 255, 0.16)',
} as const;

// Motion/easing values
export const motion = {
  easePremium: 'cubic-bezier(0.22, 1, 0.36, 1)',
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  durationFast: 0.15,
  durationNormal: 0.25,
  durationSlow: 0.4,
} as const;

// Border radius values
export const radius = {
  sm: '0.275rem',   // --radius - 4px
  md: '0.375rem',   // --radius - 2px  
  lg: '0.475rem',   // --radius (base)
  xl: '0.675rem',   // --radius + 4px
  '2xl': '0.875rem', // --radius + 8px
  full: '9999px',
} as const;

// Type exports for external use
export type ThemeColors = typeof colors;
export type GlobeColors = typeof colors.globe;
export type ThemeMotion = typeof motion;
