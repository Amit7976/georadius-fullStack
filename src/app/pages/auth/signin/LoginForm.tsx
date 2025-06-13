"use client";
import { Button } from "@/components/ui/button";
import { LoaderLink } from "@/src/components/loaderLinks";
import { useState } from "react";
import { toast } from "sonner";
import { credentialsLogin } from "../actions/login";
import { Input } from "@/components/ui/input";


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


const LoginForm = () => {
    const [loading, setLoading] = useState(false)

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleSubmit = async (formData: FormData): Promise<void> => {
        setLoading(true);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            toast("Please provide all fields");
            setLoading(false);
            return;
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////

        const error = await credentialsLogin(email, password);

        if (!error) {
            toast.success("Login success");
            window.location.reload();
        } else {
            toast.error("Login failed! " + error.err);
        }
        setLoading(false);
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(new FormData(e.currentTarget));
            }} className="w-full px-6">

                <div className="flex flex-col space-y-3 text-center mt-14">
                    <div className="border-t-2 relative h-6 flex justify-center mb-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400 absolute -top-1/2 bg-white dark:bg-neutral-900 px-2">
                            Or sign in with email
                        </p>
                    </div>

                    <div className="space-y-8 text-left">
                        <div className="space-y-2 flex flex-col">
                            <label htmlFor="email" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Email
                            </label>

                            <Input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                placeholder="Email"
                                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                    const input = e.currentTarget;
                                    input.value = input.value.replace(/\s/g, "");
                                }}
                                className="border-2 border-gray-200 dark:border-neutral-600 rounded-md h-16 px-4 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                            />
                        </div>
                        <div className="space-y-2 flex flex-col">
                            <label htmlFor="password" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Password
                            </label>

                            <Input
                                type="password"
                                name="password"
                                id="password"
                                autoComplete="current-password"
                                placeholder="Password"
                                className="border-2 border-gray-200 dark:border-neutral-600 rounded-md h-16 px-4 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                    const input = e.currentTarget;
                                    input.value = input.value.replace(/\s/g, "");
                                }}
                            />

                            <div className="flex justify-between items-center gap-5 mt-0 px-1 text-gray-600 dark:text-gray-400">
                                <p className="text-xs">Must be at least 8 characters.</p>
                                <LoaderLink
                                    href="./forget_password"
                                    className="text-green-600 font-semibold"
                                >
                                    Forgot Password?
                                </LoaderLink>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-6 items-center my-12 w-full">
                    <Button
                        type="submit"
                        className="bg-green-600 active:bg-green-500 duration-300 text-white text-lg font-bold py-2 px-4 rounded-md my-5 w-full h-16"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Sign In'}
                    </Button>
                    <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
                        Don&#39;t have an account?{" "}
                        <LoaderLink href="./signup" className="text-green-600 font-semibold">
                            Sign Up
                        </LoaderLink>
                    </p>
                </div>
            </form>
        </>
    );
};

export default LoginForm;
