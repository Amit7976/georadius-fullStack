"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiSun } from "react-icons/fi";
import { HiOutlineChevronRight } from "react-icons/hi2";
function Display() {

    const [displayModal, setDisplayModal] = useState(false);
    const [displayMode, setDisplayMode] = useState("system");


    return (
        <>
            <Dialog open={displayModal} onOpenChange={setDisplayModal}>
                <DialogTrigger className="flex justify-between items-center gap-5 active:scale-95 duration-300 w-full">
                    <div className="flex gap-3 items-center py-5">
                        <FiSun className='text-3xl shrink-0' />
                        <label className="text-start overflow-hidden">
                            <h4 className='text-base font-medium'>Display Preference</h4>
                            <p className='text-sm font-medium text-gray-400'>Select Theme Appearance</p>
                        </label>
                    </div>
                    <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                </DialogTrigger>
                <DialogContent className="">
                    <DialogHeader className="">
                        <DialogTitle className="text-lg font-bold mb-5">Display Preferences</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-wrap gap-2 justify-between px-10">
                        <div>
                            <Button className='w-20 h-40 aspect-video bg-white border-2 p-0 overflow-hidden grid grid-rows-6 shadow-none' variant={'ghost'} onClick={() => setDisplayMode("system")}>
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
                            <p className="font-semibold text-sm w-full text-center pt-2 text-gray-500">light</p>
                        </div>

                        <div>
                            <Button className='w-20 h-40 aspect-video bg-neutral-900 border-2 p-0 overflow-hidden grid grid-rows-6 shadow-none' variant={'ghost'} onClick={() => setDisplayMode("light")}>
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
                            <p className="font-semibold text-sm w-full text-center pt-2 text-gray-500">Dark</p>
                        </div>
                        <div>
                            <Button className='w-20 h-40 gap-0 aspect-video relative bg-white border-2 border-gray-100 p-0 overflow-hidden shadow-none' variant={'ghost'} onClick={() => setDisplayMode("dark")}>
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
                            <p className="font-semibold text-sm w-full text-center pt-1 text-gray-500">System</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant={'primary'}
                            onClick={() => setDisplayModal(false)}
                            className='w-full h-14 border-2 bg-green-500  text-white text-lg font-bold py-3 rounded-lg'
                        >
                            Save
                        </Button></div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Display
