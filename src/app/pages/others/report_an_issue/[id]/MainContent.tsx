"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import HeadingHeader from "@/src/components/HeadingHeader";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { RiUploadCloud2Line } from "react-icons/ri";
import { toast } from "sonner";
import { z } from "zod";

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

const MainContent = ({ id }: { id: string | null }) => {
    const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [loader, setLoader] = useState(false);

    // console.log('====================================');
    // console.log("id: " + id);
    // console.log('====================================');
    const form = useForm({
        resolver: zodResolver(issueSchema),
        defaultValues: { description: "", photos: [] },
    });



    interface FormValues {
        description: string;
        photos?: File[];
    }

    const onSubmit = async (values: FormValues): Promise<void> => {
        const formData = new FormData();
        setLoader(true);
        // Add description
        formData.append("description", values.description);

        // Add post ID from props
        if (id) {
            formData.append("postId", id);
        }

        // Append selected images
        selectedImages.forEach((image: File) => {
            formData.append("photos", image); // backend should accept multiple 'photos'
        });

        try {
            const res: Response = await fetch("/api/post/report", {
                method: "POST",
                body: formData,
            });

            if (res) {
                setLoader(false);
                // console.log("Issue submitted!");
                toast.success("Report submitted!");
                setModalOpen(false);
                form.reset();
                setSelectedImages([]);
                router.back();
            } else {
                console.error("Failed to submit issue");
            }
        } catch (err: unknown) {
            console.error("Error submitting issue:", err);
        }
    };



    const router = useRouter();



    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const selectedFiles = Array.from(files);

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

            <HeadingHeader heading="Report an Issue" />

            <div className="p-5">
                <h1 className="text-3xl font-bold mb-4">Report an Issue</h1>
                <p className="text-gray-600 mb-6 text-lg font-medium">Select an issue below to help us fix the issue and improve our services</p>
                <div className="space-y-3">
                    {issues.map((issue) => (
                        <Button variant={"primary"} key={issue} className="w-full h-14 flex justify-between gap-10 text-lg" onClick={() => { setSelectedIssue(issue); setModalOpen(true); }}>
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
                                    render={(field: {
                                        field: {
                                            value: string;
                                            onChange: (value: string) => void;
                                            onBlur: () => void;
                                        };
                                    }) => (
                                        <FormItem className="">
                                            <FormLabel className="text-lg font-bold text-black">Description</FormLabel>
                                            <FormControl>
                                                <Textarea className="h-40 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0" placeholder="Describe the issue in detail..." {...field.field} />
                                            </FormControl>
                                            <FormMessage className="" />
                                        </FormItem>
                                    )}
                                />
                                <FormItem className="">
                                    <FormLabel className="text-lg font-bold text-black">Upload media files</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <div className="h-20 border-2 focus-visible:ring-green-500 p-2 focus-visible:outline-0 focus-visible:border-0 flex items-center justify-center flex-col gap-2 rounded-lg">
                                                <RiUploadCloud2Line className="text-3xl" />
                                                <p className="text-gray-500 text-xs px-10 text-center">
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
                                            {selectedImages.map((img: File, index: number) => (
                                                <div key={index} className="relative col-span-1 h-40 object-cover">
                                                    <Image
                                                        src={URL.createObjectURL(img)}
                                                        width={100}
                                                        height={100}
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
                                        className='w-full h-14 border-2 border-gray-500  text-gray-500 text-lg font-semibold py-3 rounded-lg'
                                        disabled={loader}
                                    >
                                        {loader ? 'Submitting...' : 'Save'}
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