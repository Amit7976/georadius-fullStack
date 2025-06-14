"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import HeadingHeader from "@/src/components/HeadingHeader";
import { t } from "@/src/helpers/i18n";
import { twoFASchema } from "@/src/helpers/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


type TwoFAFormValues = z.infer<typeof twoFASchema>;

/////////////////////////////////////////////////////////////////////////////////////////////////////

export default function MainContent() {
    const {
        register,
        formState: { errors },
    } = useForm<TwoFAFormValues>({
        resolver: zodResolver(twoFASchema),
    });
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const defaultEmail = "";

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleToggle2FA = () => setIs2FAEnabled((prev) => !prev);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div className="space-y-6">
            <HeadingHeader heading={t("twoFactorAuth")} />

            <form className="space-y-6 p-6 my-10">
            {/* Current Password */ }
                <div className="space-y-2">
                    <Label className="text-lg font-bold text-black" htmlFor="password">{t("enterCurrentPassword")}</Label>
                    <Input className="h-16 px-5 font-semibold border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0" type="password" {...register("password")} placeholder={t("enterPassword")} />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>

                {/* Toggle 2FA */ }
                < div className = "flex justify-between items-center border-2 px-4 py-8 rounded-lg" >
                    <span className="text-lg font-medium flex-3">{t("enable2FA")}</span>
                    <div className="flex-1 flex justify-center"> <Switch className="scale-200" checked={is2FAEnabled} onCheckedChange={handleToggle2FA} /></div>
                </div>

                {/* Email Input (Shown only if 2FA is enabled) */ }
    {
        is2FAEnabled && (
            <div className="space-y-2">
                <Label className="text-lg font-bold text-black" htmlFor="email">{t("verificationEmail")}</Label>
                <Input className="h-16 px-5 font-semibold border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0" type="email" defaultValue={defaultEmail} {...register("email")} placeholder={t("enterEmail")} />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
        )
    }


    {/* Submit Button */ }
    <div className="w-full p-6">
        <Button
            type="submit"
            onClick={() => alert("Two-Factor Authentication (2FA) is currently not available.")}
            variant={"primary"}
            disabled
            className="w-full bg-green-600 active:bg-green-400  duration-300 h-16 text-white text-lg font-bold rounded-full"
        >
            {is2FAEnabled ? t("enable2FATitle") : t("disable2FATitle")}
        </Button>
        <p className="text-sm text-center mt-5 text-red-500 font-medium">
            <span className="text-gray-500">*</span>{t("twoFAnotAvailable")}
        </p>
    </div>
            </form >
        </div >
    );
}
