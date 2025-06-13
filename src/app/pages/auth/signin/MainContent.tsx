import logo from "@/public/images/Logo.png";
import invertLogo from "@/public/images/invertLogo.png";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { handleSignIn } from "../actions/server";
import LoginForm from "./LoginForm";
import { Button } from "@/components/ui/button";

function MainContent() {
  return (
    <>
      <div className="p-2 flex flex-col items-center h-[94.3vh] rounded-b-3xl">
        <div className="flex flex-col items-center justify-center space-y-1 py-6">
          <Image src={logo} alt="Logo" className="w-[35vw] pb-10 dark:hidden" priority />
          <Image src={invertLogo} alt="Logo" className="w-[35vw] pb-10 hidden dark:block" priority />
          <h1 className="text-2xl font-bold">Sign In Account</h1>
          <p className="text-base text-gray-600 dark:text-gray-400 font-medium mt-1.5 text-center">
            Kindly provide your credentials to log in to your account.
          </p>
        </div>

        <form action={handleSignIn} className="flex flex-col mt-5 text-center w-full px-6">
          <Button
            type="submit"
            className="bg-white dark:bg-neutral-900 text-black dark:text-white  duration-300 flex items-center justify-center w-full h-16 rounded-xl border-2 border-black dark:border-neutral-600 hover:bg-gray-100 gap-2 font-semibold"
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
