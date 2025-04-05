"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const useAuthVerification = () => {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndPermissions = async () => {
      try {
        console.log("====================================");
        console.log("Starting the verification process...");
        console.log("====================================");

        // ✅ Step 1: Check onboarding status
        if (typeof window !== "undefined") {
          const onboarding = localStorage.getItem("onboarding");

          console.log("====================================");
          console.log("Onboarding Status:", onboarding);
          console.log("====================================");

          if (!onboarding) {
            console.log("====================================");
            console.log("Redirecting to Get Started page...");
            console.log("====================================");
            router.replace("/pages/onboarding/getstarted");
            return;
          }

          // ✅ Step 2: Check LPS and NPS
          const NPS = localStorage.getItem("NPS");
          const LPS = localStorage.getItem("LPS");

          console.log("====================================");
          console.log("NPS:", NPS, " | LPS:", LPS);
          console.log("====================================");

          if (!LPS && "permissions" in navigator) {
            try {
              console.log("====================================");
              console.log("Checking location permission...");
              console.log("====================================");

              const locationPermission = await navigator.permissions.query({
                name: "geolocation",
              });
              console.log(
                "Location Permission State:",
                locationPermission.state
              );
              if (locationPermission.state !== "granted") {
                console.log("====================================");
                console.log("Redirecting to location permissions page...");
                console.log("====================================");

                router.replace("/pages/onboarding/permissions/location");
                return;
              }
            } catch (error) {
              console.log("====================================");
              console.warn("Geolocation permission check failed", error);
              console.log("====================================");
            }
          }

          if (
            !NPS &&
            typeof Notification !== "undefined" &&
            Notification.permission !== "granted"
          ) {
            console.log("====================================");
            console.log("Redirecting to notification permissions page...");
            console.log("====================================");
            router.replace("/pages/onboarding/permissions/notification");
            return;
          }
        }

        // ✅ Step 3: Check authentication
        const response = await fetch("/api/authentication");
        const data = await response.json();

        console.log("====================================");
        console.log(data);
        console.log("====================================");

        if (!data.user) {
          console.log("====================================");
          console.log("User not found, redirecting to signin...");
          console.log("====================================");
          router.replace("/pages/auth/signin");
          return;
        }

        console.log("====================================");
        console.log("User authenticated successfully.");
        console.log("====================================");



        
        // ✅ Step 4: Check if user profile exists
        const profileResponse = await fetch("/api/userProfile/exist");
        const profileData = await profileResponse.json(); // Parse response

        console.log(profileData); // Debugging

        if (!profileData.exists) {
          // Explicitly check if profile exists
          console.log("====================================");
          console.log(
            "User profile not found, redirecting to createProfile..."
          );
          console.log("====================================");
          router.replace("/pages/onboarding/createprofile");
          return;
        } else {
          console.log("====================================");
          console.log("User profile found, proceeding...");
          console.log("====================================");
        }



        console.log("====================================");
        console.log("User verification complete. Proceeding...");
        console.log("====================================");

        setIsVerified(true);
      } catch (error) {
        console.log("====================================");
        console.error("Error in verification process:", error);
        console.log("====================================");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndPermissions();
  }, []);

  return { isVerified, loading };
};

export default useAuthVerification;
