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

        // ✅ Step 2: Check if userProfile exists
        console.log("====================================");
        console.log("Checking if user profile exists...");
        console.log("====================================");

        const profileExistResponse = await fetch("/api/userProfile/exist");
        const profileExistData = await profileExistResponse.json();

        if (profileExistData.exists) {
          console.log("====================================");
          console.log("User profile exists, redirecting to home...");
          console.log("====================================");

          router.replace("/");
          return;
        }

        console.log("====================================");
        console.log("User profile not found, proceeding with profile setup...");
        console.log("====================================");

        setIsVerified(true);
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
    return <div className="flex items-center justify-center h-screen"><div className="loader"></div></div>;
  }

  return isVerified ? <MainContent /> : null;
}

export default Page;
