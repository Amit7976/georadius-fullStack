"use client";


import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { credentialsSignUp } from "../actions/register";
import Link from "next/link";
import { Button } from "@/components/ui/button";


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const SignUpForm = () => {


    // DEFINE TOAST FOR DISPLAYING MESSAGE
    const router = useRouter();


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // DEFINE THE ZOD SCHEMA
    const SignUpSchema = z.object({
        fullname: z.string().min(3, "Full name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
    });


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    return (
        <>
            <form
                action={async (formData) => {

                    // Extract form data
                    const fullname = formData.get("fullname") as string;
                    const email = formData.get("email") as string;
                    const password = formData.get("password") as string;

                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    // Validate form data using Zod
                    const result = SignUpSchema.safeParse({
                        fullname,
                        email,
                        password,
                    });

                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    if (!result.success) {
                        // Display error messages
                        result.error.errors.forEach((error) =>
                            toast(error.message)
                        );
                        return;
                    }

                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                    const error = await credentialsSignUp(fullname, email, password);

                    if (!error) {
                        toast.success("Register success");

                        router.refresh();
                    } else {
                        toast.error("Registration failed! " + error);
                    }

                }}
                className="mt-10 w-full px-4"
            >
                <div className="flex flex-col space-y-3 text-center mt-10 w-full">
                    <div className="border-t-2 relative h-6 flex justify-center mb-5">
                        <p className="text-sm text-gray-600 absolute -top-1/2 bg-white px-2">
                            Or sign up with email
                        </p>
                    </div>

                    <div className="flex flex-col space-y-6 w-full px-2 text-left">
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="fullname" className="text-lg font-semibold">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullname"
                                id="fullname"
                                autoComplete="name"
                                placeholder="Full Name"
                                className="border-2 border-gray-200 rounded-md h-16 px-4 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <label htmlFor="email" className="text-lg font-semibold">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                placeholder="Email"
                                className="border-2 border-gray-200 rounded-md h-16 px-4 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="password" className="text-lg font-semibold">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                className="border-2 border-gray-200 rounded-md h-16 px-4 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            />
                            <div className="px-2 mt-2">
                                <p>Must be at least 8 characters.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-6 text-center my-12 w-full px-5">
                    <Button
                        type="submit"
                        className="bg-green-600 active:bg-green-500 active:scale-95 duration-300 text-white font-bold py-2 px-4 rounded-md my-5 w-full h-16"
                    >
                        Sign Up
                    </Button>
                    <p className="text-base text-gray-600 font-medium">
                        Already have an account?{" "}
                        <Link href="./signin" className="text-green-600 font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </>
    );
};

export default SignUpForm;
