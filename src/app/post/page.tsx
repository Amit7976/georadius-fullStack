"use client";
import React from 'react'
import MainContent from './MainContent'
import useAuthVerification from '../hooks/useAuthVerification';

function Page() {
  const { isVerified, loading } = useAuthVerification();

  if (loading) {
    return (<div className="flex items-center justify-center h-screen"><div className="loader"></div></div>);
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

export default Page