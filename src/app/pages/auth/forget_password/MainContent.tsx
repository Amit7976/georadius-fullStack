'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from "sonner";
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { z } from 'zod'


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Define the schema using Zod
const loginSchema = z.object({
    email: z.string().email("Invalid email address").nonempty("Email is required"),
})


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Type for form data
type LoginFormData = z.infer<typeof loginSchema>


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function MainContent() {

    const router = useRouter()
    const [loading, setLoading] = useState(false) // Loading state


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    const signupSchema = z.object({
        email: z.string().email('Invalid email address'),
    })


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault()
        setLoading(true) // Set loading state to true


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        const formData = new FormData(event.currentTarget)


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        const data = {
            email: formData.get('email') as string,
        }


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        // Validate data using Zod
        const validation = signupSchema.safeParse(data)

        if (!validation.success) {
            validation.error.errors.forEach((error) => {
                toast(error.message)
            })
            setLoading(false) // Reset loading state
            return
        }


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        try {

            const response = await axios.post('/api/forgetPassword', data)

            if (response.status === 200) {

                toast("Password reset email sent successfully")

            } else {

                toast("Failed to send Password reset email")

            }
        } catch (error: any) {

            const errorMessage = error.response?.data?.error || error.message || 'An unexpected error occurred'

            toast(errorMessage)

        } finally {

            setLoading(false) // Reset loading state

        }

    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    return (
        <>
            <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-lg text-center">
                    <div className="space-y-8">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">Forget Password</h1>
                        <p className="text-gray-500 text-lg">Enter your email to get your temporary password</p>
                        <form onSubmit={handleSubmit} className="space-y-6 text-left">
                            <div>
                                <Label htmlFor="email" className="text-base font-medium pl-5">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="example@example.com"
                                    required
                                    className="h-14 rounded-full mt-3 px-8 text-xl font-semibold tracking-wider border-[3px]"
                                />
                            </div>

                            <div className="pt-3 flex gap-5 flex-col items-center">
                                <Button
                                    size={100}
                                    type="submit"
                                    variant={'default'}
                                    className="h-12 px-10 bg-green-600 text-base rounded-full duration-500 border-white shadow border-2"
                                    disabled={loading} // Disable button when loading
                                >
                                    {loading ? 'Loading...' : 'Send email'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainContent
