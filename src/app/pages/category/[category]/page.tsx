"use client";

import { useParams } from "next/navigation";
import MainContent from "./MainContent";
import useAuthVerification from "../../../hooks/useAuthVerification";

function Page({ params2 }: any) {
    const { isVerified, loading } = useAuthVerification();
    const params = useParams() ?? params2; // Use params2 if useParams() is null

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!params) {
        return <div>Page not found</div>;
    }

    return isVerified ? <MainContent params={params} /> : null;
}

export default Page;
