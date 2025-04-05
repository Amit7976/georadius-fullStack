"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import MainContent from "./MainContent";
import useAuthVerification from "../hooks/useAuthVerification";

function Page({ params2 }: any) {
    const { isVerified, loading } = useAuthVerification();
    const params = useParams() ?? params2; // Use params2 if useParams() is null
    const [userData, setUserData] = useState(null);
    const [newsData, setNewsData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!params?.profile) return; // ❌ Avoid unnecessary API calls if profile is missing

        console.log(`🔹 Fetching data for: ${params.profile}`);

        // Promise.all to fetch both APIs simultaneously
        Promise.all([
            fetch("/api/userProfile/username", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: params.profile })
            }).then(async (res) => {
                if (!res.ok) throw new Error("User profile not found");
                return res.json();
            }),

            fetch("/api/post/username", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: params.profile })
            }).then(async (res) => {
                if (!res.ok) throw new Error("User posts not found");
                return res.json();
            })
        ])
            .then(([userDataRes, postDataRes]) => {
                console.log("✅ User & Post data received", { userDataRes, postDataRes });

                // ✅ Prevent setting same data again (avoids re-render loops)
                setUserData((prev) => (JSON.stringify(prev) === JSON.stringify(userDataRes) ? prev : userDataRes));
                setNewsData((prev) => (JSON.stringify(prev) === JSON.stringify(postDataRes) ? prev : postDataRes));
                setError(null); // ✅ Reset error on success
            })
            .catch((err) => {
                console.error("❌ Fetch error:", err.message);
                setError(err.message);
            });

        // console.log('====================================');
        // console.log(newsData);
        // console.log('====================================');
    }, [params]);


    if (loading) {
        return <p>Loading...</p>;
    }

    if (!params) {
        return <div>Page not found</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return isVerified && userData ? (
        <MainContent username={params.profile} userData={userData} userPosts={newsData} />
    ) : (
        <div>No user profile found.</div>
    );
}

export default Page;
