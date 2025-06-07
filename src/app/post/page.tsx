import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import MainContent from "./MainContent";


export default async function page() {

  const cookieStore = await cookies();

  const LPS = cookieStore.get("LPS")?.value;

  if (!LPS) redirect("/pages/onboarding/permissions/location");

  const session = await auth();
  if (!session?.user) redirect("/pages/auth/signin");

  if (session.user.username === false) {
    redirect("/pages/onboarding/createprofile");
  }

  return (
    <>
      <div className="text-center p-10">
        <h1 className="text-2xl font-extrabold text-black">Report a News</h1>
      </div>
      <MainContent />
    </>
  );
}
