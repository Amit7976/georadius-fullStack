import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/src/auth";
import SearchResultsClient from "./SearchResultsClient";


export default async function page() {

    const cookieStore = await cookies();

    const LPS = cookieStore.get("LPS")?.value;

    if (!LPS) redirect("/pages/onboarding/permissions/location");

    const session = await auth();
    if (!session?.user) redirect("/pages/auth/signin");


    return (
        <>
            <SearchResultsClient />
        </>
    );
}
