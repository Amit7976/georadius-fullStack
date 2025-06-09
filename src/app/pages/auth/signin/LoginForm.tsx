"use client";
import { useRouter } from "next/navigation";
import { credentialsLogin } from "../actions/login";
import { toast } from "sonner"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoaderLink } from "@/src/components/loaderLinks";


const LoginForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (formData: FormData): Promise<void> => {
        setLoading(true);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            toast("Please provide all fields");
            setLoading(false);
            return;
        }

        const error = await credentialsLogin(email, password);

        if (!error) {
            toast.success("Login success");
            window.location.reload();
        } else {
            toast.error("Login failed! " + error.err);
        }
        setLoading(false);
    };

    return (
        <>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(new FormData(e.currentTarget));
            }}>

                <div className="flex flex-col space-y-3 text-center mt-14 w-full">
                    <div className="border-t-2 relative h-6 flex justify-center mb-6">
                        <p className="text-sm text-gray-600 absolute -top-1/2 bg-white px-2">
                            Or sign in with email
                        </p>
                    </div>

                    <div className="flex flex-col space-y-6 w-full px-2 text-left">
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
                                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                    const input = e.currentTarget;
                                    input.value = input.value.replace(/\s/g, "");
                                }}
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
                                autoComplete="current-password"
                                placeholder="Password"
                                className="border-2 border-gray-200 rounded-md h-16 px-4 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                    const input = e.currentTarget;
                                    input.value = input.value.replace(/\s/g, "");
                                }}
                            />

                            <div className="flex justify-between items-center gap-5 mt-2 px-2">
                                <p>Must be at least 8 characters.</p>
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

                <div className="flex flex-col space-y-6 items-center my-12 w-full px-5">
                    <Button
                        type="submit"
                        className="bg-green-600 active:bg-green-500  mt-4 text-white text-xl font-bold rounded-full flex items-center justify-center gap-2 w-2/4 h-14"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Sign In'}
                    </Button>
                    <p className="text-base text-gray-600 font-medium">
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
