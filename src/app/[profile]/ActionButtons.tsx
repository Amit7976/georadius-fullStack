import { Button } from '@/components/ui/button';
import { t } from '@/src/helpers/i18n';
import { redirect } from 'next/navigation';
import React from 'react'

function ActionButtons({ currentUserProfile, username }: { currentUserProfile: boolean, username: string }) {
    const handleShare = () => {
        const url = `${window.location.origin}/${username}`;
        if (navigator.share) {
            navigator
                .share({
                    title: t("checkProfile"),
                    text: t("interestProfile"),
                    url,
                })
                .catch((err) => console.error("Share failed:", err));
        } else {
            alert(t("shareNotSupported"));
        }
    };


    return (
        <>
            <div className="flex flex-row justify-between gap-3 px-3">
                {currentUserProfile && (
                    <Button
                        variant="primary"
                        onClick={() => redirect("/pages/onboarding/updateprofile")}
                        className="bg-gray-200 dark:bg-neutral-800 w-full flex-1 h-10 text-gray-600 dark:text-gray-300 font-semibold text-sm"
                    >
                        {t("updateProfile")}
                    </Button>
                )}

                <Button
                    variant="primary"
                    onClick={handleShare}
                    className="bg-gray-200 dark:bg-neutral-800 w-full flex-1 h-10 text-gray-600 dark:text-gray-300 font-semibold text-sm"
                >
                    {t("shareProfile")}
                </Button>
            </div>
        </>
    )
}

export default ActionButtons