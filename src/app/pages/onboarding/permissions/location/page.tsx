import { cookies } from "next/headers";
import MainContent from "./MainContent";
import { redirect } from "next/navigation";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


export default async function page() {
  const cookieStore = await cookies();  
  // const NPS = cookieStore.get("NPS")?.value;
  const LPS = cookieStore.get("LPS")?.value;

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  if (LPS) redirect("/");

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  return <MainContent />;
}
