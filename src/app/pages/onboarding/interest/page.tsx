"use client";
import React, { useEffect, useState } from "react";
import MainContent from "./MainContent";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [interest, setInterest] = useState<string[]>([]);

  useEffect(() => {
    const checkUserInterest = async () => {
      try {
        console.log("====================================");
        console.log("Starting authentication check...");
        console.log("====================================");

        const response = await fetch("/api/authentication");
        if (!response.ok) throw new Error("Failed to fetch authentication");

        const data = await response.json();
        if (!data.user) {
          console.log("====================================");
          console.log("User not found, redirecting to signin...");
          console.log("====================================");

          return;
        }

        console.log("====================================");
        console.log("User authenticated:", data.user.id);
        console.log("====================================");


        // 🔹 Fetch only interest array
        console.log("====================================");
        console.log("Fetching user interests...");
        console.log("====================================");

        const userProfileRes = await fetch(`/api/userProfile/interest`);
        if (!userProfileRes.ok) throw new Error("Failed to fetch user interests");

        const { interest } = await userProfileRes.json();
        console.log("====================================");
        console.log("User Interests:", interest);
        console.log("====================================");


        setInterest(Array.isArray(interest) ? interest : []);
      } catch (error) {
        console.log("====================================");
        console.error("Error fetching user data:", error);
        console.log("====================================");
      } finally {
        setLoading(false);
      }
    };

    checkUserInterest();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return <MainContent interest={interest} />;
}

export default Page;
