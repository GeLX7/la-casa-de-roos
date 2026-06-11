import type { SVGProps } from "react";

/**
 * Decorative background motif system.
 *
 * Original line-art drawn for La Casa de Roos — a flower sketch echoing the
 * logo lockup, a sillar arch, the Misti silhouette, a llamita flame flick
 * and a drifting tile cluster. Conceptually inspired by lazzat.online's
 * floating background
 * squares and by botanical/city-poster references; nothing is copied,
 * every path is authored here and recolored to the brand palette.
 *
 * Rendering rules: background-only (aria-hidden, pointer-events-none),
 * very low opacity over the white-first pages, slow transform-only drift
 * (globals.css .motif-drift-*) that prefers-reduced-motion disables.
 */

type P = SVGProps<SVGSVGElement>;

function Sketch({ children, ...props }: P) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/* Open bloom with bud and leaves — free redraw of the lockup's flower. */
export function MotifFlower(p: P) {
  return (
    <Sketch viewBox="0 0 120 170" {...p}>
      <path d="M60 64c-3-12 2-24 12-28 4 8 3 20-4 27" />
      <path d="M64 62c5-11 17-16 27-12-2 9-11 17-21 18" />
      <path d="M68 66c12-2 23 4 26 14-9 4-21 0-27-8" />
      <path d="M64 70c11 4 17 15 14 25-9-1-17-10-18-20" />
      <path d="M58 70c-2 11-12 19-22 18-1-9 6-19 16-22" />
      <path d="M56 66c-12 1-22-6-24-16 9-3 20 2 26 10" />
      <circle cx="61" cy="66" r="4.5" />
      <path d="M61 75c-2 28-4 47-3 78" />
      <path d="M59 102c-12-2-20-11-21-22 11 0 20 9 21 19" />
      <path d="M60 118c10-6 21-5 28 2-7 8-19 9-27 3" />
      <path d="M30 48c-2-9 2-17 9-20 3 6 1 15-5 19" />
      <path d="M33 51c-7 27 9 41 25 51" />
    </Sketch>
  );
}

/* Sillar portal arch — the logo's frame, drawn as a doorway. */
export function MotifArch(p: P) {
  return (
    <Sketch viewBox="0 0 110 140" {...p}>
      <path d="M15 134V58c0-27 18-46 40-46s40 19 40 46v76" />
      <path d="M29 134V60c0-19 12-33 26-33s26 14 26 33v74" />
      <path d="M7 134h96" />
    </Sketch>
  );
}

/* Misti over the skyline — twin ridge with a sun, poster-style. */
export function MotifMisti(p: P) {
  return (
    <Sketch viewBox="0 0 180 90" {...p}>
      <path d="M6 82l40-52 16 18 14-30 34 42 12-14 22 36" />
      <path d="M66 36l5 7 6-9" />
      <circle cx="150" cy="22" r="9" />
      <path d="M6 82h168" />
    </Sketch>
  );
}

/* Llamita — a small flame flick (candle/volcanic ember), two tongues
   and a spark, for tiny warm accents between the larger motifs. */
export function MotifLlamita(p: P) {
  return (
    <Sketch viewBox="0 0 64 96" {...p}>
      <path d="M32 6C24 18 14 31 14 48c0 14 8 24 18 26 10-2 18-12 18-26 0-17-10-30-18-42z" />
      <path d="M32 40c-4 8-8 12-8 19 0 6 3 10 8 11 5-1 8-5 8-11 0-7-4-11-8-19z" />
      <circle cx="49" cy="14" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="13" cy="28" r="1.1" fill="currentColor" stroke="none" />
    </Sketch>
  );
}

/* Cantuta sprig — Peru's national flower (Arequipa's beloved "texao"):
   an arched twig with three hanging trumpet blooms and a pair of leaves. */
export function MotifCantuta(p: P) {
  return (
    <Sketch viewBox="0 0 120 150" {...p}>
      <path d="M10 18c26-3 50 7 68 25 9 9 17 19 23 30" />
      <path d="M34 22c8-9 19-12 28-8-5 9-16 13-28 8z" />
      <path d="M66 42c10-5 21-3 27 4-8 7-19 7-27-4z" />
      <path d="M36 26v8" />
      <path d="M32 34c-2 9-1 17 2 24" />
      <path d="M40 34c2 9 1 17-2 24" />
      <path d="M33 58l-5 8" />
      <path d="M36 59v9" />
      <path d="M39 58l5 8" />
      <path d="M64 46v8" />
      <path d="M60 54c-2 9-1 17 2 24" />
      <path d="M68 54c2 9 1 17-2 24" />
      <path d="M61 78l-5 8" />
      <path d="M64 79v9" />
      <path d="M67 78l5 8" />
      <path d="M90 68v8" />
      <path d="M86 76c-2 9-1 17 2 24" />
      <path d="M94 76c2 9 1 17-2 24" />
      <path d="M87 100l-5 8" />
      <path d="M90 101v9" />
      <path d="M93 100l5 8" />
    </Sketch>
  );
}

/* Leafy sprig — slender stem with alternating leaves and a tip bud, the
   small botanical filler between the larger pieces. */
export function MotifSprig(p: P) {
  return (
    <Sketch viewBox="0 0 70 110" {...p}>
      <path d="M36 104c-6-24-6-52 4-80 2-6 5-12 9-17" />
      <path d="M35 88c-10-2-17-9-18-18 9 0 16 7 18 18z" />
      <path d="M34 64c-9-4-13-12-12-21 8 2 13 10 12 21z" />
      <path d="M37 62c8-6 17-6 24-1-6 7-15 8-24 1z" />
      <path d="M36 42c-7-5-9-13-6-21 7 3 9 12 6 21z" />
      <path d="M38 40c6-7 14-9 21-6-4 8-13 11-21 6z" />
      <circle cx="51" cy="8" r="3.5" />
    </Sketch>
  );
}

/* Drifting tile cluster — the lazzat square rhythm, as sillar tiles. */
export function MotifTiles(p: P) {
  return (
    <Sketch viewBox="0 0 140 140" {...p}>
      <rect x="14" y="18" width="34" height="34" rx="3" transform="rotate(-8 31 35)" />
      <rect x="66" y="8" width="20" height="20" rx="2" transform="rotate(10 76 18)" fill="currentColor" stroke="none" opacity="0.55" />
      <rect x="92" y="46" width="30" height="30" rx="3" transform="rotate(-6 107 61)" />
      <rect x="34" y="74" width="24" height="24" rx="2.5" transform="rotate(7 46 86)" />
      <rect x="78" y="100" width="16" height="16" rx="2" transform="rotate(-12 86 108)" fill="currentColor" stroke="none" opacity="0.55" />
      <rect x="10" y="112" width="12" height="12" rx="2" transform="rotate(14 16 118)" />
    </Sketch>
  );
}

type Variant = "hero" | "band" | "panel" | "cta" | "garden" | "aside";

/**
 * Positioned motif sets per section flavor. Parent section must be
 * `relative overflow-hidden`; content above needs `relative`.
 *
 * - hero: cream canvas around the landing artwork and the scroll photo
 * - band: short centered copy bands
 * - panel: tinted full-width feature panels
 * - cta: closing card sections
 * - garden: white card-grid sections (suites, guide teaser)
 * - aside: split text sections with side margins to dress
 */
export function SectionMotifs({ variant }: { variant: Variant }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
      {variant === "hero" && (
        <>
          {/* Top cream zone, flanking the artwork. The corner florals only
              run below lg, where the centering gap above the artwork is tall
              enough that they never get cut by its invisible cream edge; on
              xl+ the artwork-anchored pieces (page.tsx) take over the sides. */}
          <MotifCantuta className="motif-drift-a absolute -left-8 top-[4%] w-36 text-arcilla-500/[0.15] [--motif-rot:-8deg] sm:left-0 sm:w-44 lg:hidden" />
          <MotifFlower className="motif-drift-b absolute -right-9 top-[2.5%] w-40 text-arcilla-500/[0.13] [--motif-rot:10deg] sm:right-0 sm:w-52 lg:hidden" />
          <MotifSprig className="motif-drift-c absolute left-[15%] top-[1%] hidden w-16 text-salvia-500/[0.17] [--motif-rot:7deg] md:block" />
          <MotifArch className="motif-drift-b absolute right-[15%] top-[1%] hidden w-24 text-cacao-700/[0.09] [--motif-rot:5deg] xl:block" />
          {/* Photo zone — pieces tuck behind the arch photo on scroll. */}
          <MotifCantuta className="motif-drift-b absolute -right-7 top-[54%] hidden w-40 text-arcilla-400/[0.13] [--motif-rot:13deg] md:block xl:right-0" />
          <MotifFlower className="motif-drift-c absolute -left-12 top-[60%] hidden w-48 text-arcilla-400/[0.12] [--motif-rot:-14deg] md:block xl:-left-2" />
          <MotifTiles className="motif-drift-a absolute -left-6 top-[48%] hidden w-28 text-salvia-500/[0.14] [--motif-rot:4deg] lg:block" />
          <MotifSprig className="motif-drift-a absolute right-[10%] bottom-[1.5%] hidden w-20 text-salvia-500/[0.16] [--motif-rot:-9deg] lg:block" />
          {/* Small-screen accents in the cream above and below the artwork. */}
          <MotifLlamita className="motif-drift-b absolute -left-1 top-[38%] w-9 text-arcilla-400/[0.14] [--motif-rot:-10deg] sm:hidden" />
          <MotifSprig className="motif-drift-c absolute right-[6%] top-[40%] w-12 text-salvia-500/[0.15] [--motif-rot:9deg] sm:hidden" />
        </>
      )}
      {variant === "band" && (
        <>
          <MotifArch className="motif-drift-a absolute -left-8 -top-6 w-36 text-cacao-700/[0.09] [--motif-rot:-6deg] sm:left-4 sm:w-44" />
          <MotifFlower className="motif-drift-b absolute -bottom-10 -right-6 hidden w-44 text-arcilla-500/[0.11] [--motif-rot:-10deg] sm:block lg:right-8" />
          <MotifLlamita className="motif-drift-c absolute right-10 top-8 hidden w-10 text-arcilla-500/[0.14] [--motif-rot:10deg] sm:block" />
          <MotifCantuta className="motif-drift-a absolute left-[16%] -top-3 hidden w-24 text-arcilla-400/[0.1] [--motif-rot:6deg] xl:block" />
          <MotifSprig className="motif-drift-c absolute right-[20%] -bottom-4 hidden w-16 text-salvia-500/[0.16] [--motif-rot:-10deg] md:block" />
        </>
      )}
      {variant === "panel" && (
        <>
          <MotifMisti className="motif-drift-b absolute -right-10 top-6 w-52 text-cacao-700/[0.1] [--motif-rot:2deg] sm:right-4 sm:w-64" />
          <MotifTiles className="motif-drift-a absolute -left-8 bottom-4 hidden w-32 text-arcilla-500/[0.11] [--motif-rot:-5deg] sm:block sm:left-2" />
          {/* Ember beside the volcano line. */}
          <MotifLlamita className="motif-drift-c absolute bottom-8 left-[20%] hidden w-10 text-arcilla-400/[0.15] [--motif-rot:-7deg] lg:block" />
          <MotifCantuta className="motif-drift-c absolute -left-6 top-8 hidden w-32 text-arcilla-400/[0.11] [--motif-rot:-9deg] lg:block lg:left-0" />
          <MotifSprig className="motif-drift-b absolute right-[26%] -bottom-3 hidden w-14 text-salvia-500/[0.15] [--motif-rot:11deg] lg:block" />
        </>
      )}
      {variant === "cta" && (
        <>
          <MotifTiles className="motif-drift-a absolute -left-10 top-8 w-36 text-arcilla-500/[0.12] [--motif-rot:6deg] sm:left-6" />
          <MotifTiles className="motif-drift-c absolute -right-10 bottom-6 w-32 text-cacao-700/[0.1] [--motif-rot:-9deg] sm:right-8" />
          <MotifFlower className="motif-drift-b absolute right-1/4 -top-12 hidden w-36 text-salvia-500/[0.14] [--motif-rot:12deg] lg:block" />
          <MotifLlamita className="motif-drift-b absolute left-1/4 bottom-10 hidden w-9 text-arcilla-500/[0.15] [--motif-rot:-8deg] md:block" />
          <MotifCantuta className="motif-drift-c absolute right-[5%] top-1/3 hidden w-28 text-arcilla-500/[0.11] [--motif-rot:9deg] xl:block" />
          <MotifSprig className="motif-drift-a absolute left-[9%] bottom-8 hidden w-16 text-salvia-500/[0.16] [--motif-rot:-7deg] lg:block" />
        </>
      )}
      {variant === "garden" && (
        <>
          <MotifCantuta className="motif-drift-a absolute -left-7 top-14 w-36 text-arcilla-500/[0.12] [--motif-rot:-7deg] sm:left-0 sm:w-44" />
          <MotifSprig className="motif-drift-c absolute right-[4%] top-6 hidden w-20 text-salvia-500/[0.16] [--motif-rot:8deg] md:block" />
          <MotifFlower className="motif-drift-b absolute -right-12 bottom-32 hidden w-44 text-arcilla-400/[0.11] [--motif-rot:-11deg] md:block xl:right-0" />
          <MotifSprig className="motif-drift-a absolute -left-3 bottom-44 hidden w-16 text-cacao-700/[0.1] [--motif-rot:14deg] lg:block" />
          <MotifLlamita className="motif-drift-b absolute left-[7%] bottom-10 hidden w-9 text-arcilla-500/[0.15] [--motif-rot:-8deg] lg:block" />
        </>
      )}
      {variant === "aside" && (
        <>
          <MotifSprig className="motif-drift-b absolute -left-2 top-[16%] w-16 text-salvia-500/[0.17] [--motif-rot:-6deg] sm:left-1 sm:w-20" />
          <MotifCantuta className="motif-drift-c absolute -right-8 top-10 hidden w-36 text-arcilla-500/[0.11] [--motif-rot:12deg] md:block xl:right-2" />
          <MotifFlower className="motif-drift-a absolute -left-14 bottom-6 hidden w-40 text-arcilla-400/[0.1] [--motif-rot:-12deg] lg:block xl:-left-4" />
          <MotifLlamita className="motif-drift-a absolute right-[14%] bottom-8 hidden w-9 text-cacao-700/[0.13] [--motif-rot:7deg] lg:block" />
        </>
      )}
    </div>
  );
}
