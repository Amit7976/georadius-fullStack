import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import MainContent from "./MainContent";

export default async function ReportAnIssuePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const session = await auth();
    if (!session?.user) redirect("/pages/auth/signin");

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MainContent id={id} />
        </Suspense>
    );
}
