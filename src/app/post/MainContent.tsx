"use client"
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import TitleInput from "./components/TitleInput";
import LocationInput from "./components/LocationInput";
import DescriptionInput from "./components/DescriptionInput";
import CategorySelector from "./components/CategorySelector";

import { Button } from "@/components/ui/button";
import ImageUploader from "./components/ImageUploader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RiUploadCloud2Line } from "react-icons/ri";

// ✅ Zod Validation Schema
const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    categories: z.array(z.string()).min(1, "At least one category must be selected"),
    images: z.array(z.instanceof(File)).max(3, "You can only upload up to 3 images").optional(),
});

export interface FormValues {
    title: string;
    description: string;
    categories: string[];
    images?: File[];
}



export default function MainContent() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [location, setLocation] = useState("Fetching location...");

    // ✅ Form Setup
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { title: "", description: "", categories: [], images: [] },
    });

    // ✅ Fetch Location on Mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => setLocation(`Lat: ${position.coords.latitude.toFixed(2)}, Lng: ${position.coords.longitude.toFixed(2)}`),
                () => setLocation("Location access denied")
            );
        }
    }, []);

    // ✅ Handle Form Submission
    const onSubmit = (values: any) => {
        console.log("Submitted Data:", values);
        reset();
        setSelectedCategories([]);
        setSelectedImages([]);
    };



    return (
        <div className="p-5 space-y-10">
            <TitleInput register={register} errors={errors} />
            <LocationInput location={location} setLocation={setLocation} />
            <DescriptionInput register={register} errors={errors} />
            <CategorySelector
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                setValue={setValue}
                register={register}
                errors={errors}
            />
            <ImageUploader setValue={setValue} errors={errors} />



            <Button size={100} variant={"primary"} onClick={handleSubmit(onSubmit)} className="w-full bg-green-600 active:bg-green-400 active:scale-95 h-16 text-white text-lg font-bold rounded-lg">
                Post News
            </Button>
        </div>
    );
}
