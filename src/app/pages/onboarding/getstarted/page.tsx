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

        console.log('====================================');
        console.log(data);
        console.log('====================================');

        if (data.user) {
          setIsAuthenticated(true);
          console.log("this is redirecting...");
          
          router.replace("/");
        }
      } catch (error) {
        console.error("Error checking authentication", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);


  console.log('====================================');
  console.log("this is get started");
  console.log('====================================');


  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div className="loader"></div></div>;
  }

  return !isAuthenticated ? <MainContent /> : null;
}

export default Page;
