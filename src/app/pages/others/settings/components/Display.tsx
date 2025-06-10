"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { FiSun } from "react-icons/fi";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { useTheme } from "next-themes"
import { t } from "@/src/helpers/i18n";

function Display() {

    const { setTheme, theme } = useTheme()


    return (
        <>
            <Dialog>
                <DialogTrigger className="flex justify-between items-center gap-5 active:scale-95 duration-300 w-full">
                    <div className="flex gap-3 items-center py-5">
                        <FiSun className='text-3xl shrink-0' />
                        <label className="text-start overflow-hidden">
                            <h4 className='text-base font-medium'>{t("displayPreference")}</h4>
                            <p className='text-sm font-medium text-gray-400'>{t("themeSelection")}</p>
                        </label>
                    </div>
                    <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                </DialogTrigger>
                <DialogContent className="rounded-2xl pb-8">
                    <DialogHeader className="">
                        <DialogTitle className="text-2xl font-bold mt-4 mb-6">{t("display_preferences")}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-wrap gap-2 justify-between px-10 pb-6">
                        <div>
                            <Button className={`w-20 h-40 aspect-video hover:bg-white bg-white border-2 ${theme === "light" ? 'border-[3px] border-green-500' : 'border-gray-100'} p-0 overflow-hidden grid grid-rows-6 shadow-none`} variant={'ghost'} onClick={() => setTheme("light")}>
                                <div className="row-span-5 h-full w-20">
                                    <div className="flex items-center p-2 w-full">
                                        <div className="w-5 h-5 rounded-full bg-gray-200 shrink-0"></div>
                                        <div className="w-full px-2 py-1 space-y-1">
                                            <div className="w-1/2 h-1 bg-gray-200 rounded-full"></div>
                                            <div className="w-full h-0.5 bg-gray-200 rounded-full"></div>
                                            <div className="w-full h-0.5 bg-gray-200 rounded-full"></div>
                                            <div className="w-2/3 h-0.5 bg-gray-200 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="w-full p">
                                        <div className="flex items-center p-1 pb-1.5 w-full">
                                            <div className="w-2 h-2 rounded-full bg-gray-200 shrink-0"></div>
                                            <div className="w-full px-1 space-y-1">
                                                <div className="w-1/2 h-0.5 bg-gray-200 rounded-full"></div>
                                                <div className="w-full h-0.5 bg-gray-200 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-200 w-full h-12"></div>
                                        <div className="p-1 space-y-1">
                                            <div className="w-full h-0.5 bg-gray-200 rounded-full"></div>
                                            <div className="w-full h-0.5 bg-gray-200 rounded-full"></div>
                                            <div className="w-2/3 h-0.5 bg-gray-200 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row-span-1 bg-gray-100 h-full w-20"></div>
                            </Button>
                            <p className="font-semibold text-sm w-full text-center pt-2 text-gray-500">{t("light")}</p>
                        </div>

                        <div>
                            <Button className={`w-20 h-40 aspect-video bg-neutral-900 hover:bg-neutral-900 border-2 ${theme === "dark" ? 'border-[3px] border-green-500' : 'border-gray-100'} p-0 overflow-hidden grid grid-rows-6 shadow-none`} variant={'ghost'} onClick={() => setTheme("dark")}>
                                <div className="row-span-5 h-full w-20">
                                    <div className="flex items-center p-2 w-full">
                                        <div className="w-5 h-5 rounded-full bg-neutral-600 shrink-0"></div>
                                        <div className="w-full px-2 py-1 space-y-1">
                                            <div className="w-1/2 h-1 bg-neutral-600 rounded-full"></div>
                                            <div className="w-full h-0.5 bg-neutral-600 rounded-full"></div>
                                            <div className="w-full h-0.5 bg-neutral-600 rounded-full"></div>
                                            <div className="w-2/3 h-0.5 bg-neutral-600 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="w-full p">
                                        <div className="flex items-center p-1 pb-1.5 w-full">
                                            <div className="w-2 h-2 rounded-full bg-neutral-600 shrink-0"></div>
                                            <div className="w-full px-1 space-y-1">
                                                <div className="w-1/2 h-0.5 bg-neutral-600 rounded-full"></div>
                                                <div className="w-full h-0.5 bg-neutral-600 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="bg-neutral-600 w-full h-12"></div>
                                        <div className="p-1 space-y-1">
                                            <div className="w-full h-0.5 bg-neutral-600 rounded-full"></div>
                                            <div className="w-full h-0.5 bg-neutral-600 rounded-full"></div>
                                            <div className="w-2/3 h-0.5 bg-neutral-600 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row-span-1 bg-neutral-700 h-full w-20"></div>
                            </Button>
                            <p className="font-semibold text-sm w-full text-center pt-2 text-gray-500">{t("dark")}</p>
                        </div>
                        <div>
                            <Button className={`w-20 h-40 gap-0 aspect-video relative bg-white border-2 ${theme === "system" ? 'border-[3px] border-green-500' : 'border-gray-100'} p-0 overflow-hidden shadow-none`} variant={'ghost'} onClick={() => setTheme("system")}>
                                <div className='w-10 h-40 z-10 absolute top-0 left-0 aspect-video border-0 bg-white overflow-hidden grid grid-rows-6'>
                                    <div className="row-span-5 h-full w-20">
                                        <div className="flex items-center p-2 w-full">
                                            <div className="w-5 h-5 rounded-full bg-gray-200 shrink-0"></div>
                                            <div className="w-full px-2 py-1 space-y-1">
                                                <div className="w-1/2 h-1 bg-gray-200 rounded-full"></div>
                                                <div className="w-full h-0.5 bg-gray-200 rounded-full"></div>
                                                <div className="w-full h-0.5 bg-gray-200 rounded-full"></div>
                                                <div className="w-2/3 h-0.5 bg-gray-200 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="w-full p">
                                            <div className="flex items-center p-1 pb-1.5 w-full">
                                                <div className="w-2 h-2 rounded-full bg-gray-200 shrink-0"></div>
                                                <div className="w-full px-1 space-y-1">
                                                    <div className="w-1/2 h-0.5 bg-gray-200 rounded-full"></div>
                                                    <div className="w-full h-0.5 bg-gray-200 rounded-full"></div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-200 w-full h-12"></div>
                                            <div className="p-1 space-y-1">
                                                <div className="w-full h-0.5 bg-gray-200 rounded-full"></div>
                                                <div className="w-full h-0.5 bg-gray-200 rounded-full"></div>
                                                <div className="w-2/3 h-0.5 bg-gray-200 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row-span-1 bg-gray-100 h-full w-20"></div>
                                </div>
                                <div className='w-20 h-40 absolute right-0 top-0 aspect-video border-0 bg-neutral-900 overflow-hidden grid grid-rows-6'>
                                    <div className="row-span-5 h-full w-20">
                                        <div className="flex items-center p-2 w-full">
                                            <div className="w-5 h-5 rounded-full bg-neutral-600 shrink-0"></div>
                                            <div className="w-full px-2 py-1 space-y-1">
                                                <div className="w-1/2 h-1 bg-neutral-600 rounded-full"></div>
                                                <div className="w-full h-0.5 bg-neutral-600 rounded-full"></div>
                                                <div className="w-full h-0.5 bg-neutral-600 rounded-full"></div>
                                                <div className="w-2/3 h-0.5 bg-neutral-600 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="w-full p">
                                            <div className="flex items-center p-1 pb-1.5 w-full">
                                                <div className="w-2 h-2 rounded-full bg-neutral-600 shrink-0"></div>
                                                <div className="w-full px-1 space-y-1">
                                                    <div className="w-1/2 h-0.5 bg-neutral-600 rounded-full"></div>
                                                    <div className="w-full h-0.5 bg-neutral-600 rounded-full"></div>
                                                </div>
                                            </div>
                                            <div className="bg-neutral-600 w-full h-12"></div>
                                            <div className="p-1 space-y-1">
                                                <div className="w-full h-0.5 bg-neutral-600 rounded-full"></div>
                                                <div className="w-full h-0.5 bg-neutral-600 rounded-full"></div>
                                                <div className="w-2/3 h-0.5 bg-neutral-600 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row-span-1 bg-neutral-700 h-full w-20"></div>
                                </div>
                            </Button>
                            <p className="font-semibold text-sm w-full text-center pt-1 text-gray-500">{t("system")}</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Display
