"use client";
import React from 'react';
import MainContent from '../../auth/actions/MainContent'
import useAuthVerification from '../../../hooks/useAuthVerification';

function Page() {
    const { isVerified, loading } = useAuthVerification();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    return isVerified ? <MainContent /> : null;
}

export default Page;
