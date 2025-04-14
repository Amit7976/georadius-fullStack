"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

function MainContent() {
  const router = useRouter();
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      const permission = Notification.permission;
      setPermissionStatus(permission);

      if (permission === "granted") {
        router.replace("/");
      }
    }
  }, []);

  const requestNotificationPermission = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }

    Notification.requestPermission().then((permission) => {
      setPermissionStatus(permission);
      if (permission === "granted") {
        new Notification("Notifications Enabled", {
          body: "You will receive breaking news updates!",
          icon: "/icons/notification.png",
        });

        router.replace("/");
      }
    });
  };

  return (
    <div className="flex items-center justify-around flex-col space-y-4 h-[94.3vh]">
      <Image
        src={"/gif/notification.gif"}
        alt="On Boarding Get Started"
        width={200}
        height={200}
        priority
        className="w-full h-96 object-contain"
      />

      <div>{/* EMPTY DIV FOR SPACING */}</div>
      <div className="flex items-center justify-center flex-col space-y-4 text-center bg-gray-50 px-10 pt-20 pb-14 rounded-t-[5rem] w-full bottom-0 absolute">
        <h1 className="text-3xl font-extrabold">Notification Permission</h1>
        <p className="text-xl font-semibold text-gray-600">
          We need your permission to send you notifications about breaking news or updates.
        </p>

        <button
          type="button"
          className="bg-green-600 active:bg-green-500 active:scale-95 px-20 py-4 mt-4 text-white text-xl font-bold rounded-md flex items-center justify-center gap-2"
          onClick={requestNotificationPermission}
          disabled={permissionStatus === "granted"}
        >
          {permissionStatus === "granted" ? "Enabled" : "Turn"}
          <FaRegBell className="text-2xl" />
          {permissionStatus === "granted" ? "" : "On"}
        </button>

        <div className="flex items-center justify-center">
          <Link
            href="/home"
            className="text-black text-lg font-extrabold"
            onClick={() => localStorage.setItem("NPS", "true")} // NOTIFICATION PERMISSION SKIPPED
          >
            Skip
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MainContent;
