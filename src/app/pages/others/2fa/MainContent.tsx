"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import HeadingHeader from "@/src/components/HeadingHeader";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const twoFASchema = z.object({
    password: z.string().min(6, "Current password is required"),
    email: z.string().email("Invalid email address").optional(),
});

type TwoFAFormValues = z.infer<typeof twoFASchema>;

export default function MainContent() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TwoFAFormValues>({
        resolver: zodResolver(twoFASchema),
    });

    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const defaultEmail = "";

    const handleToggle2FA = () => setIs2FAEnabled((prev) => !prev);
    const router = useRouter();

    return (
        <div className="space-y-6">
            <HeadingHeader heading="Two-Factor Authentication" />

            <form onSubmit={handleSubmit((data) => console.log(data))} className="space-y-6 p-6 my-10">
                {/* Current Password */}
                <div className="space-y-2">
                    <Label className="text-lg font-bold text-black" htmlFor="password">Current Password</Label>
                    <Input className="h-16 px-5 font-semibold border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0" type="password" {...register("password")} placeholder="Enter your password" />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>

                {/* Toggle 2FA */}
                <div className="flex justify-between items-center border-2 px-4 py-8 rounded-lg">
                    <span className="text-lg font-medium flex-3">Enable Two-Factor Authentication</span>
                    <div className="flex-1 flex justify-center"> <Switch className="scale-200" checked={is2FAEnabled} onCheckedChange={handleToggle2FA} /></div>
                </div>

                {/* Email Input (Shown only if 2FA is enabled) */}
                {is2FAEnabled && (
                    <div className="space-y-2">
                        <Label className="text-lg font-bold text-black" htmlFor="email">Verification Email</Label>
                        <Input className="h-16 px-5 font-semibold border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0" type="email" defaultValue={defaultEmail} {...register("email")} placeholder="Enter your email" />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    </div>
                )}


                {/* Submit Button */}
                <div className="w-full p-6">
                    <Button
                        type="submit"
                        onClick={() => alert("Two-Factor Authentication (2FA) is currently not available.")}
                        variant={"primary"}
                        disabled
                        className="w-full bg-green-600 active:bg-green-400  duration-300 h-16 text-white text-lg font-bold rounded-full"
                    >
                        {is2FAEnabled ? "Enable 2FA" : "Disable 2FA"}
                    </Button>
                    <p className="text-sm text-center mt-5 text-red-500 font-medium">
                        <span className="text-gray-500">*</span>Two-Factor Authentication (2FA) is currently not available.
                    </p>
                </div>
            </form>
        </div>
    );
}
