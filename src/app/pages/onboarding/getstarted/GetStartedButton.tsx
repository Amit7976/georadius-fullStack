"use client"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import React from 'react'
import { FaArrowRightLong } from 'react-icons/fa6'


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


function GetStartedButton() {
    const router = useRouter();

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleClick = () => {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 10);
        document.cookie = `onboarding=true; expires=${expires.toUTCString()}; path=/;`;
        router.replace("/pages/onboarding/permissions/location");
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <>
            <Button
                className="bg-green-600 hover:bg-green-500 active:bg-green-500 mt-4 text-white text-xl font-bold rounded-full flex items-center justify-center gap-2 w-full h-14"
                onClick={handleClick}
            >
                Get Started
                <FaArrowRightLong className="text-2xl" />
            </Button>
        </>
    )
}

export default GetStartedButton
