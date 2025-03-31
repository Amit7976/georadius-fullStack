import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import interestsList from "@/public/json/interestList.json";
import { useEffect } from "react";
import { UseFormSetValue, FieldErrors } from "react-hook-form";

// ✅ Define FormValues interface for proper TypeScript support
interface FormValues {
    title: string;
    description: string;
    categories: string[];
    images?: File[];
}

interface CategorySelectorProps {
    selectedCategories: string[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    setValue: UseFormSetValue<FormValues>; // ✅ Correct type
    register: any;
    errors: FieldErrors<FormValues>; // ✅ Correct error type
}

export default function CategorySelector({ selectedCategories, setSelectedCategories, setValue, register, errors }: CategorySelectorProps) {
    const toggleCategory = (category: string) => {
        setSelectedCategories((prev: string[]) => {
            const updated = prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category];
            setValue("categories", updated); // ✅ No TypeScript error now
            return updated;
        });
    };

    // ✅ Ensure validation runs on component update
    useEffect(() => {
        setValue("categories", selectedCategories);
    }, [selectedCategories, setValue]);

    return (
        <div className="space-y-4">
            <Label className="text-lg font-bold text-black">
                News Category <span className="text-red-500">*</span>
            </Label>

            <div className="grid grid-cols-3 gap-2">
                {interestsList.map((category) => (
                    <Button
                        size={100}
                        className={"text-xs py-3"}
                        key={category.name}
                        variant={selectedCategories.includes(category.name) ? "default" : "outline"}
                        onClick={() => toggleCategory(category.name)}
                    >
                        {category.name}
                    </Button>
                ))}
            </div>

            {/* ✅ Error Message */}
            {errors.categories && (
                <p className="text-red-500 text-sm">Please select at least one category.</p>
            )}
        </div>
    );
}
