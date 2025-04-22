// app/[profile]/page.tsx
'use client';

import { useParams } from "next/navigation";
import ProfileClientContent from "./ProfileClientContent";

export default function Page() {
    const params = useParams();
    const profile = params.profile as string;

    return <ProfileClientContent profile={profile} />;
}
