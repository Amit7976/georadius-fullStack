'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderLink } from '@/src/components/loaderLinks';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { FaAngleLeft } from 'react-icons/fa6';
import { toast } from "sonner";
import { z } from 'zod';


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
})

/////////////////////////////////////////////////////////////////////////////////////////////////////

function MainContent() {
    const [loading, setLoading] = useState(false)
    const router = useRouter();

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const data = {
            email: formData.get('email') as string,
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////

        const validation = signupSchema.safeParse(data)
        if (!validation.success) {
            validation.error.errors.forEach((error) => {
                toast(error.message)
            })
            setLoading(false)
            return
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////

        try {
            const response = await axios.post('/api/forgetPassword', data)

            if (response.status === 200) {
                toast("Password reset email sent successfully")
                router.replace("/pages/auth/signin")
            } else {
                toast("Failed to send Password reset email")
            }
        } catch (error: unknown) {
            const errorMessage =
                axios.isAxiosError(error) && error.response?.data?.error
                    ? error.response.data.error
                    : error instanceof Error
                        ? error.message
                        : 'An unexpected error occurred'

            toast(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto text-center">
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Forget Password</h1>
                    <p className="text-gray-500 text-lg">Enter your email to get your temporary password</p>
                    <form onSubmit={handleSubmit} className="space-y-8 text-left mt-8">
                        <div>
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                    const input = e.currentTarget;
                                    input.value = input.value.replace(/\s/g, "");
                                }}
                                placeholder="example@gmail.com"
                                required
                                className="rounded-lg mt-2 px-5 h-16 text-base font-semibold tracking-wider border-[3px]"
                            />
                        </div>

                        <div className="flex gap-5 flex-col items-center">
                            <Button

                                type="submit"
                                variant={'default'}
                                className="h-12 px-20 bg-green-600 text-base rounded-full duration-500 shadow text-white"
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Send email'}
                            </Button>

                            <LoaderLink href='/pages/auth/signin'>
                                <span className='flex gap-2 items-center'><FaAngleLeft /> Back to Login</span>
                            </LoaderLink>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default MainContent
