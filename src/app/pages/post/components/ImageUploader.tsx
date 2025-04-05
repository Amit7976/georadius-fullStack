import { UseFormSetValue } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RiUploadCloud2Line } from "react-icons/ri";
import { useState } from "react";
import type { FormValues } from "../MainContent";


interface ImageUploaderProps {
    setValue: UseFormSetValue<FormValues>;
    errors: any;
}

export default function ImageUploader({ setValue, errors }: ImageUploaderProps) {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);

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
        setValue("images", [...selectedImages, ...validFiles]);
    };

    const removeImage = (index: number) => {
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updatedImages);
        setValue("images", updatedImages);
    };

    return (
        <div className="space-y-4">
            <Label className="text-lg font-bold text-black">Attach Media</Label>
            <div className="relative">
                <div className={`${selectedImages.length === 0 ? "h-40" : "h-20"} border-2 flex items-center justify-center flex-col gap-2 rounded-lg`}>
                    <RiUploadCloud2Line className="text-3xl" />
                    <p className="text-gray-500 text-xs">Max file size: 2MB, up to 3 images</p>
                </div>
                <Input
                    className={`absolute top-0 opacity-0 ${selectedImages.length === 0 ? "h-40" : "h-20"}`}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
            {selectedImages.length > 0 && (
                <div className="gap-2 mt-3 flex-wrap grid grid-cols-3">
                    {selectedImages.map((img, index) => (
                        <div key={index} className="relative col-span-1 h-40 object-cover">
                            <img src={URL.createObjectURL(img)} alt={`preview-${index}`} className="w-full h-40 object-cover rounded-md" />
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
    );
}
