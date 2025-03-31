"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GrMicrophone } from "react-icons/gr";
import { RiUploadCloud2Line } from "react-icons/ri";
import { IoLocation } from "react-icons/io5";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FaRegTrashCan } from "react-icons/fa6";
import interestsList from "@/public/json/interestList.json";

// ✅ Zod Validation Schema
const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    categories: z.array(z.string()).min(1, "At least one category must be selected"),
    images: z
        .array(z.instanceof(File))
        .max(3, "You can only upload up to 3 images")
        .refine((files) => files.every((file) => file.size <= 2 * 1024 * 1024), {
            message: "Each image must be 2MB or less",
        })
        .optional(),
});


function MainContent() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);

    // ✅ Setup Form with Zod Validation
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            categories: [],
            images: [],
        },
    });

    // ✅ Handle Category Selection
    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) => {
            const newCategories = prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category];
            setValue("categories", newCategories);
            return newCategories;
        });
    };

    // ✅ Remove Category
    const removeCategory = (category: string) => {
        setSelectedCategories((prev) => prev.filter((c) => c !== category));
        setValue("categories", selectedCategories.filter((c) => c !== category));
    };

    // ✅ Handle File Selection with Validation
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        let selectedFiles = Array.from(files);

        // Max 3 images allowed
        if (selectedFiles.length + selectedImages.length > 3) {
            alert("You can only select up to 3 images.");
            return;
        }

        // Filter out large files (>2MB)
        const validFiles = selectedFiles.filter((file) => file.size <= 2 * 1024 * 1024);
        if (validFiles.length < selectedFiles.length) {
            alert("Some files are too large (Max 2MB per file).");
        }

        setSelectedImages((prev) => [...prev, ...validFiles]);
        setValue("images", [...selectedImages, ...validFiles]); // Update form state
    };

    // ✅ Remove Image
    const removeImage = (index: number) => {
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updatedImages);
        setValue("images", updatedImages);
    };

    // ✅ Form Submission
    const onSubmit = (values: any) => {
        console.log("Submitted Data:", values);
        reset();
        setSelectedCategories([]);
        setSelectedImages([]);
    };

    const [currentLocation, setCurrentLocation] = useState("Fetching location...");
    const [customLocation, setCustomLocation] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);


    // Fetch user location on mount
    useEffect(() => {
        if (typeof window !== "undefined" && navigator.geolocation) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then((permission) => {
                    if (permission.state === "granted" || permission.state === "prompt") {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const { latitude, longitude } = position.coords;
                                setCurrentLocation(`Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`);
                            },
                            () => setCurrentLocation("Location access denied")
                        );
                    } else {
                        setCurrentLocation("Location permission denied");
                    }
                });
        } else {
            setCurrentLocation("Geolocation not supported");
        }
    }, []);

    return (
        <>
            <div className="text-center p-10 space-y-3">
                <h1 className="text-2xl font-extrabold text-black">Report a News</h1>
                <p className="text-base font-medium text-gray-500">
                    Share the latest updates, eyewitness reports, and important stories
                </p>
            </div>

            <div className="p-5 space-y-10">
                <div className="space-y-4">
                    {/* Title Input */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center gap-5">
                            <Label className="text-lg font-bold text-black">
                                News Title <span className="text-red-500">*</span>
                            </Label>
                            <GrMicrophone className="text-2xl active:scale-75 duration-300" />
                        </div>
                        <Input
                            className="h-14 ring-2 ring-gray-400 font-bold focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0"
                            type="text"
                            placeholder="Enter News Title"
                            {...register("title")}
                        />
                        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                    </div>

                    <div className="flex items-start gap-1">
                        <IoLocation className="text-blue-500 text-xl shrink-0 mt-1" />
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <button type="button" className="text-blue-500 font-bold text-left">
                                    {customLocation || currentLocation} <span className="text-gray-400 shrink-0">(click to change)</span>
                                </button>
                            </DialogTrigger>

                            {/* Dialog Box */}
                            <DialogContent className="">
                                <DialogHeader className="">
                                    <DialogTitle className="text-lg font-bold mb-5">Enter New Location</DialogTitle>
                                </DialogHeader>
                                <Input
                                    type={"text"}
                                    value={inputValue}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setInputValue(e.target.value)
                                    }
                                    placeholder="Type location here..."
                                    className="h-14 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0"
                                />

                                <DialogFooter className="mt-2">
                                    <div className="flex justify-end">
                                        <Button
                                            type="button"
                                            variant={'primary'}
                                            size={20}
                                            onClick={() => { setCustomLocation(inputValue); setOpen(false); }}
                                            className='w-full h-14 border-2 border-gray-500 active:scale-95 text-gray-500 text-lg font-semibold py-3 rounded-lg'
                                        >
                                            Save
                                        </Button></div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Remove Button (only if custom location exists) */}
                        {customLocation && (
                            <Button className="border-2 border-red-500 text-red-500" variant="primary" size="sm" onClick={() => setCustomLocation(null)}>
                                <FaRegTrashCan />
                            </Button>
                        )}
                    </div>
                </div>


                {/* Description Input */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center gap-5">
                        <Label className="text-lg font-bold text-black">
                            Description <span className="text-red-500">*</span>
                        </Label>
                        <GrMicrophone className="text-2xl active:scale-75 duration-300" />
                    </div>
                    <Textarea
                        className="h-40 ring-2 ring-gray-400 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0"
                        placeholder="Describe the news in detail..."
                        {...register("description")}
                    />
                    {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                </div>


                {/* Category Selection */}
                <div className="space-y-4">
                    <Label className="text-lg font-bold text-black">
                        News Category <span className="text-red-500">*</span>
                    </Label>

                    <div>
                        <div className="grid grid-cols-3 gap-2">
                            {interestsList.map((category) => (
                                <Button
                                    className={"py-3 text-xs font-semibold"}
                                    size={100}
                                    key={category.name}
                                    variant={selectedCategories.includes(category.name) ? "default" : "outline"}
                                    onClick={() => toggleCategory(category.name)}
                                >
                                    {category.name}
                                </Button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {selectedCategories.map((category) => (
                                <div key={category} className="bg-gray-100 text-xs px-6 py-3 font-semibold rounded-lg flex items-center gap-2">
                                    {category}
                                    <FaRegTrashCan className="text-red-500 cursor-pointer text-sm" onClick={() => removeCategory(category)} />
                                </div>
                            ))}
                        </div>
                        {errors.categories && <p className="text-red-500">{errors.categories.message}</p>}
                    </div>
                </div>


                {/* Image Upload */}
                <div className="space-y-4">
                    <Label className="text-lg font-bold text-black">Attach Media</Label>
                    <div className="relative">
                        <div className={`${(selectedImages.length == 0) ? "h-40" : "h-20"} border-2 flex items-center justify-center flex-col gap-2 rounded-lg`}>
                            <RiUploadCloud2Line className="text-3xl" />
                            <p className="text-gray-500 text-xs">Max file size: 2MB, up to 3 images</p>
                        </div>
                        <Input
                            className={`absolute top-0 opacity-0 ${(selectedImages.length == 0) ? "h-40" : "h-20"}`}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    {/* Image Preview */}
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
                    {errors.images && <p className="text-red-500">{errors.images.message}</p>}
                </div>

                {/* Submit Button */}
                <Button
                    size={100}
                    variant={"primary"}
                    onClick={handleSubmit(onSubmit)}
                    className="w-full bg-green-600 active:bg-green-400 active:scale-95 duration-300 h-16 mb-10 text-white text-lg font-bold rounded-lg"
                >
                    Post News
                </Button>
            </div >
        </>
    );
}

export default MainContent;