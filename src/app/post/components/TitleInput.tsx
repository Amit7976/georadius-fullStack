import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { t } from "@/src/helpers/i18n";
import { FormValues } from "@/src/helpers/types";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


interface TitleInputProps {
    register: UseFormRegister<FormValues>;
    errors: FieldErrors<FormValues>;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

export default function TitleInput({ register, errors }: TitleInputProps) {
    return (
        <div className="space-y-4">
            <Label className="text-lg font-bold text-black">
                {t("newsTitle")} <span className="text-red-500">*</span>
            </Label>
            <Input
                type={"text"}
                {...register("title")}
                className="h-14 ring-2 ring-gray-400 font-bold"
                placeholder={t("enterNewsTitle")}
            />
            {errors.title && <p className="text-red-500">{String(errors.title.message)}</p>}
        </div>
    );
}
