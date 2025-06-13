"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


export default function ClientNotificationHandler() {
    const router = useRouter();
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>("default");

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        if ("Notification" in window) {
            const permission = Notification.permission;
            setPermissionStatus(permission);

            if (permission === "granted") {
                const expires = new Date();
                expires.setFullYear(expires.getFullYear() + 10);
                document.cookie = `NPS=true; expires=${expires.toUTCString()}; path=/;`;
                router.replace("/pages/auth/signin");
            }
        }
    }, [router]);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const setLongTermCookie = () => {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 10);
        document.cookie = `NPS=true; expires=${expires.toUTCString()}; path=/;`;
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const requestNotificationPermission = () => {
        if (!("Notification" in window)) {
            alert("This browser does not support notifications.");
            return;
        }

        Notification.requestPermission().then((permission) => {
            setPermissionStatus(permission);
            if (permission === "granted") {
                setLongTermCookie();

                new Notification("Notifications Enabled", {
                    body: "You will receive breaking news updates!",
                    icon: "/icons/notification.png",
                });

                router.replace("/pages/auth/signin");
            }
        });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleSkip = () => {
        document.cookie = `NPS=true; path=/;`;
        router.replace("/pages/auth/signin");
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <>
            <Button
                className="bg-green-600 hover:bg-green-500 active:bg-green-500 mt-4 text-white text-xl font-bold rounded-full flex items-center justify-center gap-2 w-full h-14"
                onClick={requestNotificationPermission}
                disabled={permissionStatus === "granted"}
            >
                Turn
                <FaRegBell className="text-5xl" />
                On
            </Button>

            <p className="capitalize text-red-500 font-bold">
                {(permissionStatus !== "granted" && permissionStatus !== "default") && permissionStatus}
            </p>

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
