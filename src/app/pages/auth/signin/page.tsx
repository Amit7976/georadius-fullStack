"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MainContent from "./MainContent";

function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/authentication");
        const data = await response.json();

        if (data.user) {
          setIsAuthenticated(true);
          router.replace("/");
        }
      } catch (error) {
        console.error("Error checking authentication", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return !isAuthenticated ? <MainContent /> : null;
}

export default Page;
