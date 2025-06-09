"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import HeadingHeader from "@/src/components/HeadingHeader";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MainContent = () => {
    const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const response = await axios.get("/json/faq.json");
                setFaqs(response.data.faqs);
            } catch (error) {
                console.error("Error fetching FAQs", error);
            }
        };
        fetchFAQs();
    }, []);
    const router = useRouter();

    return (
        <div className="bg-white">

            <HeadingHeader heading="Frequently Asked Questions" />

            <div className="p-5">
                <Accordion type="single" collapsible>
                    {faqs.map((faq, index) => (
                        <AccordionItem className="mb-6" key={index} value={String(index)}>
                            <AccordionTrigger className="text-lg font-semibold">{faq.question}</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
};

export default MainContent;
