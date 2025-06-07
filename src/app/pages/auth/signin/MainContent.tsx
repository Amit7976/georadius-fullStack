import logo from "@/public/images/Logo.png";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { handleSignIn } from "../actions/server";
import LoginForm from "./LoginForm";
import { Button } from "@/components/ui/button";

function MainContent() {
  return (
    <>
      <div className="p-2 bg-white flex flex-col items-center h-[94.3vh] rounded-b-3xl">
        <div className="flex flex-col items-center space-y-1 py-6">
          <Image src={logo} alt="Logo" className="w-[35vw] pb-10" priority />
          <h1 className="text-2xl font-bold text-black">Sign In Account</h1>
          <p className="text-base text-gray-600 font-medium mt-1.5">
            Enter your personal data to login your account.
          </p>
        </div>

        <form action={handleSignIn} className="flex flex-col mt-5 text-center w-full px-10">
          <Button
            type="submit"
            className="bg-white text-black active:scale-95 duration-300 flex items-center justify-center w-full h-14 rounded-xl border-2 border-black hover:bg-gray-100 gap-2 font-semibold"
          >
            <FcGoogle className="text-xl mb-0.5" />
            Sign Up with Google
          </Button>
        </form>

        <LoginForm />
      </div>
    </>
  );
}

export default MainContent;
