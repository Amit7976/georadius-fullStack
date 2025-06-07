import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MainContent from "./MainContent";
export default async function Home() {
  const cookieStore = await cookies();
  const NPS = cookieStore.get("NPS")?.value;

  if (NPS) {
    if (!NPS) redirect("/pages/auth/signin");
  }

  return <MainContent />;
}
