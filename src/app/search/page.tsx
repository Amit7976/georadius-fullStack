import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import MainContent from "./MainContent";
import { Metadata } from "next";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


export const metadata: Metadata = {
    title: 'Learning Desk | All Your Roadmaps in One Place | Roadmint',
    description: 'Access all your learning roadmaps and topics in one organized dashboard. Track what you’ve completed and plan what’s next — fast, simple, and personalized.',
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function page() {

    const cookieStore = await cookies();

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const LPS = cookieStore.get("LPS")?.value;
    if (!LPS) redirect("/pages/onboarding/permissions/location");

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const session = await auth();
    if (!session?.user) redirect("/pages/auth/signin");

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (session.user.username === false) {
        redirect("/pages/onboarding/createprofile");
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <>
            <MainContent />
        </>
    );
}
