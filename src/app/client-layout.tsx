'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BottomNavigation from "../components/BottomNavigation";
import { Toaster } from "sonner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [userName, setUserName] = useState<string | null>(null);
    const [showBottomNav, setShowBottomNav] = useState(false);
    const pathname = usePathname();

    const allowedRoutes = ["/", "/home", "/post", "/rapid", "/search"];
    if (userName) allowedRoutes.push("/" + userName);

    // Remove localStorage on refresh
    useEffect(() => {
        const handleUnload = () => {
            localStorage.removeItem("NPS");
            localStorage.removeItem("LPS");
        };
        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, []);

    // Get userName from server
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response = await fetch("/api/userProfile/username");
                if (response.status !== 204) {
                    const data = await response.json();
                    if (data.username) setUserName(data.username);
                }
            } catch (error) {
                console.error("Failed to fetch username:", error);
            }
        };
        fetchUserName();
    }, []);

    // Show or hide bottom nav based on route
    useEffect(() => {
        const timeout = setTimeout(() => {
            const shouldShow = allowedRoutes.includes(pathname);
            setShowBottomNav(shouldShow);
        }, 1000); // keep it short
        return () => clearTimeout(timeout);
    }, [pathname, userName, allowedRoutes]);

    // ✅ Instead of conditionally rendering <main>, we always render and just hide contents
    const isMainHidden = allowedRoutes.includes(pathname);
    console.log("AllowedRoutes:", allowedRoutes);
    console.log("Route:", pathname);
    console.log("Show BottomNav?", showBottomNav);
    console.log("Hide Main?", isMainHidden);

    return (
        <>
            {
                !isMainHidden && (
                    <main>
                        {children}
                    </main>
                )
            }
            <Toaster richColors position="top-center" expand={false} closeButton />
            {
                showBottomNav && (
                    <div>
                        <BottomNavigation />
                    </div>
                )
            }
        </>
    );
}
