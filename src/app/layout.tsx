import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import BottomNavigation from "../components/BottomNavigation";
import { auth } from "../auth";
import { redirect } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Geo Radius News Application",
  description: "The local news are covered by our friendly neighborhood news app the Geo radius news where users can share, verify and access updates based on location.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased max-w-lg relative mx-auto bg-gray-200">
        <main className="bg-white">
          {children}
          <BottomNavigation username={session?.user.username || false} />
        </main>
        <Toaster richColors position="top-center" expand={false} closeButton />
      </body>
    </html>
  );
}
