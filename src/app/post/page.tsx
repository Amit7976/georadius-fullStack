"use client";
import React from 'react'
import MainContent from './MainContent'
import useAuthVerification from '../hooks/useAuthVerification';

function page() {
  const { isVerified, loading } = useAuthVerification();

  if (loading) {
    return <p>Loading...</p>;
  }
  return isVerified ? (
    <>
      <div className="text-center p-10">
        <h1 className="text-2xl font-extrabold text-black">Report a News</h1>
      </div>
      <MainContent />
    </>
  ) : null;
}

export default page