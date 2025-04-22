"use client";

import Image from "next/image";
import React from "react";
import logo from "@/public/images/Logo.png";
import { FcGoogle } from "react-icons/fc";
import SignUpForm from "./signUpForm";
import { handleSignIn } from "../actions/server";

function MainContent() {

  return (
    <>
      <div className="p-2 bg-white flex flex-col items-center h-[94.3vh] rounded-b-3xl">
        <div className="flex flex-col items-center space-y-1 py-6">
          <Image src={logo} alt="Logo" className="w-[35vw] pb-10" priority />
          <h1 className="text-2xl font-bold text-black">Sign Up Account</h1>
          <p className="text-base text-gray-600 font-medium mt-1.5">
            Enter your personal data to create your account.
          </p>
        </div>

        <form action={handleSignIn} className="flex flex-col mt-5 text-center w-full px-10">
          <button
            type="submit"
            className="bg-white text-black active:scale-95 duration-300 flex items-center justify-center w-full h-14 rounded-xl border-2 border-black gap-2 font-semibold"
          >
            <FcGoogle className="text-xl mb-0.5" />
            Sign Up with Google
          </button>
        </form>

        <SignUpForm />
      </div>
    </>
  );
}

export default MainContent;
