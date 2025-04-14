"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";

function MainContent() {
  const centerLogoRef = useRef<HTMLImageElement | null>(null);
  const centerLogoBackgroundRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (centerLogoBackgroundRef.current) {
        centerLogoBackgroundRef.current.style.transform = "scale(1.6)";
        centerLogoBackgroundRef.current.style.animationName = "animate-ping";
      }
      if (centerLogoRef.current) {
        centerLogoRef.current.style.transform = "scale(0.8)";
        centerLogoRef.current.style.animationName = "animate-ping";
      }
    }, 200);

    return () => clearTimeout(timer); // Cleanup timeout
  }, []);
  return (
    <div>
      <div className="p-2 bg-white h-[94.3vh] rounded-b-3xl relative flex items-center justify-center">
        <Image
          src={"/images/earth.png"}
          alt="earth image"
          width={100}
          height={100}
          priority
          className="absolute top-5 -right-20 w-40 h-40 object-contain opacity-45 animate-spin-earth"
        />

        <Image
          src={"/images/logo.png"}
          alt="logo"
          width={100}
          height={100}
          priority
          ref={centerLogoRef}
          className="w-72 h-20 aspect-video object-contain duration-[2000ms] ease-in-out absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        />
        <Image
          src={"/images/background-splash.svg"}
          alt="logo"
          width={100}
          height={100}
          priority
          ref={centerLogoBackgroundRef}
          className="w-full aspect-video object-contain duration-[2000ms] ease-in-out"
        />

        <Image
          src={"/images/earth.png"}
          alt="earth image"
          width={100}
          height={100}
          priority
          className="absolute bottom-5 -left-20 w-40 h-40 object-contain opacity-45 animate-spin-earth"
        />
      </div>
    </div>
  );
}

export default MainContent;
