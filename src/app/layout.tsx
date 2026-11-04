import AnalyticsTracker from "@/components/AnalyticsTracker";
import TrackingPixel from "@/components/TrackingPixel";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Suspense } from "react";
import { SITE_URL } from "@/lib/siteUrl";
import "./globals.css";

// Same @fontsource files as before, through next/font: it adds size-adjusted fallbacks, so the
// swap from fallback to web font doesn't shift the layout (CLS).
const inter = localFont({
  src: [
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  // Not preloaded: the size-adjusted fallback already holds the layout, and the 300 weight is home-only.
  preload: false,
  adjustFontFallback: "Arial",
});
const playfair = localFont({
  src: [{ path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-600-normal.woff2", weight: "600", style: "normal" }],
  variable: "--font-playfair",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Fozzie's Dining",
    template: "%s | Fozzie's Dining",
  },
  description: "Chef-driven dining in Cookeville, Tennessee with seasonal menus, warm hospitality, and elevated service.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Fozzie's Dining",
    title: "Fozzie's Dining",
    description: "Chef-driven dining in Cookeville, Tennessee with seasonal menus, warm hospitality, and elevated service.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Candlelit table setting at Fozzie's Dining in Cookeville, TN",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fozzie's Dining",
    description: "Chef-driven dining in Cookeville, Tennessee with seasonal menus, warm hospitality, and elevated service.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        {gaMeasurementId ? (
          <>
            {/* gtag.js loads after window load (no high-priority preload competing with the
                first paint). The inline stub below defines window.gtag/dataLayer right after
                hydration, so events queue and are sent once gtag.js arrives. */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="lazyOnload"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', { anonymize_ip: true, send_page_view: false });
              `}
            </Script>
          </>
        ) : null}
        <AnalyticsTracker />
        <Suspense fallback={null}>
          <TrackingPixel />
        </Suspense>
        <div className="flex-1">
          <Header />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
