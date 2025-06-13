"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CgSearch, CgSearchLoading } from "react-icons/cg";
import { FaRegUser, FaUser } from "react-icons/fa";
import { IoFlash, IoFlashOutline, IoHome, IoHomeOutline } from "react-icons/io5";
import { MdAddBox, MdOutlineAddBox } from "react-icons/md";
import { t } from "../helpers/i18n";
import { LoaderLink } from "./loaderLinks";


export default function BottomNavigation({ username }: { username: string | boolean }) {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    const allowedRoutes = ['home', 'rapid', 'search', username, 'post'];

    // Determine current tab from pathname
    const currentTab = (() => {
        const path = pathname.split("/")[1];
        if (path === username) return username;
        return path || "home";
    })();




    const tabs = [
        { key: "home", name: t("home"), icon: IoHomeOutline, icon2: IoHome, href: "/home" },
        { key: "rapid", name: t("rapid"), icon: IoFlashOutline, icon2: IoFlash, href: "/rapid" },
        { key: "post", name: t("post"), icon: MdOutlineAddBox, icon2: MdAddBox, href: "/post" },
        { key: "search", name: t("search"), icon: CgSearch, icon2: CgSearchLoading, href: "/search" },
        { key: `${username}`, name: t("profile"), icon: FaRegUser, icon2: FaUser, href: `/${username}` },
    ];


    
    // Hide nav on scroll down, show on scroll up
    useEffect(() => {
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsVisible(currentScrollY < lastScrollY.current || currentScrollY === 0);
            lastScrollY.current = currentScrollY;
        };
        
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
    
    // Set allowed status
    if (!allowedRoutes.includes(currentTab)) return null;

    return (
        <nav
            className={`fixed bottom-0 w-full bg-white dark:bg-neutral-900 flex justify-around p-2 h-[6vh] pt-0 rounded-none z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "translate-y-full"
                }`}
        >
            {tabs.map(({ key, name, icon: Icon, icon2: Icon2, href }) => {
                const isActive = currentTab === key;

                return (
                    <LoaderLink key={key} href={href} className="flex-1 active:bg-transparent">
                        <div
                            className={`lg:p-1 p-2 active:bg-neutral-900 ${isActive ? "border-t-[3px] border-green-500" : "border-t-1 border-gray-200 dark:border-neutral-700"}`}>
                            <div className={`flex flex-col items-center ${isActive ? "pt-0" : "pt-0.5"}`}>
                                {isActive ? (
                                    <Icon2 className="text-green-600 text-[5vw] sm:text-xl" />
                                ) : (
                                    <Icon className="text-gray-400 text-[5vw] sm:text-xl" />
                                )}
                                <p className={`text-[2.3vw] sm:text-xs font-bold mt-0.5 ${isActive ? "text-green-600" : "text-gray-400"}`}>
                                    {name}
                                </p>
                            </div>
                        </div>
                    </LoaderLink>
                );
            })}
        </nav>
    );
}
