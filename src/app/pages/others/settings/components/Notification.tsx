"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { t } from "@/src/helpers/i18n";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { IoNotificationsOutline } from "react-icons/io5";

function Notification() {
    
    const [inAppNotifications, setInAppNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);



    return (
        <>

            <Dialog>
                <DialogTrigger className="flex justify-between items-center gap-5 active:scale-95 duration-300 w-full">
                    <div className="flex gap-3 items-center py-5">
                        <IoNotificationsOutline className='text-3xl shrink-0' />
                        <label className="text-start overflow-hidden">
                            <h4 className='text-base font-medium'>{t("notifications")}</h4>
                            <p className='text-sm font-medium text-gray-400'>{t("toggleNotifications")}</p>
                        </label>
                    </div>
                    <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                </DialogTrigger>
                <DialogContent className="pt-3 pb-12 rounded-3xl space-y-2">
                    <DialogHeader className="">
                        <DialogTitle className="text-xl font-bold mt-4 mb-6">{t("notification_settings")}</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-between items-center border-2 rounded-lg p-5">
                        <span className="flex-4">{t("in_app_notifications")}</span>
                        <div className="flex-1 flex justify-center">
                            <Switch className="scale-150" checked={inAppNotifications} onCheckedChange={setInAppNotifications} />
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-2 rounded-lg p-5">
                        <span className="flex-4">{t("push_notifications")}</span>
                        <div className="flex-1 flex justify-center">
                            <Switch className="scale-150" checked={pushNotifications} onCheckedChange={setPushNotifications} />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <DialogClose
                            type="button"
                            variant={'primary'}
                            className='w-full h-14 border-2 border-gray-500  text-gray-500 text-lg font-semibold py-3 rounded-lg'
                        >
                            {t("save")}
                        </DialogClose></div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Notification