"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FaArrowLeftLong } from "react-icons/fa6";

const twoFASchema = z.object({
    password: z.string().min(6, "Current password is required"),
    email: z.string().email("Invalid email address").optional(),
});

type TwoFAFormValues = z.infer<typeof twoFASchema>;

export default function MainContent() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<TwoFAFormValues>({
        resolver: zodResolver(twoFASchema),
    });

    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const defaultEmail = "user@example.com"; // Replace with user's actual email later

    const handleToggle2FA = () => setIs2FAEnabled((prev) => !prev);
    const router = useRouter();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-center relative my-5">
                <FaArrowLeftLong
                    onClick={() => router.back()}
                    className="text-lg absolute left-3 w-10 h-10 p-2.5 cursor-pointer"
                />

                <h1 className="text-xl font-bold">Two-Factor Authentication</h1>
            </div>
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
                        size={100}
                        variant={"primary"}
                        className="w-full bg-green-600 active:bg-green-400 active:scale-95 duration-300 h-16 text-white text-lg font-bold rounded-full"
                    >
                        {is2FAEnabled ? "Enable 2FA" : "Disable 2FA"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
