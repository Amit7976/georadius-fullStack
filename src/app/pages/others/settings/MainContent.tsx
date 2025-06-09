"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import HeadingHeader from "@/src/components/HeadingHeader";
import { LoaderLink } from "@/src/components/loaderLinks";
import ProviderLogout from "@/src/helpers/logout";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegUserCircle } from 'react-icons/fa';
import { FiSun } from "react-icons/fi";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { IoLanguage, IoLocationOutline, IoNotificationsOutline } from "react-icons/io5";
import { MdPassword } from "react-icons/md";
import { SlQuestion } from "react-icons/sl";
import Radius from "./components/Radius";
import Notification from "./components/Notification";
import Display from "./components/Display";
import Language from "./components/Language";

const MainContent = () => {
    return (
        <>
            <HeadingHeader heading="Settings" />


            <div className='pt-4 px-5'>
                <h2 className='text-lg font-semibold mb-2'>Account Settings</h2>
                <LoaderLink href={"updateprofile"} className="flex w-full justify-between items-center gap-5 active:scale-95 duration-300 cursor-pointer">
                    <div className="flex gap-3 items-center py-5">
                        <FaRegUserCircle className='text-3xl shrink-0' />
                        <div className="text-start overflow-hidden">
                            <h4 className='text-base font-medium'>Your Profile</h4>
                            <p className='text-sm font-medium text-gray-400'>Update your Profile Information</p>
                        </div>
                    </div>
                    <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                </LoaderLink>

                <LoaderLink href={"privacy_security"} className="flex w-full justify-between items-center gap-5 active:scale-95 duration-300">
                    <div className="flex gap-3 items-center py-5">
                        <MdPassword className='text-3xl shrink-0' />
                        <div className="text-start overflow-hidden">
                            <h4 className='text-base font-medium'>Privacy & Security</h4>
                            <p className='text-sm font-medium text-gray-400'>Change your password</p>
                        </div>
                    </div>
                    <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                </LoaderLink>
            </div>

            <div className='pt-4 px-5'>
                <h2 className='text-lg font-semibold mb-2'>App Settings</h2>

               <Language/>
                <Notification/>
                <Display/>
                <Radius/>
            </div>

            <div className='pt-4 px-5'>
                <h2 className='text-lg font-semibold mb-2'>Support</h2>
                
                <LoaderLink href={"f&q"} className="flex w-full justify-between items-center gap-5 active:scale-95 duration-300 cursor-pointer">
                    <div className="flex gap-3 items-center py-5">
                        <SlQuestion className='text-3xl shrink-0' />
                        <div className="text-start overflow-hidden">
                            <h4 className='text-base font-medium px-1 truncate'>Frequently Asked Questions</h4>
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
