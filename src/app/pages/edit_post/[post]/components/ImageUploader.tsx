import { UseFormSetValue } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RiUploadCloud2Line } from "react-icons/ri";
import { useState, useEffect } from "react";
import type { FormValues } from "../MainContent";

interface ImageUploaderProps {
    setValue: UseFormSetValue<FormValues>;
    errors: any;
    data: string[]; // post.images (URLs)
}

export default function ImageUploader({ setValue, errors, data }: ImageUploaderProps) {
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [deletedImages, setDeletedImages] = useState<string[]>([]);

    useEffect(() => {
        setExistingImages(data || []);
        setNewImages([]);
        setDeletedImages([]);
        setValue("images", []);
        setValue("deletedImages", []);
    }, [data, setValue]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const selectedFiles = Array.from(files);
        const totalImages = existingImages.length + newImages.length + selectedFiles.length;
        if (totalImages > 3) {
            alert("You can only select up to 3 images total.");
            return;
        }

        const validFiles = selectedFiles.filter((file) => file.size <= 2 * 1024 * 1024);
        if (validFiles.length < selectedFiles.length) {
            alert("Some files are too large (Max 2MB per file).");
        }

        const updatedNewImages = [...newImages, ...validFiles];
        setNewImages(updatedNewImages);
        setValue("images", updatedNewImages);

        // ✅ Reset file input to allow re-uploading same file again
        event.target.value = "";
    };

    const removeExistingImage = (index: number) => {
        const removedImage = existingImages[index];
        const updated = existingImages.filter((_, i) => i !== index);
        const updatedDeleted = [...deletedImages, removedImage];

        setExistingImages(updated);
        setDeletedImages(updatedDeleted);

        setValue("images", newImages); // Keep current new uploads
        setValue("deletedImages", updatedDeleted); // Update deleted images
    };

    const removeNewImage = (index: number) => {
        const updated = newImages.filter((_, i) => i !== index);
        setNewImages(updated);
        setValue("images", updated); // ✅ Only set updated list
    };

    return (
        <div className="space-y-4">
            <Label className="text-lg font-bold text-black">Attach Media</Label>

            <div className="relative">
                <div
                    className={`${existingImages.length + newImages.length === 0 ? "h-40" : "h-20"
                        } border-2 flex items-center justify-center flex-col gap-2 rounded-lg`}
                >
                    <RiUploadCloud2Line className="text-3xl" />
                    <p className="text-gray-500 text-xs">Max file size: 2MB, up to 3 images</p>
                </div>

                <Input
                    className={`absolute top-0 opacity-0 ${existingImages.length + newImages.length === 0 ? "h-40" : "h-20"
                        }`}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {(existingImages.length > 0 || newImages.length > 0) && (
                <div className="gap-2 mt-3 flex-wrap grid grid-cols-3">
                    {existingImages.map((url, index) => (
                        <div key={`existing-${index}`} className="relative col-span-1 h-40 object-cover">
                            <img
                                src={url}
                                alt={`existing-preview-${index}`}
                                className="w-full h-40 object-cover rounded-md"
                            />
                            <button
                                type="button"
                                className="absolute top-0 right-0 bg-red-500 text-white font-extrabold rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                onClick={() => removeExistingImage(index)}
                            >
                                X
                            </button>
                        </div>
                    ))}

                    {newImages.map((img, index) => (
                        <div key={`new-${index}`} className="relative col-span-1 h-40 object-cover">
                            <img
                                src={URL.createObjectURL(img)}
                                alt={`new-preview-${index}`}
                                className="w-full h-40 object-cover rounded-md"
                            />
                            <button
                                type="button"
                                className="absolute top-0 right-0 bg-red-500 text-white font-extrabold rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                onClick={() => removeNewImage(index)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {errors.images && <p className="text-red-500">{errors.images.message}</p>}
        </div>
    );
}
