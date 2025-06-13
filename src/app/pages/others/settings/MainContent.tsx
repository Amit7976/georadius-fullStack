"use client";

import HeadingHeader from "@/src/components/HeadingHeader";
import { LoaderLink } from "@/src/components/loaderLinks";
import { t } from "@/src/helpers/i18n";
import ProviderLogout from "@/src/helpers/logout";
import { FaRegUserCircle } from 'react-icons/fa';
import { HiOutlineChevronRight } from "react-icons/hi2";
import { MdBookmark, MdInterests, MdPassword } from "react-icons/md";
import { SlQuestion } from "react-icons/sl";
import Display from "./components/Display";
import Language from "./components/Language";
import Notification from "./components/Notification";
import Radius from "./components/Radius";

const MainContent = () => {

    return (
        <>
            <HeadingHeader heading={t("settings")} />


            <div className='pt-4 px-5'>
                <h2 className='text-lg font-semibold mb-2'>{t("accountSettings")}</h2>
                <LoaderLink href={"/pages/onboarding/updateprofile"} className="flex w-full justify-between items-center gap-5 active:scale-95 duration-300 cursor-pointer">
                    <div className="flex gap-3 items-center py-5">
                        <FaRegUserCircle className='text-3xl shrink-0' />
                        <div className="text-start overflow-hidden">
                            <h4 className='text-base font-medium'>{t("yourProfile")}</h4>
                            <p className='text-sm font-medium text-gray-400'>{t('updateYourProfileInformation')}</p>
                        </div>
                    </div>
                    <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                </LoaderLink>

                <LoaderLink href="/pages/onboarding/interest" className="flex w-full justify-between items-center gap-5 active:scale-95 duration-300">
                    <div className="flex gap-3 items-center py-5">
                        <MdInterests className="text-3xl shrink-0" />
                        <div className="text-start overflow-hidden">
                            <h4 className="text-base font-medium">{t("interestsAndPreferences")}</h4>
                            <p className="text-sm font-medium text-gray-400">{t("updateYourInterests")}</p>
                        </div>
                    </div>
                    <HiOutlineChevronRight className="text-2xl text-gray-500 font-light" />
                </LoaderLink>


                <LoaderLink href="/pages/saved" className="flex w-full justify-between items-center gap-5 active:scale-95 duration-300">
                    <div className="flex gap-3 items-center py-5">
                        <MdBookmark className="text-3xl shrink-0" />
                        <div className="text-start overflow-hidden">
                            <h4 className="text-base font-medium">{t("savedPosts")}</h4>
                            <p className="text-sm font-medium text-gray-400">{t("viewYourSavedItems")}</p>
                        </div>
                    </div>
                    <HiOutlineChevronRight className="text-2xl text-gray-500 font-light" />
                </LoaderLink>

                

                <LoaderLink href={"privacy_security"} className="flex w-full justify-between items-center gap-5 active:scale-95 duration-300">
                    <div className="flex gap-3 items-center py-5">
                        <MdPassword className='text-3xl shrink-0' />
                        <div className="text-start overflow-hidden">
                            <h4 className='text-base font-medium'>{t("privacySecurity")}</h4>
                            <p className='text-sm font-medium text-gray-400'>{t("changePassword")}</p>
                        </div>
                    </div>
                    <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                </LoaderLink>
            </div>

            <div className='pt-4 px-5'>
                <h2 className='text-lg font-semibold mb-2'>{t("appSettings")}</h2>

                <Language />
                <Notification />
                <Display />
                <Radius />
            </div>

            <div className='pt-4 px-5'>
                <h2 className='text-lg font-semibold mb-2'>{t("support")}</h2>

                <LoaderLink href={"f&q"} className="flex w-full justify-between items-center gap-5 active:scale-95 duration-300 cursor-pointer">
                    <div className="flex gap-3 items-center py-5">
                        <SlQuestion className='text-3xl shrink-0' />
                        <div className="text-start overflow-hidden">
                            <h4 className='text-base font-medium px-1 truncate'>{t("faq")}</h4>
                        </div>
                    </div>
                    <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                </LoaderLink>
            </div>

            <div className="pt-10 pb-5 px-5">
                <ProviderLogout />
            </div>
        </>
    )
}

export default MainContent
