"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { IoLocationOutline } from "react-icons/io5";

function Radius() {

    const [radiusModal, setRadiusModal] = useState(false);
    const [radius, setRadius] = useState(10);


    return (
        <>

            <Dialog open={radiusModal} onOpenChange={setRadiusModal}>
                <DialogTrigger className="flex justify-between items-center gap-5 active:scale-95 duration-300 w-full">
                    <div className="flex gap-3 items-center py-5">
                        <IoLocationOutline className='text-3xl shrink-0' />
                        <label className="text-start overflow-hidden">
                            <h4 className='text-base font-medium'>Radius Selection</h4>
                            <p className='text-sm font-medium text-gray-400'>Default radius is 10km</p>
                        </label>
                    </div>
                    <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                </DialogTrigger>
                <DialogContent className="">
                    <DialogHeader className="">
                        <DialogTitle className="text-lg font-bold mb-5">Select Radius</DialogTitle>
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
                        <Button
                            type="button"
                            variant={'primary'}

                            onClick={() => setRadiusModal(false)}
                            className='w-full h-14 border-2 border-gray-500  text-gray-500 text-lg font-semibold py-3 rounded-lg'
                        >
                            Save
                        </Button></div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Radius