import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import BottomWrapper from "../components/BottomWrapper";
import { ThemeHandler } from "../components/ThemeHandler";
import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from '@next/third-parties/google'
import "./globals.css";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

export const metadata: Metadata = {
  title: "Geo Radius News — HyperLocal Community-Powered News Application",
  description:
    "Get real-time HyperLocal news updates from your neighborhood. Geo Radius News lets users share, verify, and access updates based on location — for the people, by the people.",
  keywords: [
    "local news app",
    "HyperLocal news",
    "neighborhood updates",
    "geo based news",
    "location news alerts",
    "community journalism",
    "crowd sourced news",
    "news verification",
    "real-time local updates",
    "Geo Radius News"
  ],
  verification: {
    google: "NNBw6f7lAr5SUMYT2XyMDeknY_fr1ad6mUgnRXBL3TM",
  },
  alternates: {
    canonical: "https://georadiusnews.vercel.app",
  },
  other: {
    "next-size-adjust": "100%",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  authors: [{ name: "Geo Radius Team", url: "https://georadiusnews.vercel.app" }],
  creator: "Amit Gupta | Geo Radius News",
  metadataBase: new URL("https://georadiusnews.vercel.app"),
  openGraph: {
    title: "Geo Radius News — HyperLocal Community-Powered News Application",
    description:
      "Get real-time HyperLocal news updates from your neighborhood. Geo Radius News lets users share, verify, and access updates based on location — for the people, by the people.",
    url: "https://georadiusnews.vercel.app",
    siteName: "Geo Radius News",
    images: [
      {
        url: "https://georadiusnews.vercel.app/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Geo Radius — HyperLocal News App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geo Radius News — HyperLocal Community-Powered News Application",
    description:
      "Get real-time HyperLocal news updates from your neighborhood. Geo Radius News lets users share, verify, and access updates based on location — for the people, by the people.",
    images: ["https://georadiusnews.vercel.app/opengraph-image.png"], // Replace with actual image
  },
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

export const viewport: Viewport = {
  themeColor: '#111827',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

const updatedTime = "2025-06-14T12:00:00+05:30";

/////////////////////////////////////////////////////////////////////////////////////////////////////

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta property="og:updated_time" content={updatedTime} />

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsMediaOrganization",
              "name": "Geo Radius News — HyperLocal Community-Powered News Application",
              "url": "https://georadiusnews.vercel.app",
              "description":
                "Get real-time HyperLocal news updates from your neighborhood. Geo Radius News lets users share, verify, and access updates based on location — for the people, by the people.",
              "inLanguage": "en",
              "foundingDate": "2025-06-05",
              "publisher": {
                "@type": "Organization",
                "name": "Geo Radius News — HyperLocal Community-Powered News Application",
                "url": "https://georadiusnews.vercel.app",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://georadiusnews.vercel.app/icons/icon-192x192.png"
                }
              },
              "applicationCategory": "NewsApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0.00",
                "priceCurrency": "INR"
              },
              "creator": {
                "@type": "Person",
                "name": "Amit Gupta"
              }
            }),
          }}
        />
      </head>


      <body className="antialiased relative bg-white dark:bg-neutral-900">
        <div className="lg:hidden">
          <ThemeHandler>
            <main>
              <Toaster richColors position="top-right" />
              {children}
              <BottomWrapper />
            </main>
            <Toaster richColors position="top-center" expand={false} closeButton />
          </ThemeHandler>
        </div>
        <div className="hidden lg:flex items-center justify-center h-screen w-full dark:bg-neutral-900 px-10">
          <p className="max-w-lg mx-auto text-center">You&#39;re currently viewing the web version of the Geo Radius app. For the best experience, please use a mobile device.</p>
        </div>
      </body>

      <GoogleAnalytics gaId="G-JLMGJ6PG9F" />

    </html>
  );
}
