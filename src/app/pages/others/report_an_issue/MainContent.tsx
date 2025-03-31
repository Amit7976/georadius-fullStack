"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaArrowLeftLong, FaCross } from "react-icons/fa6";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { RiUploadCloud2Line } from "react-icons/ri";

const issueSchema = z.object({
    description: z.string().min(5, "Description must be at least 5 characters"),
    photos: z.array(z.instanceof(File)).optional(),
});

const issues = [
    "News is not showing",
    "Know Fake News",
    "Nudity Suspect",
    "Incorrect Location",
    "Spam or Scam",
    "Hate Speech",
    "Other",
];

const MainContent: React.FC = () => {
    const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);

    const form = useForm({
        resolver: zodResolver(issueSchema),
        defaultValues: { description: "", photos: [] },
    });

    const onSubmit = (values: any) => {
        console.log("Submitted", values);
        setModalOpen(false);
        form.reset();
        setSelectedImages([]);
    };
    const router = useRouter();



    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        let selectedFiles = Array.from(files);

        // Restrict max selection to 6 images
        if (selectedFiles.length > 3) {
            alert("You can only select up to 3 images.");
            return;
        }

        setSelectedImages(selectedFiles); // Only store valid images
    };
    // Remove individual image
    const removeImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    };


    return (
        <>
            <div className='flex items-center justify-center relative my-5'>
                <FaArrowLeftLong
                    onClick={() => router.back()}
                    className="text-lg absolute left-3 w-10 h-10 p-2.5 cursor-pointer"
                />
                <h1 className='text-xl font-bold'>Report an Issue</h1>
            </div>
            <div className="p-5">
                <h1 className="text-3xl font-bold mb-4">Report an Issue</h1>
                <p className="text-gray-600 mb-6 text-lg font-medium">Select an issue below to help us fix the issue and improve our services</p>
                <div className="space-y-3">
                    {issues.map((issue) => (
                        <Button variant={"primary"} size={100} key={issue} className="w-full h-14 flex justify-between gap-10 text-lg" onClick={() => { setSelectedIssue(issue); setModalOpen(true); }}>
                            {issue}
                            <HiOutlineChevronRight className='text-2xl text-gray-500 font-light' />
                        </Button>
                    ))}
                </div>

                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent className="p-6">
                        <DialogHeader className="">
                            <DialogTitle className="text-lg font-bold mb-5">{selectedIssue}</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }: any) => (
                                        <FormItem className="">
                                            <FormLabel className="text-lg font-bold text-black">Description</FormLabel>
                                            <FormControl>
                                                <Textarea className="h-40 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0" placeholder="Describe the issue in detail..." {...field} />
                                            </FormControl>
                                            <FormMessage className="" />
                                        </FormItem>
                                    )}
                                />
                                <FormItem className="">
                                    <FormLabel className="text-lg font-bold text-black">Upload media files</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <div className="h-20 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0 flex items-center justify-center flex-col gap-2 rounded-lg">
                                                <RiUploadCloud2Line className="text-3xl" />
                                                <p className="text-gray-500 text-xs">
                                                    Max file size: 2MB, accepted formats: JPG, JPEG, PNG, GIF
                                                </p>
                                            </div>
                                            <Input
                                                className="h-20 border-2 absolute top-0 opacity-0 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    </FormControl>
                                    {/* Image Previews with Remove Button */}
                                    {selectedImages.length > 0 && (
                                        <div className="gap-2 mt-3 flex-wrap grid grid-cols-3">
                                            {selectedImages.map((img, index) => (
                                                <div key={index} className="relative col-span-1 h-40 object-cover">
                                                    <img
                                                        src={URL.createObjectURL(img)}
                                                        alt={`preview-${index}`}
                                                        className="w-full h-40 object-cover rounded-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute top-0 right-0 bg-red-500 text-white font-extrabold rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <FormMessage className="" />
                                </FormItem>
                                <div className="flex justify-end mt-0 mb-5">
                                    <Button
                                        type="submit"
                                        variant={'primary'}
                                        size={20}
                                        className='w-full h-14 border-2 border-gray-500 active:scale-95 text-gray-500 text-lg font-semibold py-3 rounded-lg'
                                    >
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};

export default MainContent;