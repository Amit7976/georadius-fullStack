import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { auth } from "../auth";
import BottomNavigation from "../components/BottomNavigation";
import { ThemeHandler } from "../components/ThemeHandler";
import "./globals.css";
import BottomWrapper from "../components/BottomWrapper";


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

export const metadata = {
  title: "Geo Radius News Application",
  description: "The local news are covered by our friendly neighborhood news app the Geo radius news where users can share, verify and access updates based on location.",
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
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
    </html>
  );
}
