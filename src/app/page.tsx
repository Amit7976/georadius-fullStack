"use client";

import React from "react";
import MainContent from "./MainContent";
import useAuthVerification from "./hooks/useAuthVerification";

const Home = () => {
  const { isVerified, loading } = useAuthVerification();

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div className="loader"></div></div>;
  }

  return isVerified ? <MainContent /> : null;
};

export default Home;
