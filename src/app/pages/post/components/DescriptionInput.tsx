import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GrMicrophone } from "react-icons/gr";

export default function DescriptionInput({ register, errors }: any) {
    return (
        <div className="space-y-4">
            <Label className="text-lg font-bold text-black">
                Description <span className="text-red-500">*</span>
            </Label>
            <Textarea {...register("description")} className="h-40 ring-2 ring-gray-400" placeholder="Describe the news in detail..." />
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>
    );
}
