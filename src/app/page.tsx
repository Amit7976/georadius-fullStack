"use client";

import React from "react";
import MainContent from "./MainContent";
import useAuthVerification from "./hooks/useAuthVerification";

const Home = () => {
  const { isVerified, loading } = useAuthVerification();

  if (loading) {
    return <p>Loading...</p>;
  }

  return isVerified ? <MainContent /> : null;
};

export default Home;
