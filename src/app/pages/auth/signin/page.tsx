import { redirect } from "next/navigation";
import MainContent from "./MainContent";
import { auth } from "@/src/auth";


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export default async function page() {


  // GET DATA FORM SESSION
  const session = await auth()
  const user = session?.user


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  if (session?.user) {
    redirect("/")
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////




  return (
    <>
      <>
        <MainContent />
      </>
    </>
  );
}
