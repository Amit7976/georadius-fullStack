"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";

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
            <div className='flex items-center justify-center relative my-5'>
                <FaArrowLeftLong
                    onClick={() => router.back()}
                    className="text-lg absolute left-3 w-10 h-10 p-2.5 cursor-pointer"
                />
                <h1 className='text-xl font-bold'>Frequently Asked Questions</h1>
            </div>
            <div className="p-5">
                <Accordion type="single" collapsible>
                    {faqs.map((faq, index) => (
                        <AccordionItem className="my-6" key={index} value={String(index)}>
                            <Card className="">
                                <CardContent className="">
                                    <h2 className="text-lg font-semibold">{faq.question}</h2>
                                    <p className="text-gray-600">{faq.answer}</p>
                                </CardContent>
                            </Card>
                        </AccordionItem>
                    ))}
                </Accordion>
           </div>
        </div>
    );
};

export default MainContent;
