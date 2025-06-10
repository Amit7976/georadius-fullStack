"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function MainContent() {
  const router = useRouter();
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      const permission = Notification.permission;
      if (permission === "granted") {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 10);
        document.cookie = `NPS=true; expires=${expires.toUTCString()}; path=/;`;
        router.replace("/pages/auth/signin");
      }
    }
  }, [router]);

  const requestNotificationPermission = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }

    Notification.requestPermission().then((permission) => {
      setPermissionStatus(permission);
      if (permission === "granted") {
        // Set cookie for 10 years
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 10);
        document.cookie = `NPS=true; expires=${expires.toUTCString()}; path=/;`;

        // Show welcome notification
        new Notification("Notifications Enabled", {
          body: "You will receive breaking news updates!",
          icon: "/icons/notification.png",
        });

        router.replace("/pages/auth/signin");
      }
    });
  };

  const handleSkip = () => {
    // Set session cookie (browser close = delete)
    document.cookie = `NPS=true; path=/;`;
    router.replace("/pages/auth/signin");
  };

  return (
    <div className="flex items-center justify-around flex-col space-y-4 h-[94.3vh] bg-white">
      <Image
        src={"/gif/notification.gif"}
        alt="On Boarding Get Started"
        width={200}
        height={200}
        priority
        className="w-full h-96 object-contain"
      />

      <div>{/* EMPTY DIV FOR SPACING */}</div>

      <div className="flex items-center justify-center flex-col space-y-4 text-center bg-gray-50 px-10 pt-10 pb-5 rounded-t-[5rem] w-full bottom-0 absolute">
        <h1 className="text-xl font-semibold text-black">Notification Permission</h1>
        <p className="text-sm font-medium text-gray-600">
          We need your permission to send you notifications about breaking news or updates.
        </p>

        <Button
          className="bg-green-600 active:bg-green-500  mt-4 text-white text-xl font-bold rounded-full flex items-center justify-center gap-2 w-full h-14"
          onClick={requestNotificationPermission}
          disabled={permissionStatus === "granted"}
        >
          Turn
          <FaRegBell className="text-5xl" />
          On
        </Button>

        <p className="capitalize text-red-500 font-bold">{(permissionStatus != 'granted' && permissionStatus != 'default') && permissionStatus}</p>


        <div className="flex items-center justify-center fixed top-3 right-3">
          <Button
            variant={'ghost'}
            size={'sm'}
            className="text-black text-sm font-semibold bg-gray-100 px-7 py-1 rounded-full duration-300 cursor-pointer"
            onClick={handleSkip}
          >
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MainContent;
