"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAddress } from "@/src/helpers/AddressFunc";
import { t } from "@/src/helpers/i18n";
import { FormDataType } from "@/src/helpers/types";
import { profileSchema } from "@/src/helpers/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PiCircleNotch } from "react-icons/pi";
import { toast } from "sonner";


export default function MainContent() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(profileSchema),
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [locationLoading, setLocationLoading] = useState(false)

    // Handle profile image selection
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setValue("profileImage", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Get current location
    const handleGetLocation = async () => {
        setLocationLoading(true);

        if (typeof window === "undefined" || !navigator.geolocation || !navigator.permissions) {
            alert(t("geoNotSupported"));
            setLocationLoading(false);
            return;
        }

        try {
            const permissionStatus = await navigator.permissions.query({ name: "geolocation" as PermissionName });

            if (permissionStatus.state === "granted" || permissionStatus.state === "prompt") {
                try {
                    const location = await getAddress();
                    setValue("location", location);
                } catch (err) {
                    console.error("Error fetching address from coordinates:", err);
                    alert(t("fetchLocationError"));
                }
            } else {
                alert(t("locationPermissionDenied"));
            }
        } catch (err) {
            console.error("Permission check failed:", err);
            alert(t("geoPermissionError"));
        }

        setLocationLoading(false);
    };


    const router = useRouter();


    const [isSubmitting, setIsSubmitting] = useState(false);



    const onSubmit = async (data: FormDataType) => {
        if (isSubmitting) return; // Prevent multiple clicks
        setIsSubmitting(true);

        try {
            // console.log("====================================");
            // console.log("Form submission started...");
            // console.log("====================================");

            // console.log("Received Form Data:", data);

            const formData = new FormData();
            formData.append("username", data.username);
            formData.append("fullName", data.fullName);
            formData.append("phoneNumber", data.phoneNumber || "");
            formData.append("dob", data.dob);
            formData.append("location", data.location);
            formData.append("bio", data.bio);

            // console.log("✅ Basic fields appended!");

            if (data.profileImage instanceof File) {
                // console.log("✅ Profile Image detected, appending...");
                formData.append("profileImage", data.profileImage);

                // console.log("====================================");
                // console.log("Sending data to API...");
                // console.log("====================================");

                // console.log("📝 Final FormData Entries:", [...formData.entries()]);

                const response = await fetch("/api/userProfile/profile", {
                    method: "POST",
                    body: formData,
                });

                const result: { error?: string } = await response.json();
                // console.log("✅ API Response Received:", result);

                if (!response.ok) {
                    console.error("❌ API Error:", result.error);
                    throw new Error(result.error || "Failed to update profile");
                }

                // console.log("✅ Profile Created successfully!", result);
                toast.success("Profile Created successfully!");

                router.replace("/pages/onboarding/interest");

            } else {
                // console.log("⚠️ No valid profile image provided.");
                toast.warning("No valid profile image provided.");
            }
        } catch (error) {
            console.error("❌ Error updating profile:", error);
            toast.error("Failed to create profile.");
        } finally {
            setIsSubmitting(false);
        }
    };






    return (
        <div className="max-w-lg mx-auto px-3 py-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
                {/* Profile Image Upload */}
                <div className="border border-gray-200 w-full p-4 rounded-lg flex items-center gap-6">

                    {/* <Label className={"h-14 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0"}>Profile Image</Label> */}
                    <div className="relative flex-1 w-32 h-32 border-2 border-dashed rounded-xl active:scale-95">
                        {!imagePreview && (
                            <>
                                <Image
                                    src={"/images/profileIcon/default.jpg"}
                                    alt="Preview"
                                    width={80}
                                    height={80}
                                    priority
                                    className="w-full h-32 rounded-xl object-cover pointer-events-none" />
                            </>
                        )}
                        <Input
                            className={"w-full h-32 absolute opacity-0 top-0"}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                width={80}
                                height={80}
                                priority
                                className="w-full h-32 rounded-xl object-cover"
                            />
                        )}
                        {errors.profileImage && (
                            <p className="text-red-500">{errors.profileImage.message}</p>
                        )}
                    </div>

                    {/* Username */}
                    <div className="rounded-lg space-y-2 flex-2">
                        <Label className={"text-sm text-gray-600 dark:text-gray-400 font-medium"}>{t("username")}</Label>
                        <Input
                            className={"border-0 border-b-2 focus-visible:ring-0 rounded-none rounded-t-lg text-base font-medium p-0 focus-visible:border-green-500 focus-visible:border-b-4 focus-visible:outline-0"}
                            type={"text"}
                            {...register("username")}
                            autoComplete="username"
                            placeholder={t("enterUsername")}
                            onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                const input = e.currentTarget;
                                input.value = input.value.replace(/\s/g, "");
                            }}
                        />
                        {errors.username && (
                            <p className="text-red-500">{errors.username.message}</p>
                        )}
                    </div>

                </div>

                {/* Full Name */}
                <div className="border border-gray-200 w-full p-6 rounded-lg flex flex-col gap-2">
                    <Label className={"text-sm text-gray-600 dark:text-gray-400 font-medium"}>{t("fullName")}</Label>
                    <Input
                        type={"text"}
                        autoComplete="name"
                        className={"h-14 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0"}
                        {...register("fullName")}
                        placeholder={t("enterFullName")}
                    />
                    {errors.fullName && (
                        <p className="text-red-500">{errors.fullName.message}</p>
                    )}
                </div>

                {/* Phone Number (Optional) */}
                <div className="border border-gray-200 w-full p-6 rounded-lg flex flex-col gap-2">
                    <Label className={"text-sm text-gray-600 dark:text-gray-400 font-medium"}>{t("phoneNumber")}</Label>
                    <Input
                        className={"h-14 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0"}
                        {...register("phoneNumber")}
                        placeholder={t("enterPhoneNumber")}
                        autoComplete="tel"
                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                            const input = e.currentTarget;
                            input.value = input.value.replace(/\s/g, "");
                        }}
                        type="tel"
                    />
                </div>

                {/* Date of Birth */}
                <div className="border border-gray-200 w-full p-6 rounded-lg flex flex-col gap-2">
                    <Label className="text-sm text-gray-500 font-medium">{t("dateOfBirth")}</Label>
                    <Input
                        className="h-14 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0"
                        {...register("dob")}
                        type="date"
                        autoComplete="bday"
                        defaultValue="2000-01-01"
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 16))
                            .toISOString()
                            .split("T")[0]} // ✅ max = today - 16 years
                    />

                    {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
                </div>


                {/* Location + Get Current Location Button */}
                <div className="border border-gray-200 w-full p-6 rounded-lg flex flex-col justify-center-center gap-2">
                    <Label className={"text-sm text-gray-600 dark:text-gray-400 font-medium"}>{t("location")}</Label>
                    <div className="flex items-center gap-2" >
                        <div className="flex-3">
                            <Input
                                type={"text"}
                                className={"h-14 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0"}
                                {...register("location")}
                                autoComplete="address-level2"
                                placeholder={t("enterLocation")}
                            />
                            {errors.location && (
                                <p className="text-red-500">{errors.location.message}</p>
                            )}
                        </div>
                        <Button
                            className={"h-14 border-2 px-2 flex-1"}

                            type="button"
                            variant="outline"
                            onClick={handleGetLocation}
                        >
                            {locationLoading ? <PiCircleNotch className="animate-spin text-gray-500" /> :
                                (<><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-navigation h-4 w-4"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                                    {t("current")}
                                </>)}
                        </Button>
                    </div>
                </div>

                {/* Bio */}
                <div className="border border-gray-200 w-full p-6 rounded-lg flex flex-col gap-2">
                    <Label className={"text-sm text-gray-600 dark:text-gray-400 font-medium"}>{t("bio")}</Label>
                    <Textarea className={"h-40 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0"} {...register("bio")} placeholder={t("bio")} />
                    {errors.bio && <p className="text-red-500">{errors.bio.message}</p>}
                </div>

                {/* Submit Button */}
                <div className="w-full pt-2 px-6">
                    <Button
                        type="submit"

                        variant={"primary"}
                        disabled={isSubmitting}
                        className="w-full bg-green-600 active:bg-green-400 duration-300 h-16 text-white text-lg font-medium rounded-full"
                    >
                        {isSubmitting ? "Submitting..." : "Build Profile"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
