import type { SVGProps } from "react";

/* Tiny inline icon set — avoids an icon dependency for ~15 glyphs.
   All stroke-based, inherit currentColor. */

type P = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const Star = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
  </svg>
);

export const Users = (p: P) => (
  <Base {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
    <circle cx="16.5" cy="9" r="2.5" />
    <path d="M16.5 14.5c2.5 0 4.5 1.8 4.5 4.2" />
  </Base>
);

export const Bed = (p: P) => (
  <Base {...p}>
    <path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" />
    <path d="M3 18h18M5 9V6h14v3M7.5 9V7.5h4V9" />
  </Base>
);

export const Bath = (p: P) => (
  <Base {...p}>
    <path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2zM7 12V5.5A1.5 1.5 0 0 1 8.5 4h.8M7 19.5L6 21M17 19.5L18 21" />
  </Base>
);

export const Wifi = (p: P) => (
  <Base {...p}>
    <path d="M3.5 9.5a12.5 12.5 0 0 1 17 0M6.5 12.8a8 8 0 0 1 11 0M9.5 16a4 4 0 0 1 5 0" />
    <circle cx="12" cy="19" r="0.8" fill="currentColor" />
  </Base>
);

export const Tv = (p: P) => (
  <Base {...p}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M9 21h6" />
  </Base>
);

export const Kitchen = (p: P) => (
  <Base {...p}>
    <path d="M5 3v7M8 3v7M6.5 10v11M6.5 3v0M16.5 3c-1.7 0-3 2-3 4.5S14.8 12 16.5 12 19.5 10 19.5 7.5 18.2 3 16.5 3zM16.5 12v9" />
  </Base>
);

export const SharedKitchen = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9 8v8M15 8v8M9 12h6" />
  </Base>
);

export const Key = (p: P) => (
  <Base {...p}>
    <circle cx="8" cy="15" r="4" />
    <path d="M11 12l8.5-8.5M16 7l2.5 2.5M13.5 9.5L16 12" />
  </Base>
);

export const Luggage = (p: P) => (
  <Base {...p}>
    <rect x="6" y="7" width="12" height="13" rx="2" />
    <path d="M9.5 7V4.5h5V7M9.5 11v5M14.5 11v5" />
  </Base>
);

export const Moon = (p: P) => (
  <Base {...p}>
    <path d="M20 13.5A8 8 0 1 1 10.5 4 6.5 6.5 0 0 0 20 13.5z" />
  </Base>
);

export const CalendarIcon = (p: P) => (
  <Base {...p}>
    <rect x="4" y="5" width="16" height="16" rx="2" />
    <path d="M4 10h16M8 3v4M16 3v4" />
  </Base>
);

export const Laundry = (p: P) => (
  <Base {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <circle cx="12" cy="13" r="4.5" />
    <path d="M8 6h1.5M11 6h1.5" />
  </Base>
);

export const Parking = (p: P) => (
  <Base {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M9.5 16V8h3.5a2.5 2.5 0 0 1 0 5H9.5" />
  </Base>
);

export const Desk = (p: P) => (
  <Base {...p}>
    <path d="M3 9h18M5 9v9M19 9v9M5 13h6v5" />
  </Base>
);

export const Iron = (p: P) => (
  <Base {...p}>
    <path d="M4 17h16v-3a6 6 0 0 0-6-6H8.5a3 3 0 0 0-3 3v0H20" />
  </Base>
);

export const MapPin = (p: P) => (
  <Base {...p}>
    <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </Base>
);

export const Camera = (p: P) => (
  <Base {...p}>
    <path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
    <circle cx="12" cy="13.5" r="3.5" />
  </Base>
);

export const ArrowRight = (p: P) => (
  <Base {...p}>
    <path d="M4 12h16M13 5l7 7-7 7" />
  </Base>
);

export const ExternalLink = (p: P) => (
  <Base {...p}>
    <path d="M14 4h6v6M20 4l-9 9M19 14v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
  </Base>
);

export const Check = (p: P) => (
  <Base {...p}>
    <path d="M4.5 12.5l5 5L19.5 7" />
  </Base>
);

export const WhatsApp = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.4.1-.6l.6-.7c.1-.1.1-.3 0-.4s-.6-1.4-.8-1.9-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.4 11.4 0 0 0 4.4 3.9 14.6 14.6 0 0 0 1.5.5 3.5 3.5 0 0 0 1.6.1 2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.3-.2-.6-.3z" />
  </svg>
);

export const Instagram = (p: P) => (
  <Base {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
  </Base>
);

export const TikTok = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M16.6 3c.4 2 1.7 3.4 3.9 3.6v2.8c-1.5 0-2.8-.4-3.9-1.2v5.8a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.9a2.7 2.7 0 1 0 1.9 2.6V3h2.8z" />
  </svg>
);

export const Facebook = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.2-.1-2.2-.1a3.4 3.4 0 0 0-3.7 3.7v2.1H8v2.8h2.5v7h3z" />
  </svg>
);

const map = {
  wifi: Wifi,
  tv: Tv,
  bath: Bath,
  bed: Bed,
  users: Users,
  kitchen: Kitchen,
  "shared-kitchen": SharedKitchen,
  key: Key,
  luggage: Luggage,
  moon: Moon,
  calendar: CalendarIcon,
  laundry: Laundry,
  parking: Parking,
  desk: Desk,
  iron: Iron,
} as const;

export function AmenityIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name as keyof typeof map] ?? Check;
  return <Icon className={className} />;
}
