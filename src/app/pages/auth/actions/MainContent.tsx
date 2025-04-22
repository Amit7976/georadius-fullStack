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
import ProviderLogout from "@/src/helpers/logout";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegUserCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { FiSun } from "react-icons/fi";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { IoLanguage, IoLocationOutline, IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineReport, MdPassword } from "react-icons/md";
import { SlQuestion } from "react-icons/sl";

const MainContent = () => {
    const router = useRouter();
    const [languageModal, setLanguageModal] = useState(false);
    const [notificationModal, setNotificationModal] = useState(false);
    const [displayModal, setDisplayModal] = useState(false);
    const [radiusModal, setRadiusModal] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [inAppNotifications, setInAppNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [displayMode, setDisplayMode] = useState("system");
    const [radius, setRadius] = useState(10);
    type Language = { language: string };
    const [languages, setLanguages] = useState<Language[]>([]);

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                // const res = await axios.get("https://translation.googleapis.com/language/translate/v2/languages?key=YOUR_GOOGLE_API_KEY");
                // setLanguages(res.data.data.languages);
                setLanguages([{ language: "Hindi" }, { language: "English" }]);
            } catch (error) {
                console.error("Error fetching languages", error);
            }
        };
        fetchLanguages();
    }, []);




    return (
        <>
            <div className='bg-white w-full h-full'>
                <div className='flex items-center justify-center relative my-5'>
                    <FaArrowLeftLong
                        onClick={() => router.back()}
                        className="text-lg absolute left-3 w-10 h-10 p-2.5 cursor-pointer"
                    />
                    <h1 className='text-xl font-bold'>Settings</h1>
                </div>

                <div className='py-8 px-5'>
                    <h2 className='text-xl font-semibold mb-2'>Account Settings</h2>
                    <Link href={"updateprofile"} className="flex justify-between items-center gap-5 cursor-pointer">
                        <div className="flex gap-3 items-center py-5">
                            <FaRegUserCircle className='text-4xl' />
                            <label>
                                <h4 className='text-lg font-semibold'>Your Profile</h4>
                                <p className='text-base font-medium text-gray-500'>Update your Profile Information</p>
                            </label>
                        </div>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                    </Link>

                    <Link href={"privacy_security"} className="flex justify-between items-center gap-5">
                        <div className="flex gap-3 items-center py-5">
                            <MdPassword className='text-4xl' />
                            <label className="">
                                <h4 className='text-lg font-semibold'>Privacy & Security</h4>
                                <p className='text-base font-medium text-gray-500'>Change your password</p>
                            </label>
                        </div>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                    </Link>
                </div>

                <div className='py-8 px-5'>
                    <h2 className='text-xl font-semibold mb-2'>App Settings</h2>

                    <div onClick={() => setLanguageModal(true)} className="flex justify-between items-center gap-5">
                        <div className="flex gap-3 items-center py-5">
                            <IoLanguage className='text-4xl' />
                            <label className="">
                                <h4 className='text-lg font-semibold'>Language</h4>
                                <p className='text-base font-medium text-gray-500'>Select your native Language</p>
                            </label>
                        </div>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                    </div>
                    <div onClick={() => setNotificationModal(true)} className="flex justify-between items-center gap-5">
                        <div className="flex gap-3 items-center py-5">
                            <IoNotificationsOutline className='text-4xl' />
                            <label className="">
                                <h4 className='text-lg font-semibold'>Notification</h4>
                                <p className='text-base font-medium text-gray-500'>On/Off your Notifications</p>
                            </label>
                        </div>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                    </div>
                    <div onClick={() => setDisplayModal(true)} className="flex justify-between items-center gap-5">
                        <div className="flex gap-3 items-center py-5">
                            <FiSun className='text-4xl' />
                            <label className="">
                                <h4 className='text-lg font-semibold'>Display Preference</h4>
                                <p className='text-base font-medium text-gray-500'>Select Theme Appearance</p>
                            </label>
                        </div>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                    </div>
                    <div onClick={() => setRadiusModal(true)} className="flex justify-between items-center gap-5">
                        <div className="flex gap-3 items-center py-5">
                            <IoLocationOutline className='text-4xl' />
                            <label className="">
                                <h4 className='text-lg font-semibold'>Radius Selection</h4>
                                <p className='text-base font-medium text-gray-500'>Default radius is 10km</p>
                            </label>
                        </div>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                    </div>
                </div>

                <div className='py-8 px-5'>
                    <h2 className='text-xl font-semibold mb-2'>Support</h2>
                    <Link href={"report_an_issue"} className="flex justify-between items-center gap-5">
                        <div className="flex gap-3 items-center py-5">
                            <MdOutlineReport className='text-4xl' />
                            <label className="">
                                <h4 className='text-lg font-semibold'>Report an issue</h4>
                            </label>
                        </div>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                    </Link>
                    <Link href={"f&q"} className="flex justify-between items-center gap-5">
                        <div className="flex gap-3 items-center py-5">
                            <SlQuestion className='text-4xl' />
                            <label className="">
                                <h4 className='text-lg font-semibold'>F&Q</h4>
                            </label>
                        </div>
                        <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                    </Link>
                </div>

                <div className="py-8 px-5">
                    <ProviderLogout />
                </div>
            </div>

            {/* // MODALs */}
            <div>

                {/* Language Modal */}
                <Dialog open={languageModal} onOpenChange={setLanguageModal}>
                    <DialogContent className="">
                        <DialogHeader className="">
                            <DialogTitle className="text-lg font-bold mb-5">Select Language</DialogTitle>
                        </DialogHeader>
                        <Select
                            value={selectedLanguage}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedLanguage(e.target.value)}
                        >
                            <SelectTrigger className="w-full border-2 h-14">
                                <SelectValue placeholder="Select a Language" />
                            </SelectTrigger>
                            <SelectContent className="">
                                <SelectGroup>
                                    {languages.map((lang: Language) => (
                                        <SelectItem className="" key={lang.language} value={lang.language}>{lang.language.toUpperCase()}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant={'primary'}
                                size={20}
                                onClick={() => setLanguageModal(false)}
                                className='w-full h-14 border-2 border-gray-500 active:scale-95 text-gray-500 text-lg font-semibold py-3 rounded-lg'
                            >
                                Save
                            </Button></div>
                    </DialogContent>
                </Dialog>

                {/* Notifications Modal */}
                <Dialog open={notificationModal} onOpenChange={setNotificationModal}>
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
                                size={20}
                                onClick={() => setNotificationModal(false)}
                                className='w-full h-14 border-2 border-gray-500 active:scale-95 text-gray-500 text-lg font-semibold py-3 rounded-lg'
                            >
                                Save
                            </Button></div>
                    </DialogContent>
                </Dialog>

                {/* Display Preference Modal */}
                <Dialog open={displayModal} onOpenChange={setDisplayModal}>
                    <DialogContent className="">
                        <DialogHeader className="">
                            <DialogTitle className="text-lg font-bold mb-5">Display Preferences</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-2">
                            <Button className='w-full h-14 border-2 border-gray-500 focus-visible:text-white text-lg font-semibold py-3 rounded-lg' size={100} variant={displayMode === "system" ? "default" : "outline"} onClick={() => setDisplayMode("system")}>
                                System Default
                            </Button>
                            <Button className='w-full h-14 border-2 border-gray-500 focus-visible:text-white text-lg font-semibold py-3 rounded-lg' size={100} variant={displayMode === "light" ? "default" : "outline"} onClick={() => setDisplayMode("light")}>
                                Light Mode
                            </Button>
                            <Button className='w-full h-14 border-2 border-gray-500 focus-visible:text-white text-lg font-semibold py-3 rounded-lg' size={100} variant={displayMode === "dark" ? "default" : "outline"} onClick={() => setDisplayMode("dark")}>
                                Dark Mode
                            </Button>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant={'primary'}
                                size={20}
                                onClick={() => setDisplayModal(false)}
                                className='w-full h-14 border-2 bg-green-500 active:scale-95 text-white text-lg font-bold py-3 rounded-lg'
                            >
                                Save
                            </Button></div>
                    </DialogContent>
                </Dialog>

                {/* Radius Selection Modal */}
                <Dialog open={radiusModal} onOpenChange={setRadiusModal}>
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
                                size={20}
                                onClick={() => setRadiusModal(false)}
                                className='w-full h-14 border-2 border-gray-500 active:scale-95 text-gray-500 text-lg font-semibold py-3 rounded-lg'
                            >
                                Save
                            </Button></div>
                    </DialogContent>
                </Dialog>
            </div>

        </>
    )
}

export default MainContent
