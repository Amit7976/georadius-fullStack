'use client';
import React from 'react';
import MainContent from './MainContent';
import useAuthVerification from '../../../hooks/useAuthVerification';
import { useSearchParams } from 'next/navigation';

function ReportAnIssueClient() {
    const { isVerified, loading } = useAuthVerification();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><div className="loader"></div></div>;
    }

    return isVerified ? <MainContent id={id} /> : null;
}

export default ReportAnIssueClient;
