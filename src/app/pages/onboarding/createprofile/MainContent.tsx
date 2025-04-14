"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAddress } from "@/src/helpers/AddressFunc";


const profileSchema = z.object({
    profileImage: z
        .instanceof(File, { message: "Profile image is required" })
        .or(z.string().min(1, "Profile image is required")),
    username: z.string().min(3, "Username must be at least 3 characters"),
    fullName: z.string().min(3, "Full name is required"),
    phoneNumber: z.string().optional(),
    dob: z.string().min(1, "Date of Birth is required"),
    location: z.string().min(1, "Location is required"),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
});

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
        const location = await getAddress();
        setValue("location", location);
    };

    const router = useRouter();


    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: any) => {
        if (isSubmitting) return; // Prevent multiple clicks
        setIsSubmitting(true);

        try {
            console.log("====================================");
            console.log("Form submission started...");
            console.log("====================================");

            console.log("Received Form Data:", data);

            const formData = new FormData();
            formData.append("username", data.username);
            formData.append("fullName", data.fullName);
            formData.append("phoneNumber", data.phoneNumber);
            formData.append("dob", data.dob);
            formData.append("location", data.location);
            formData.append("bio", data.bio);

            console.log("✅ Basic fields appended!");

            if (data.profileImage instanceof File) {
                console.log("✅ Profile Image detected, appending...");
                formData.append("profileImage", data.profileImage);


                console.log("====================================");
                console.log("Sending data to API...");
                console.log("====================================");

                console.log("📝 Final FormData Entries:", [...formData.entries()]);

                const response = await fetch("/api/userProfile/profile", {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();
                console.log("✅ API Response Received:", result);

                if (!response.ok) {
                    console.error("❌ API Error:", result.error);
                    throw new Error(result.error || "Failed to update profile");
                }

                console.log("✅ Profile updated successfully!", result);
                toast("Profile updated successfully!");

                router.replace("/pages/onboarding/interest");

            } else {
                console.log("⚠️ No valid profile image provided.");
                toast.warning("No valid profile image provided.");
            }
        } catch (error) {
            console.error("❌ Error updating profile:", error);
            toast("Failed to update profile.");
        } finally {
            setIsSubmitting(false);
        }
    };






    return (
        <div className="max-w-lg mx-auto px-6 py-0">
            <h1 className="text-xl font-extrabold text-gray-800 text-center py-6 pb-8">Build your <span className="text-green-600">Profile</span></h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Profile Image Upload */}
                <div className="border-2 border-gray-100 w-full p-6 rounded-lg flex items-center gap-6">


                    {/* <Label className={"h-14 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0"}>Profile Image</Label> */}
                    <div className="relative flex-1">
                        {!imagePreview && (
                            <>
                                <Image
                                    src={"/images/profileIcon/default.jpg"}
                                    alt="Preview"
                                    width={80}
                                    height={80}
                                    priority
                                    className="w-32 h-32 rounded-xl object-cover pointer-events-none" />
                            </>
                        )}
                        <Input
                            className={"w-32 h-32 absolute opacity-0 top-0"}
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
                                className="w-32 h-32 rounded-xl object-cover"
                            />
                        )}
                        {errors.profileImage && (
                            <p className="text-red-500">{errors.profileImage.message}</p>
                        )}
                    </div>

                    {/* Username */}
                    <div className="rounded-lg space-y-2 flex-2">
                        <Label className={"text-lg font-bold mb-2"}>Username</Label>
                        <Input
                            className={"border-0 border-b-2 focus-visible:ring-0 rounded-none rounded-t-lg text-lg font-semibold focus-visible:border-green-500 focus-visible:border-b-4 focus-visible:outline-0"}
                            type={"text"}
                            {...register("username")}
                            autoComplete="username"
                            placeholder="Enter username"
                        />
                        {errors.username && (
                            <p className="text-red-500">{errors.username.message}</p>
                        )}
                    </div>

                </div>

                {/* Full Name */}
                <div className="border-2 border-gray-100 w-full p-6 rounded-lg flex flex-col gap-2">
                    <Label className={"text-lg font-bold"}>Full Name</Label>
                    <Input
                        type={"text"}
                        autoComplete="name"
                        className={"h-14 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0"}
                        {...register("fullName")}
                        placeholder="Enter full name"
                    />
                    {errors.fullName && (
                        <p className="text-red-500">{errors.fullName.message}</p>
                    )}
                </div>

                {/* Phone Number (Optional) */}
                <div className="border-2 border-gray-100 w-full p-6 rounded-lg flex flex-col gap-2">
                    <Label className={"text-lg font-bold"}>Phone Number</Label>
                    <Input
                        className={"h-14 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0"}
                        {...register("phoneNumber")}
                        placeholder="Enter phone number"
                        autoComplete="tel"
                        type="tel"
                    />
                </div>

                {/* Date of Birth */}
                <div className="border-2 border-gray-100 w-full p-6 rounded-lg flex flex-col gap-2">
                    <Label className="text-lg font-bold">Date of Birth</Label>
                    <Input
                        className="h-14 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0"
                        {...register("dob")}
                        type="date"
                        autoComplete="bday"
                        defaultValue={new Date().toISOString().split("T")[0]} // Set today's date
                    />
                    {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
                </div>


                {/* Location + Get Current Location Button */}
                <div className="border-2 border-gray-100 w-full p-6 rounded-lg flex flex-col justify-center-center gap-2">
                    <Label className={"text-lg font-bold mb-2"}>Location</Label>
                    <div className="flex items-center gap-2" >
                        <div className="flex-3">
                            <Input
                                type={"text"}
                                className={"h-14 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0"}
                                {...register("location")}
                                autoComplete="address-level2"
                                placeholder="Enter location"
                            />
                            {errors.location && (
                                <p className="text-red-500">{errors.location.message}</p>
                            )}
                        </div>
                        <Button
                            className={"h-14 border-2 px-2 flex-1"}
                            size={100}
                            type="button"
                            variant="outline"
                            onClick={handleGetLocation}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-navigation h-4 w-4"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                            Current
                        </Button>
                    </div>
                </div>

                {/* Bio */}
                <div className="border-2 border-gray-100 w-full p-6 rounded-lg flex flex-col gap-2">
                    <Label className={"text-lg font-bold"}>Bio</Label>
                    <Textarea className={"h-40 border-2 focus-visible:ring-green-500 focus-visible:outline-0 focus-visible:border-0"} {...register("bio")} placeholder="Tell us about yourself" />
                    {errors.bio && <p className="text-red-500">{errors.bio.message}</p>}
                </div>

                {/* Submit Button */}
                <div className="w-full p-6">
                    <Button
                        type="submit"
                        size={100}
                        variant={"primary"}
                        disabled={isSubmitting}
                        className="w-full bg-green-600 active:bg-green-400 active:scale-95 duration-300 h-16 text-white text-lg font-bold rounded-full"
                    >
                        {isSubmitting ? "Submitting..." : "Build Profile"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
