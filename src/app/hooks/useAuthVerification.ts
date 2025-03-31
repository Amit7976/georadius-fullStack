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
        console.log("Starting authentication and verification process...");
        console.log("====================================");

        const response = await fetch("/api/authentication");
        const data = await response.json();

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
        console.log("User ID:", data.user.id);
        console.log("====================================");

        // ✅ Step 1: Fetch Interest List from UserProfile
        console.log("====================================");
        console.log("Fetching user interests...");
        console.log("====================================");

        const userProfileResponse = await fetch(`/api/userProfile/interest`);
        if (!userProfileResponse.ok)
          throw new Error("Failed to fetch interests");

        const { interest } = await userProfileResponse.json();
        console.log("====================================");
        console.log("User Interests:", interest);
        console.log("====================================");

        if (!Array.isArray(interest) || interest.length === 0) {
          console.log("====================================");
          console.log(
            "Interest is empty, redirecting to interest selection..."
          );
          console.log("====================================");
          router.replace("/pages/onboarding/interest");
          return;
        }

        // ✅ Step 2: Check if user profile has a name

        console.log("====================================");
        console.log("Fetching full user profile...");
        console.log("====================================");

        const profileResponse = await fetch("/api/userProfile/username");
        if (!profileResponse.ok)
          throw new Error("Failed to fetch user profile");

        const { isUsernameEmpty } = await profileResponse.json();
        console.log("====================================");
        console.log("User Profile username empty:", isUsernameEmpty);
        console.log("====================================");

        if (isUsernameEmpty) {
          console.log("====================================");
          console.log(
            "User username is missing, Redirecting to Create Profile page..."
          );
          console.log("====================================");
          router.replace("/pages/onboarding/createprofile");
          return;
        } else {
          // console.log("====================================");
          // console.log("User has a username, proceeding...");
          // console.log("====================================");
          console.log("====================================");
          console.log("User profile complete, redirecting to home...");
          console.log("====================================");
        }

        // ✅ Step 3: Onboarding & Permissions Check
        console.log("Checking onboarding and permissions...");
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

        console.log("====================================");
        console.log("User verification complete. Proceeding...");
        console.log("====================================");

        setIsVerified(true);
      } catch (error) {
        console.log("====================================");
        console.error("Error in authentication check:", error);
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
