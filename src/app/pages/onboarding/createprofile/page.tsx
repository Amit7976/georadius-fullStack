import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import MainContent from "./MainContent";


export default async function Home() {
  
  const session = await auth();
  if (!session?.user) redirect("/pages/auth/signin");

  if (!session.user.username === false) {
    redirect("/pages/onboarding/interest");
  }

  return (
    <>
      <MainContent />
    </>
  );
}
