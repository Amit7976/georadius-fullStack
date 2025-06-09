"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";

function MainContent() {
  const router = useRouter();
  const handleClick = () => {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 10);
    document.cookie = `onboarding=true; expires=${expires.toUTCString()}; path=/;`;
    router.replace("/pages/onboarding/permissions/location");
  };

  return (
    <div className="flex items-center justify-around flex-col space-y-4 h-[94.3vh]">
      <Image
        src={"/images/onBoarding1.png"}
        alt="On Boarding Get Started"
        width={200}
        height={200}
        priority
        className="w-full h-96 object-contain"
      />
      <div>{/* // EMPTY DIV ELEMENT FOR SPACING */}</div>
      <div className="flex items-center justify-center flex-col space-y-4 text-center bg-gray-100 px-10 pt-10 pb-5 rounded-t-[5rem] w-full bottom-0 absolute">
        <h1 className="text-xl font-semibold">Stay Updated</h1>
        <p className="text-sm font-medium text-gray-600">
          Get Breaking News and your most local news directly in your feed
        </p>

        {/* Wrap with div and call handleClick */}
        <Button
          className="bg-green-600 active:bg-green-500 mt-4 text-white text-xl font-bold rounded-full flex items-center justify-center gap-2 w-full h-14"
          onClick={handleClick}
        >
          Get Started
          <FaArrowRightLong className="text-2xl" />
        </Button>
      </div>
    </div>
  );
}

export default MainContent;
