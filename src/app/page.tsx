import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import MainContent from "./MainContent";


export default async function Home() {
  const cookieStore = await cookies();
  const onboarding = cookieStore.get("onboarding")?.value;
  const NPS = cookieStore.get("NPS")?.value;
  const LPS = cookieStore.get("LPS")?.value;

  if (!onboarding) redirect("/pages/onboarding/getstarted");
  if (!LPS) redirect("/pages/onboarding/permissions/location");
  if (!NPS) redirect("/pages/onboarding/permissions/notification");

  const session = await auth();
  if (!session?.user) redirect("/pages/auth/signin");

  if (session.user.username === false) {
    redirect("/pages/onboarding/createprofile");
  }

  return (
    <>
      <MainContent />
    </>
  );
}
