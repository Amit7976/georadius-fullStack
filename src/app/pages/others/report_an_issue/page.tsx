'use client';
import React from 'react';
import MainContent from './MainContent';
import useAuthVerification from '../../../hooks/useAuthVerification';
import { useSearchParams } from 'next/navigation';

function Page() {
    const { isVerified, loading } = useAuthVerification();
    const searchParams = useSearchParams();
    const id = searchParams.get('id'); // Get 'id' from URL

    if (loading) {
        return <p>Loading...</p>;
    }

    return isVerified ? <MainContent id={id} /> : null;
}

export default Page;
