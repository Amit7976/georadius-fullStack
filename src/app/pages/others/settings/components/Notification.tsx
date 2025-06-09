"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { IoNotificationsOutline } from "react-icons/io5";

function Notification() {


    const [notificationModal, setNotificationModal] = useState(false);
    const [inAppNotifications, setInAppNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);



    return (
        <>

            <Dialog open={notificationModal} onOpenChange={setNotificationModal}>
                <DialogTrigger className="flex justify-between items-center gap-5 active:scale-95 duration-300 w-full">
                    <div className="flex gap-3 items-center py-5">
                        <IoNotificationsOutline className='text-3xl shrink-0' />
                        <label className="text-start overflow-hidden">
                            <h4 className='text-base font-medium'>Notification</h4>
                            <p className='text-sm font-medium text-gray-400'>On/Off your Notifications</p>
                        </label>
                    </div>
                    <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                </DialogTrigger>
                <DialogContent className="space-y-5">
                    <DialogHeader className="">
                        <DialogTitle className="text-lg font-bold mb-5">Notification Settings</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-between items-center border-2 rounded-lg p-5">
                        <span className="flex-4">In-App Notifications</span>
                        <div className="flex-1 flex justify-center">
                            <Switch className="scale-150" checked={inAppNotifications} onCheckedChange={setInAppNotifications} />
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-2 rounded-lg p-5">
                        <span className="flex-4">Push Notifications</span>
                        <div className="flex-1 flex justify-center">
                            <Switch className="scale-150" checked={pushNotifications} onCheckedChange={setPushNotifications} />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button
                            type="button"
                            variant={'primary'}

                            onClick={() => setNotificationModal(false)}
                            className='w-full h-14 border-2 border-gray-500  text-gray-500 text-lg font-semibold py-3 rounded-lg'
                        >
                            Save
                        </Button></div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Notification