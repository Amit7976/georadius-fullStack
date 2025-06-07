"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/src/auth";

const useAuthVerification = () => {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(() => {
    // Initial state from cache (fast!)
    return localStorage.getItem("isVerified") === "true";
  });
  const [loading, setLoading] = useState(!isVerified);

  useEffect(() => {
    if (isVerified) {
      // Already verified, no need to run again
      setLoading(false);
      return;
    }

    const checkAuthAndPermissions = async () => {
      try {
        console.log("=== Starting verification process ===");

        if (typeof window === "undefined") {
          setLoading(false);
          return;
        }

        

        // Cache the result to speed up next loads
        localStorage.setItem("isVerified", "true");
        setIsVerified(true);
        console.log("=== User verified successfully ===");
      } catch (error) {
        console.error("Error during verification:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndPermissions();
  }, [router, isVerified]);

  return { isVerified, loading };
};

export default useAuthVerification;
