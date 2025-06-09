import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import ProfileClientContent from "./ProfileClientContent";

export default async function page({ params }: { params: Promise<{ profile: string }> }) {
    const { profile } = await params;


    const session = await auth();
    if (!session?.user) redirect("/pages/auth/signin");


    return (
        <>
            <ProfileClientContent profile={profile} />
        </>
    );
}

