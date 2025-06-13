"use client"
import { useRouter } from 'next/navigation';
import React from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


function BackButton({ classname }: { classname?: string }) {
    
    const router = useRouter();

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <FaArrowLeftLong
            onClick={() => router.back()}
            className={`text-xl absolute left-3 w-10 h-10 p-2 cursor-pointer text-gray-400 ${classname}`}
        />
    )
}

export default BackButton