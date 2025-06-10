"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { t } from "@/src/helpers/i18n";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { IoLocationOutline } from "react-icons/io5";

function Radius() {

    const [radius, setRadius] = useState(10);

    // Load radius from localStorage on mount
    useEffect(() => {
        const savedRadius = Number(localStorage.getItem("radius")) || 10;
        if (!isNaN(savedRadius)) {
            setRadius(savedRadius);
        }
    }, []);

    // Save radius to localStorage on change
    useEffect(() => {
        localStorage.setItem("radius", radius.toString());
    }, [radius]);

    return (
        <>

            <Dialog>
                <DialogTrigger className="flex justify-between items-center gap-5 active:scale-95 duration-300 w-full">
                    <div className="flex gap-3 items-center py-5">
                        <IoLocationOutline className='text-3xl shrink-0' />
                        <label className="text-start overflow-hidden">
                            <h4 className='text-base font-medium'>{t("radiusSelection")}</h4>
                            <p className='text-sm font-medium text-gray-400'>{t("radiusDescription")}</p>
                        </label>
                    </div>
                    <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                </DialogTrigger>
                <DialogContent className="pt-3 pb-12 rounded-3xl">
                    <DialogHeader className="">
                        <DialogTitle className="text-xl font-bold mt-5 mb-6">{t("select_radius")}</DialogTitle>
                    </DialogHeader>
                    <Slider
                        className="my-1 h-10"
                        defaultValue={[5]}
                        min={5}
                        max={50}
                        step={1}
                        value={[radius]}
                        onValueChange={(val: number[]) => setRadius(val[0])}
                    />
                    <p className="mb-5">Selected Radius: <span className="font-bold text-2xl text-green-600">{radius} km</span></p>
                    <div className="flex justify-end">
                        <DialogClose
                            type="button"
                            variant={'primary'}
                            className='w-full h-14 border-2 border-gray-500  dark:border-neutral-700  text-gray-500 dark:text-gray-200 text-lg font-semibold py-3 rounded-lg'
                        >
                            {t("save")}
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Radius