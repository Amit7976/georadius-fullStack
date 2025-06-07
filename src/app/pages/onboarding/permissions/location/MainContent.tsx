"use client"
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/src/app/hooks/useGeolocation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";

function MainContent() {
  const router = useRouter();
  const [locationStatus, setLocationStatus] = useState<string>("");
  const location = useGeolocation();

  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          const expires = new Date();
          expires.setFullYear(expires.getFullYear() + 10);
          document.cookie = `LPS=true; expires=${expires.toUTCString()}; path=/;`;
          router.replace("/pages/onboarding/permissions/notification");
        }

        result.onchange = () => {
          setLocationStatus(result.state);
          if (result.state === "granted") {
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 10);
            document.cookie = `LPS=true; expires=${expires.toUTCString()}; path=/;`;
            router.replace("/pages/onboarding/permissions/notification");
          }
        };
      });
    } else {
      setLocationStatus("not supported");
    }
  }, [router]);


  const handleSkip = () => {
    document.cookie = `LPS=true; path=/;`;
    router.replace("/pages/onboarding/permissions/notification");
  };

  // Request location and on success set long term cookie (10 years)
  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 10);
        document.cookie = `LPS=true; expires=${expires.toUTCString()}; path=/;`;
        router.replace("/pages/onboarding/permissions/notification");
      },
      (error) => {
        alert("Location permission denied or error.");
      }
    );
  };


  return (
    <div className="flex items-center justify-around flex-col space-y-4 h-[94.3vh]">
      <Image
        src={"/gif/location.gif"}
        alt="On Boarding Get Started"
        width={200}
        height={200}
        priority
        className="w-full h-96 object-contain"
      />

      <div>{/* EMPTY DIV FOR SPACING */}</div>
      <div className="flex items-center justify-center flex-col space-y-4 text-center bg-gray-50 px-10 pt-20 pb-14 rounded-t-[5rem] w-full bottom-0 absolute">
        <h1 className="text-3xl font-extrabold">Location Permission</h1>
        <p className="text-xl font-semibold text-gray-600">
          We need your location to deliver the most accurate, real-time news on the go.
        </p>

        <Button
          className="bg-green-600 active:bg-green-500 active:scale-95 mt-4 text-white text-xl font-bold rounded-full flex items-center justify-center gap-2 w-2/4 h-14"
          onClick={requestLocationPermission}
        >
          Allow
          <FaLocationDot className="text-2xl" />
          Location
        </Button>

        <p>{locationStatus != 'granted' && locationStatus}</p>

        <div className="flex items-center justify-center fixed top-3 right-3">
          <Button
            variant={'ghost'}
            size={'sm'}
            className="text-black text-sm font-extrabold bg-gray-100 px-5 py-1.5 rounded-full active:scale-95 duration-300 cursor-pointer"
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
