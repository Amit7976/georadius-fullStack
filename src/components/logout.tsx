"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HiOutlineLogout } from "react-icons/hi";
import { t } from "../helpers/i18n";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


const ProviderLogout = () => {

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  const router = useRouter();

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleLogout = async () => {
    const signup = confirm("Are you Sure You want to Logout");
    if (signup) {
      await signOut({ redirect: false });
      router.replace("/pages/auth/signin");
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <Button
      variant={"primary"}
      onClick={handleLogout}
      className="w-full border-2 border-red-500 hover:bg-red-600 hover:text-white active:bg-red-600 active:text-white h-16 text-lg text-red-500 font-semibold"
    >
      <HiOutlineLogout className="size-6" />
      <span>{t("logout")}</span>
    </Button>
  );
};

export default ProviderLogout;
