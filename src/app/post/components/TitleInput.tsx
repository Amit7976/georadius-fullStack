import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GrMicrophone } from "react-icons/gr";

export default function TitleInput({ register, errors }: any) {
    return (
        <div className="space-y-4">
            <Label className="text-lg font-bold text-black">
                News Title <span className="text-red-500">*</span>
            </Label>
            <Input {...register("title")} className="h-14 ring-2 ring-gray-400 font-bold" placeholder="Enter News Title" />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>
    );
}
