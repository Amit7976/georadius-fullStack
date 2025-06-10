"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import HeadingHeader from "@/src/components/HeadingHeader";
import { t } from "@/src/helpers/i18n";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MainContent = () => {
    const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const storedLang = localStorage.getItem("app-language");
                const isHindi = storedLang === "Hindi";
                const fileName = isHindi ? "/json/faq_hi.json" : "/json/faq.json";

                const response = await axios.get(fileName);
                setFaqs(response.data.faqs);
            } catch (error) {
                console.error("Error fetching FAQs", error);
            }
        };

        fetchFAQs();
    }, []);

    return (
        <>
            <HeadingHeader heading={t("faq")} />
            <div className="p-5">
                <Accordion type="single" collapsible>
                    {faqs.map((faq, index) => (
                        <AccordionItem className="mb-6" key={index} value={String(index)}>
                            <AccordionTrigger className="text-lg font-semibold">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </>
    );
};

export default MainContent;
