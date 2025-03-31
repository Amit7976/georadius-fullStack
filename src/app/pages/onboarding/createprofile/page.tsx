"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MainContent from "./MainContent";

function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        console.log("====================================");
        console.log("Starting authentication check...");
        console.log("====================================");

        // ✅ Step 1: Fetch Authenticated User
        const authResponse = await fetch("/api/authentication");
        const authData = await authResponse.json();

        if (!authData.user) {
          console.log("====================================");
          console.log("User not found, redirecting to signin...");
          console.log("====================================");

          router.replace("/pages/auth/signin");
          return;
        }

        console.log("====================================");
        console.log("User authenticated:", authData.user.id);
        console.log("====================================");


        // ✅ Step 2: Fetch User Interests
        console.log("====================================");
        console.log("Fetching user interests...");
        console.log("====================================");

        const interestResponse = await fetch(`/api/userProfile/interest`);
        if (!interestResponse.ok) throw new Error("Failed to fetch interests");

        const { interest } = await interestResponse.json();
        console.log("====================================");
        console.log("User Interests:", interest);
        console.log("====================================");


        if (!Array.isArray(interest) || interest.length === 0) {
          console.log("====================================");
          console.log("Interest is empty, redirecting to interest selection...");
          console.log("====================================");

          router.replace("/pages/onboarding/interest");
          return;
        }

        // ✅ Step 3: Fetch Full User Profile (Check Name)
        console.log("====================================");
        console.log("Fetching User's username...");
        console.log("====================================");

        const profileResponse = await fetch("/api/userProfile/username");
        if (!profileResponse.ok) throw new Error("Failed to fetch user profile");

        const { isUsernameEmpty } = await profileResponse.json();
        console.log("====================================");
        console.log("User Profile username empty:", isUsernameEmpty);
        console.log("====================================");

        if (isUsernameEmpty) {
          console.log("====================================");
          console.log("User username is missing, showing Create Profile page...");
          console.log("====================================");
          setIsVerified(true);
        } else {
          // console.log("====================================");
          // console.log("User has a username, proceeding...");
          // console.log("====================================");
          console.log("====================================");
          console.log("User profile complete, redirecting to home...");
          console.log("====================================");

          router.replace("/");
        }

      } catch (error) {
        console.log("====================================");
        console.error("Error in verification:", error);
        console.log("====================================");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return isVerified ? <MainContent /> : null;
}

export default Page;
