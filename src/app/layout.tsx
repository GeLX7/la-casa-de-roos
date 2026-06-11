import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { JsonLd } from "@/components/json-ld";
import { site, SITE_URL } from "@/data/site";
import { listings } from "@/data/listings";
import "./globals.css";

/* Single-family system following arequipa.com: Montserrat for everything,
   with 700/800 reserved for the heavier editorial headings. */
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
});

/* Brand name reads uppercase wherever it titles the site (tab, search
   results, link previews), matching the wordmark. Icons and the OG/Twitter
   images come from the app-dir file conventions (favicon.ico, icon.png,
   apple-icon.png, opengraph-image.jpg, twitter-image.jpg) so Next emits
   the tags with correct absolute URLs — no Vercel/Next default icon. */
const siteTitle = site.name.toUpperCase();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteTitle} · ${site.tagline}`,
    template: `%s · ${siteTitle}`,
  },
  description: site.description,
  applicationName: siteTitle,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: siteTitle,
    title: `${siteTitle} · ${site.tagline}`,
    description: site.description,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
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
  logo: `${SITE_URL}/images/brand/logo.jpg`,
  image: `${SITE_URL}/images/brand/landing-page.jpg`,
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
    <html lang="es" className={montserrat.variable}>
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
