import { z } from "zod";
import { t } from "./i18n";

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


export const SignUpSchema = z.object({
  fullname: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});