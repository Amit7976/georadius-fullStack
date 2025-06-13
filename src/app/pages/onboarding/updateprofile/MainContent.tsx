"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import BackButton from "@/src/components/BackButton";
import { getAddress } from "@/src/helpers/AddressFunc";
import { t } from "@/src/helpers/i18n";
import { FormDataType } from "@/src/helpers/types";
import { profileSchema } from "@/src/helpers/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PiCircleNotch } from "react-icons/pi";
import { toast } from "sonner";

export default function MainContent() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl); // Show preview
            setSelectedFile(file); // Store File object
        }
    };


    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(profileSchema),
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch existing profile data from API
    useEffect(() => {
        // console.log("Fetching existing profile data...");
        fetch("/api/update/profile")
            .then((res) => res.json())
            .then((data) => {
                // console.log("Profile Data:", data);
                if (data.error) {
                    toast.error("Failed to fetch profile data");
                    return;
                }

                // Prefill form fields
                setValue("profileImage", data.profileImage);
                setValue("username", data.username);
                setValue("fullName", data.fullname);
                setValue("phoneNumber", data.phoneNumber || "");
                setValue("dob", new Date(data.dob).toISOString().split("T")[0]);
                setValue("location", data.location);
                setValue("bio", data.bio);
                setImagePreview(data.profileImage);
            })
            .catch((err) => {
                console.error("Error fetching profile:", err);
                toast.error("Error fetching profile data");
            })
            .finally(() => setLoading(false));
    }, [setValue]);



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



    // Handle form submission


    const onSubmit = async (data: FormDataType) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("phoneNumber", data.phoneNumber || "");
            formData.append("dob", data.dob);
            formData.append("location", data.location); // Use the resolved address
            formData.append("bio", data.bio);

            // console.log("📤 Sending Form Data:", formData);

            // **Check if user selected a new file**
            if (selectedFile) {
                // console.log("New profile image detected, appending...");
                formData.append("profileImage", selectedFile);
            } else {
                // console.log("Using existing image URL...");
                formData.append("profileImage", data.profileImage); // Send existing image path
            }

            const response = await fetch("/api/update/profile", {
                method: "PUT",
                body: formData,
            });

            const result: { error?: string } = await response.json();
            if (!response.ok) throw new Error(result.error || "Profile update failed");

            // console.log("✅ Profile updated successfully!", result);
            toast.success(t("profileUpdateSuccess"));

            router.refresh();
        } catch (error) {
            console.error("❌ Error updating profile:", error);
            toast.error(t("profileUpdateFailed"));
        } finally {
            setIsSubmitting(false);
        }
    };



    if (loading) return <div className="flex items-center justify-center h-screen"><div className="loader"></div></div>;

    return (
        <div className="max-w-lg mx-auto p-2">
            <div className='flex items-center justify-center relative my-5'>
                <BackButton />
                <h1 className="text-xl font-semibold text-gray-600 dark:text-gray-400 text-center">{t("updateYour")} <span className="text-green-600">Profile</span></h1>
            </div>



            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6 p-2">
                {/* Profile Image Upload */}
                <div className="border border-gray-200 dark:border-neutral-700 w-full px-6 py-10 rounded-lg flex items-center gap-6">

                    <div className="relative flex-1 w-32 h-32 border-2 border-dashed rounded-xl active:scale-95 duration-300">
                        {!imagePreview && (
                            <>
                                <Image
                                    src={"/images/profileIcon/default.jpg"}
                                    alt="Preview"
                                    width={80}
                                    height={80}
                                    priority
                                    className="w-full h-32 rounded-xl p-0 object-cover pointer-events-none" />
                            </>
                        )}
                        <Input
                            className={"w-full h-32 absolute opacity-0 top-0 p-0"}
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
                            className={"border-0 border-b-2 focus-visible:ring-0 px-0 rounded-none rounded-t-lg text-lg font-semibold focus-visible:border-green-500 focus-visible:border-b-4 focus-visible:outline-0"}
                            type='text'
                            {...register("username")}
                            autoComplete="username"
                            onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                const input = e.currentTarget;
                                input.value = input.value.replace(/\s/g, "");
                            }}
                            disabled
                            readOnly
                            placeholder={t("enterUsername")}
                        />
                    </div>

                </div>

                {/* Full Name */}
                <div className="border border-gray-200 dark:border-neutral-700 w-full px-6 py-10 rounded-lg flex flex-col gap-2">
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
                <div className="border border-gray-200 dark:border-neutral-700 w-full px-6 py-10 rounded-lg flex flex-col gap-2">
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
                        disabled
                        readOnly
                        type="tel"
                    />
                </div>

                {/* Date of Birth */}
                <div className="border border-gray-200 dark:border-neutral-700 w-full p-6 rounded-lg flex flex-col gap-2">
                    <Label className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t("dateOfBirth")}</Label>
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
                <div className="border border-gray-200 dark:border-neutral-700 w-full px-6 py-10 rounded-lg flex flex-col justify-center-center gap-2">
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
                <div className="border border-gray-200 dark:border-neutral-700 w-full px-6 py-10 rounded-lg flex flex-col gap-2">
                    <Label className={"text-sm text-gray-600 dark:text-gray-400 font-medium"}>{t("bio")}</Label>
                    <Textarea className={"h-40 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0"} {...register("bio")} placeholder={t("bio")} />
                    {errors.bio && <p className="text-red-500">{errors.bio.message}</p>}
                </div>

                {/* Submit Button */}
                <div className="w-full p-6">
                    <Button
                        type="submit"

                        variant={"primary"}
                        disabled={isSubmitting}
                        className="w-full bg-green-600 active:bg-green-400  duration-300 h-16 text-white text-lg font-bold rounded-full"
                    >
                        {isSubmitting ? "Submitting..." : t("updateProfile")}
                    </Button>
                </div>
            </form>
        </div>
    );
}
