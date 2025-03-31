"use client";

import { useRouter } from "next/navigation";
import React, { useState } from 'react'
import { FaAngleRight, FaRegUserCircle } from 'react-icons/fa'
import { FaArrowLeftLong, FaChevronRight, FaLeftLong } from 'react-icons/fa6'
import { HiOutlineChevronRight } from "react-icons/hi2";
import { MdOutlineReport, MdPassword, MdSecurity } from "react-icons/md";
import { FiSun } from "react-icons/fi";
import { IoLanguage, IoLocationOutline, IoNotificationsOutline } from "react-icons/io5";
import { SlQuestion } from "react-icons/sl";
import { TbAuth2Fa } from "react-icons/tb";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"



function MainContent() {

    const [deactivation, setDeactivation] = useState(true)
    const [removeAccount, setRemoveAccount] = useState(true)

    const router = useRouter();
    return (
        <>
            <div className='bg-white w-full h-full'>
                <div className='flex items-center justify-center relative my-5'>
                    <FaArrowLeftLong
                        onClick={() => router.back()}
                        className="text-lg absolute left-3 w-10 h-10 p-2.5 cursor-pointer"
                    />

                    <h1 className='text-xl font-bold'>Privacy & Security</h1>
                </div>

                <div className='py-8 px-5 space-y-6'>
                    <h2 className='text-xl font-semibold mb-5'>Policies</h2>
                    <Link href={"../policies/terms_and_conditions"} className="flex justify-between items-center gap-5 cursor-pointer py-5 border-2 rounded-xl px-4">
                        <label>
                            <h4 className='text-lg font-semibold'>Terms and Conditions</h4>
                        </label>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                    </Link>
                    <Link href={"../policies/privacy_policy"} className="flex justify-between items-center gap-5 cursor-pointer py-5 border-2 rounded-xl px-4">
                        <label>
                            <h4 className='text-lg font-semibold'>Privacy Policy</h4>
                        </label>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                    </Link>
                    <Link href={"../policies/community_guidelines"} className="flex justify-between items-center gap-5 cursor-pointer py-5 border-2 rounded-xl px-4">
                        <label>
                            <h4 className='text-lg font-semibold'>Community Guidelines</h4>
                        </label>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                    </Link>
                    <Link href={"../policies/cookie_policy"} className="flex justify-between items-center gap-5 cursor-pointer py-5 border-2 rounded-xl px-4">
                        <label>
                            <h4 className='text-lg font-semibold'>Cookie Policy</h4>
                        </label>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                    </Link>

                </div>

                <div className='pt-8 px-5'>
                    <h2 className='text-xl font-semibold mb-2'>Security</h2>
                    <Link href={"change_password"} className="flex justify-between items-center gap-5 cursor-pointer">
                        <div className="flex gap-3 items-center py-5">
                            <MdPassword className='text-4xl' />
                            <label>
                                <h4 className='text-lg font-semibold'>Change Password</h4>
                                <p className='text-base font-medium text-gray-500'>Update your account Password</p>
                            </label>
                        </div>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                    </Link>
                    <Link href={"2fa"} className="flex justify-between items-center gap-5 cursor-pointer">
                        <div className="flex gap-3 items-center py-5">
                            <TbAuth2Fa className='text-4xl' />
                            <label>
                                <h4 className='text-lg font-semibold'>Two factor Authentication</h4>
                                <p className='text-base font-medium text-gray-500 truncate'>Turn on 2FA for enhance security of your account</p>
                            </label>
                        </div>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                    </Link>

                    <div className="space-y-8 mt-20 mb-12">

                        <div className="flex items-start space-x-3">
                            <Checkbox className="w-6 h-6 mt-2" id="confirm-deactivate" onClick={() => setDeactivation(!deactivation)} />
                            <label
                                htmlFor="confirm-deactivate"
                                className="text-lg font-medium text-gray-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Yes, I understand that deactivating my account will temporarily disable my access, but I can reactivate it anytime.
                            </label>
                        </div>


                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant={'primary'}
                                size={20}
                                disabled={deactivation}
                                className='w-full h-14 border-2 border-gray-500 active:scale-95 text-gray-500 text-lg font-semibold py-3 rounded-lg'
                            >
                                Deactivate Your Account
                            </Button></div>

                        <div className="flex items-start space-x-3 mt-12">
                            <Checkbox className="w-6 h-6 mt-2" id="confirm-delete" onClick={() => { setRemoveAccount(!removeAccount) }} />
                            <label
                                htmlFor="confirm-delete"
                                className="text-lg font-semibold text-red-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Yes, I understand that deleting my account is permanent and cannot be undone.
                            </label>
                        </div>


                        <div>
                            <Button
                                type="submit"
                                variant={'primary'}
                                size={20}
                                disabled={removeAccount}
                                className="w-full bg-red-500 active:bg-red-400 active:scale-95 duration-300 h-16 text-white text-lg font-bold rounded-lg"
                            >
                                Permanently Delete your Account
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainContent
