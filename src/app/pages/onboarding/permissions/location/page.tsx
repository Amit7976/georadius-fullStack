import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MainContent from "./MainContent";
export default async function page() {
  const cookieStore = await cookies();  
  const NPS = cookieStore.get("NPS")?.value;
  const LPS = cookieStore.get("LPS")?.value;

  if (LPS) {
    if (!NPS) redirect("/pages/onboarding/permissions/notification");
  }

  return <MainContent />;
}
