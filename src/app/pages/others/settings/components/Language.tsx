"use client";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { setLang, t } from "@/src/helpers/i18n";
import { useEffect, useState } from "react";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { IoLanguage } from "react-icons/io5";


type LangType = "English" | "Hindi";


function Language() {
    const [selectedLanguage, setSelectedLanguage] = useState("English");

    type Language = { language: LangType };
    const [languages, setLanguages] = useState<Language[]>([]);

    useEffect(() => {
        // Load supported languages
        setLanguages([{ language: "Hindi" }, { language: "English" }]);

        // Set current language from localStorage
        const lang = localStorage.getItem("app-language") || "English";
        setSelectedLanguage(lang);
        setLang(lang as LangType);
    }, []);

    const handleLanguageChange = (value: LangType) => {
        setSelectedLanguage(value);
        localStorage.setItem("app-language", value);
        setLang(value);
        window.location.reload();
    };

    return (
        <Dialog>
            <DialogTrigger className="flex justify-between items-center gap-5 active:scale-95 duration-300 w-full">
                <div className="flex gap-3 items-center py-5">
                    <IoLanguage className='text-3xl shrink-0' />
                    <label className="text-start overflow-hidden">
                        <h4 className='text-base font-medium'>{t("languageTitle")}</h4>
                        <p className='text-sm font-medium text-gray-400'>{t("languageDescription")}</p>
                    </label>
                </div>
                <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
            </DialogTrigger>
            <DialogContent className="pt-3 pb-16 rounded-3xl">
                <DialogHeader className={""}>
                    <DialogTitle className="text-xl font-bold mt-4 mb-6">{t("selectLanguage")}</DialogTitle>
                </DialogHeader>
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-full border-2 h-16 py-6 font-bold tracking-wider text-gray-500">
                        <SelectValue placeholder="Select a Language" />
                    </SelectTrigger>
                    <SelectContent className="p-1">
                        <SelectGroup>
                            {languages.map((lang) => (
                                <SelectItem
                                    className="py-3 font-semibold tracking-wider"
                                    key={lang.language}
                                    value={lang.language}
                                >
                                    {lang.language.toUpperCase() === 'Hindi' ? 'हिंदी' : lang.language.toUpperCase()}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </DialogContent>
        </Dialog>
    );
}

export default Language;
