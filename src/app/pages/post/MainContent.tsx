"use client";
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
import { useRouter } from "next/navigation";

// ✅ Zod Validation Schema with Debugging
const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    location: z.string().min(10, "Location must be provided"),
    latitude: z.number().min(1, "latitude must be provided"),
    longitude: z.number().min(1, "longitude must be provided"),
    categories: z.array(z.string()).min(1, "At least one category must be selected"),
    images: z.array(z.any()).max(3, "You can only upload up to 3 images").optional(),
});

export interface FormValues {
    title: string;
    description: string;
    location: string;
    latitude: number;
    longitude: number;
    categories: string[];
    images?: File[];
}

export default function MainContent() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);

    console.log("Component Rendered");

    // ✅ Form Setup with Debugging
    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { title: "", description: "", location: "", longitude: 0, latitude: 0, categories: [], images: [] },
    });

    useEffect(() => {
        console.log("Current Errors:", errors);
    }, [errors]);



    const router = useRouter();

    // ✅ Handle Form Submission with Debugging
    const onSubmit = async (values: FormValues) => {
        setProcessing(true)
        console.log("Form Submitted");
        console.log("Submitted Data:", values);

        try {
            // ✅ Create FormData for sending images
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("location", values.location);
            formData.append("latitude", values.latitude.toString());
            formData.append("longitude", values.longitude.toString());

            // ✅ Append categories as JSON string (since it's an array)
            formData.append("categories", JSON.stringify(values.categories));

            // ✅ Append images if available
            if (values.images && values.images.length > 0) {
                values.images.forEach((image, index) => {
                    formData.append(`images`, image);
                });
            }

            // ✅ Send Data to Server
            const response = await fetch("/api/post/new", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to upload");
            }

            console.log("Upload Successful:", data);

            // ✅ Reset Form After Successful Submission
            reset();
            setSelectedCategories([]);

            // ✅ Redirect After Submission
            router.push("/");
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Failed to upload. Please try again.");
        } finally {
            setProcessing(false)
        }
    };


    return (
        <div className="p-5 space-y-10">
            {isSubmitting && <p className="text-blue-500">Submitting...</p>}

            <TitleInput register={register} errors={errors} />
            <LocationInput register={register} setValue={setValue} errors={errors} />
            <DescriptionInput register={register} errors={errors} />

            <CategorySelector
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                setValue={setValue}
                register={register}
                errors={errors}
            />
            <ImageUploader setValue={setValue} errors={errors} />

            {errors && (
                <div className="text-red-500">
                    {(Object.keys(errors) as (keyof FormValues)[]).map((key) => (
                        <p key={key}>{errors[key]?.message as string}</p>
                    ))}
                </div>
            )}

            <Button size={100} variant={"primary"} disabled={processing} type="submit" onClick={handleSubmit(onSubmit)} className="w-full bg-green-600 active:bg-green-400 active:scale-95 h-16 text-white text-lg font-bold rounded-lg">
                {processing ? "Processing...." : "Post News"}
            </Button>
        </div>
    );
}
