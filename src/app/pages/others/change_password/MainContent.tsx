"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import HeadingHeader from "@/src/components/HeadingHeader";
import { t } from "@/src/helpers/i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// ✅ Zod Schema for Validation
const passwordSchema = z
    .object({
        currentPassword: z.string().min(6, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(/[A-Z]/, "Must include at least one uppercase letter")
            .regex(/[a-z]/, "Must include at least one lowercase letter")
            .regex(/[0-9]/, "Must include at least one number")
            .regex(/[^A-Za-z0-9]/, "Must include at least one special character"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ChangePassword() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
    });

    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordColor, setPasswordColor] = useState("bg-red-500");
    const [loading, setLoading] = useState(false)

    // ✅ Password Strength Checker with Colors
    const checkPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;

        setPasswordStrength(strength);

        // Change color based on strength
        if (strength < 25) {
            setPasswordColor("bg-red-500"); // Weak
        } else if (strength < 50) {
            setPasswordColor("bg-yellow-500"); // Medium
        } else if (strength < 75) {
            setPasswordColor("bg-blue-500"); // Strong
        } else {
            setPasswordColor("bg-green-500"); // Very Strong
        }
    };

    // ✅ Generate Secure Password
    const generateSecurePassword = () => {
        const charset =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < 12; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setValue("newPassword", password);
        setValue("confirmPassword", password);
        checkPasswordStrength(password);
    };

    const newPassword = watch("newPassword");


    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            const response = await fetch("/api/changePassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                }),
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || t("somethingWrong"));

            toast.success(t("passwordUpdatedSuccessfully"));
        } catch (error: any) {
            toast.error("❌ " + error.message);
        }
        finally {
            setLoading(false);
        }
    };



    return (
        <div className="w-white">
            <HeadingHeader heading={t("changePassword")} />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8 my-10 p-4"
            >
                {/* Current Password */}
                <div className="space-y-4">
                    <Label className="text-lg font-bold text-black" htmlFor="currentPassword">
                        {t("currentPasswordTitle")}
                    </Label>
                    <Input
                        className="h-14 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0 font-medium text-gray-500"
                        type="text"
                        {...register("currentPassword")}
                        placeholder={t("enterCurrentPassword")}
                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                            const input = e.currentTarget;
                            input.value = input.value.replace(/\s/g, "");
                        }}
                    />
                    {errors.currentPassword && (
                        <p className="text-red-500">{errors.currentPassword.message}</p>
                    )}
                </div>

                {/* New Password */}
                <div className="space-y-4">
                    <Label className="text-lg font-bold text-black" htmlFor="newPassword">
                        {t("newPasswordTitle")}
                    </Label>
                    <Input
                        className="h-14 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0 font-medium text-gray-500"
                        type="text"
                        {...register("newPassword")}
                        placeholder={t("enterNewPassword")}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => checkPasswordStrength(e.target.value)}
                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                            const input = e.currentTarget;
                            input.value = input.value.replace(/\s/g, "");
                        }}
                    />
                    {errors.newPassword && (
                        <p className="text-red-500">{errors.newPassword.message}</p>
                    )}

                    {/* Password Strength Meter */}
                    {newPassword && (
                        <div className="relative w-full mt-2">
                            <div className="h-2 w-full bg-gray-200 rounded-lg overflow-hidden">
                                <div
                                    className={`h-2 ${passwordColor} transition-all duration-300`}
                                    style={{ width: `${passwordStrength}%` }}
                                />
                            </div>
                            <p
                                className={`mt-1 text-sm font-medium ${passwordColor.replace(
                                    "bg",
                                    "text"
                                )}`}
                            >
                                {passwordStrength < 25
                                    ? "Weak"
                                    : passwordStrength < 50
                                        ? "Medium"
                                        : passwordStrength < 75
                                            ? "Strong"
                                            : "Very Strong"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Generate Password Button */}
                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant={'primary'}

                        onClick={generateSecurePassword}
                        className="w-1/2 border-2 border-green-600 text-green-600 text-base font-semibold h-12 rounded-lg"
                    >
                        {t("generatePassword")}
                    </Button></div>

                {/* Confirm Password */}
                <div className="space-y-4">
                    <Label className="text-lg font-bold text-black" htmlFor="confirmPassword">
                        {t("confirmNewPassword")}
                    </Label>
                    <Input
                        className="h-14 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0 font-medium text-gray-500"
                        type="text"
                        {...register("confirmPassword")}
                        placeholder={t("confirmNewPassword")}
                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                            const input = e.currentTarget;
                            input.value = input.value.replace(/\s/g, "");
                        }}
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500">{errors.confirmPassword.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant={'primary'}
                    className="w-full bg-green-600 active:bg-green-400  duration-300 h-16 text-white text-lg font-bold rounded-full"
                    disabled={loading}
                >
                    {loading ? t("loading") : t("updatePassword") }
                </Button>
            </form>
        </div>
    );
}
