"use client";

import React from 'react'
import MainContent from './MainContent'
import useAuthVerification from '../hooks/useAuthVerification';
import BottomNavigation from '@/src/components/BottomNavigation';

function Page() {
    const { isVerified, loading } = useAuthVerification();

    if (loading) {
        return (<div className="flex items-center justify-center h-screen"><div className="loader"></div></div>);
    }

    return isVerified ? (<><MainContent /><BottomNavigation /></>) : null;
}

export default Page
