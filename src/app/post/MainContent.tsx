"use client";
import { Button } from "@/components/ui/button";
import { t } from "@/src/helpers/i18n";
import { FormValues } from "@/src/helpers/types";
import { formSchemaForAddPost } from "@/src/helpers/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CategorySelector from "./components/CategorySelector";
import DescriptionInput from "./components/DescriptionInput";
import ImageUploader from "./components/ImageUploader";
import LocationInput from "./components/LocationInput";
import TitleInput from "./components/TitleInput";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


export default function MainContent() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [processing, setProcessing] = useState(false);
    const router = useRouter();

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // Form Setup with Debugging
    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(formSchemaForAddPost),
        defaultValues: { title: "", description: "", location: "", longitude: 0, latitude: 0, categories: [], images: [] },
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    // Handle Form Submission with Debugging
    const onSubmit = async (values: FormValues) => {
        setProcessing(true)
        // console.log("Form Submitted");
        // console.log("Submitted Data:", values);

        try {
            // Create FormData for sending images
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("location", values.location);
            formData.append("latitude", values.latitude.toString());
            formData.append("longitude", values.longitude.toString());

            /////////////////////////////////////////////////////////////////////////////////////////////////////

            // Append categories as JSON string (since it's an array)
            formData.append("categories", JSON.stringify(values.categories));

            /////////////////////////////////////////////////////////////////////////////////////////////////////

            // Append images if available
            if (values.images && values.images.length > 0) {
                values.images.forEach((image) => {
                    formData.append(`images`, image);
                });
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////

            // Send Data to Server
            const response = await fetch("/api/post/new", {
                method: "POST",
                body: formData,
            });

            /////////////////////////////////////////////////////////////////////////////////////////////////////

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to upload");
            }

            // console.log("Upload Successful:", data);
            toast.success(t("uploadComplete"))

            /////////////////////////////////////////////////////////////////////////////////////////////////////

            //  Reset Form After Successful Submission
            reset();
            setSelectedCategories([]);

            /////////////////////////////////////////////////////////////////////////////////////////////////////

            // Redirect After Submission
            router.replace("/");
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error(t("uploadFailed"));
        } finally {
            setProcessing(false)
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div className="p-5 space-y-10">
            {isSubmitting && <p className="text-blue-500">{t("submitting")}</p>}

            <TitleInput register={register} errors={errors} />
            <LocationInput register={register} setValue={setValue} errors={errors} />
            <DescriptionInput register={register} errors={errors} />

            <CategorySelector
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                setValue={setValue}
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

            <Button variant={"primary"} disabled={processing} type="submit" onClick={handleSubmit(onSubmit)} className="w-full bg-green-600 active:bg-green-400  h-16 text-white text-lg font-bold rounded-lg">
                {processing ? t("posting") : t("postNews")}
            </Button>
        </div>
    );
}
