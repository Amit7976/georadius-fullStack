"use client"
import { Button } from "@/components/ui/button";
import { t } from "@/src/helpers/i18n";
import { FormValues, MainPostTypes } from "@/src/helpers/types";
import { formSchemaForEditPost } from "@/src/helpers/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
    const [processing, setProcessing] = useState(false);
    const router = useRouter();
    const [post, setPost] = useState<MainPostTypes["post"]>({
        _id: "",
        title: "",
        description: "",
        location: "",
        latitude: 0,
        longitude: 0,
        categories: [],
        images: [],
    });
    const [selectedCategories, setSelectedCategories] = useState<string[]>(post.categories || []);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(formSchemaForEditPost),
        defaultValues: {
            title: "",
            description: "",
            location: "",
            longitude: 0,
            latitude: 0,
            categories: [],
            images: [],
            deletedImages: [],
        },
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        const storedData = sessionStorage.getItem("editNewsData");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setPost(parsedData);
            reset({
                title: parsedData.title,
                description: parsedData.description,
                location: parsedData.location,
                latitude: parsedData.latitude,
                longitude: parsedData.longitude,
                categories: parsedData.categories,
                images: parsedData.images || [],
                deletedImages: [],
            });
            setSelectedCategories(parsedData.categories || []);
        } else {
            console.warn("No edit data in sessionStorage. Consider fetching...");
        }
    }, [reset]);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const onSubmit = async (values: FormValues) => {
        setProcessing(true);
        try {
            const formData = new FormData();
            formData.append("postId", post._id);
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("location", values.location);
            formData.append("latitude", values.latitude.toString());
            formData.append("longitude", values.longitude.toString());
            formData.append("categories", JSON.stringify(values.categories));
            formData.append("deletedImages", JSON.stringify(values.deletedImages));

            /////////////////////////////////////////////////////////////////////////////////////////////////////

            // Append images if present
            if (values.images && values.images.length > 0) {
                values.images.forEach((image) => {
                    formData.append("images", image);
                });
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////

            const response = await fetch("/api/update/post", {
                method: "POST",
                body: formData,
            });

            /////////////////////////////////////////////////////////////////////////////////////////////////////

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to upload");
            }

            /////////////////////////////////////////////////////////////////////////////////////////////////////

            // Reset form on success
            reset();
            toast.success(t("uploadComplete"))
            setSelectedCategories([]); // Reset the selected categories as well
            router.replace("/");

        } catch (error) {
            console.error("Upload Error:", error);
            toast.error(t("uploadFailed"));
        } finally {
            setProcessing(false);
        }
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div className="p-5 space-y-10">
            {isSubmitting && <p className="text-blue-500">Submitting...</p>}

            <TitleInput register={register} errors={errors} />
            <LocationInput register={register} setValue={setValue} errors={errors} data={post} />
            <DescriptionInput register={register} errors={errors} />

            <CategorySelector
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                setValue={setValue}
                errors={errors}
            />
            <ImageUploader setValue={setValue} errors={errors} data={(post.images || []).map(image => typeof image === "string" ? image : "")} />

            {errors && (
                <div className="text-red-500">
                    {(Object.keys(errors) as (keyof FormValues)[]).map((key) => (
                        <p key={key}>{errors[key]?.message as string}</p>
                    ))}
                </div>
            )}

            <Button
                variant={"</div>primary"}
                disabled={processing}
                type="submit"
                onClick={handleSubmit(onSubmit)} // Remove onClick for simplicity
                className="w-full bg-green-600 active:bg-green-400  h-16 text-white text-lg font-bold rounded-lg"
            >
                {processing ? t("posting") : t("postNews")}
            </Button>
        </div>
    );
}
