import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/400-italic.css";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import TrackingPixel from "@/components/TrackingPixel";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { SITE_URL } from "@/lib/siteUrl";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        {gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
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
