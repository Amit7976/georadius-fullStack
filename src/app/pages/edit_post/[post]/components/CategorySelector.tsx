"use client"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import interestsList from "@/public/json/interestList.json";
import { useEffect } from "react";
import { UseFormSetValue, FieldErrors } from "react-hook-form";
import { t } from "@/src/helpers/i18n";
import { FormValues } from "@/src/helpers/types";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


interface CategorySelectorProps {
    selectedCategories: string[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    setValue: UseFormSetValue<FormValues>;
    errors: FieldErrors<FormValues>;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

export default function CategorySelector({
    selectedCategories,
    setSelectedCategories,
    setValue,
    errors,
}: CategorySelectorProps) {
    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) => {
            const updated = prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category];
            setValue("categories", updated);
            return updated;
        });
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setValue("categories", selectedCategories);
    }, [selectedCategories, setValue]);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div className="space-y-4">
            <Label className="text-lg font-bold text-black">
                {t("newsCategory")} <span className="text-red-500">*</span>
            </Label>

            <div className="grid grid-cols-3 gap-4">
                {interestsList.map((category) => (
                    <Button

                        className="text-xs py-3 h-12"
                        key={category.name}
                        variant={selectedCategories.includes(category.name) ? "default" : "outline"}
                        onClick={() => toggleCategory(category.name)}
                    >
                        {category.name}
                    </Button>
                ))}
            </div>

            {errors.categories && (
                <p className="text-red-500 text-sm">{t("selectCategoryWarning")}</p>
            )}
        </div>
    );
}
