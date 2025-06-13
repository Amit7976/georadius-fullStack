import { z } from "zod";
import { t } from "./i18n";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


export const profileSchema = z.object({
    profileImage: z
        .instanceof(File, { message: t("profileImageRequired") })
        .or(z.string().min(1, t("profileImageRequired"))),

    username: z.string().min(3, t("usernameTooShort")),
    fullName: z.string().min(3, t("fullNameRequired")),
    phoneNumber: z.string().optional(),
    dob: z
        .string()
        .min(1, t("dobRequired"))
        .refine((dob) => {
            const inputDate = new Date(dob);
            return (
                !isNaN(inputDate.getTime()) &&
                inputDate <= new Date(new Date().setFullYear(new Date().getFullYear() - 16))
            );
        }, {
            message: t("ageRequirement"),
        }),
    location: z.string().min(1, t("locationRequired")),
    bio: z.string().min(10, t("bioTooShort")),
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

export const SignUpSchema = z.object({
  fullname: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

export const formSchemaForAddPost = z.object({
    title: z.string().min(3, t("titleTooShort")),
    description: z.string().min(10, t("descriptionTooShort")),
    location: z.string().min(10, t("locationRequired")),
    latitude: z.number().min(1, t("latitudeRequired")),
    longitude: z.number().min(1, t("longitudeRequired")),
    categories: z.array(z.string()).min(1, t("categoryRequired")),
    images: z.array(z.any()).max(3, t("maxImages")).optional(),
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

export const formSchemaForEditPost = z.object({
    title: z.string().min(3, t("titleTooShort")),
    description: z.string().min(10, t("descriptionTooShort")),
    location: z.string().min(10, t("locationRequired")),
    latitude: z.number().min(1, t("latitudeRequired")),
    longitude: z.number().min(1, t("longitudeRequired")),
    categories: z.array(z.string()).min(1, t("categoryRequired")),
    images: z.array(z.any()).max(3, t("maxImages")).optional(),
    deletedImages: z.array(z.any()).max(3, "You can only delete up to 3 images").optional(),
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

export const passwordSchema = z
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

/////////////////////////////////////////////////////////////////////////////////////////////////////

export const twoFASchema = z.object({
  password: z.string().min(6, "Current password is required"),
  email: z.string().email("Invalid email address").optional(),
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

export const issueSchema = z.object({
  description: z.string().min(5, "Description must be at least 5 characters"),
  photos: z.array(z.instanceof(File)).optional(),
});