"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaLocationDot } from "react-icons/fa6";

export default function ClientPermissionHandler() {
    const router = useRouter();

    const setLocationPermissionCookie = () => {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 10);
        document.cookie = `LPS=true; expires=${expires.toUTCString()}; path=/;`;
    };

    const redirectToNext = () => {
        setLocationPermissionCookie();
        router.replace("/pages/onboarding/permissions/notification");
    };

    const requestLocationPermission = () => {
        if (!navigator.permissions || !navigator.geolocation) {
            toast.error("Geolocation or permissions API not supported");
            return;
        }

        navigator.permissions.query({ name: "geolocation" }).then((result) => {
            if (result.state === "granted") {
                redirectToNext();
            } else if (result.state === "prompt") {
                navigator.geolocation.getCurrentPosition(
                    () => {
                        redirectToNext();
                    },
                    () => {
                        toast.error("Permission denied. We need your location to continue.");
                    }
                );
            } else if (result.state === "denied") {
                toast.error("Location permission is denied. Please enable it in your browser settings.");
            }
        });
    };

    const handleSkip = () => {
        redirectToNext();
    };

    return (
        <>
            <Button
                className="bg-green-600 hover:bg-green-500 active:bg-green-500 active:scale-95 mt-4 text-white text-xl font-bold rounded-full flex items-center justify-center gap-2 w-full h-14"
                onClick={requestLocationPermission}
            >
                Allow
                <FaLocationDot className="text-2xl" />
                Location
            </Button>

            <div className="flex items-center justify-center fixed top-3 right-3">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-black text-sm font-semibold bg-gray-100 px-7 py-1 rounded-full duration-300 cursor-pointer"
                    onClick={handleSkip}
                >
                    Skip
                </Button>
            </div>
        </>
    );
}
