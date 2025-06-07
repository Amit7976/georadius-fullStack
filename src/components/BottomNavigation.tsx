"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoHomeOutline, IoHome, IoFlashOutline, IoFlash } from "react-icons/io5";
import { MdAddBox, MdOutlineAddBox } from "react-icons/md";
import { CgSearch, CgSearchLoading } from "react-icons/cg";
import { FaUser } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";


export default function BottomNavigation({ username }: { username: string | boolean }) {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    // Determine current tab from pathname
    const currentTab = (() => {
        const path = pathname.split("/")[1];
        if (path === username) return "profile";
        return path || "home";
    })();

    const tabs = [
        { key: "home", name: "Home", icon: IoHomeOutline, icon2: IoHome, href: "/home" },
        { key: "rapid", name: "Rapid", icon: IoFlashOutline, icon2: IoFlash, href: "/rapid" },
        { key: "post", name: "Post", icon: MdOutlineAddBox, icon2: MdAddBox, href: "/post" },
        { key: "search", name: "Search", icon: CgSearch, icon2: CgSearchLoading, href: "/search" },
        { key: "profile", name: "Profile", icon: FaRegUser, icon2: FaUser, href: `/${username}` },
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

    return (
        <nav
            className={`fixed bottom-0 w-full max-w-lg bg-white flex justify-around p-2 h-[6vh] pt-0 rounded-none z-50 transition-transform duration-300 ${isVisible ? "translate-y-0" : "translate-y-full"
                }`}
        >
            {tabs.map(({ key, name, icon: Icon, icon2: Icon2, href }) => {
                const isActive = currentTab === key;

                return (
                    <Link key={key} href={href} scroll={false} className="flex-1">
                        <div
                            className={`flex flex-col items-center p-2 lg:p-1 ${isActive ? "border-t-[3px] border-green-500" : "border-t-1"
                                }`}
                        >
                            {isActive ? (
                                <Icon2 className="text-green-600 text-[5vw] sm:text-xl" />
                            ) : (
                                <Icon className="text-gray-400 text-[5vw] sm:text-xl" />
                            )}
                            <span
                                className={`text-[2.3vw] sm:text-xs font-bold mt-0.5 ${isActive ? "text-green-600" : "text-gray-400"
                                    }`}
                            >
                                {name}
                            </span>
                        </div>
                    </Link>
                );
            })}
        </nav>
    );
}
