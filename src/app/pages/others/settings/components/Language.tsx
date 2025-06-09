"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { IoLanguage } from "react-icons/io5";

function Language() {

    const [languageModal, setLanguageModal] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("English");

    type Language = { language: string };
    const [languages, setLanguages] = useState<Language[]>([]);

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                setLanguages([{ language: "Hindi" }, { language: "English" }]);
            } catch (error) {
                console.error("Error fetching languages", error);
            }
        };
        fetchLanguages();
    }, []);



    return (
        <>
            <Dialog onOpenChange={setLanguageModal}>
                <DialogTrigger className="flex justify-between items-center gap-5 active:scale-95 duration-300 w-full">
                    <div className="flex gap-3 items-center py-5">
                        <IoLanguage className='text-3xl shrink-0' />
                        <label className="text-start overflow-hidden">
                            <h4 className='text-base font-medium'>Language</h4>
                            <p className='text-sm font-medium text-gray-400'>Select your native Language</p>
                        </label>
                    </div>
                    <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                </DialogTrigger>
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

                            onClick={() => setLanguageModal(false)}
                            className='w-full h-14 border-2 border-gray-500  text-gray-500 text-lg font-semibold py-3 rounded-lg'
                        >
                            Save
                        </Button></div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Language