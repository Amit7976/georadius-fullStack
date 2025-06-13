"use client";
import { Button } from "@/components/ui/button";
import { LoaderLink } from "@/src/components/loaderLinks";
import { SignUpSchema } from "@/src/helpers/zodSchema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { credentialsSignUp } from "../actions/register";


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const SignUpForm = () => {


    // DEFINE TOAST FOR DISPLAYING MESSAGE
    const router = useRouter();

    const [loading, setLoading] = useState(false)

    return (
        <>
            <form
                action={async (formData) => {

                    setLoading(true);
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
                        setLoading(false);
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
                    
                    setLoading(false);
                }}
                className="mt-10 w-full px-4"
            >
                <div className="flex flex-col space-y-3 text-center mt-10 w-full">
                    <div className="border-t-2 relative h-6 flex justify-center mb-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400 absolute -top-1/2 bg-white dark:bg-neutral-900 px-2">
                            Or SignUp with email
                        </p>
                    </div>

                    <div className="flex flex-col space-y-6 w-full px-2 text-left">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="fullname" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullname"
                                id="fullname"
                                autoComplete="name"
                                placeholder="Full Name"
                                className="border-2 border-gray-200 dark:border-neutral-600 rounded-md h-16 px-4 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                id="email"
                                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                    const input = e.currentTarget;
                                    input.value = input.value.replace(/\s/g, "");
                                }}
                                autoComplete="email"
                                placeholder="Email"
                                className="border-2 border-gray-200 dark:border-neutral-600 rounded-md h-16 px-4 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="password" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                id="password"
                                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                    const input = e.currentTarget;
                                    input.value = input.value.replace(/\s/g, "");
                                }}
                                placeholder="Password"
                                className="border-2 border-gray-200 dark:border-neutral-600 rounded-md h-16 px-4 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            />
                            <div className="px-2 text-xs text-gray-600 dark:text-gray-400">
                                <p>Must be at least 8 characters.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-6 text-center my-12 w-full px-5">
                    <Button
                        type="submit"
                        className="bg-green-600 active:bg-green-500 duration-300 text-white text-lg font-bold py-2 px-4 rounded-md my-5 w-full h-16"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Sign Up'}
                    </Button>
                    <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
                        Already have an account?{" "}
                        <LoaderLink href="./signin" className="text-green-600 font-semibold">
                            Sign In
                        </LoaderLink>
                    </p>
                </div>
            </form>
        </>
    );
};

export default SignUpForm;
