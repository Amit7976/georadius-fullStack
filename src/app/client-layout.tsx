// app/client-layout.tsx
'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BottomNavigation from "../components/BottomNavigation";
import { Toaster } from "sonner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [userName, setUserName] = useState<string | null>(null);
    const [clientPath, setClientPath] = useState<string | null>(null);
    const pathname = usePathname();

    const allowedRoutes = ["/", "/" + userName, "/home", "/post", "/rapid", "/search"];

    useEffect(() => {
        const handleUnload = () => {
            localStorage.removeItem("NPS");
            localStorage.removeItem("LPS");
        };

        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, []);

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response = await fetch("/api/userProfile/username");
                const data = await response.json();
                if (data.username) setUserName(data.username);
            } catch (error) {
                console.error("Failed to fetch username:", error);
            }
        };

        fetchUserName();
    }, []);

    useEffect(() => {
        setClientPath(pathname);
    }, [pathname]);

    const showBottomNav = clientPath !== null && allowedRoutes.includes(clientPath);
    const showMain = !showBottomNav;

    return (
        <>
            {showMain && <main className="flex-grow">{children}</main>}
            <Toaster richColors position="top-center" expand={false} closeButton />
            {showBottomNav && <BottomNavigation />}
        </>
    );
}
