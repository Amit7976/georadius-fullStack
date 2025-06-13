"use client";
import DeleteAccountButton from "@/src/components/DeleteAccountButton";
import HeadingHeader from "@/src/components/HeadingHeader";
import { LoaderLink } from "@/src/components/loaderLinks";
import { t } from "@/src/helpers/i18n";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { MdPassword } from "react-icons/md";
import { TbAuth2Fa } from "react-icons/tb";



/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


function MainContent() {
    return (
        <>
            <>

                <HeadingHeader heading={t("privacySecurity")} />

                <div className='py-8 px-5 space-y-6'>
                    <h2 className='text-xl font-semibold mb-5'>{t("policies")}</h2>
                    <LoaderLink href={"../policies/terms_and_conditions"} className="w-full flex justify-between items-center gap-5 cursor-pointer py-5 border-2 rounded-xl px-4 active:scale-95 duration-300">
                        <label>
                            <h4 className='text-lg font-semibold'>{t("termsConditions")}</h4>
                        </label>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light shrink-0 col-span-1' />
                    </LoaderLink>
                    <LoaderLink href={"../policies/privacy_policy"} className="w-full flex justify-between items-center gap-5 cursor-pointer py-5 border-2 rounded-xl px-4 active:scale-95 duration-300">
                        <label>
                            <h4 className='text-lg font-semibold'>{t("privacyPolicy")}</h4>
                        </label>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light shrink-0 col-span-1' />
                    </LoaderLink>
                    <LoaderLink href={"../policies/community_guidelines"} className="w-full flex justify-between items-center gap-5 cursor-pointer py-5 border-2 rounded-xl px-4 active:scale-95 duration-300">
                        <label>
                            <h4 className='text-lg font-semibold'>{t("communityGuidelines")}</h4>
                        </label>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light shrink-0 col-span-1' />
                    </LoaderLink>
                    <LoaderLink href={"../policies/cookie_policy"} className="w-full flex justify-between items-center gap-5 cursor-pointer py-5 border-2 rounded-xl px-4 active:scale-95 duration-300">
                        <label>
                            <h4 className='text-lg font-semibold'>{t("cookiePolicy")}</h4>
                        </label>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light shrink-0 col-span-1' />
                    </LoaderLink>

                </div>

                <div className='pt-8 px-5'>
                    <h2 className='text-xl font-semibold mb-2'>{t("security")}</h2>
                    <LoaderLink href={"change_password"} className="w-full grid grid-cols-7 justify-between items-center gap-5 cursor-pointer active:scale-95 duration-300">
                        <div className="flex gap-3 items-center py-5 col-span-6">
                            <MdPassword className='text-4xl shrink-0' />
                            <div className="text-start overflow-hidden">
                                <h4 className='text-lg font-semibold'>{t("changePassword")}</h4>
                                <p className='text-base font-medium text-gray-500'>{t("updatePassword")}</p>
                            </div>
                        </div>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light shrink-0 col-span-1' />
                    </LoaderLink>
                    <LoaderLink href={"2fa"} className="w-full grid grid-cols-7 justify-between items-center gap-5 cursor-pointer active:scale-95 duration-300">
                        <div className="flex gap-3 items-center py-5 col-span-6">
                            <TbAuth2Fa className='text-4xl shrink-0' />
                            <div className="text-start overflow-hidden">
                                <h4 className='text-lg font-semibold'>{t("twoFA")}</h4>
                                <p className='text-base font-medium text-gray-500 truncate'>{t("enable2FA")}</p>
                            </div>
                        </div>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light shrink-0 col-span-1' />
                    </LoaderLink>

                    <div className="space-y-8 mt-40 mb-10">

                        <DeleteAccountButton />
                    </div>
                </div>
            </>
        </>
    )
}

export default MainContent
