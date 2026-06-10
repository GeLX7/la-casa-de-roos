import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { JsonLd } from "@/components/json-ld";
import { site, SITE_URL } from "@/data/site";
import { listings } from "@/data/listings";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: site.name,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fbf8f3",
};

/* LodgingBusiness JSON-LD. Street address intentionally omitted until the
   owner provides it (questions-for-owner.md Q4). No aggregateRating on
   purpose: Airbnb scores are shown visually with attribution only. */
const lodgingJsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: site.name,
  description: site.description,
  url: SITE_URL,
  telephone: `+${site.whatsappNumber}`,
  checkinTime: site.checkin,
  checkoutTime: site.checkout,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: site.region,
    addressCountry: site.country,
  },
  sameAs: [
    site.social.instagram,
    site.social.tiktok,
    site.social.facebook,
    ...listings.map((l) => l.airbnbUrl),
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={lodgingJsonLd} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
