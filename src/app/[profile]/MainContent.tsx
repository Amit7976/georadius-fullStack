import BackButton from "@/src/components/BackButton";
import NewsPost from "@/src/components/NewsPost";
import { LoaderLink } from "@/src/components/loaderLinks";
import { t } from "@/src/helpers/i18n";
import { MainContentProps } from "@/src/helpers/types";
import Image from "next/image";
import { IoSettingsOutline } from "react-icons/io5";
import ActionButtons from "./ActionButtons";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


export default function MainContent({
    username,
    userData,
    userPosts,
    currentLoginUsername,
    handleHide
}: MainContentProps) {
    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between py-5 p-4">
                <div className="flex items-center gap-0 relative">
                    {!userData.currentUserProfile && (
                        <BackButton  classname="relative pr-5 pl-0"/>
                    )}
                    <h2 className="text-lg font-bold">{username}</h2>
                </div>
                <LoaderLink href="/pages/others/settings">
                    <IoSettingsOutline
                        className="text-2xl cursor-pointer"
                    />
                </LoaderLink>
            </div>

            {/* Profile Info */}
            <div className="flex items-start gap-4 my-2 p-4">
                <div className="flex-1">
                    <Image
                        width={100}
                        height={100}
                        src={userData.profileImage}
                        alt="Profile Pic"
                        className="w-full aspect-square border-4 border-green-500 rounded-full object-cover"
                    />
                </div>
                <div className="flex-3 mt-1 space-y-2">
                    <h3 className="text-xl font-bold">{userData.fullname}</h3>
                    <p
                        className="text-gray-500 dark:text-gray-400 text-sm font-medium text-balance"
                        dangerouslySetInnerHTML={{
                            __html: userData.bio.replace(/\r?\n/g, "<br />"),
                        }}
                    />
                    <p className="text-gray-500 font-semibold text-xs mt-3">{userData.location}</p>
                </div>
            </div>

            {/* Action Buttons */}
            <ActionButtons currentUserProfile={userData.currentUserProfile} username={username}/>

            {/* News Posts */}
            <div className="py-6">
                {userPosts.length > 0 ? (
                    userPosts.map((news) => (
                        <NewsPost
                            news={news}
                            currentLoginUsername={currentLoginUsername}
                            key={news._id}
                            onHide={() => handleHide(news._id)}
                            fullDescription={false}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500">{t("noPosts")}</p>
                )}
            </div>
        </>
    );
}
