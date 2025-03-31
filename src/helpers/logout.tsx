"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HiOutlineLogout } from "react-icons/hi";

const ProviderLogout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/pages/auth/signin");
  };

    return (
      <Button
        size={100}
        variant={"primary"}
        onClick={handleLogout}
        className="relative flex flex-row items-center h-12 w-full justify-start rounded-xl focus:outline-none bg-green-500 hover:bg-green-700 text-white duration-300"
      >
        <span className="inline-flex justify-center items-center ml-4">
          <HiOutlineLogout className="w-6 h-6" />
        </span>
        <span className="ml-2 text-sm tracking-wide truncate">Logout</span>
      </Button>
    );
};

export default ProviderLogout;
