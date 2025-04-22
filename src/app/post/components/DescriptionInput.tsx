import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormValues } from "../MainContent"; // 👈 import your form values

interface DescriptionInputProps {
    register: UseFormRegister<FormValues>;
    errors: FieldErrors<FormValues>;
}


export default function DescriptionInput({ register, errors }: DescriptionInputProps) {
    return (
        <div className="space-y-4">
            <Label className="text-lg font-bold text-black">
                Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
                {...register("description")}
                className="h-40 ring-2 ring-gray-400"
                placeholder="Describe the news in detail..."
            />
            {errors.description &&
                typeof errors.description?.message === "string" && (
                    <p className="text-red-500">{errors.description.message}</p>
                )
            }
        </div>
    );
}
